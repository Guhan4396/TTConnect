const xlsx = require('xlsx');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Initialize Supabase client with SERVICE ROLE key to bypass RLS
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use service role key instead

console.log('Supabase URL:', supabaseUrl ? 'Present' : 'Missing');
console.log('Supabase Key:', supabaseKey ? 'Present' : 'Missing');

const supabase = createClient(supabaseUrl, supabaseKey);

// Log Excel file existence
const fs = require('fs');
const files = [
  './TOKIO_Supplier_Marketplace_BelievableNames.xlsx',
  './Global_Manufacturing_Transport_Emissions.xlsx',
  './abstract_risks_with_overall_risk_score.csv'
];

files.forEach(file => {
  console.log(`File ${file} exists:`, fs.existsSync(file));
});

// We'll skip clearing existing data due to foreign key constraints

async function getBrandId() {
  // Get the brand ID for TOKIO (or first brand if TOKIO doesn't exist)
  const { data: brands, error } = await supabase
    .from('brands')
    .select('id, name')
    .limit(10);
  
  if (error) {
    console.error('Error fetching brands:', error);
    return null;
  }
  
  console.log(`Found ${brands.length} brands`);
  
  // Look for a brand with "TOKIO" in the name
  const tokioBrand = brands.find(b => b.name.toUpperCase().includes('TOKIO'));
  
  if (tokioBrand) {
    console.log(`Found TOKIO brand: ${tokioBrand.name} with ID: ${tokioBrand.id}`);
    return tokioBrand.id;
  }
  
  // If no TOKIO brand, use the first brand
  if (brands.length > 0) {
    console.log(`Using first brand: ${brands[0].name} with ID: ${brands[0].id}`);
    return brands[0].id;
  }
  
  console.error('No brands found in the database');
  return null;
}

async function importSuppliers() {
  try {
    console.log('Importing suppliers from Excel...');
    
    // Get the brand ID
    const brandId = await getBrandId();
    if (!brandId) {
      console.error('Cannot proceed without a brand ID');
      return;
    }
    
    // Read the suppliers Excel file
    const filepath = './TOKIO_Supplier_Marketplace_BelievableNames.xlsx';
    if (!fs.existsSync(filepath)) {
      console.error(`File not found: ${filepath}`);
      console.log('Current directory:', process.cwd());
      console.log('Please place your Excel file in:', process.cwd());
      return;
    }
    
    const workbook = xlsx.readFile(filepath);
    const sheetName = workbook.SheetNames[0];
    console.log('Sheet name:', sheetName);
    
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);
    
    console.log(`Found ${data.length} suppliers in Excel`);
    console.log('First row sample:', JSON.stringify(data[0]));
    
    // First, let's get existing suppliers to avoid duplicates
    const { data: existingSuppliers, error: fetchError } = await supabase
      .from('suppliers')
      .select('id, name');
      
    if (fetchError) {
      console.error('Error fetching existing suppliers:', fetchError);
      return;
    }
    
    const existingNames = new Map(existingSuppliers.map(s => [s.name, s.id]));
    console.log(`Found ${existingNames.size} existing suppliers`);
    
    // Process data for insert
    for (const row of data) {
      const supplierName = row['Supplier Name'] || 'Unknown Supplier';
      let supplierId;
      
      // Check if this supplier already exists
      if (existingNames.has(supplierName)) {
        console.log(`Supplier already exists: ${supplierName}`);
        supplierId = existingNames.get(supplierName);
      } else {
        // Using the correct column names from the Excel file - only fields that exist in the table
        const supplierData = {
          name: supplierName,
          address: row['Country'] || '',
          contact: {
            email: `contact@${supplierName.toLowerCase().replace(/[^a-z0-9]/g, '')}.example.com`,
            phone: '',
            website: '',
          },
          certifications: row['Certifications'] ? row['Certifications'].split(',').map(c => c.trim()) : [],
          materials: row['Materials'] ? row['Materials'].split(',').map(m => m.trim()) : [],
          value_processes: row['Processes'] ? row['Processes'].split(',').map(p => p.trim()) : [],
          risk_score: Math.floor(Math.random() * 100),
          profile_strength: Math.floor(Math.random() * 100),
          opted_in_brands: [brandId], // Add the brand ID to the opted_in_brands array
        };
        
        console.log(`Inserting supplier: ${supplierData.name}`);
        
        // Insert into the database
        const { data: supplier, error } = await supabase
          .from('suppliers')
          .insert(supplierData)
          .select('id');
          
        if (error) {
          console.error(`Error inserting supplier ${supplierData.name}:`, error);
          continue;
        }
        
        supplierId = supplier[0].id;
        console.log(`Supplier ${supplierData.name} inserted with ID: ${supplierId}`);
      }
      
      // Create a connection record to mark this supplier as connected to the brand
      // First check if connection already exists
      const { data: existingConnection, error: connectionCheckError } = await supabase
        .from('connection_requests')
        .select('id')
        .eq('brand_id', brandId)
        .eq('supplier_id', supplierId)
        .eq('status', 'accepted');
      
      if (connectionCheckError) {
        console.error(`Error checking existing connection for supplier ${supplierName}:`, connectionCheckError);
        continue;
      }
      
      if (existingConnection && existingConnection.length > 0) {
        console.log(`Connection already exists between brand and supplier ${supplierName}`);
      } else {
        // Create a connection
        const connectionData = {
          brand_id: brandId,
          supplier_id: supplierId,
          status: 'accepted',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        const { error: connectionError } = await supabase
          .from('connection_requests')
          .insert(connectionData);
          
        if (connectionError) {
          console.error(`Error creating connection for supplier ${supplierName}:`, connectionError);
        } else {
          console.log(`Created connection between brand and supplier ${supplierName}`);
        }
      }
      
      // Also update the supplier to ensure opted_in_brands contains the brand ID
      const { error: updateError } = await supabase
        .from('suppliers')
        .update({ opted_in_brands: [brandId] })
        .eq('id', supplierId);
        
      if (updateError) {
        console.error(`Error updating opted_in_brands for supplier ${supplierName}:`, updateError);
      }
    }
    
    console.log('Supplier import completed.');
  } catch (error) {
    console.error('Error importing suppliers:', error);
    console.error(error.stack);
  }
}

async function runImport() {
  try {
    await importSuppliers();
    console.log('All data import completed.');
  } catch (error) {
    console.error('Fatal error during import:', error);
    console.error(error.stack);
  }
}

runImport();
