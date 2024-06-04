import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import GetAppIcon from '@mui/icons-material/GetApp';
import ClientProfile from '@/app/components/ProfileClient/ProfileClient';
import styles from '@/app/components/ClientPageTab4/styles';
import { orange } from '@mui/material/colors';
import sharedStyles from '@/app/styles/sharedStyles';

interface ClientPageTab4Props {
  clientId: string;
}

const ClientPageTab4: React.FC<ClientPageTab4Props> = ({ clientId }) => {
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
        <ClientProfile
          rating={0}
          clientCondition={''}
          setRating={function (rating: number): void {
            throw new Error('Function not implemented.');
          }}
          setClientCondition={function (condition: string): void {
            throw new Error('Function not implemented.');
          }}
        />
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
