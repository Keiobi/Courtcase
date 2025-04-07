'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Container,
  Typography,
  Box,
  Paper,
  Tabs,
  Tab,
  Button,
  Stack,
  Chip,
  CircularProgress,
  Alert,
  Divider,
  Breadcrumbs,
  Link as MuiLink
} from '@mui/material';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchCaseById, updateCase, softDeleteCase, CaseStatus } from '@/features/cases/casesSlice';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Case Detail page component
 * Displays case details with a tabbed interface for different phases
 */
export default function CaseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { currentUser, isLoading: authLoading, authInitialized } = useAuth();
  
  // Get case ID from URL params
  const caseId = params?.id as string || '';
  
  // Get cases state from Redux
  const { currentCase, loading, error } = useAppSelector((state) => state.cases);
  
  // Local state
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState<any>({});
  const [hasChanges, setHasChanges] = useState(false);
  
  // Fetch case data on component mount
  useEffect(() => {
    if (authInitialized && currentUser && !authLoading && caseId) {
      dispatch(fetchCaseById(caseId));
    }
  }, [dispatch, caseId, currentUser, authLoading, authInitialized]);
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (authInitialized && !currentUser && !authLoading) {
      router.push('/login');
    }
  }, [currentUser, authLoading, authInitialized, router]);
  
  // Initialize form data when case data is loaded
  useEffect(() => {
    if (currentCase) {
      setFormData(currentCase);
    }
  }, [currentCase]);
  
  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };
  
  // Handle form field changes
  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value
    }));
    setHasChanges(true);
  };
  
  // Handle client field changes
  const handleClientChange = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      client: {
        ...prev.client,
        [field]: value
      }
    }));
    setHasChanges(true);
  };
  
  // Handle save
  const handleSave = async () => {
    if (currentCase && hasChanges) {
      try {
        await dispatch(updateCase({
          id: currentCase.id,
          ...formData
        }));
        setHasChanges(false);
      } catch (error) {
        console.error('Error updating case:', error);
      }
    }
  };
  
  // Handle delete
  const handleDelete = async () => {
    if (currentCase) {
      try {
        await dispatch(softDeleteCase(currentCase.id));
        router.push('/cases');
      } catch (error) {
        console.error('Error deleting case:', error);
      }
    }
  };
  
  // Get status chip color
  const getStatusChipColor = (status: CaseStatus) => {
    switch (status) {
      case 'Open':
        return 'primary';
      case 'Closed':
        return 'default';
      case 'Pending':
        return 'warning';
      case 'Deleted':
        return 'error';
      default:
        return 'default';
    }
  };
  
  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  // Show loading indicator while checking auth state
  if (authLoading) {
    return (
      <Container>
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }
  
  // Show loading indicator while fetching case data
  if (loading) {
    return (
      <Container>
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }
  
  // Show error message if case not found
  if (!currentCase && !loading) {
    return (
      <Container>
        <Box sx={{ mt: 4 }}>
          <Alert severity="error">
            Case not found or you don't have permission to view it.
          </Alert>
          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              onClick={() => router.push('/cases')}
            >
              Back to Cases
            </Button>
          </Box>
        </Box>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ mb: 2 }}>
          <Link href="/dashboard" passHref>
            <MuiLink underline="hover" color="inherit">
              Dashboard
            </MuiLink>
          </Link>
          <Link href="/cases" passHref>
            <MuiLink underline="hover" color="inherit">
              Cases
            </MuiLink>
          </Link>
          <Typography color="text.primary">
            {currentCase?.caseNumber || 'Case Details'}
          </Typography>
        </Breadcrumbs>
        
        {/* Error message */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {/* Case header */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography variant="h4" component="h1" gutterBottom>
                {currentCase?.caseNumber}: {currentCase?.clientName}
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                {currentCase?.currentSummary}
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                <Chip 
                  label={currentCase?.status || 'Unknown'} 
                  color={getStatusChipColor((currentCase?.status || 'Open') as CaseStatus)}
                />
                <Typography variant="body2" color="text.secondary">
                  Created: {formatDate(currentCase?.createdAt || null)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Updated: {formatDate(currentCase?.updatedAt || null)}
                </Typography>
              </Stack>
            </Box>
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => router.push(`/cases/${caseId}/edit`)}
              >
                Edit
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={handleDelete}
              >
                Delete
              </Button>
              {hasChanges && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSave}
                >
                  Save Changes
                </Button>
              )}
            </Stack>
          </Box>
        </Paper>
        
        {/* Tabs */}
        <Paper sx={{ mb: 3 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="case phases tabs"
          >
            <Tab label="Initial Consultation" />
            <Tab label="Case Evaluation" />
            <Tab label="Legal Research" />
            <Tab label="Documents & Evidence" />
            <Tab label="Pre-Trial Preparation" />
            <Tab label="Negotiation" />
            <Tab label="Trial Preparation" />
            <Tab label="During Trial" />
            <Tab label="Post-Trial" />
          </Tabs>
        </Paper>
        
        {/* Tab content */}
        <Paper sx={{ p: 3 }}>
          {/* Initial Consultation */}
          {activeTab === 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Initial Consultation
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Typography variant="subtitle1" gutterBottom>
                This phase will include:
              </Typography>
              <ul>
                <li>Client statement recording</li>
                <li>Client objectives documentation</li>
                <li>Charges explanation</li>
                <li>Potential outcomes analysis</li>
                <li>Timeline estimation</li>
                <li>Defense strategy planning</li>
              </ul>
              
              <Alert severity="info" sx={{ mt: 2 }}>
                This section is under development. The expandable text fields for each of these items will be implemented soon.
              </Alert>
            </Box>
          )}
          
          {/* Case Evaluation */}
          {activeTab === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Case Evaluation
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Typography variant="subtitle1" gutterBottom>
                This phase will include:
              </Typography>
              <ul>
                <li>Evidence review interface</li>
                <li>Case strengths/weaknesses analysis</li>
                <li>Expert consultation notes</li>
              </ul>
              
              <Alert severity="info" sx={{ mt: 2 }}>
                This section is under development. The expandable text fields for each of these items will be implemented soon.
              </Alert>
            </Box>
          )}
          
          {/* Legal Research */}
          {activeTab === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Legal Research
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Typography variant="subtitle1" gutterBottom>
                This phase will include:
              </Typography>
              <ul>
                <li>Relevant laws documentation</li>
                <li>Case precedents tracking</li>
                <li>Legal strategy development</li>
              </ul>
              
              <Alert severity="info" sx={{ mt: 2 }}>
                This section is under development. The expandable text fields for each of these items will be implemented soon.
              </Alert>
            </Box>
          )}
          
          {/* Documents & Evidence */}
          {activeTab === 3 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Documents & Evidence
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Typography variant="subtitle1" gutterBottom>
                This phase will include:
              </Typography>
              <ul>
                <li>Document upload functionality</li>
                <li>Evidence categorization</li>
                <li>Document preview</li>
              </ul>
              
              <Alert severity="info" sx={{ mt: 2 }}>
                This section is under development. The document upload and management functionality will be implemented soon.
              </Alert>
            </Box>
          )}
          
          {/* Pre-Trial Preparation */}
          {activeTab === 4 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Pre-Trial Preparation
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Typography variant="subtitle1" gutterBottom>
                This phase will include:
              </Typography>
              <ul>
                <li>Motion filing documentation</li>
                <li>Discovery process tracking</li>
                <li>Witness preparation notes</li>
              </ul>
              
              <Alert severity="info" sx={{ mt: 2 }}>
                This section is under development. The expandable text fields for each of these items will be implemented soon.
              </Alert>
            </Box>
          )}
          
          {/* Negotiation */}
          {activeTab === 5 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Negotiation & Plea Bargaining
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Typography variant="subtitle1" gutterBottom>
                This phase will include:
              </Typography>
              <ul>
                <li>Negotiation strategy planning</li>
                <li>Prosecution communication logs</li>
                <li>Client consultation records</li>
              </ul>
              
              <Alert severity="info" sx={{ mt: 2 }}>
                This section is under development. The expandable text fields for each of these items will be implemented soon.
              </Alert>
            </Box>
          )}
          
          {/* Trial Preparation */}
          {activeTab === 6 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Trial Preparation
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Typography variant="subtitle1" gutterBottom>
                This phase will include:
              </Typography>
              <ul>
                <li>Defense strategy development</li>
                <li>Mock trial notes</li>
                <li>Exhibit preparation</li>
              </ul>
              
              <Alert severity="info" sx={{ mt: 2 }}>
                This section is under development. The expandable text fields for each of these items will be implemented soon.
              </Alert>
            </Box>
          )}
          
          {/* During Trial */}
          {activeTab === 7 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                During Trial
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Typography variant="subtitle1" gutterBottom>
                This phase will include:
              </Typography>
              <ul>
                <li>Opening/closing statement preparation</li>
                <li>Cross-examination planning</li>
                <li>Defense presentation notes</li>
              </ul>
              
              <Alert severity="info" sx={{ mt: 2 }}>
                This section is under development. The expandable text fields for each of these items will be implemented soon.
              </Alert>
            </Box>
          )}
          
          {/* Post-Trial */}
          {activeTab === 8 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Post-Trial
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Typography variant="subtitle1" gutterBottom>
                This phase will include:
              </Typography>
              <ul>
                <li>Verdict and sentencing documentation</li>
                <li>Appeals planning</li>
                <li>Post-trial motions</li>
              </ul>
              
              <Alert severity="info" sx={{ mt: 2 }}>
                This section is under development. The expandable text fields for each of these items will be implemented soon.
              </Alert>
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
}
