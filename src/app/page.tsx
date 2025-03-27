'use client';

import { Box, Container, Typography, Paper, Button } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h3" component="h1" gutterBottom>
            Courtcase - Defense Lawyer Case Management
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom>
            Efficiently manage your legal cases with our comprehensive solution
          </Typography>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              onClick={() => router.push('/login')}
            >
              Login
            </Button>
            <Button 
              variant="outlined" 
              color="primary" 
              size="large"
              onClick={() => router.push('/register')}
            >
              Register
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
