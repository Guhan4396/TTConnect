const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Initialize Supabase client with SERVICE ROLE key to bypass RLS
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('Supabase URL:', supabaseUrl ? 'Present' : 'Missing');
console.log('Supabase Key:', supabaseKey ? 'Present' : 'Missing');

const supabase = createClient(supabaseUrl, supabaseKey);

// Sample certifications to use
const certifications = ['GOTS', 'OEKO-TEX', 'GRS', 'ISO 9001', 'BCI', 'ZDHC', 'LWG', 'RCS', 'SA8000'];

// Countries for suppliers
const countries = ['Vietnam', 'China', 'Bangladesh', 'India', 'Indonesia', 'Turkey', 'Pakistan', 'Cambodia', 'Taiwan', 'South Korea'];

async function fixSuppliers() {
  try {
    console.log('Starting to fix suppliers...');
    
    // Get the brand ID for TOKIO
    const { data: brands, error: brandError } = await supabase
      .from('brands')
      .select('id, name')
      .limit(10);
    
    if (brandError) {
      console.error('Error fetching brands:', brandError);
      return;
    }
    
    const tokioBrand = brands.find(b => b.name.toUpperCase().includes('TOKIO'));
    if (!tokioBrand) {
      console.error('Could not find TOKIO brand');
      return;
    }
    
    const brandId = tokioBrand.id;
    console.log(`Using brand: ${tokioBrand.name} with ID: ${brandId}`);
    
    // Get all suppliers
    const { data: suppliers, error: supplierError } = await supabase
      .from('suppliers')
      .select('*');
      
    if (supplierError) {
      console.error('Error fetching suppliers:', supplierError);
      return;
    }
    
    console.log(`Found ${suppliers.length} suppliers to update`);
    
    // Update each supplier
    for (const supplier of suppliers) {
      // Skip the original seed suppliers (they should be in marketplace)
      if (['EcoFabrics', 'GreenDye', 'EthicalStitch', 'SustainMaterials', 'CleanProcess'].includes(supplier.name)) {
        console.log(`Skipping seed supplier: ${supplier.name}`);
        
        // Ensure seed suppliers are NOT connected
        await supabase
          .from('connection_requests')
          .delete()
          .eq('supplier_id', supplier.id);
          
        // Ensure they don't have opted_in_brands
        await supabase
          .from('suppliers')
          .update({ opted_in_brands: [] })
          .eq('id', supplier.id);
          
        continue;
      }
      
      // Assign random certifications (2-3)
      const randomCerts = [];
      const certCount = Math.floor(Math.random() * 2) + 2; // 2-3 certifications
      for (let i = 0; i < certCount; i++) {
        const cert = certifications[Math.floor(Math.random() * certifications.length)];
        if (!randomCerts.includes(cert)) {
          randomCerts.push(cert);
        }
      }
      
      // Assign a country
      const country = countries[Math.floor(Math.random() * countries.length)];
      
      // Update the supplier
      const { error: updateError } = await supabase
        .from('suppliers')
        .update({
          address: country,
          certifications: randomCerts,
          risk_score: Math.floor(Math.random() * 70) + 30, // 30-100 range
          profile_strength: Math.floor(Math.random() * 40) + 60, // 60-100 range
          opted_in_brands: [brandId]
        })
        .eq('id', supplier.id);
        
      if (updateError) {
        console.error(`Error updating supplier ${supplier.name}:`, updateError);
        continue;
      }
      
      // Create a connection if one doesn't exist
      const { data: existingConnection, error: connectionCheckError } = await supabase
        .from('connection_requests')
        .select('id')
        .eq('brand_id', brandId)
        .eq('supplier_id', supplier.id);
      
      if (connectionCheckError) {
        console.error(`Error checking connection for supplier ${supplier.name}:`, connectionCheckError);
        continue;
      }
      
      if (existingConnection && existingConnection.length > 0) {
        // Update the connection to accepted status
        const { error: connectionUpdateError } = await supabase
          .from('connection_requests')
          .update({ status: 'accepted' })
          .eq('id', existingConnection[0].id);
          
        if (connectionUpdateError) {
          console.error(`Error updating connection for supplier ${supplier.name}:`, connectionUpdateError);
        } else {
          console.log(`Updated connection for supplier ${supplier.name}`);
        }
      } else {
        // Create a new connection
        const connectionData = {
          brand_id: brandId,
          supplier_id: supplier.id,
          status: 'accepted',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        const { error: connectionError } = await supabase
          .from('connection_requests')
          .insert(connectionData);
          
        if (connectionError) {
          console.error(`Error creating connection for supplier ${supplier.name}:`, connectionError);
        } else {
          console.log(`Created connection for supplier ${supplier.name}`);
        }
      }
      
      console.log(`Updated supplier: ${supplier.name}`);
    }
    
    console.log('Supplier updates completed.');
  } catch (error) {
    console.error('Error fixing suppliers:', error);
    console.error(error.stack);
  }
}

fixSuppliers(); 