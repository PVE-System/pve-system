import { Box, Card, CardContent, Container, Typography } from '@mui/material';

import styles from '@/app/components/ExcelDownload/style';
import sharedStyles from '@/app/styles/sharedStyles';

import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

export default function ExcelDownloadFileComponent() {
  return (
    <Container fixed>
      <Box sx={sharedStyles.container}>
        <Typography variant="h4" component="h1" sx={sharedStyles.titlePage}>
          <span>Planilha</span>Excel
        </Typography>
      </Box>
      <Box /* sx={styles.cardContainer} */>
        <Card variant="outlined" sx={styles.card}>
          <CardContent sx={styles.cardContent}>
            <Typography variant="h6" sx={sharedStyles.subtitleSize}>
              <span>Download</span> Planilha
            </Typography>
            <CloudDownloadIcon sx={styles.icon} />
          </CardContent>
          <CardContent sx={styles.cardContent}>
            <Typography variant="h6" sx={sharedStyles.subtitleSize}>
              <span>Atualizar</span> Planilha
            </Typography>
            <CloudUploadIcon sx={styles.icon} />
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}
