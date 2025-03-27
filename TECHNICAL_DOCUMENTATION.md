# Courtcase Next.js Technical Documentation

This document provides technical details about the Courtcase Next.js application architecture, implementation, and best practices. It serves as a reference for developers working on the project.

## Architecture Overview

The Courtcase Next.js application follows a modern architecture based on Next.js 13+ with the App Router pattern. The application is structured to provide a clean separation of concerns, maintainable code, and optimal performance.

### Key Architectural Components

1. **Next.js App Router**: Provides file-based routing and layout nesting
2. **React Server Components**: Enables server-side rendering for improved performance
3. **Client Components**: Used for interactive UI elements with client-side state
4. **Redux Toolkit**: Manages global application state
5. **Material UI**: Provides consistent UI components and theming
6. **Firebase Services**: Backend services for authentication, data storage, and functions
7. **AI Integration**: Services for AI-assisted content generation

## Component Architecture

### Component Types

1. **Page Components**: Located in `src/app` directory, define routes in the application
2. **Layout Components**: Define shared layouts for multiple pages
3. **UI Components**: Reusable UI elements in `src/components`
4. **Feature Components**: Feature-specific components in `src/features`
5. **Case Phase Components**: Specialized components for each phase of the case workflow
6. **Dynamic Form Components**: Components like ExpandableTextField that adapt to user input
7. **Service Modules**: Backend service integrations in `src/services`

### Component Design Principles

- **Single Responsibility**: Each component should have a single responsibility
- **Composition Over Inheritance**: Use component composition for reusability
- **Stateful vs. Stateless**: Separate stateful logic from presentation components
- **Server vs. Client Components**: Use server components where possible for better performance

## Data Flow

### State Management

The application uses a combination of:

1. **Redux Toolkit**: For global application state management
2. **Local Component State**: For UI-specific state using React's `useState` hook
3. **Context API**: For shared state across component trees
4. **Firebase Realtime Updates**: For data that needs to be synchronized with the backend

#### Redux Store Structure

```typescript
// src/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import casesReducer from './features/cases/casesSlice';
import clientsReducer from './features/clients/clientsSlice';
import settingsReducer from './features/settings/settingsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cases: casesReducer,
    clients: clientsReducer,
    settings: settingsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### Data Fetching

Data fetching is implemented using:

1. **Server Components**: For data that can be fetched at build/request time
2. **React Query/SWR**: For client-side data fetching with caching and revalidation
3. **Firebase SDK**: For real-time data and authentication state

## Authentication Flow

1. **User Registration**:
   - User submits registration form
   - Firebase Authentication creates a new user
   - User profile is created in Firestore
   - User is redirected to dashboard

2. **User Login**:
   - User submits login form
   - Firebase Authentication verifies credentials
   - User session is established
   - User is redirected to dashboard

3. **Authentication State**:
   - Firebase Auth state is used to track user authentication
   - Protected routes check authentication state
   - Unauthenticated users are redirected to login

## Firebase Integration

### Authentication

```typescript
// src/services/firebase.ts
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

// Initialize Firebase Auth
const auth = getAuth(app);

// Sign in with email and password
export const signInWithEmail = async (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

// Create user with email and password
export const createUserWithEmail = async (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password);
};
```

### Firestore Database

```typescript
// Example Firestore integration
import { getFirestore, collection, doc, getDoc, setDoc, query, where } from 'firebase/firestore';

const db = getFirestore(app);

// Get case by ID
export const getCaseById = async (caseId: string) => {
  const caseRef = doc(db, 'cases', caseId);
  const caseSnap = await getDoc(caseRef);
  
  if (caseSnap.exists()) {
    return { id: caseSnap.id, ...caseSnap.data() };
  }
  
  return null;
};

// Get cases by user ID
export const getCasesByUserId = async (userId: string) => {
  const casesQuery = query(collection(db, 'cases'), where('userId', '==', userId));
  const querySnapshot = await getDocs(casesQuery);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};
```

### Storage

```typescript
// Example Storage integration
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const storage = getStorage(app);

// Upload file
export const uploadFile = async (file: File, path: string) => {
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file);
  return getDownloadURL(snapshot.ref);
};
```

### Cloud Functions

```typescript
// Example Cloud Functions integration
import { getFunctions, httpsCallable } from 'firebase/functions';

const functions = getFunctions(app);

// Call a Cloud Function
export const processCase = async (caseData: any) => {
  const processCaseFunction = httpsCallable(functions, 'processCase');
  return processCaseFunction(caseData);
};
```

## Case Management Data Model

### Case Data Structure

```typescript
interface Case {
  id: string;
  caseNumber: string;
  clientName: string;
  currentSummary: string;
  caseDate: string | null;
  status: 'Open' | 'Closed' | 'Pending' | 'Deleted';
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  userId: string;
  isPrimary: boolean;
  canWrite: boolean;
  canExport: boolean;
  
  // Client information
  client?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    statement: string;
    objectives: string;
  };
  
  // Initial Consultation
  chargesExplanation: string;
  potentialOutcomes: string;
  timelineEstimate: string;
  defenseStrategySteps: string;
  
  // Case Evaluation
  evidenceReview: string;
  caseStrengths: string;
  caseWeaknesses: string;
  expertConsultation: string;
  
  // Legal Research
  relevantLaws: string;
  casePrecedents: string;
  legalStrategy: string;
  
  // Pre-Trial Preparation
  motionFilings: string;
  discoveryProcess: string;
  witnessPreparation: string;
  
  // Negotiation
  negotiationStrategy: string;
  prosecutionCommunication: string;
  clientConsultation: string;
  
  // Trial Preparation
  defenseStrategy: string;
  mockTrialNotes: string;
  exhibitPreparation: string;
  
  // During Trial
  openingStatement: string;
  crossExamination: string;
  defensePresentation: string;
  closingArgument: string;
  
  // Post-Trial
  verdictAndSentencing: string;
  appealsPlanning: string;
  postTrialMotions: string;
}
```

### Document Data Structure

```typescript
interface Document {
  id: string;
  caseId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadDate: string;
  uploadedBy: string;
  category: string;
  phase: string;
  description: string;
  url: string;
}
```

## Routing and Navigation

### App Router Structure

```
src/app/
├── layout.tsx           # Root layout (applied to all pages)
├── page.tsx             # Home page
├── login/
│   └── page.tsx         # Login page
├── register/
│   └── page.tsx         # Registration page
├── dashboard/
│   └── page.tsx         # Dashboard page
├── cases/
│   ├── page.tsx         # Cases list page
│   ├── new/
│   │   └── page.tsx     # New case creation page
│   └── [id]/
│       └── page.tsx     # Case detail page
├── clients/
│   ├── page.tsx         # Clients list page
│   ├── new/
│   │   └── page.tsx     # New client creation page
│   └── [id]/
│       └── page.tsx     # Client detail page
├── calendar/
│   └── page.tsx         # Calendar page
└── settings/
    └── page.tsx         # Settings page
```

### Navigation

```typescript
// Client-side navigation
import { useRouter } from 'next/navigation';

const MyComponent = () => {
  const router = useRouter();
  
  const handleClick = () => {
    router.push('/dashboard');
  };
  
  return <button onClick={handleClick}>Go to Dashboard</button>;
};
```

## Dynamic UI Components

### Expandable Text Field

The ExpandableTextField component is a key UI element that automatically expands as the user types content:

```typescript
// src/components/common/ExpandableTextField.tsx
import React, { useState, useRef, useEffect } from 'react';
import { TextField, InputAdornment, IconButton, Box } from '@mui/material';
import { ContentCopy as ContentCopyIcon } from '@mui/icons-material';
import AiAssistButton from './AiAssistButton';

interface ExpandableTextFieldProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  multiline?: boolean;
  allowCopy?: boolean;
  enableAiAssistance?: boolean;
  aiContext?: string;
  placeholder?: string;
  minRows?: number;
  [key: string]: any;
}

const ExpandableTextField: React.FC<ExpandableTextFieldProps> = ({
  value,
  onChange,
  label,
  multiline = true,
  allowCopy = false,
  enableAiAssistance = false,
  aiContext = 'general',
  placeholder,
  minRows = 3,
  ...rest
}) => {
  const [rows, setRows] = useState(minRows);
  const textFieldRef = useRef<HTMLDivElement>(null);

  // Function to copy text to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(value || '');
  };
  
  // Function to handle AI assistance result
  const handleAiResult = (result: string) => {
    if (onChange) {
      // Create a synthetic event
      const syntheticEvent = {
        target: { value: value ? value + '\n\n' + result : result }
      } as React.ChangeEvent<HTMLInputElement>;
      
      onChange(syntheticEvent);
    }
  };

  // Calculate rows based on content
  useEffect(() => {
    if (multiline && value) {
      const lineCount = (value.match(/\n/g) || []).length + 1;
      const newRows = Math.min(Math.max(lineCount, minRows), 20); // Limit to 20 rows max
      setRows(newRows);
    } else {
      setRows(minRows);
    }
  }, [value, multiline, minRows]);

  // Auto-resize based on content
  useEffect(() => {
    if (multiline && textFieldRef.current) {
      const textarea = textFieldRef.current.querySelector('textarea');
      if (textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
      }
    }
  }, [value, multiline]);

  return (
    <TextField
      ref={textFieldRef}
      value={value || ''}
      onChange={onChange}
      label={label}
      multiline={multiline}
      minRows={rows}
      fullWidth
      variant="outlined"
      placeholder={placeholder}
      InputProps={{
        endAdornment: (allowCopy || enableAiAssistance) && (
          <InputAdornment position="end">
            <Box sx={{ display: 'flex' }}>
              {enableAiAssistance && (
                <AiAssistButton
                  text={value}
                  context={aiContext}
                  onResult={handleAiResult}
                  tooltipText={`Get AI assistance for ${label}`}
                />
              )}
              {allowCopy && (
                <IconButton
                  edge="end"
                  onClick={handleCopy}
                  aria-label="copy text"
                  size="small"
                >
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
          </InputAdornment>
        ),
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          transition: 'min-height 0.2s ease',
        },
      }}
      {...rest}
    />
  );
};

export default ExpandableTextField;
```

### AI Assistance Button

The AiAssistButton component provides AI-powered assistance for legal content:

```typescript
// src/components/common/AiAssistButton.tsx
import React, { useState } from 'react';
import {
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  CircularProgress,
  Box,
  Alert,
  TextField,
} from '@mui/material';
import { SmartToy as AiIcon } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import aiService from '@/services/aiService';

interface AiAssistButtonProps {
  text: string;
  context?: string;
  onResult: (result: string) => void;
  tooltipText?: string;
}

const AiAssistButton: React.FC<AiAssistButtonProps> = ({
  text,
  context = 'general',
  onResult,
  tooltipText = 'Get AI assistance',
}) => {
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [inputText, setInputText] = useState('');
  
  const handleClick = () => {
    setInputText(text || '');
    setDialogOpen(true);
    setResult('');
    setError('');
  };
  
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(event.target.value);
  };
  
  const handleAnalyze = async () => {
    if (!inputText.trim()) {
      setError('Please enter some text before requesting AI assistance.');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const response = await aiService.analyzeText(inputText, context, user?.id);
      setResult(response.result);
    } catch (error: any) {
      console.error('Error analyzing text with AI:', error);
      setError(error.message || 'An unexpected error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleClose = () => {
    setDialogOpen(false);
  };
  
  const handleApply = () => {
    if (onResult && result) {
      onResult(result);
    }
    handleClose();
  };
  
  return (
    <>
      <Tooltip title={tooltipText}>
        <IconButton
          onClick={handleClick}
          color="primary"
          size="small"
          aria-label="AI assistance"
        >
          <AiIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      
      <Dialog
        open={dialogOpen}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>AI Assistance</DialogTitle>
        
        <DialogContent>
          {!result && !loading && (
            <TextField
              label="Text to analyze"
              value={inputText}
              onChange={handleInputChange}
              multiline
              rows={6}
              fullWidth
              variant="outlined"
              placeholder="Edit the text before analysis..."
              disabled={loading}
              sx={{ my: 2 }}
            />
          )}
          
          {error && (
            <Alert severity="error" sx={{ my: 2 }}>
              {error}
            </Alert>
          )}
          
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          )}
          
          {result && (
            <Box sx={{ my: 2 }}>
              <Typography variant="body1" component="div" sx={{ whiteSpace: 'pre-wrap' }}>
                {result}
              </Typography>
            </Box>
          )}
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          
          {!result && !loading ? (
            <Button 
              onClick={handleAnalyze}
              variant="contained"
              disabled={loading || !inputText.trim()}
            >
              Analyze
            </Button>
          ) : (
            <Button
              onClick={handleApply}
              variant="contained"
              disabled={!result || loading}
            >
              Apply
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AiAssistButton;
```

## AI Integration

### AI Service

```typescript
// src/services/aiService.ts
import api from './api';

interface AiResponse {
  result: string;
  provider: string;
  jurisdiction?: string;
  isFree?: boolean;
  isMock?: boolean;
  error?: string;
  errorType?: string;
}

const aiService = {
  /**
   * Analyze text using AI
   * @param text Text to analyze
   * @param context Context for analysis (general, defense, prosecution)
   * @param userId User ID for API key lookup
   * @returns AI analysis response
   */
  analyzeText: async (text: string, context: string, userId?: string): Promise<AiResponse> => {
    try {
      // Call the backend API
      const response = await api.post('/api/ai/analyze', {
        text,
        context,
        userId
      });
      
      return response.data;
    } catch (error: any) {
      console.error('AI service error:', error);
      
      // If the API is unavailable, provide a mock response
      const mockResponses: Record<string, string> = {
        'defense': "Based on the provided information, here are some potential defense strategies...",
        'prosecution': "Based on the provided information, the following charges could potentially apply...",
        'general': "I've analyzed the provided information and have the following insights..."
      };
      
      return {
        result: mockResponses[context] || "I've analyzed the provided text and have prepared some insights...",
        provider: "Demo AI (Offline Mode)",
        isFree: true,
        isMock: true
      };
    }
  },
  
  /**
   * Get available AI providers
   * @param userId User ID for API key lookup
   * @returns List of available providers
   */
  getProviders: async (userId?: string) => {
    try {
      const response = await api.get('/api/ai/providers', {
        params: { userId }
      });
      
      return response.data.providers;
    } catch (error) {
      console.error('Error getting AI providers:', error);
      return [];
    }
  }
};

export default aiService;
```

## Styling and Theming

### Material UI Theme

```typescript
// src/theme.ts
import { createTheme, ThemeOptions } from '@mui/material/styles';

const themeOptions: ThemeOptions = {
  palette: {
    primary: {
      main: '#FF9F1C',
      light: '#FFBF69',
      dark: '#F27D0C',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#2EC4B6',
      light: '#CBF3F0',
      dark: '#1B9E8F',
      contrastText: '#FFFFFF',
    },
    // ...other colors
  },
  // ...other theme options
};

const theme = createTheme(themeOptions);

export default theme;
```

### Theme Provider

```typescript
// src/components/ThemeRegistry.tsx
import { ReactNode } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '@/theme';

export default function ThemeRegistry({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
```

## Error Handling

### Client-Side Error Handling

```typescript
// Example error handling in a component
const [error, setError] = useState<string | null>(null);

try {
  // Perform operation
  await someAsyncOperation();
} catch (err: any) {
  // Handle error
  setError(err.message || 'An unexpected error occurred');
  console.error('Operation failed:', err);
}

// Display error to user
{error && <Alert severity="error">{error}</Alert>}
```

### Server-Side Error Handling

```typescript
// Example error handling in a server action
export async function serverAction(data: FormData) {
  try {
    // Perform server operation
    const result = await someServerOperation(data);
    return { success: true, data: result };
  } catch (error: any) {
    console.error('Server action failed:', error);
    return { 
      success: false, 
      error: error.message || 'Server operation failed' 
    };
  }
}
```

## Performance Optimization

### Code Splitting

Next.js automatically code-splits your application at the page level. For additional code splitting:

```typescript
// Dynamic import for code splitting
import dynamic from 'next/dynamic';

const DynamicComponent = dynamic(() => import('@/components/HeavyComponent'), {
  loading: () => <p>Loading...</p>,
  ssr: false // Disable server-side rendering if needed
});
```

### Image Optimization

```typescript
// Optimized image component
import Image from 'next/image';

<Image 
  src="/path/to/image.jpg"
  alt="Description"
  width={500}
  height={300}
  priority={false}
  loading="lazy"
/>
```

### Memoization

```typescript
// Memoize expensive calculations or components
import { useMemo, memo } from 'react';

// Memoize value
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);

// Memoize component
const MemoizedComponent = memo(({ prop1, prop2 }) => {
  return <div>{prop1} {prop2}</div>;
});
```

## Testing Strategy

### Unit Testing

```typescript
// Example Jest test for a component
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from '@/components/LoginForm';

describe('LoginForm', () => {
  it('renders email and password fields', () => {
    render(<LoginForm onSubmit={jest.fn()} />);
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });
  
  it('calls onSubmit with form data when submitted', async () => {
    const handleSubmit = jest.fn();
    render(<LoginForm onSubmit={handleSubmit} />);
    
    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /login/i }));
    
    expect(handleSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123'
    });
  });
});
```

### Integration Testing

```typescript
// Example integration test
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@mui/material/styles';
import theme from '@/theme';
import Dashboard from '@/app/dashboard/page';
import { AuthProvider } from '@/context/AuthContext';

// Mock Firebase
jest.mock('@/services/firebase', () => ({
  getCurrentUser: jest.fn(() => ({ uid: 'test-user-id', email: 'test@example.com' })),
  // ...other mocked functions
}));

describe('Dashboard Integration', () => {
  it('renders user information and case list', async () => {
    render(
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <Dashboard />
        </AuthProvider>
      </ThemeProvider>
    );
    
    // Check if user info is displayed
    expect(screen.getByText(/test@example.com/i)).toBeInTheDocument();
    
    // Check if case list is loaded
    expect(await screen.findByText(/active cases/i)).toBeInTheDocument();
  });
});
```

## Deployment Process

### Build Process

1. **Development Build**:
   ```bash
   npm run dev
   ```

2. **Production Build**:
   ```bash
   npm run build
   ```

3. **Static Export** (if needed):
   ```bash
   npm run build
   npm run export
   ```

### Firebase Deployment

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Deploy to Firebase**:
   ```bash
   firebase deploy
   ```

3. **Deploy only hosting**:
   ```bash
   firebase deploy --only hosting
   ```

4. **Deploy only functions**:
   ```bash
   firebase deploy --only functions
   ```

## Case Workflow Implementation

### Case Detail Page

The Case Detail Page implements a tabbed interface for the 9-phase case workflow:

```typescript
// src/app/cases/[id]/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Button,
  Breadcrumbs,
  Link,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import { fetchCaseById, updateCase, deleteCase } from '@/features/cases/casesSlice';
import { AppDispatch, RootState } from '@/store';
import InitialConsultation from '@/components/cases/InitialConsultation';
import CaseEvaluation from '@/components/cases/CaseEvaluation';
import LegalResearch from '@/components/cases/LegalResearch';
import DocumentUpload from '@/components/cases/DocumentUpload';
import PreTrialPreparation from '@/components/cases/PreTrialPreparation';
import Negotiation from '@/components/cases/Negotiation';
import TrialPreparation from '@/components/cases/TrialPreparation';
import DuringTrial from '@/components/cases/DuringTrial';
import PostTrial from '@/components/cases/PostTrial';

const CaseDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState<any>({});
  
  const dispatch = useDispatch<AppDispatch>();
  const { currentCase, loading, error } = useSelector((state: RootState) => state.cases);

  useEffect(() => {
    if (id) {
      dispatch(fetchCaseById(id));
    }
  }, [id, dispatch]);
  
  useEffect(() => {
    if (currentCase) {
      setFormData(currentCase);
    }
  }, [currentCase]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleUpdate = (updatedData: any) => {
    setFormData(prevData => ({
      ...prevData,
      ...updatedData
    }));
  };

  const handleSave = () => {
    if (currentCase && Object.keys(formData).length > 0) {
      dispatch(updateCase({
        id: currentCase.id,
        ...formData
      }));
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!currentCase) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">Case not found</Alert>
      </Box>
    );
  }

  const tabSections = [
    {
      label: 'Initial Consultation',
      component: <InitialConsultation caseData={currentCase} onUpdate={handleUpdate} />,
    },
    {
      label: 'Case Evaluation',
      component: <CaseEvaluation caseData={currentCase} onUpdate={handleUpdate} />,
    },
    {
      label: 'Legal Research',
      component: <LegalResearch caseData={currentCase} onUpdate={handleUpdate} />,
    },
    {
      label: 'Documents & Evidence',
      component: <DocumentUpload caseId={currentCase.id} />,
    },
    {
      label: 'Pre-Trial Preparation',
      component: <PreTrialPreparation caseData={currentCase} onUpdate={handleUpdate} />,
    },
    {
      label: 'Negotiation',
      component: <Negotiation caseData={currentCase} onUpdate={handleUpdate} />,
    },
    {
      label: 'Trial Preparation',
      component: <TrialPreparation caseData={currentCase} onUpdate={handleUpdate} />,
    },
    {
      label: 'During Trial',
      component: <DuringTrial caseData={currentCase} onUpdate={handleUpdate} />,
    },
    {
      label: 'Post-Trial',
      component: <PostTrial caseData={currentCase} onUpdate={handleUpdate} />,
    },
  ];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {currentCase.caseNumber}: {currentCase.clientName}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {currentCase.currentSummary}
        </Typography>
      </Box>
      
      {/* Save Button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
        <Button
          variant="contained"
          onClick={handleSave}
        >
          Save Case
        </Button>
      </Box>
      
      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="case sections tabs"
        >
          {tabSections.map((section, index) => (
            <Tab key={index} label={section.label} />
          ))}
        </Tabs>
      </Paper>
      
      {/* Tab content */}
      <Box sx={{ mt: 3 }}>
        {tabSections[activeTab].component}
      </Box>
    </Box>
  );
};

export default CaseDetailPage;
```

### Phase Component Example

Each phase of the case workflow is implemented as a separate component:

```typescript
// src/components/cases/InitialConsultation.tsx
'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardHeader,
} from '@mui/material';
import ExpandableTextField from '../common/ExpandableTextField';
import SectionSaveButton from '../common/SectionSaveButton';

interface InitialConsultationProps {
  caseData: any;
  onUpdate: (data: any) => void;
}

const InitialConsultation: React.FC<InitialConsultationProps> = ({ caseData, onUpdate }) => {
  const [formData, setFormData] = useState({
    clientStatement: '',
    clientObjectives: '',
    chargesExplanation: '',
    potentialOutcomes: '',
    timelineEstimate: '',
    defenseStrategySteps: '',
  });
  
  // Initialize form data from case data
  useEffect(() => {
    if (caseData) {
      setFormData({
        clientStatement: caseData.client?.statement || '',
        clientObjectives: caseData.client?.objectives || '',
        chargesExplanation: caseData.chargesExplanation || '',
        potentialOutcomes: caseData.potentialOutcomes || '',
        timelineEstimate: caseData.timelineEstimate || '',
        defenseStrategySteps: caseData.defenseStrategySteps || '',
      });
    }
  }, [caseData]);

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    
    // Update local state
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // Call onUpdate with the updated data
    if (onUpdate) {
      // Handle client-related fields specially
      if (field === 'clientStatement' || field === 'clientObjectives') {
        onUpdate({
          client: {
            ...(caseData.client || {}),
            [field === 'clientStatement' ? 'statement' : 'objectives']: value
          }
        });
      } else {
        onUpdate({ [field]: value });
      }
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Initial Consultation
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Gather information from the client, understand the charges, and set expectations for the case.
      </Typography>

      <Grid container spacing={3}>
        {/* Client Information Section */}
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Client Information" />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <ExpandableTextField
                    label="Client Statement"
                    value={formData.clientStatement}
                    onChange={handleChange('clientStatement')}
                    placeholder="Record the client's account of events..."
                    multiline
                    minRows={3}
                    enableAiAssistance={true}
                    aiContext="general"
                  />
                </Grid>
                <Grid item xs={12}>
                  <ExpandableTextField
                    label="Client Objectives"
                    value={formData.clientObjectives}
                    onChange={handleChange('clientObjectives')}
                    placeholder="What does the client hope to achieve with their defense?"
                    multiline
                    minRows={2}
                    enableAiAssistance={true}
                    aiContext="defense"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Charges and Legal Context */}
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Charges and Legal Context" />
            <CardContent>
              <ExpandableTextField
                label="Explanation of Charges"
                value={formData.chargesExplanation}
                onChange={handleChange('chargesExplanation')}
                placeholder="Explain the charges and potential legal consequences..."
                multiline
                minRows={3}
                enableAiAssistance={true}
                aiContext="prosecution"
                allowCopy={true}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Expectations Setting */}
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Setting Expectations" />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <ExpandableTextField
                    label="Potential Outcomes"
                    value={formData.potentialOutcomes}
                    onChange={handleChange('potentialOutcomes')}
                    placeholder="Describe possible case outcomes..."
                    multiline
                    minRows={2}
                    enableAiAssistance={true}
                    aiContext="defense"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <ExpandableTextField
                    label="Timeline Estimate"
                    value={formData.timelineEstimate}
                    onChange={handleChange('timelineEstimate')}
                    placeholder="Estimated timeline for the case..."
                    multiline
                    minRows={2}
                    enableAiAssistance={true}
                    aiContext="general"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <ExpandableTextField
                    label="Defense Strategy Key Steps"
                    value={formData.defenseStrategySteps}
                    onChange={handleChange('defenseStrategySteps')}
                    placeholder="Outline the key steps in the defense strategy..."
                    multiline
                    minRows={2}
                    enableAiAssistance={true}
                    aiContext="defense"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default InitialConsultation;
```

## Security Considerations

### Authentication Security

- Use Firebase Authentication for secure user authentication
- Implement proper password policies
- Use secure session management
- Implement rate limiting for login attempts

### Data Security

- Use Firestore security rules to control access to data
- Validate all user input on both client and server
- Implement proper error handling to avoid leaking sensitive information
- Use HTTPS for all API requests

### Firebase Security Rules

```
// Firestore security rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read and write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow authenticated users to read and write their own cases
    match /cases/{

### Authentication Security

- Use Firebase Authentication for secure user authentication
- Implement proper password policies
- Use secure session management
- Implement rate limiting for login attempts

### Data Security

- Use Firestore security rules to control access to data
- Validate all user input on both client and server
- Implement proper error handling to avoid leaking sensitive information
- Use HTTPS for all API requests

### Firebase Security Rules

```
// Firestore security rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read and write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow authenticated users to read and write their own cases
    match /cases/{caseId} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
    }
  }
}
```

## Troubleshooting

### Common Issues

1. **Authentication Issues**:
   - Check Firebase Authentication configuration
   - Verify user permissions in Firestore rules
   - Check for expired tokens or sessions

2. **Data Fetching Issues**:
   - Check network requests in browser developer tools
   - Verify Firestore queries and paths
   - Check for permission issues in Firestore rules

3. **Rendering Issues**:
   - Check for client/server component mismatches
   - Verify that client components are properly marked with 'use client'
   - Check for hydration errors in the console

### Debugging Tools

1. **Browser Developer Tools**:
   - Network tab for API requests
   - Console for JavaScript errors
   - React DevTools for component inspection

2. **Next.js Debugging**:
   - Enable verbose build output: `next build --debug`
   - Check `.next/server/pages` for server-rendered output
   - Use `next/dynamic` with `ssr: false` to debug client/server issues

3. **Firebase Debugging**:
   - Firebase console for authentication and database logs
   - Firebase emulator for local testing
   - Firebase Functions logs for backend issues

## Best Practices

### Code Organization

- Follow the established project structure
- Group related files together
- Use descriptive file and component names
- Keep components small and focused

### Performance

- Use server components where possible
- Implement proper data fetching strategies
- Optimize images and assets
- Use code splitting for large components

### Accessibility

- Use semantic HTML elements
- Include proper ARIA attributes
- Ensure keyboard navigation works
- Test with screen readers

### Internationalization

- Use Next.js built-in i18n features
- Extract all user-facing strings
- Support right-to-left languages if needed
- Test with different locales

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [Material UI Documentation](https://mui.com/material-ui/getting-started/overview/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
