import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  Timestamp,
  serverTimestamp,
  DocumentReference,
  DocumentData
} from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { getCurrentUser } from '@/services/firebase';

// Define the case status type
export type CaseStatus = 'Open' | 'Closed' | 'Pending' | 'Deleted';

// Define the case interface
export interface Case {
  id: string;
  caseNumber: string;
  clientName: string;
  currentSummary: string;
  caseDate: string | null;
  status: CaseStatus;
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

// Define the state interface
interface CasesState {
  cases: Case[];
  currentCase: Case | null;
  loading: boolean;
  error: string | null;
  searchTerm: string;
  filters: {
    status: CaseStatus | 'All';
    dateRange: {
      start: string | null;
      end: string | null;
    };
  };
  sorting: {
    field: keyof Case;
    direction: 'asc' | 'desc';
  };
}

// Initial state
const initialState: CasesState = {
  cases: [],
  currentCase: null,
  loading: false,
  error: null,
  searchTerm: '',
  filters: {
    status: 'All',
    dateRange: {
      start: null,
      end: null,
    },
  },
  sorting: {
    field: 'updatedAt',
    direction: 'desc',
  },
};

// Helper function to convert Firestore data to Case object
const convertFirestoreDataToCase = (id: string, data: DocumentData): Case => {
  return {
    id,
    caseNumber: data.caseNumber || '',
    clientName: data.clientName || '',
    currentSummary: data.currentSummary || '',
    caseDate: data.caseDate ? new Date(data.caseDate.toDate()).toISOString() : null,
    status: data.status || 'Open',
    isDeleted: data.isDeleted || false,
    deletedAt: data.deletedAt ? new Date(data.deletedAt.toDate()).toISOString() : null,
    createdAt: data.createdAt ? new Date(data.createdAt.toDate()).toISOString() : new Date().toISOString(),
    updatedAt: data.updatedAt ? new Date(data.updatedAt.toDate()).toISOString() : new Date().toISOString(),
    userId: data.userId || '',
    isPrimary: data.isPrimary || true,
    canWrite: data.canWrite || true,
    canExport: data.canExport || true,
    
    // Client information
    client: data.client || {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      statement: '',
      objectives: '',
    },
    
    // Initial Consultation
    chargesExplanation: data.chargesExplanation || '',
    potentialOutcomes: data.potentialOutcomes || '',
    timelineEstimate: data.timelineEstimate || '',
    defenseStrategySteps: data.defenseStrategySteps || '',
    
    // Case Evaluation
    evidenceReview: data.evidenceReview || '',
    caseStrengths: data.caseStrengths || '',
    caseWeaknesses: data.caseWeaknesses || '',
    expertConsultation: data.expertConsultation || '',
    
    // Legal Research
    relevantLaws: data.relevantLaws || '',
    casePrecedents: data.casePrecedents || '',
    legalStrategy: data.legalStrategy || '',
    
    // Pre-Trial Preparation
    motionFilings: data.motionFilings || '',
    discoveryProcess: data.discoveryProcess || '',
    witnessPreparation: data.witnessPreparation || '',
    
    // Negotiation
    negotiationStrategy: data.negotiationStrategy || '',
    prosecutionCommunication: data.prosecutionCommunication || '',
    clientConsultation: data.clientConsultation || '',
    
    // Trial Preparation
    defenseStrategy: data.defenseStrategy || '',
    mockTrialNotes: data.mockTrialNotes || '',
    exhibitPreparation: data.exhibitPreparation || '',
    
    // During Trial
    openingStatement: data.openingStatement || '',
    crossExamination: data.crossExamination || '',
    defensePresentation: data.defensePresentation || '',
    closingArgument: data.closingArgument || '',
    
    // Post-Trial
    verdictAndSentencing: data.verdictAndSentencing || '',
    appealsPlanning: data.appealsPlanning || '',
    postTrialMotions: data.postTrialMotions || '',
  };
};

// Async thunks
export const fetchCases = createAsyncThunk(
  'cases/fetchCases',
  async (_, { rejectWithValue }) => {
    try {
      const user = getCurrentUser();
      if (!user) {
        return rejectWithValue('User not authenticated');
      }
      
      const db = getFirestore();
      const casesQuery = query(
        collection(db, 'cases'),
        where('userId', '==', user.uid),
        where('isDeleted', '==', false),
        orderBy('updatedAt', 'desc')
      );
      
      const querySnapshot = await getDocs(casesQuery);
      const cases: Case[] = [];
      
      querySnapshot.forEach((doc) => {
        cases.push(convertFirestoreDataToCase(doc.id, doc.data()));
      });
      
      return cases;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch cases');
    }
  }
);

export const fetchCaseById = createAsyncThunk(
  'cases/fetchCaseById',
  async (caseId: string, { rejectWithValue }) => {
    try {
      const user = getCurrentUser();
      if (!user) {
        return rejectWithValue('User not authenticated');
      }
      
      const db = getFirestore();
      const caseRef = doc(db, 'cases', caseId);
      const caseSnapshot = await getDoc(caseRef);
      
      if (!caseSnapshot.exists()) {
        return rejectWithValue('Case not found');
      }
      
      const caseData = caseSnapshot.data();
      
      // Check if the user has access to this case
      if (caseData.userId !== user.uid) {
        return rejectWithValue('You do not have access to this case');
      }
      
      return convertFirestoreDataToCase(caseSnapshot.id, caseData);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch case');
    }
  }
);

export const createCase = createAsyncThunk(
  'cases/createCase',
  async (caseData: Partial<Case>, { rejectWithValue }) => {
    try {
      const user = getCurrentUser();
      if (!user) {
        return rejectWithValue('User not authenticated');
      }
      
      const db = getFirestore();
      
      // Generate a case number if not provided
      const caseNumber = caseData.caseNumber || `CASE-${Date.now().toString().slice(-6)}`;
      
      // Prepare the case data
      const newCase = {
        ...caseData,
        caseNumber,
        userId: user.uid,
        status: caseData.status || 'Open',
        isDeleted: false,
        deletedAt: null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isPrimary: true,
        canWrite: true,
        canExport: true,
      };
      
      const docRef = await addDoc(collection(db, 'cases'), newCase);
      
      // Get the created case
      const caseSnapshot = await getDoc(docRef);
      
      if (!caseSnapshot.exists()) {
        return rejectWithValue('Failed to create case');
      }
      
      return convertFirestoreDataToCase(caseSnapshot.id, caseSnapshot.data());
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create case');
    }
  }
);

export const updateCase = createAsyncThunk(
  'cases/updateCase',
  async (caseData: Partial<Case> & { id: string }, { rejectWithValue }) => {
    try {
      const user = getCurrentUser();
      if (!user) {
        return rejectWithValue('User not authenticated');
      }
      
      const db = getFirestore();
      const caseRef = doc(db, 'cases', caseData.id);
      
      // Get the current case data
      const caseSnapshot = await getDoc(caseRef);
      
      if (!caseSnapshot.exists()) {
        return rejectWithValue('Case not found');
      }
      
      const currentCaseData = caseSnapshot.data();
      
      // Check if the user has access to this case
      if (currentCaseData.userId !== user.uid) {
        return rejectWithValue('You do not have access to this case');
      }
      
      // Check if the user has write permission
      if (!currentCaseData.canWrite) {
        return rejectWithValue('You do not have permission to update this case');
      }
      
      // Prepare the update data (excluding the id)
      const { id, ...updateData } = caseData;
      
      // Add the server timestamp
      const dataToUpdate = {
        ...updateData,
        updatedAt: serverTimestamp(),
      };
      
      await updateDoc(caseRef, dataToUpdate);
      
      // Get the updated case
      const updatedCaseSnapshot = await getDoc(caseRef);
      
      if (!updatedCaseSnapshot.exists()) {
        return rejectWithValue('Failed to update case');
      }
      
      return convertFirestoreDataToCase(updatedCaseSnapshot.id, updatedCaseSnapshot.data());
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update case');
    }
  }
);

export const softDeleteCase = createAsyncThunk(
  'cases/softDeleteCase',
  async (caseId: string, { rejectWithValue }) => {
    try {
      const user = getCurrentUser();
      if (!user) {
        return rejectWithValue('User not authenticated');
      }
      
      const db = getFirestore();
      const caseRef = doc(db, 'cases', caseId);
      
      // Get the current case data
      const caseSnapshot = await getDoc(caseRef);
      
      if (!caseSnapshot.exists()) {
        return rejectWithValue('Case not found');
      }
      
      const currentCaseData = caseSnapshot.data();
      
      // Check if the user has access to this case
      if (currentCaseData.userId !== user.uid) {
        return rejectWithValue('You do not have access to this case');
      }
      
      // Check if the user has write permission
      if (!currentCaseData.canWrite) {
        return rejectWithValue('You do not have permission to delete this case');
      }
      
      // Soft delete the case
      await updateDoc(caseRef, {
        isDeleted: true,
        deletedAt: serverTimestamp(),
        status: 'Deleted',
        updatedAt: serverTimestamp(),
      });
      
      return caseId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete case');
    }
  }
);

export const restoreCase = createAsyncThunk(
  'cases/restoreCase',
  async (caseId: string, { rejectWithValue }) => {
    try {
      const user = getCurrentUser();
      if (!user) {
        return rejectWithValue('User not authenticated');
      }
      
      const db = getFirestore();
      const caseRef = doc(db, 'cases', caseId);
      
      // Get the current case data
      const caseSnapshot = await getDoc(caseRef);
      
      if (!caseSnapshot.exists()) {
        return rejectWithValue('Case not found');
      }
      
      const currentCaseData = caseSnapshot.data();
      
      // Check if the user has access to this case
      if (currentCaseData.userId !== user.uid) {
        return rejectWithValue('You do not have access to this case');
      }
      
      // Check if the user has write permission
      if (!currentCaseData.canWrite) {
        return rejectWithValue('You do not have permission to restore this case');
      }
      
      // Restore the case
      await updateDoc(caseRef, {
        isDeleted: false,
        deletedAt: null,
        status: 'Open',
        updatedAt: serverTimestamp(),
      });
      
      // Get the updated case
      const updatedCaseSnapshot = await getDoc(caseRef);
      
      if (!updatedCaseSnapshot.exists()) {
        return rejectWithValue('Failed to restore case');
      }
      
      return convertFirestoreDataToCase(updatedCaseSnapshot.id, updatedCaseSnapshot.data());
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to restore case');
    }
  }
);

export const permanentlyDeleteCase = createAsyncThunk(
  'cases/permanentlyDeleteCase',
  async (caseId: string, { rejectWithValue }) => {
    try {
      const user = getCurrentUser();
      if (!user) {
        return rejectWithValue('User not authenticated');
      }
      
      const db = getFirestore();
      const caseRef = doc(db, 'cases', caseId);
      
      // Get the current case data
      const caseSnapshot = await getDoc(caseRef);
      
      if (!caseSnapshot.exists()) {
        return rejectWithValue('Case not found');
      }
      
      const currentCaseData = caseSnapshot.data();
      
      // Check if the user has access to this case
      if (currentCaseData.userId !== user.uid) {
        return rejectWithValue('You do not have access to this case');
      }
      
      // Check if the user has write permission
      if (!currentCaseData.canWrite) {
        return rejectWithValue('You do not have permission to delete this case');
      }
      
      // Permanently delete the case
      await deleteDoc(caseRef);
      
      return caseId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to permanently delete case');
    }
  }
);

// Create the cases slice
const casesSlice = createSlice({
  name: 'cases',
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setStatusFilter: (state, action: PayloadAction<CaseStatus | 'All'>) => {
      state.filters.status = action.payload;
    },
    setDateRangeFilter: (state, action: PayloadAction<{ start: string | null; end: string | null }>) => {
      state.filters.dateRange = action.payload;
    },
    setSorting: (state, action: PayloadAction<{ field: keyof Case; direction: 'asc' | 'desc' }>) => {
      state.sorting = action.payload;
    },
    clearFilters: (state) => {
      state.searchTerm = '';
      state.filters = {
        status: 'All',
        dateRange: {
          start: null,
          end: null,
        },
      };
    },
    clearCurrentCase: (state) => {
      state.currentCase = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchCases
      .addCase(fetchCases.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCases.fulfilled, (state, action) => {
        state.loading = false;
        state.cases = action.payload;
      })
      .addCase(fetchCases.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // fetchCaseById
      .addCase(fetchCaseById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCaseById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCase = action.payload;
      })
      .addCase(fetchCaseById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // createCase
      .addCase(createCase.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCase.fulfilled, (state, action) => {
        state.loading = false;
        state.cases.unshift(action.payload);
        state.currentCase = action.payload;
      })
      .addCase(createCase.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // updateCase
      .addCase(updateCase.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCase.fulfilled, (state, action) => {
        state.loading = false;
        
        // Update the case in the cases array
        const index = state.cases.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) {
          state.cases[index] = action.payload;
        }
        
        // Update the current case if it's the same
        if (state.currentCase && state.currentCase.id === action.payload.id) {
          state.currentCase = action.payload;
        }
      })
      .addCase(updateCase.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // softDeleteCase
      .addCase(softDeleteCase.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(softDeleteCase.fulfilled, (state, action) => {
        state.loading = false;
        
        // Update the case in the cases array
        const index = state.cases.findIndex((c) => c.id === action.payload);
        if (index !== -1) {
          state.cases[index].isDeleted = true;
          state.cases[index].status = 'Deleted';
          state.cases[index].deletedAt = new Date().toISOString();
        }
        
        // Clear the current case if it's the same
        if (state.currentCase && state.currentCase.id === action.payload) {
          state.currentCase = null;
        }
      })
      .addCase(softDeleteCase.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // restoreCase
      .addCase(restoreCase.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(restoreCase.fulfilled, (state, action) => {
        state.loading = false;
        
        // Update the case in the cases array
        const index = state.cases.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) {
          state.cases[index] = action.payload;
        } else {
          state.cases.unshift(action.payload);
        }
      })
      .addCase(restoreCase.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // permanentlyDeleteCase
      .addCase(permanentlyDeleteCase.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(permanentlyDeleteCase.fulfilled, (state, action) => {
        state.loading = false;
        
        // Remove the case from the cases array
        state.cases = state.cases.filter((c) => c.id !== action.payload);
        
        // Clear the current case if it's the same
        if (state.currentCase && state.currentCase.id === action.payload) {
          state.currentCase = null;
        }
      })
      .addCase(permanentlyDeleteCase.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions
export const {
  setSearchTerm,
  setStatusFilter,
  setDateRangeFilter,
  setSorting,
  clearFilters,
  clearCurrentCase,
} = casesSlice.actions;

// Export reducer
export default casesSlice.reducer;
