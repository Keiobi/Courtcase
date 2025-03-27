'use client';

import React, { useEffect, useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Grid, 
  Card, 
  CardContent,
  CardHeader,
  Button
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { getCurrentUser, signOutUser } from '@/services/firebase';

/**
 * Dashboard page component
 * Main landing page after authentication
 */
export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        const currentUser = getCurrentUser();
        
        if (!currentUser) {
          // Redirect to login if not authenticated
          router.push('/login');
          return;
        }
        
        setUser(currentUser);
      } catch (error) {
        console.error('Authentication check failed:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [router]);
  
  const handleLogout = async () => {
    try {
      await signOutUser();
      
      // Clear local storage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('uid');
      }
      
      // Redirect to login
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  
  if (loading) {
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
              Welcome, {user?.email || 'User'}
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
