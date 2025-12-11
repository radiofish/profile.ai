# Profile.ai

A personal profile website where anyone can create and share their profile, built with Next.js and Supabase.

## Features

- **No Authentication Required**: Create profiles with just a username
- **Public Profile Grid**: Browse all published profiles on the main page
- **Username-based URLs**: Each profile is accessible at `/{username}`
- **Admin Mode**: Edit profiles at `/edit/{username}` (hidden from public navigation)
- **Iframely Integration**: Automatically embeds URLs as rich content
- **Drag & Drop**: Arrange content using react-grid-layout
- **Supabase Backend**: Data storage without authentication

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Run the migration files to create the database schema:
   - Go to SQL Editor in your Supabase dashboard
   - Copy and paste the contents of `supabase/migrations/001_initial_schema.sql`
   - Execute the SQL
   - Then copy and paste the contents of `supabase/migrations/002_remove_auth_add_username.sql`
   - Execute the SQL

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
# OR use legacy anon key:
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_IFRAMELY_API_KEY=your_iframely_api_key
```

**Note**: 
- Supabase is transitioning to new keys. Use `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (starts with `sb_publishable_...`) for new projects, or `NEXT_PUBLIC_SUPABASE_ANON_KEY` (starts with `eyJ...`) for legacy projects. **Do NOT use the secret key** (`sb_secret_...`) in client-side code.
- Iframely API key is optional. Without it, the app will use the public endpoint (which has rate limits). Sign up at [iframely.com](https://iframely.com) to get an API key.

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Create Profile**: Click "Create Your Profile" on the main page and choose a username
2. **Add Content**: Enter URLs and click "Add" to embed them
3. **Arrange Layout**: Drag and drop content items to arrange them
4. **Resize**: Drag the bottom-right corner of items to resize them
5. **Delete**: Click the "Delete" button on any content item
6. **Publish**: Click "Publish" to make your profile visible on the main page
7. **View Profile**: Visit `/{username}` to see your published profile
8. **Edit Profile**: Visit `/edit/{username}` to edit your profile (not linked publicly)

## Routes

- `/` - Main page showing grid of all published profiles
- `/{username}` - View a specific profile (presentation mode)
- `/create` - Create a new profile
- `/edit/{username}` - Edit a profile (admin mode, hidden from public)

## Tech Stack

- **Next.js 14**: React framework with App Router
- **Supabase**: Backend database (no authentication)
- **react-grid-layout**: Drag and drop grid layout
- **Iframely**: URL embedding service
- **TypeScript**: Type safety

## Database Schema

- **profiles**: Stores profiles with username and publish status
- **content_items**: Stores embedded content with layout positions

## License

MIT

