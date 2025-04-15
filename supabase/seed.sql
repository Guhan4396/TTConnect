-- Seed data for TTconnect platform

-- Insert brands
INSERT INTO brands (id, name, logo) VALUES
('11111111-1111-1111-1111-111111111111', 'Tokio', 'https://placehold.co/400x200?text=Tokio'),
('22222222-2222-2222-2222-222222222222', 'Houdini', 'https://placehold.co/400x200?text=Houdini'),
('33333333-3333-3333-3333-333333333333', 'Adidas', 'https://placehold.co/400x200?text=Adidas'),
('44444444-4444-4444-4444-444444444444', 'Nike', 'https://placehold.co/400x200?text=Nike'),
('55555555-5555-5555-5555-555555555555', 'Puma', 'https://placehold.co/400x200?text=Puma');

-- Insert suppliers with value processes and certifications
INSERT INTO suppliers (id, name, address, contact, certifications, materials, value_processes, risk_score, profile_strength, opted_in_brands) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'EcoFabrics', '123 Green St, Sustainability City', 
  '{"email": "contact@ecofabrics.example", "phone": "+1 555-123-4567", "website": "https://ecofabrics.example"}',
  ARRAY['GRS', 'GOTS', 'Oeko-Tex'],
  ARRAY['Organic Cotton', 'Recycled Polyester', 'Hemp'],
  ARRAY['Weaving', 'Dyeing', 'Finishing'],
  25, 85,
  ARRAY[UUID '11111111-1111-1111-1111-111111111111', UUID '22222222-2222-2222-2222-222222222222']
),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'GreenDye', '456 Eco Ave, Greenville', 
  '{"email": "info@greendye.example", "phone": "+1 555-987-6543", "website": "https://greendye.example"}',
  ARRAY['Bluesign', 'ISO 14001'],
  ARRAY['Natural Dyes', 'Low-Impact Dyes'],
  ARRAY['Dyeing', 'Printing', 'Finishing'],
  35, 75,
  ARRAY[UUID '11111111-1111-1111-1111-111111111111', UUID '33333333-3333-3333-3333-333333333333']
),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'EthicalStitch', '789 Fair Trade Blvd, Ethicsville', 
  '{"email": "hello@ethicalstitch.example", "phone": "+1 555-456-7890", "website": "https://ethicalstitch.example"}',
  ARRAY['Fair Trade', 'SA8000'],
  ARRAY['Organic Cotton', 'Linen', 'Wool'],
  ARRAY['Cutting', 'Stitching', 'Embroidery'],
  15, 95,
  ARRAY[UUID '22222222-2222-2222-2222-222222222222', UUID '44444444-4444-4444-4444-444444444444']
),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'SustainMaterials', '321 Recycled Road, Circularville', 
  '{"email": "support@sustainmaterials.example", "phone": "+1 555-789-0123", "website": "https://sustainmaterials.example"}',
  ARRAY['GRS', 'RCS'],
  ARRAY['Recycled Polyester', 'Recycled Nylon', 'Organic Cotton'],
  ARRAY['Spinning', 'Extrusion', 'Weaving'],
  40, 80,
  ARRAY[UUID '33333333-3333-3333-3333-333333333333', UUID '55555555-5555-5555-5555-555555555555']
),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'CleanProcess', '654 Pure Stream Way, Cleantown', 
  '{"email": "info@cleanprocess.example", "phone": "+1 555-234-5678", "website": "https://cleanprocess.example"}',
  ARRAY['ISO 14001', 'ZDHC'],
  ARRAY['Recycled Water Systems', 'Chemical Management'],
  ARRAY['Washing', 'Dyeing', 'Finishing'],
  30, 70,
  ARRAY[UUID '44444444-4444-4444-4444-444444444444', UUID '55555555-5555-5555-5555-555555555555']
);

-- Insert users (brands and suppliers)
-- Note: In a real environment, these would have hashed passwords
INSERT INTO users (id, email, password, role, linked_brand_id) VALUES
('11111111-1111-1111-1111-111111111112', 'tokio@example.com', 'hashed_password_here', 'brand', '11111111-1111-1111-1111-111111111111'),
('22222222-2222-2222-2222-222222222223', 'houdini@example.com', 'hashed_password_here', 'brand', '22222222-2222-2222-2222-222222222222'),
('33333333-3333-3333-3333-333333333334', 'adidas@example.com', 'hashed_password_here', 'brand', '33333333-3333-3333-3333-333333333333'),
('44444444-4444-4444-4444-444444444445', 'nike@example.com', 'hashed_password_here', 'brand', '44444444-4444-4444-4444-444444444444'),
('55555555-5555-5555-5555-555555555556', 'puma@example.com', 'hashed_password_here', 'brand', '55555555-5555-5555-5555-555555555555');

INSERT INTO users (id, email, password, role, linked_supplier_id) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaab', 'ecofabrics@example.com', 'hashed_password_here', 'supplier', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbc', 'greendye@example.com', 'hashed_password_here', 'supplier', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
('cccccccc-cccc-cccc-cccc-cccccccccccd', 'ethicalstitch@example.com', 'hashed_password_here', 'supplier', 'cccccccc-cccc-cccc-cccc-cccccccccccc'),
('dddddddd-dddd-dddd-dddd-ddddddddddde', 'sustainmaterials@example.com', 'hashed_password_here', 'supplier', 'dddddddd-dddd-dddd-dddd-dddddddddddd'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'cleanprocess@example.com', 'hashed_password_here', 'supplier', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee');

-- Insert connection requests
INSERT INTO connection_requests (id, brand_id, supplier_id, status, initial_message) VALUES
('aaaaaaaa-1111-aaaa-1111-aaaaaa111111', '11111111-1111-1111-1111-111111111111', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'pending', 'We are interested in your ethical stitching services for our upcoming sustainable collection.'),
('bbbbbbbb-2222-bbbb-2222-bbbbbb222222', '22222222-2222-2222-2222-222222222222', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'accepted', 'We would like to explore using your recycled materials in our next product line.'),
('cccccccc-3333-cccc-3333-cccccc333333', '33333333-3333-3333-3333-333333333333', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'declined', 'We are looking for partners with clean processing capabilities.');

-- Insert workspaces for accepted connections
INSERT INTO workspaces (id, brand_id, supplier_id) VALUES
('77777777-7777-7777-7777-777777777777', '22222222-2222-2222-2222-222222222222', 'dddddddd-dddd-dddd-dddd-dddddddddddd');

-- Insert messages in the workspace
INSERT INTO messages (id, workspace_id, sender_id, content, timestamp) VALUES
('88888888-8888-8888-8888-888888888888', '77777777-7777-7777-7777-777777777777', '22222222-2222-2222-2222-222222222223', 'Hello! We are excited to work with you on our new sustainable line.', NOW() - INTERVAL '2 days'),
('99999999-9999-9999-9999-999999999999', '77777777-7777-7777-7777-777777777777', 'dddddddd-dddd-dddd-dddd-ddddddddddde', 'Thank you for the opportunity! We look forward to providing our recycled materials.', NOW() - INTERVAL '1 day'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa11', '77777777-7777-7777-7777-777777777777', '22222222-2222-2222-2222-222222222223', 'Can you send us samples of your recycled polyester fabric?', NOW());

-- Insert certifications
INSERT INTO certifications (id, supplier_id, name, status, uploaded_file) VALUES
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb11', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'GOTS Certification', 'valid', 'https://placehold.co/400x500?text=GOTS+Certificate'),
('cccccccc-cccc-cccc-cccc-cccccccccc11', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Bluesign Certificate', 'valid', 'https://placehold.co/400x500?text=Bluesign+Certificate'),
('dddddddd-dddd-dddd-dddd-dddddddddd11', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Fair Trade Certification', 'valid', 'https://placehold.co/400x500?text=Fair+Trade+Certificate');

-- Insert supply chain routes
INSERT INTO supply_chain_routes (id, brand_id, chain_id, suppliers) VALUES
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeee11', '11111111-1111-1111-1111-111111111111', 'organic-cotton-line', ARRAY[UUID 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', UUID 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb']),
('ffffffff-ffff-ffff-ffff-ffffffffff11', '22222222-2222-2222-2222-222222222222', 'recycled-poly-line', ARRAY[UUID 'dddddddd-dddd-dddd-dddd-dddddddddddd', UUID 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee']),
('00000000-0000-0000-0000-0000000000aa', '33333333-3333-3333-3333-333333333333', 'performance-wear', ARRAY[UUID 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', UUID 'cccccccc-cccc-cccc-cccc-cccccccccccc', UUID 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee']);

-- Insert checklist items for the existing workspace
INSERT INTO checklist_items (id, workspace_id, title, status) VALUES
('11111111-1111-1111-1111-11111111aa11', '77777777-7777-7777-7777-777777777777', 'Initial meeting', 'completed'),
('22222222-2222-2222-2222-22222222aa11', '77777777-7777-7777-7777-777777777777', 'Material samples review', 'in_progress'),
('33333333-3333-3333-3333-33333333aa11', '77777777-7777-7777-7777-777777777777', 'Contract signing', 'not_started'),
('44444444-4444-4444-4444-44444444aa11', '77777777-7777-7777-7777-777777777777', 'Production timeline agreement', 'not_started'); 