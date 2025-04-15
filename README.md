# TTconnect - B2B Sustainability Platform

TTconnect is a B2B sustainability platform that connects brands with suppliers to optimize supply chains and promote sustainable practices.

## Features

- **Supplier Marketplace**: Discover and connect with sustainable suppliers
- **My Suppliers**: Manage your connected suppliers
- **Supply Chain Optimization**: Visualize and optimize your supply chain routes
- **Messaging**: Communicate directly with suppliers
- **Certifications**: View and manage sustainability certifications

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API routes
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Custom JWT implementation
- **File Storage**: Supabase Storage

## Setup Guide

### Prerequisites

- Node.js 16+ 
- pnpm
- Supabase account

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/Guhan4396/TTConnect.git
   cd ttconnect
   ```

2. Install dependencies:
   ```
   pnpm install
   ```

3. Create a `.env.local` file with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   JWT_SECRET=your_jwt_secret
   ```

4. Create the database schema and seed the database:
   - Run the SQL from `supabase/schema.sql` in the Supabase SQL editor
   - Run the SQL from `supabase/seed.sql` in the Supabase SQL editor

5. Create a storage bucket named 'documents' in your Supabase project.

### Running the Application

Start the development server:
```
pnpm dev
```

Visit http://localhost:3000 to see the application.

### Login Information

- **Brand Login**: 
  - Email: tokio@example.com
  - Password: hashed_password_here

- **Supplier Login**:
  - Email: ecofabrics@example.com
  - Password: hashed_password_here

## Importing Data

To import supplier data from Excel:
```
node import-excel.js
```

## Deployment

The application can be deployed to Vercel:
```
vercel
```

## License

MIT
