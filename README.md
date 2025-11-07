# PharmaCare - Professional Pharmacy E-Commerce Platform

A complete, world-standard e-commerce web application for a pharmacy built with Next.js, Firebase, and modern web technologies.

## Features

- 🛒 Complete e-commerce functionality (product catalog, cart, checkout)
- 🔐 User authentication (sign up, login, password reset)
- 💊 Product management with categories and search
- 📋 Prescription upload and management
- 💳 MTN MoMo payment integration
- 👨‍💼 Admin dashboard for managing products, orders, and users
- 📱 Fully responsive mobile-first design
- 🌓 Dark/light theme support
- 🔒 Firebase security rules
- 📦 Cloudinary image optimization

## Tech Stack

- **Frontend**: Next.js 16, React, TypeScript
- **Styling**: Tailwind CSS v4
- **Backend**: Firebase (Firestore, Auth, Storage, Cloud Functions)
- **Image Management**: Cloudinary
- **Payment**: MTN MoMo API
- **State Management**: Zustand
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Firebase account
- Cloudinary account
- MTN MoMo API credentials (sandbox for testing)

### Installation

1. Clone the repository:
\`\`\`bash
git clone <your-repo-url>
cd pharmacare
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:

Create a \`.env.local\` file in the root directory:

\`\`\`env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset

# MTN MoMo Configuration
MTN_MOMO_SUBSCRIPTION_KEY=your_subscription_key
MTN_MOMO_API_USER=your_api_user
MTN_MOMO_API_KEY=your_api_key
MTN_MOMO_ENVIRONMENT=sandbox
\`\`\`

4. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Firebase Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Authentication (Email/Password)
3. Create a Firestore database
4. Enable Storage
5. Deploy the security rules from \`firebase/firestore.rules\` and \`firebase/storage.rules\`

## Cloudinary Setup

1. Create a Cloudinary account at [cloudinary.com](https://cloudinary.com)
2. Get your Cloud Name from the dashboard
3. Create an unsigned upload preset in Settings > Upload

## Project Structure

\`\`\`
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication pages
│   ├── (shop)/            # Shop pages
│   ├── admin/             # Admin dashboard
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── layout/           # Layout components
│   └── features/         # Feature-specific components
├── lib/                   # Utility functions and configurations
│   ├── firebase/         # Firebase configuration
│   ├── hooks/            # Custom React hooks
│   └── types/            # TypeScript types
└── public/               # Static assets
\`\`\`

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Firebase Cloud Functions

Deploy payment webhook and other cloud functions:

\`\`\`bash
cd firebase/functions
npm install
firebase deploy --only functions
\`\`\`

## Security

- Firebase security rules are configured for Firestore and Storage
- Environment variables are used for sensitive data
- Server-side payment processing for security
- Input validation and sanitization

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.
\`\`\`
