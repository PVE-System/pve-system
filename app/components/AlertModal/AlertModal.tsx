import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';

interface SimpleModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const AlertModal: React.FC<SimpleModalProps> = ({
  open,
  onClose,
  onConfirm,
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 300,
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          textAlign: 'center',
        }}
      >
        <Typography variant="h6" sx={{ mb: 2, color: 'white' }}>
          Acesso Restrito
        </Typography>
        <Typography sx={{ mb: 4, color: 'white' }}>
          Por favor, faça o login para ter acesso ao sistema.
        </Typography>
        <Button variant="contained" onClick={onConfirm}>
          OK
        </Button>
      </Box>
    </Modal>
  );
};

export default AlertModal;
