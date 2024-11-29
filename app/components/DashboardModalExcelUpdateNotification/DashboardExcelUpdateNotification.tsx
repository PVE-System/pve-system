import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { Modal, Button, Typography, Box } from '@mui/material';
import { useRouter } from 'next/navigation';
import sharedStyles from '@/app/styles/sharedStyles';

export default function ExcelUpdateNotification() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkForNotification = async () => {
      const userId = Cookies.get('userId');
      if (!userId) {
        console.error('User ID not found in cookies');
        return;
      }

      try {
        const response = await fetch(
          `/api/notificationCheckModalStatus?userId=${userId}`,
        );
        const data = await response.json();

        if (response.ok && data.hasModal) {
          setIsModalOpen(true);
        } else {
          setIsModalOpen(false);
        }
      } catch (error) {
        console.error('Error checking modal status:', error);
      }
    };

    checkForNotification();
  }, []);

  const handleCloseModal = async () => {
    setIsModalOpen(false);

    const userId = Cookies.get('userId');
    if (!userId) {
      console.error('User ID not found in cookies');
      return;
    }

    try {
      const response = await fetch(
        `/api/updateDashboardNotification?userId=${userId}`,
        {
          method: 'PUT',
        },
      );
      if (!response.ok) {
        console.error(
          'Error updating dashboard notification status:',
          response.statusText,
        );
      } else {
        console.log('Dashboard notification status updated successfully.');
      }
    } catch (error) {
      console.error('Error updating dashboard notification status:', error);
    }
  };

  const handleCheckUpdates = async () => {
    setIsModalOpen(false); // Fecha o modal

    const userId = Cookies.get('userId');
    if (!userId) {
      console.error('User ID not found in cookies');
      return;
    }

    try {
      // Atualiza o estado do modal no backend
      const response = await fetch(
        `/api/updateDashboardNotification?userId=${userId}`,
        {
          method: 'PUT',
        },
      );
      if (!response.ok) {
        console.error(
          'Error updating dashboard notification status:',
          response.statusText,
        );
      } else {
        console.log('Dashboard notification status updated successfully.');
      }
    } catch (error) {
      console.error('Error updating dashboard notification status:', error);
    }

    console.log('User chose to check updates, redirecting...');
    router.push('/excelDownloadFile'); // Redireciona para a página Excel
  };

  return (
    <Modal
      sx={sharedStyles.boxModal}
      open={isModalOpen}
      onClose={handleCloseModal}
      aria-labelledby="excel-update-notification"
      aria-describedby="notify-user-of-new-excel-update"
    >
      <Box sx={sharedStyles.modalAlert}>
        <Typography variant="h6" id="excel-update-notification" gutterBottom>
          Informamos que a Planilha de Vendas foi atualizada!
        </Typography>
        <Box>
          <Button
            sx={sharedStyles.modalButton}
            variant="contained"
            onClick={handleCheckUpdates}
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
