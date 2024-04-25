import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import GetAppIcon from '@mui/icons-material/GetApp';
import ClientProfile from '@/app/components/ProfileClient/ProfileClient';
import styles from '@/app/components/ClientPageTab4/styles';
import { orange } from '@mui/material/colors';
import sharedStyles from '@/app/styles/sharedStyles';

const ClientPageTab4: React.FC = () => {
  const handleAttachFiles = () => {
    // Lógica para anexar arquivos
    console.log('Anexar arquivos');
  };

  const handleDownloadFiles = () => {
    // Lógica para baixar arquivos
    console.log('Baixar arquivos');
  };

  return (
    <Box>
      <Box sx={styles.boxContent}>
        {/* Grupo 1 - Imagem e status do cliente. Col1 */}
        <ClientProfile />
        {/* Grupo 2 - Anexar e baixar arquivos. Col2 */}
        <Box sx={styles.boxCol2}>
          <Box sx={styles.boxIcon}>
            <Typography variant="h6" sx={sharedStyles.subtitleSize}>
              <span>Anexar</span> Arquivos
            </Typography>
            <AttachFileIcon sx={styles.icon} onClick={handleAttachFiles} />
          </Box>
          <Box sx={styles.boxIcon}>
            <Typography variant="h6" sx={sharedStyles.subtitleSize}>
              <span>Baixar</span> Arquivos
            </Typography>
            <GetAppIcon sx={styles.icon} onClick={handleDownloadFiles} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ClientPageTab4;
