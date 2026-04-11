import CircularProgressTimer from './CircularProgressTimer';
import {Box, Typography } from '@mui/material';
import image from '../../assets/doorsclose.png';

const CircularProgressTimerPage = () => {
  return (
    <Box
    sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        textAlign: 'center',
        backgroundImage: `url(${image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: 'rgba(134, 184, 242, 0.46)',
        backgroundBlendMode: 'color-burn',
        backgroundAttachment: 'fixed'
    }}
    >
      <Typography
        variant="h2"
        gutterBottom
        sx={{
          fontFamily: "'Orbitron', sans-serif",
          color: '#fff',
          textShadow:
            '0 0 10px rgba(0, 114, 255, 0.7), 0 0 20px rgba(0, 114, 255, 0.7), 0 0 30px rgba(0, 114, 255, 0.7)',
          animation: 'glow 1.5s ease-in-out infinite alternate',
          '@keyframes glow': {
            from: {
              textShadow:
                '0 0 10px rgba(0, 114, 255, 0.7), 0 0 20px rgba(0, 114, 255, 0.7), 0 0 30px rgba(0, 114, 255, 0.7)',
            },
            to: {
              textShadow:
                '0 0 20px rgba(0, 114, 255, 0.9), 0 0 30px rgba(0, 114, 255, 0.9), 0 0 40px rgba(0, 114, 255, 0.9)',
            },
          },
        }}
      >
        Your Leave Is In Progress
      </Typography>
      <CircularProgressTimer initialTime={3600} timeIncrement={3600} />
    </Box>
  );
};

export default CircularProgressTimerPage;
