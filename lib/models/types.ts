// User Types
export type UserRole = 'brand' | 'supplier';

export interface User {
  id: string;
  email: string;
  password: string;
  role: UserRole;
  linked_brand_id?: string;
  linked_supplier_id?: string;
  created_at?: string;
  updated_at?: string;
}

// Brand Types
export interface Brand {
  id: string;
  name: string;
  logo?: string;
  created_at?: string;
  updated_at?: string;
}

// Supplier Types
export type SupplierCertificationType = 'environmental' | 'ethical' | 'quality' | 'safety' | 'other';
export type ValueProcess = 
  | 'Finishing'
  | 'Printing'
  | 'Dyeing'
  | 'Knitting'
  | 'Weaving'
  | 'Warping'
  | 'Spinning'
  | 'Extrusion'
  | 'Ginning'
  | 'Cultivation'
  | 'Carding'
  | 'Washing'
  | 'Farming'
  | 'Fibre Production'
  | 'Down Processing'
  | 'Slaughtering'
  | 'Tanning'
  | 'Ironing'
  | 'Pre-treatment'
  | 'Accessories Application'
  | 'Assembling'
  | 'Embroidery'
  | 'Cutting'
  | 'Hand Treatment'
  | 'Stitching';

export interface Facility {
  id: string;
  name: string;
  address: string;
  country: string;
  certifications?: string[];
}

export interface Supplier {
  id: string;
  name: string;
  address: string;
  contact: {
    email: string;
    phone?: string;
    website?: string;
  };
  certifications: string[];
  materials: string[];
  value_processes: ValueProcess[];
  facilities: Facility[];
  risk_score: number;
  profile_strength: number;
  opted_in_brands: string[];
  created_at?: string;
  updated_at?: string;
}

// Connection Types
export type ConnectionStatus = 'pending' | 'accepted' | 'declined';

export interface ConnectionRequest {
  id: string;
  brand_id: string;
  supplier_id: string;
  status: ConnectionStatus;
  initial_message?: string;
  created_at?: string;
  updated_at?: string;
}

// Workspace Types
export interface Workspace {
  id: string;
  brand_id: string;
  supplier_id: string;
  created_at?: string;
  updated_at?: string;
}

// Message Types
export interface Message {
  id: string;
  workspace_id: string;
  sender_id: string;
  content: string;
  timestamp: string;
}

// Document Types
export type DocumentType = 'certification' | 'contract' | 'report' | 'other';

export interface Document {
  id: string;
  supplier_id?: string;
  workspace_id?: string;
  name: string;
  type: DocumentType;
  file_url: string;
  uploaded_by: string;
  created_at?: string;
  updated_at?: string;
}

// Certification Types
export type CertificationStatus = 'valid' | 'expired' | 'pending';

export interface Certification {
  id: string;
  supplier_id: string;
  name: string;
  status: CertificationStatus;
  uploaded_file: string;
  expiry_date?: string;
  created_at?: string;
  updated_at?: string;
}

// Checklist Types
export type ChecklistStatus = 'not_started' | 'in_progress' | 'completed';

export interface ChecklistItem {
  id: string;
  workspace_id: string;
  title: string;
  status: ChecklistStatus;
  created_at?: string;
  updated_at?: string;
}

// Supply Chain Types
export interface SupplyChainRoute {
  id: string;
  brand_id: string;
  chain_id: string;
  suppliers: string[];
  created_at?: string;
  updated_at?: string;
}

// Optimization Types
export type OptimizationType = 'simple' | 'medium' | 'max';

export interface OptimizationResult {
  id: string;
  type: OptimizationType;
  before_chain: SupplyChainRoute;
  after_chain: SupplyChainRoute;
  impact_metrics: {
    carbon_reduction: number;
    cost_savings: number;
    lead_time_improvement: number;
  };
  created_at?: string;
  updated_at?: string;
} 