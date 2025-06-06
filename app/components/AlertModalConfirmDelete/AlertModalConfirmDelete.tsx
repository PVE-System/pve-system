import sharedStyles from '@/app/styles/sharedStyles';
import { Modal, Typography, Box, Button } from '@mui/material';
import { orange, red } from '@mui/material/colors';

interface AlertModalConfirmDeleteProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const AlertModalConfirmDelete: React.FC<AlertModalConfirmDeleteProps> = ({
  open,
  onClose,
  onConfirm,
}) => (
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
      <Typography
        variant="h6"
        sx={{ ...sharedStyles.titlePage, fontSize: '24px' }}
      >
        Confirmação:
      </Typography>
      <Typography sx={sharedStyles.subtitleSize}>
        Tem certeza que deseja excluir esta ocorrência?
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, mt: 2, justifyContent: 'center' }}>
        <Button
          onClick={onConfirm}
          variant="contained"
          sx={{
            backgroundColor: red[500],
            '&:hover': {
              backgroundColor: red[700],
            },
          }}
        >
          Sim
        </Button>
        <Button onClick={onClose} variant="contained">
          Não
        </Button>
      </Box>
    </Box>
  </Modal>
);

export default AlertModalConfirmDelete;
