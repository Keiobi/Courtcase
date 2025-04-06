'use client';

import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Box,
  CircularProgress
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useRouter } from 'next/navigation';
import { signOutUser } from '@/services/firebase';
import { useAuth } from '@/contexts/AuthContext';

interface HeaderProps {
  toggleSidebar?: () => void;
}

/**
 * Header component for the Courtcase application
 * Displays the app bar with navigation and user controls
 */
const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const router = useRouter();
  const { currentUser, isLoading, authInitialized } = useAuth();
  const isAuthenticated = !!currentUser;
  
  const handleLogout = async () => {
    try {
      await signOutUser();
      
      // Clear local storage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('uid');
      }
      
      
      // Redirect to login page
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  
  return (
    <AppBar position="static">
      <Toolbar>
        {isAuthenticated && toggleSidebar && (
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleSidebar}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}
        
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            flexGrow: 1, 
            cursor: 'pointer' 
          }}
          onClick={() => router.push(isAuthenticated ? '/dashboard' : '/')}
        >
          Courtcase
        </Typography>
        
        {!authInitialized || isLoading ? (
          <CircularProgress color="inherit" size={24} />
        ) : isAuthenticated ? (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body1" sx={{ mr: 2 }}>
              {currentUser?.email || 'User'}
            </Typography>
            <Button 
              color="inherit" 
              onClick={() => router.push('/settings')}
            >
              Settings
            </Button>
            <Button 
              color="inherit" 
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Box>
        ) : (
          <Box>
            <Button 
              color="inherit" 
              onClick={() => router.push('/login')}
            >
              Login
            </Button>
            <Button 
              color="inherit" 
              onClick={() => router.push('/register')}
            >
              Register
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
