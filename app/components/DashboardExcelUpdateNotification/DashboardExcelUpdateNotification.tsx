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
import { usePathname, useRouter } from 'next/navigation';
import sharedStyles from '@/app/styles/sharedStyles';

export default function ExcelUpdateNotification() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const checkForNotification = async () => {
    const userId = Cookies.get('userId');
    if (!userId) {
      console.error('User ID not found in cookies');
      return;
    }

    console.log('Checking for notification...');

    try {
      const response = await fetch(
        `/api/notificationCheckUpdatePages?userId=${userId}`,
      );
      const data = await response.json();

      console.log('Notification data received:', data);

      if (response.ok && data.hasNotification) {
        console.log('Notification found, opening modal...');
        setIsModalOpen(true);
      } else {
        console.log('No new notifications found');
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error('Erro ao verificar notificações:', error);
    }
  };

  const updateDashboardViewedAt = async () => {
    const userId = Cookies.get('userId');
    if (!userId) {
      console.error('User ID not found in cookies');
      return;
    }

    try {
      const response = await fetch(
        `/api/updateDashboardViewedAt?userId=${userId}`,
        {
          method: 'PUT', // Certifique-se de que o método é PUT
        },
      );
      if (!response.ok) {
        console.error(
          'Erro ao atualizar dashboard_last_viewed_at:',
          response.statusText,
        );
      } else {
        console.log('Dashboard view updated successfully in database');
      }
    } catch (error) {
      console.error('Erro ao atualizar dashboard view:', error);
    }
  };

  const handleCloseModal = async () => {
    console.log('Closing modal and updating dashboard view...');
    setIsModalOpen(false);
    await updateDashboardViewedAt(); // Atualiza o campo no banco de dados
    console.log('Modal closed, dashboard view updated in database');
    await checkForNotification(); // Recheca notificações
  };

  const handleCheckUpdates = async () => {
    setIsModalOpen(false);
    await updateDashboardViewedAt(); // Atualiza o campo no banco de dados
    console.log('User chose to check updates, redirecting...');

    // Recheca notificações para refletir a nova atualização
    await checkForNotification();

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
            onClick={() => {
              handleCloseModal();
            }}
          >
            Entendi
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
