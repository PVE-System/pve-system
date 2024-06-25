'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import GetAppIcon from '@mui/icons-material/GetApp';
import ClientProfile from '@/app/components/ProfileClient/ProfileClient';
import styles from '@/app/components/ClientPageTabFiles/styles';
import sharedStyles from '@/app/styles/sharedStyles';
import { useRouter } from 'next/navigation';

interface ClientPageTabFilesProps {
  clientId: string;
}

const ClientPageTabFiles: React.FC<ClientPageTabFilesProps> = ({
  clientId,
}) => {
  const [clientData, setClientData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchClientData = useCallback(async () => {
    try {
      const clientResponse = await fetch(`/api/getClient/[id]?id=${clientId}`);
      if (!clientResponse.ok) {
        throw new Error('Network response was not ok');
      }
      const clientData = await clientResponse.json();
      setClientData(clientData);
    } catch (error) {
      console.error('Error fetching client data:', error);
    }
  }, [clientId]);

  useEffect(() => {
    if (!clientId) return;

    const fetchData = async () => {
      setLoading(true);
      await fetchClientData();
      setLoading(false);
    };

    fetchData();
  }, [clientId, fetchClientData]);

  const handleAttachFiles = () => {
    // Trigger the file input click event
    document.getElementById('file-upload')?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      console.log('Arquivos selecionados:', files);
      // Placeholder para lógica de upload de arquivos
    }
  };

  const handleDownloadFiles = () => {
    // Placeholder para lógica de baixar arquivos
    console.log('Baixar arquivos');
  };

  const handleRatingChange = (rating: number) => {
    console.log('Rating:', rating);
  };

  const handleConditionChange = (condition: string) => {
    console.log('Condition:', condition);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <Box>
      <Box sx={styles.boxContent}>
        {/* Grupo 1 - Imagem e status do cliente. Col1 */}
        <ClientProfile
          rating={clientData?.rating}
          clientCondition={clientData?.clientCondition}
          onRatingChange={handleRatingChange}
          onConditionChange={handleConditionChange}
          companyName={clientData?.companyName}
          corfioCode={clientData?.corfioCode}
        />
        {/* Grupo 2 - Anexar e baixar arquivos. Col2 */}
        <Box sx={styles.boxCol2}>
          <Box sx={styles.boxIcon}>
            <Typography variant="h6" sx={sharedStyles.subtitleSize}>
              <span>Anexar</span> Arquivos
            </Typography>
            <IconButton onClick={handleAttachFiles}>
              <AttachFileIcon sx={styles.icon} />
            </IconButton>
            <input
              id="file-upload"
              type="file"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
          </Box>
          <Box sx={styles.boxIcon}>
            <Typography variant="h6" sx={sharedStyles.subtitleSize}>
              <span>Baixar</span> Arquivos
            </Typography>
            <IconButton onClick={handleDownloadFiles}>
              <GetAppIcon sx={styles.icon} />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ClientPageTabFiles;
