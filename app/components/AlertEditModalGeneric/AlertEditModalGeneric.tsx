import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, Button, TextField } from '@mui/material';
import sharedStyles from '@/app/styles/sharedStyles';

interface EditModalGenericProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (newName: string) => void;
  title: string;
  currentName: string;
}

const EditModalGeneric: React.FC<EditModalGenericProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  currentName,
}) => {
  const [newName, setNewName] = useState(currentName);

  // Atualiza newName quando currentName mudar
  useEffect(() => {
    setNewName(currentName);
  }, [currentName]);

  const handleConfirm = () => {
    onConfirm(newName);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          width: 300,
          margin: 'auto',
          padding: 2,
          backgroundColor: 'background.default',
          textAlign: 'center',
          borderRadius: 2,
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <Typography sx={{ ...sharedStyles.titlePage, fontSize: '24px' }}>
          {title}
        </Typography>
        <TextField
          fullWidth
          label="Editar nome do grupo"
          variant="outlined"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          sx={{ mt: 2, mb: 2 }}
        />
        <Button variant="contained" onClick={handleConfirm}>
          Salvar
        </Button>
      </Box>
    </Modal>
  );
};

export default EditModalGeneric;
