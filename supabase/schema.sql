-- Create tables for TTconnect platform

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('brand', 'supplier')),
  linked_brand_id UUID,
  linked_supplier_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Brands table
CREATE TABLE brands (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  logo TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Suppliers table
CREATE TABLE suppliers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  address TEXT,
  contact JSONB NOT NULL DEFAULT '{"email": ""}',
  certifications TEXT[] DEFAULT '{}',
  materials TEXT[] DEFAULT '{}',
  value_processes TEXT[] DEFAULT '{}',
  facilities JSONB[] DEFAULT '{}',
  risk_score INTEGER DEFAULT 0,
  profile_strength INTEGER DEFAULT 0,
  opted_in_brands UUID[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Connection requests table
CREATE TABLE connection_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_id UUID NOT NULL REFERENCES brands(id),
  supplier_id UUID NOT NULL REFERENCES suppliers(id),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  initial_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(brand_id, supplier_id)
);

-- Workspaces table
CREATE TABLE workspaces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_id UUID NOT NULL REFERENCES brands(id),
  supplier_id UUID NOT NULL REFERENCES suppliers(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(brand_id, supplier_id)
);

-- Messages table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id),
  sender_id UUID NOT NULL REFERENCES users(id),
  content TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Documents table
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  supplier_id UUID REFERENCES suppliers(id),
  workspace_id UUID REFERENCES workspaces(id),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('certification', 'contract', 'report', 'other')),
  file_url TEXT NOT NULL,
  uploaded_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CHECK (
    (supplier_id IS NOT NULL AND workspace_id IS NULL) OR
    (supplier_id IS NULL AND workspace_id IS NOT NULL)
  )
);

-- Certifications table
CREATE TABLE certifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  supplier_id UUID NOT NULL REFERENCES suppliers(id),
  name TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('valid', 'expired', 'pending')),
  uploaded_file TEXT NOT NULL,
  expiry_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Checklist items table
CREATE TABLE checklist_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id),
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Supply chain routes table
CREATE TABLE supply_chain_routes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_id UUID NOT NULL REFERENCES brands(id),
  chain_id TEXT NOT NULL,
  suppliers UUID[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(brand_id, chain_id)
);

-- Optimization results table
CREATE TABLE optimization_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL CHECK (type IN ('simple', 'medium', 'max')),
  before_chain JSONB NOT NULL,
  after_chain JSONB NOT NULL,
  impact_metrics JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create storage bucket for documents
INSERT INTO storage.buckets (id, name) 
VALUES ('documents', 'documents')
ON CONFLICT DO NOTHING;

-- Set up public access policy for the documents bucket
CREATE POLICY "Public Access" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'documents');

-- Create RLS policies for the tables

-- Users policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid() = id);

-- Brands policies
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Brands are viewable by authenticated users" ON brands
  FOR SELECT USING (auth.role() = 'authenticated');

-- Suppliers policies
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Suppliers are viewable by authenticated users" ON suppliers
  FOR SELECT USING (auth.role() = 'authenticated');

-- Connection requests policies
ALTER TABLE connection_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Connection requests are viewable by involved parties" ON connection_requests
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND (
        (users.role = 'brand' AND users.linked_brand_id = connection_requests.brand_id) OR
        (users.role = 'supplier' AND users.linked_supplier_id = connection_requests.supplier_id)
      )
    )
  );

-- Workspaces policies
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Workspaces are viewable by involved parties" ON workspaces
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND (
        (users.role = 'brand' AND users.linked_brand_id = workspaces.brand_id) OR
        (users.role = 'supplier' AND users.linked_supplier_id = workspaces.supplier_id)
      )
    )
  );

-- Messages policies
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Messages are viewable by workspace members" ON messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM workspaces w
      JOIN users u ON auth.uid() = u.id
      WHERE messages.workspace_id = w.id
      AND (
        (u.role = 'brand' AND u.linked_brand_id = w.brand_id) OR
        (u.role = 'supplier' AND u.linked_supplier_id = w.supplier_id)
      )
    )
  );

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp"; 