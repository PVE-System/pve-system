import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';
import sharedStyles from '@/app/styles/sharedStyles';
import { Theme } from '@mui/material/styles/createTheme';

interface AlertModalClientsVisitsRouteProps {
  open: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onClose: () => void;
  onConfirm?: () => void;
  isConfirmation?: boolean;
}

const AlertModalClientsVisitsRoute: React.FC<
  AlertModalClientsVisitsRouteProps
> = ({
  open,
  title = 'Aviso:',
  message,
  confirmText = 'OK',
  cancelText = 'Cancelar',
  onClose,
  onConfirm,
  isConfirmation = false,
}) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="alert-modal-title"
      aria-describedby="alert-modal-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 300,
          bgcolor: (theme: Theme) =>
            theme.palette.mode === 'light'
              ? theme.palette.background.paper
              : theme.palette.background.alternative,
          borderRadius: 2,
          boxShadow: 24,
          p: 3,
          textAlign: 'center',
        }}
      >
        <Typography
          id="alert-modal-title"
          sx={{ ...sharedStyles.titlePage, fontSize: '20px', mb: 1 }}
        >
          {title}
        </Typography>
        <Typography
          id="alert-modal-description"
          sx={{ ...sharedStyles.subtitleSize, mb: 2 }}
        >
          {message}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          {isConfirmation && (
            <Button
              variant="contained"
              onClick={onClose}
              sx={{ minWidth: 100 }}
            >
              {cancelText}
            </Button>
          )}
          <Button
            variant="contained"
            onClick={isConfirmation ? onConfirm : onClose}
            sx={{
              minWidth: 100,
              backgroundColor: 'green',
              '&:hover': {
                backgroundColor: 'darkgreen',
              },
            }}
          >
            {confirmText}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AlertModalClientsVisitsRoute;
