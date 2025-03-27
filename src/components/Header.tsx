'use client';

import React, { useState, useEffect } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Box 
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { getCurrentUser, signOutUser } from '@/services/firebase';

interface HeaderProps {
  toggleSidebar?: () => void;
}

/**
 * Header component for the Courtcase application
 * Displays the app bar with navigation and user controls
 */
const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = () => {
      try {
        const currentUser = getCurrentUser();
        
        if (currentUser) {
          setIsAuthenticated(true);
          setUser(currentUser);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        setIsAuthenticated(false);
        setUser(null);
      }
    };
    
    checkAuth();
  }, [pathname]);
  
  const handleLogout = async () => {
    try {
      await signOutUser();
      
      // Clear local storage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('uid');
      }
      
      // Update state
      setIsAuthenticated(false);
      setUser(null);
      
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
        
        {isAuthenticated ? (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body1" sx={{ mr: 2 }}>
              {user?.email || 'User'}
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
