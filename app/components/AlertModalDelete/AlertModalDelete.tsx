import { Modal, Typography, Box, Button } from '@mui/material';
import { orange } from '@mui/material/colors';

interface AlertModalProps {
  open: boolean;
  onClose: () => void;
  message: string;
  onConfirm: () => void;
}

const AlertModal: React.FC<AlertModalProps> = ({
  open,
  onClose,
  message,
  onConfirm,
}) => (
  <Modal open={open} onClose={onClose}>
    <Box
      sx={{
        width: 300,
        margin: 'auto',
        padding: 3,
        backgroundColor: 'white',
        textAlign: 'center',
        borderRadius: 2,
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    >
      <Typography variant="h6" sx={{ marginBottom: 2, color: 'black' }}>
        {message}
      </Typography>
      <Button
        onClick={onConfirm}
        variant="contained"
        color="primary"
        sx={{ marginTop: 1, color: 'black', backgroundColor: orange[700] }}
      >
        Voltar
      </Button>
    </Box>
  </Modal>
);

export default AlertModal;
