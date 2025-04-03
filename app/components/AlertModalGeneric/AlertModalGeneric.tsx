import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';
import sharedStyles from '@/app/styles/sharedStyles';

interface AlertModalGenericProps {
  open: boolean;
  onClose: () => void;
  title: string;
  message: string;
  buttonText?: string;
  onConfirm?: () => void; // Ação de confirmação (opcional)
}

const AlertModalGeneric: React.FC<AlertModalGenericProps> = ({
  open,
  onClose,
  title,
  message,
  buttonText = 'OK',
  onConfirm,
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          width: 300,
          margin: 'auto',
          padding: 2,
          backgroundColor: 'background.default',
          color: 'text.primary',
          textAlign: 'center',
          borderRadius: 2,
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <Typography sx={sharedStyles.titlePage}>{title}</Typography>
        <Typography sx={sharedStyles.subtitleSize}>{message}</Typography>
        <Box sx={{ mt: 2 }}>
          <Button
            variant="contained"
            onClick={onConfirm || onClose} // Executa onConfirm se existir, senão fecha o modal
          >
            {buttonText}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AlertModalGeneric;
