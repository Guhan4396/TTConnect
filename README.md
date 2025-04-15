# TTconnect

TTconnect is a B2B sustainability platform that connects brands and suppliers, helping to optimize supply chains and promote sustainability.

## Features

- **Two User Roles**: Brand and Supplier
- **Authentication**: JWT-based authentication
- **Supplier Marketplace**: Brands can discover suppliers with filters
- **Connection Requests**: Brands can send connection requests to suppliers
- **Workspaces**: Brands and suppliers collaborate within dedicated workspaces
- **Messaging**: Real-time messaging within workspaces
- **Document Management**: Upload and share certifications and documents
- **Supply Chain Optimization**: Optimize supply chains based on emissions, costs, and other factors

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or pnpm
- Supabase account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ttconnect.git
   cd ttconnect
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   ```

3. Create a `.env.local` file in the root directory with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   JWT_SECRET=your-jwt-secret-key
   ```

4. Create the required tables in your Supabase database:
   - users
   - brands
   - suppliers
   - connection_requests
   - workspaces
   - messages
   - documents
   - certifications
   - checklist_items
   - supply_chain_routes
   - optimization_results

5. Run the development server:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Database Schema

The database consists of the following tables:

- **Users**: Stores user authentication and role information
- **Brands**: Stores brand profiles
- **Suppliers**: Stores supplier profiles with certifications, materials, and value processes
- **Connection Requests**: Manages connection requests between brands and suppliers
- **Workspaces**: Represents collaborative spaces between connected brands and suppliers
- **Messages**: Stores messages exchanged in workspaces
- **Documents**: Stores document metadata (files stored in Supabase Storage)
- **Certifications**: Stores supplier certifications
- **Supply Chain Routes**: Stores supply chain configurations
- **Optimization Results**: Stores the results of supply chain optimizations

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **Authentication**: JWT, Supabase Auth

## Deployment

The application can be deployed to Vercel:

1. Connect your repository to Vercel
2. Add the environment variables
3. Deploy

## License

This project is licensed under the MIT License - see the LICENSE file for details. 