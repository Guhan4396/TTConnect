import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/middleware/auth';
import supabase from '@/lib/supabase/client';
import { validateToken } from '@/lib/middleware/auth';
import { OptimizationType } from '@/lib/models/types';

interface Supplier {
  id: string;
  name: string;
  risk_score?: number;
  profile_strength?: number;
  value_processes?: string[];
  [key: string]: any;
}

interface SupplyChain {
  id: string;
  chain_id: string;
  suppliers: string[];
  [key: string]: any;
}

// Perform supply chain optimization
export async function POST(req: NextRequest) {
  // Check if user is authenticated and has the brand role
  const authError = await requireRole(req, ['brand']);
  if (authError) return authError;

  try {
    const { 
      chainId, 
      optimizationType, 
      optimizationParameters
    } = await req.json();

    if (!chainId || !optimizationType) {
      return NextResponse.json(
        { error: 'Chain ID and optimization type are required' },
        { status: 400 }
      );
    }

    if (!['simple', 'medium', 'max'].includes(optimizationType)) {
      return NextResponse.json(
        { error: 'Optimization type must be "simple", "medium", or "max"' },
        { status: 400 }
      );
    }

    // Get the authenticated user
    const authResult = await validateToken(req);
    if (!authResult.isValid || !authResult.user) {
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 401 }
      );
    }

    // Get the brand ID associated with this user
    const { data: userData } = await supabase
      .from('users')
      .select('linked_brand_id')
      .eq('id', authResult.user.id)
      .single();

    if (!userData?.linked_brand_id) {
      return NextResponse.json(
        { error: 'Brand not found' },
        { status: 404 }
      );
    }

    const brandId = userData.linked_brand_id;

    // Get the existing supply chain
    const { data: supplyChain, error: chainError } = await supabase
      .from('supply_chain_routes')
      .select('id, chain_id, suppliers')
      .eq('id', chainId)
      .eq('brand_id', brandId)
      .single();

    if (chainError || !supplyChain) {
      return NextResponse.json(
        { error: 'Supply chain not found or not accessible' },
        { status: 404 }
      );
    }

    // In a real implementation, this would use complex algorithms
    // to optimize the supply chain based on emission data, costs, etc.
    // For this demo, we'll simulate optimization by finding alternate
    // suppliers with better metrics

    // Get current suppliers in the chain
    const currentSupplierIds = supplyChain.suppliers;

    // Get all suppliers that have opted in to this brand
    const { data: availableSuppliers } = await supabase
      .from('suppliers')
      .select('id, name, risk_score, value_processes')
      .contains('opted_in_brands', [brandId])
      .not('id', 'in', `(${currentSupplierIds.join(',')})`) // Exclude current suppliers
      .order('risk_score', { ascending: true }); // Prioritize lower risk

    // Create an optimized chain by replacing some suppliers
    // The number of suppliers to replace depends on optimization type
    const replacementCount = 
      optimizationType === 'simple' ? 1 : 
      optimizationType === 'medium' ? Math.ceil(currentSupplierIds.length / 3) : 
      Math.ceil(currentSupplierIds.length / 2);

    const potentialReplacements = availableSuppliers?.slice(0, replacementCount) || [];
    
    // Create a new supply chain with replacements
    const optimizedSupplierIds = [...currentSupplierIds];
    
    for (let i = 0; i < Math.min(replacementCount, potentialReplacements.length); i++) {
      // Replace suppliers starting from the end of the chain for simplicity
      const indexToReplace = optimizedSupplierIds.length - 1 - i;
      if (indexToReplace >= 0) {
        optimizedSupplierIds[indexToReplace] = potentialReplacements[i].id;
      }
    }

    // Calculate estimated impact metrics
    // In a real app, these would be calculated based on actual data
    const impactMetrics = {
      carbon_reduction: Math.floor(Math.random() * 50) + 10, // 10-60% reduction
      cost_savings: Math.floor(Math.random() * 30) + 5, // 5-35% reduction
      lead_time_improvement: Math.floor(Math.random() * 20) + 5 // 5-25% improvement
    };

    // Create a new optimized supply chain
    const { data: optimizedChain, error: createError } = await supabase
      .from('supply_chain_routes')
      .insert({
        brand_id: brandId,
        chain_id: `${supplyChain.chain_id}_optimized`,
        suppliers: optimizedSupplierIds
      })
      .select()
      .single();

    if (createError) {
      return NextResponse.json(
        { error: 'Failed to create optimized supply chain' },
        { status: 500 }
      );
    }

    // Record the optimization result
    const { data: optimizationResult, error: resultError } = await supabase
      .from('optimization_results')
      .insert({
        type: optimizationType as OptimizationType,
        before_chain: supplyChain,
        after_chain: optimizedChain,
        impact_metrics: impactMetrics
      })
      .select()
      .single();

    if (resultError) {
      console.error('Failed to record optimization result:', resultError);
    }

    // Get details of both original and optimized suppliers for the response
    const allSupplierIds = [...new Set([...currentSupplierIds, ...optimizedSupplierIds])];
    
    const { data: supplierDetails } = await supabase
      .from('suppliers')
      .select('id, name, risk_score, profile_strength, value_processes')
      .in('id', allSupplierIds);

    const suppliersMap = supplierDetails?.reduce((map: Record<string, Supplier>, supplier: Supplier) => {
      map[supplier.id] = supplier;
      return map;
    }, {} as Record<string, Supplier>) || {};

    // Format response with detailed supplier info
    const beforeChainDetails = currentSupplierIds.map((id: string) => suppliersMap[id] || { id, name: 'Unknown Supplier' });
    const afterChainDetails = optimizedSupplierIds.map((id: string) => suppliersMap[id] || { id, name: 'Unknown Supplier' });

    return NextResponse.json({
      optimization: {
        id: optimizationResult?.id,
        type: optimizationType,
        before_chain: {
          id: supplyChain.id,
          chain_id: supplyChain.chain_id,
          suppliers: beforeChainDetails
        },
        after_chain: {
          id: optimizedChain.id,
          chain_id: optimizedChain.chain_id,
          suppliers: afterChainDetails
        },
        impact_metrics: impactMetrics,
        replacement_suggestions: potentialReplacements
      }
    });
  } catch (error) {
    console.error('Error optimizing supply chain:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Get all supply chains for optimization
export async function GET(req: NextRequest) {
  // Check if user is authenticated and has the brand role
  const authError = await requireRole(req, ['brand']);
  if (authError) return authError;

  try {
    // Get the authenticated user
    const authResult = await validateToken(req);
    if (!authResult.isValid || !authResult.user) {
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 401 }
      );
    }

    // Get the brand ID associated with this user
    const { data: userData } = await supabase
      .from('users')
      .select('linked_brand_id')
      .eq('id', authResult.user.id)
      .single();

    if (!userData?.linked_brand_id) {
      return NextResponse.json(
        { error: 'Brand not found' },
        { status: 404 }
      );
    }

    const brandId = userData.linked_brand_id;

    // Get all supply chains for this brand
    const { data: supplyChains, error } = await supabase
      .from('supply_chain_routes')
      .select('id, chain_id, suppliers')
      .eq('brand_id', brandId)
      .not('chain_id', 'ilike', '%optimized%'); // Exclude already optimized chains

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch supply chains' },
        { status: 500 }
      );
    }

    // Get details for all suppliers in all chains
    const allSupplierIds = new Set<string>();
    supplyChains?.forEach((chain: SupplyChain) => {
      chain.suppliers.forEach((id: string) => allSupplierIds.add(id));
    });

    const { data: supplierDetails } = await supabase
      .from('suppliers')
      .select('id, name')
      .in('id', Array.from(allSupplierIds));

    const suppliersMap = supplierDetails?.reduce((map: Record<string, Supplier>, supplier: Supplier) => {
      map[supplier.id] = supplier;
      return map;
    }, {} as Record<string, Supplier>) || {};

    // Format response with supplier names
    const chainsWithSupplierDetails = supplyChains?.map((chain: SupplyChain) => ({
      ...chain,
      supplier_details: chain.suppliers.map((id: string) => 
        suppliersMap[id] || { id, name: 'Unknown Supplier' }
      )
    }));

    return NextResponse.json({ supplyChains: chainsWithSupplierDetails });
  } catch (error) {
    console.error('Error fetching supply chains:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 