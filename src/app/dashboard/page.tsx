'use client';

import React, { useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Card, 
  CardContent,
  CardHeader,
  Button,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { signOutUser } from '@/services/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchCases, CaseStatus } from '@/features/cases/casesSlice';

/**
 * Dashboard page component
 * Main landing page after authentication
 */
export default function Dashboard() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { currentUser, isLoading: authLoading, authInitialized } = useAuth();
  const { cases, loading: casesLoading } = useAppSelector((state) => state.cases);
  
  // Redirect if not authenticated
  useEffect(() => {
    // Only redirect if auth is initialized and user is not authenticated
    if (authInitialized && !authLoading && !currentUser) {
      console.log('User not authenticated and auth initialized, redirecting to login');
      router.push('/login');
    }
  }, [currentUser, authLoading, authInitialized, router]);
  
  // Fetch cases on component mount
  useEffect(() => {
    if (authInitialized && currentUser && !authLoading) {
      dispatch(fetchCases());
    }
  }, [dispatch, currentUser, authLoading, authInitialized]);
  
  const handleLogout = async () => {
    try {
      await signOutUser();
      
      // Redirect to login
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
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
  
  // Get active cases count
  const activeCasesCount = cases.filter(c => c.status === 'Open').length;
  
  // Get recent cases (last 5)
  const recentCases = [...cases]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);
  
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1">
            Dashboard
          </Typography>
          <Button 
            variant="outlined" 
            color="primary"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>
        
        <Box sx={{ mb: 4 }}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Welcome, {currentUser?.email || 'User'}
            </Typography>
            <Typography variant="body1">
              This is your case management dashboard. Here you can manage your legal cases and client information.
            </Typography>
          </Paper>
        </Box>
        
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Overview
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <Card sx={{ minWidth: 240, flex: 1 }}>
              <CardHeader title="Active Cases" />
              <CardContent>
                <Typography variant="h3" align="center">{activeCasesCount}</Typography>
                <Typography variant="body2" color="text.secondary" align="center">
                  {activeCasesCount === 0 
                    ? 'No active cases' 
                    : activeCasesCount === 1 
                      ? '1 active case' 
                      : `${activeCasesCount} active cases`}
                </Typography>
              </CardContent>
            </Card>
            
            <Card sx={{ minWidth: 240, flex: 1 }}>
              <CardHeader title="Upcoming Events" />
              <CardContent>
                <Typography variant="h3" align="center">0</Typography>
                <Typography variant="body2" color="text.secondary" align="center">
                  No upcoming events
                </Typography>
                <Typography variant="caption" color="text.secondary" align="center" display="block" sx={{ mt: 1 }}>
                  Calendar functionality coming soon
                </Typography>
              </CardContent>
            </Card>
            
            <Card sx={{ minWidth: 240, flex: 1 }}>
              <CardHeader title="Total Cases" />
              <CardContent>
                <Typography variant="h3" align="center">{cases.length}</Typography>
                <Typography variant="body2" color="text.secondary" align="center">
                  {cases.length === 0 
                    ? 'No cases' 
                    : cases.length === 1 
                      ? '1 case in total' 
                      : `${cases.length} cases in total`}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, mb: 4 }}>
          <Card sx={{ flex: 2 }}>
            <CardHeader title="Recent Cases" />
            <Divider />
            <CardContent sx={{ p: 0 }}>
              {casesLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress size={24} />
                </Box>
              ) : recentCases.length > 0 ? (
                <List>
                  {recentCases.map((caseItem) => (
                    <ListItem 
                      key={caseItem.id}
                      onClick={() => router.push(`/cases/${caseItem.id}`)}
                      divider
                      sx={{ cursor: 'pointer' }}
                    >
                      <ListItemText
                        primary={`${caseItem.caseNumber}: ${caseItem.clientName}`}
                        secondary={`Updated: ${formatDate(caseItem.updatedAt)}`}
                      />
                      <Chip 
                        label={caseItem.status} 
                        color={getStatusChipColor(caseItem.status)}
                        size="small"
                        sx={{ ml: 1 }}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    No cases found
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
          
          <Card sx={{ flex: 1 }}>
            <CardHeader title="Quick Actions" />
            <Divider />
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button 
                  variant="contained" 
                  color="primary"
                  fullWidth
                  onClick={() => router.push('/cases/new')}
                >
                  Create New Case
                </Button>
                <Button 
                  variant="outlined" 
                  color="primary"
                  fullWidth
                  onClick={() => router.push('/cases')}
                >
                  View All Cases
                </Button>
                <Divider sx={{ my: 1 }} />
                <Button 
                  variant="outlined" 
                  color="secondary"
                  fullWidth
                  disabled
                >
                  Calendar (Coming Soon)
                </Button>
                <Button 
                  variant="outlined" 
                  color="secondary"
                  fullWidth
                  disabled
                >
                  Client Management (Coming Soon)
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
        
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Development Progress
          </Typography>
          <Typography variant="body2" paragraph>
            The Courtcase application is currently in active development. The following features are being implemented:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText 
                primary="Case Management" 
                secondary="Basic functionality implemented. Expandable text fields and AI assistance coming soon."
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Document Management" 
                secondary="Coming soon. Upload, organize, and preview documents."
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Calendar & Scheduling" 
                secondary="Coming soon. Manage case events and deadlines."
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Client Management" 
                secondary="Coming soon. Manage client information and communication."
              />
            </ListItem>
          </List>
        </Paper>
      </Box>
    </Container>
  );
}
