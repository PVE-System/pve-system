import React, { useEffect, useState } from 'react';
import { Modal, Button, Typography, Box } from '@mui/material';
import { useRouter } from 'next/navigation';
import sharedStyles from '@/app/styles/sharedStyles';

interface AlertModalClientPageOccurrencesNotificationProps {
  clientId: string;
}

export default function AlertModalClientPageOccurrencesNotification({
  clientId,
}: AlertModalClientPageOccurrencesNotificationProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkForOpenOccurrences = async () => {
      if (!clientId) {
        console.error('Client ID not found');
        return;
      }

      try {
        const response = await fetch(
          `/api/checkOpenOccurrences?clientId=${clientId}`,
        );
        const data = await response.json();

        if (response.ok && data.hasOpenOccurrences) {
          setIsModalOpen(true);
        } else {
          setIsModalOpen(false);
        }
      } catch (error) {
        console.error('Erro ao verificar ocorrências:', error);
      }
    };

    checkForOpenOccurrences();
  }, [clientId]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleViewOccurrences = () => {
    setIsModalOpen(false);
    router.push(`/frequentOccurrencesPage`);
  };

  return (
    <Modal
      sx={sharedStyles.boxModal}
      open={isModalOpen}
      onClose={handleCloseModal}
      aria-labelledby="occurrences-notification"
      aria-describedby="notify-user-of-open-occurrences"
    >
      <Box sx={sharedStyles.modalAlert}>
        <Typography
          variant="h6"
          sx={sharedStyles.modalText}
          id="occurrences-notification"
          gutterBottom
        >
          Existem ocorrências em aberto para este cliente!
        </Typography>
        <Box>
          <Button
            sx={sharedStyles.modalButton}
            variant="contained"
            onClick={handleViewOccurrences}
          >
            Conferir
          </Button>
          <Button
            sx={sharedStyles.modalButton}
            variant="contained"
            onClick={handleCloseModal}
          >
            Entendi
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
