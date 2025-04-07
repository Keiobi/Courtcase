'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Divider,
  Breadcrumbs,
  Link as MuiLink,
  SelectChangeEvent
} from '@mui/material';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/store';
import { createCase, CaseStatus } from '@/features/cases/casesSlice';
import { useAuth } from '@/contexts/AuthContext';

/**
 * New Case page component
 * Form for creating a new case
 */
export default function NewCasePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { currentUser, isLoading: authLoading, authInitialized } = useAuth();
  
  // Get cases state from Redux
  const { loading, error } = useAppSelector((state) => state.cases);
  
  // Form state
  const [formData, setFormData] = useState({
    caseNumber: '',
    clientName: '',
    currentSummary: '',
    status: 'Open' as CaseStatus,
    client: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      statement: '',
      objectives: '',
    },
  });
  
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (authInitialized && !currentUser && !authLoading) {
      router.push('/login');
    }
  }, [currentUser, authLoading, authInitialized, router]);
  
  // Handle form input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }> | SelectChangeEvent<CaseStatus>
  ) => {
    const { name, value } = e.target;
    
    if (!name) return;
    
    // Handle nested client fields
    if (name.startsWith('client.')) {
      const clientField = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        client: {
          ...prev.client,
          [clientField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  // Validate form
  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    // Required fields
    if (!formData.clientName.trim()) {
      errors.clientName = 'Client name is required';
    }
    
    if (!formData.currentSummary.trim()) {
      errors.currentSummary = 'Case summary is required';
    }
    
    // Client fields validation
    if (formData.client.email && !/\S+@\S+\.\S+/.test(formData.client.email)) {
      errors['client.email'] = 'Invalid email address';
    }
    
    if (formData.client.phone && !/^\+?[\d\s()-]{10,15}$/.test(formData.client.phone)) {
      errors['client.phone'] = 'Invalid phone number';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Set client name from first and last name if not provided
    let clientNameToUse = formData.clientName;
    if (!clientNameToUse && formData.client.firstName && formData.client.lastName) {
      clientNameToUse = `${formData.client.firstName} ${formData.client.lastName}`;
      setFormData((prev) => ({
        ...prev,
        clientName: clientNameToUse,
      }));
    }
    
    try {
      // Create case
      const resultAction = await dispatch(createCase(formData));
      
      if (createCase.fulfilled.match(resultAction)) {
        // Navigate to the new case
        router.push(`/cases/${resultAction.payload.id}`);
      }
    } catch (error) {
      console.error('Error creating case:', error);
    }
  };
  
  // Generate case number
  const generateCaseNumber = () => {
    const prefix = 'CASE';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    
    const caseNumber = `${prefix}-${timestamp}-${random}`;
    
    setFormData((prev) => ({
      ...prev,
      caseNumber,
    }));
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
          <Typography color="text.primary">New Case</Typography>
        </Breadcrumbs>
        
        <Typography variant="h4" component="h1" gutterBottom>
          Create New Case
        </Typography>
        
        {/* Error message */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {/* Form */}
        <Paper sx={{ p: 3 }}>
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              {/* Case Information */}
              <Box>
                <Typography variant="h6" gutterBottom>
                  Case Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Box>
              
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <TextField
                  name="caseNumber"
                  label="Case Number"
                  value={formData.caseNumber}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  placeholder="Auto-generated if left blank"
                  InputProps={{
                    endAdornment: (
                      <Button
                        onClick={generateCaseNumber}
                        size="small"
                        sx={{ ml: 1 }}
                      >
                        Generate
                      </Button>
                    ),
                  }}
                />
                
                <FormControl fullWidth>
                  <InputLabel id="status-label">Status</InputLabel>
                  <Select
                    labelId="status-label"
                    name="status"
                    value={formData.status}
                    label="Status"
                    onChange={handleChange}
                  >
                    <MenuItem value="Open">Open</MenuItem>
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="Closed">Closed</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
              
              <TextField
                name="clientName"
                label="Client Name"
                value={formData.clientName}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                required
                error={!!formErrors.clientName}
                helperText={formErrors.clientName}
              />
              
              <TextField
                name="currentSummary"
                label="Case Summary"
                value={formData.currentSummary}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                multiline
                rows={3}
                required
                error={!!formErrors.currentSummary}
                helperText={formErrors.currentSummary}
              />
              
              {/* Client Information */}
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Client Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Box>
              
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <TextField
                  name="client.firstName"
                  label="First Name"
                  value={formData.client.firstName}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  error={!!formErrors['client.firstName']}
                  helperText={formErrors['client.firstName']}
                />
                
                <TextField
                  name="client.lastName"
                  label="Last Name"
                  value={formData.client.lastName}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  error={!!formErrors['client.lastName']}
                  helperText={formErrors['client.lastName']}
                />
              </Stack>
              
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <TextField
                  name="client.email"
                  label="Email"
                  type="email"
                  value={formData.client.email}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  error={!!formErrors['client.email']}
                  helperText={formErrors['client.email']}
                />
                
                <TextField
                  name="client.phone"
                  label="Phone"
                  value={formData.client.phone}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  error={!!formErrors['client.phone']}
                  helperText={formErrors['client.phone']}
                />
              </Stack>
              
              <TextField
                name="client.address"
                label="Address"
                value={formData.client.address}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                multiline
                rows={2}
                error={!!formErrors['client.address']}
                helperText={formErrors['client.address']}
              />
              
              {/* Form Actions */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => router.push('/cases')}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create Case'}
                </Button>
              </Box>
            </Stack>
          </form>
        </Paper>
      </Box>
    </Container>
  );
}
