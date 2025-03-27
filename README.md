# Courtcase - Defense Lawyer Case Management System (Next.js Version)

A comprehensive case management system for defense lawyers, built with Next.js, TypeScript, and Firebase. This project is a migration from the original React-based Courtcase application to a modern Next.js architecture, incorporating features from the CaseFlow Android project.

## Features

- **User Authentication**: Secure login and registration with role-based access control (Admin, Primary, Basic)
- **Structured Case Workflow**: Organized into 9 key defense case phases:
  1. Initial Consultation
  2. Case Evaluation
  3. Legal Research
  4. Documents & Evidence
  5. Pre-Trial Preparation
  6. Negotiation & Plea Bargaining
  7. Trial Preparation
  8. During Trial
  9. Post-Trial
- **Dynamic Forms**: Text fields that automatically expand as content grows
- **AI Assistance**: Integrated AI tools to help with case analysis and legal research
- **Case Management**: Create, view, update, delete, and organize defense cases
- **Client Management**: Manage client information and communications
- **Document Storage**: Upload and organize case-related documents with preview functionality
- **Calendar Integration**: Track court dates, meetings, and deadlines
- **Case Export**: Export cases in various formats (PDF, JSON)
- **Soft Delete**: 30-day retention period for deleted cases with restoration capability
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Technology Stack

- **Frontend**: Next.js 13+, TypeScript, Material UI
- **State Management**: Redux with Redux Toolkit
- **Authentication**: Firebase Authentication
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage
- **Hosting**: Firebase Hosting
- **Functions**: Firebase Cloud Functions
- **AI Integration**: Support for multiple AI providers
- **Forms**: Dynamic expandable text fields

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- Firebase account

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/Keiobi/Courtcase.git
   cd courtcase-nextjs
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with your Firebase configuration:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
   ```

4. Start the development server:
   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Firebase Setup

1. Create a new Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Enable Authentication (Email/Password)
3. Create a Firestore database
4. Set up Firebase Storage
5. Deploy Firebase Functions (if needed)

## Deployment

### Deploy to Firebase Hosting

1. Install Firebase CLI:
   ```
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```
   firebase login
   ```

3. Initialize Firebase:
   ```
   firebase init
   ```

4. Build the Next.js application:
   ```
   npm run build
   ```

5. Deploy to Firebase:
   ```
   firebase deploy
   ```

## Project Structure

- `/src/app`: Next.js App Router pages and layouts
- `/src/components`: Reusable UI components
- `/src/features`: Feature-specific components
- `/src/services`: Service layer (Firebase, API)
- `/public`: Static assets

## Documentation

### Development Plan

A detailed development plan is available in the [DEVELOPMENT_PLAN.md](./DEVELOPMENT_PLAN.md) file. This document outlines:

- Development phases and current progress
- Completed components and features
- In-progress work
- Next steps and future tasks
- Development guidelines and best practices

Refer to this document for a comprehensive overview of the project's development status and roadmap.

### Technical Documentation

For detailed technical information about the application architecture, implementation details, and best practices, refer to the [TECHNICAL_DOCUMENTATION.md](./TECHNICAL_DOCUMENTATION.md) file. This document includes:

- Architecture overview
- Component design principles
- Data flow and state management
- Authentication flow
- Firebase integration examples
- Routing and navigation
- Styling and theming
- Error handling strategies
- Performance optimization techniques
- Testing strategies
- Deployment process
- Security considerations
- Troubleshooting guides

This technical documentation serves as a reference for developers working on the project.

## License

This project is licensed under the Apache License 2.0 - see the LICENSE file for details.
