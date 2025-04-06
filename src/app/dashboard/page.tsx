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
  CircularProgress
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { signOutUser } from '@/services/firebase';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Dashboard page component
 * Main landing page after authentication
 */
export default function Dashboard() {
  const router = useRouter();
  const { currentUser, isLoading, authInitialized } = useAuth();
  
  useEffect(() => {
    // Only redirect if auth is initialized and user is not authenticated
    if (authInitialized && !isLoading && !currentUser) {
      console.log('User not authenticated and auth initialized, redirecting to login');
      router.push('/login');
    }
  }, [currentUser, isLoading, authInitialized, router]);
  
  const handleLogout = async () => {
    try {
      await signOutUser();
      
      // Redirect to login
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  
  if (isLoading) {
    return (
      <Container>
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="h5">Loading...</Typography>
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
                <Typography variant="h3" align="center">0</Typography>
                <Typography variant="body2" color="text.secondary" align="center">
                  No active cases
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
              </CardContent>
            </Card>
            
            <Card sx={{ minWidth: 240, flex: 1 }}>
              <CardHeader title="Recent Activity" />
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  No recent activity
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Box>
        
        <Box>
          <Typography variant="h5" gutterBottom>
            Quick Actions
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="contained" color="primary">
              Create New Case
            </Button>
            <Button variant="outlined" color="primary">
              View All Cases
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
