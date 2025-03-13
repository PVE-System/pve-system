import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  MenuItem,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import styles from './styles';

const AdminPageTabClientByUser = ({}) => {
  return (
    <Box>
      <Box sx={styles.boxContent}>
        <Typography component="div">
          Essa Aba desponibilizará listas de clientes. Segmentada por cada
          Responsável PVE de acordo com seu Número Operador.{' '}
        </Typography>
      </Box>
    </Box>
  );
};

export default AdminPageTabClientByUser;
