/* import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { Modal, Button, Typography, Box } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import sharedStyles from '@/app/styles/sharedStyles';

export default function ExcelUpdateNotification() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasNotification, setHasNotification] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const checkForNotification = async () => {
    const userId = Cookies.get('userId');
    if (!userId) {
      console.error('User ID not found in cookies');
      return;
    }

    // Testar sem a verificação `localStorage` para garantir que o modal aparece corretamente
    console.log('Checking for notification...');

    try {
      const response = await fetch(
        `/api/notificationCheckUpdatePages?userId=${userId}`,
      );
      const data = await response.json();

      console.log('Notification data received:', data);

      if (response.ok && data.hasNotification) {
        console.log('Notification found, opening modal...');
        setHasNotification(true);
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error('Erro ao verificar notificações:', error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setHasNotification(false);
    const userId = Cookies.get('userId');
    if (userId) {
      localStorage.setItem(`viewedExcelNotification_${userId}`, 'true');
    }
    console.log('Modal closed and notification set as viewed in localStorage');
  };

  const handleCheckUpdates = () => {
    setIsModalOpen(false);
    const userId = Cookies.get('userId');
    if (userId) {
      localStorage.setItem(`viewedExcelNotification_${userId}`, 'true');
    }
    console.log('User chose to check updates, redirecting...');
    router.push('/excelDownloadFile');
  };

  useEffect(() => {
    console.log('Pathname changed, checking for notification...');
    checkForNotification();
  }, [pathname]);

  return (
    <Modal
      open={isModalOpen}
      onClose={handleCloseModal}
      aria-labelledby="excel-update-notification"
      aria-describedby="notify-user-of-new-excel-update"
    >
      <Box sx={sharedStyles.modalStyle}>
        <Typography variant="h6" id="excel-update-notification" gutterBottom>
          Informamos que a Planilha de Vendas foi atualizada!
        </Typography>
        <Box mt={2} display="flex" justifyContent="space-between">
          <Button
            variant="contained"
            color="primary"
            onClick={handleCheckUpdates}
          >
            Conferir
          </Button>
          <Button
            sx={{
              backgroundColor: 'green',
              color: 'white',
              '&:hover': { backgroundColor: 'darkgreen' },
            }}
            variant="contained"
            onClick={handleCloseModal}
          >
            Entendi
          </Button>
        </Box>
      </Box>
    </Modal>
  );
} */

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
    console.log('User chose to check updates, redirecting...');
    router.push('/excelDownloadFile'); // Redireciona para a página Excel
  };

  return (
    <Modal
      open={isModalOpen}
      onClose={handleCloseModal}
      aria-labelledby="excel-update-notification"
      aria-describedby="notify-user-of-new-excel-update"
    >
      <Box sx={sharedStyles.modalStyle}>
        <Typography variant="h6" id="excel-update-notification" gutterBottom>
          Informamos que a Planilha de Vendas foi atualizada!
        </Typography>
        <Box mt={2} display="flex" justifyContent="space-between">
          <Button
            variant="contained"
            color="primary"
            onClick={handleCheckUpdates}
          >
            Conferir
          </Button>
          <Button
            sx={{
              backgroundColor: 'green',
              color: 'white',
              '&:hover': { backgroundColor: 'darkgreen' },
            }}
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
