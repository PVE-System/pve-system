'use client';

import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Rating,
  Tooltip,
  Typography,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import Image from 'next/image';
import styles from '@/app/components/ProfileClient/styles';
import { orange } from '@mui/material/colors';

interface ClientProfileProps {
  rating: number;
  clientCondition: string;
  companyName: string;
  corfioCode: string;
  emailCommercial: string;
  phone: string;
  onRatingChange: (rating: number) => void;
  onConditionChange: (condition: string) => void;
  readOnly?: boolean;
  imageUrl?: string | null; // Adiciona a propriedade imageUrl como opcional
  onImageChange?: (file: File) => void; // Callback para quando a imagem for alterada
  showTooltip?: boolean;
  enableImageUpload?: boolean;
}

// Função Renderizar o nome do cliente com tamanho menor
const renderAsIs = (str: any) => {
  if (typeof str !== 'string') {
    return '';
  }
  return str;
};

const ClientProfile: React.FC<ClientProfileProps> = ({
  rating,
  clientCondition,
  companyName,
  corfioCode,
  emailCommercial,
  phone,
  onRatingChange,
  onConditionChange,
  readOnly,
  imageUrl,
  onImageChange, // Recebe o callback do componente pai
  showTooltip = false, // Valor padrão é false
  enableImageUpload = false,
}) => {
  const { control } = useForm();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);

      if (onImageChange) {
        onImageChange(file);
      }
    }
  };

  const handleImageClick = () => {
    if (!readOnly) {
      setOpenDialog(true);
    }
  };

  return (
    <Box sx={styles.boxProfile}>
      <Typography variant="h6" sx={styles.companyName}>
        {renderAsIs(companyName.slice(0, 35))} {/* Limita a 35 caracteres */}
      </Typography>{' '}
      <label htmlFor="profile-picture-input">
        {/* Exibe o input apenas se enableImageUpload for true */}
        {enableImageUpload && (
          <input
            id="profile-picture-input"
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileChange}
            disabled={readOnly}
          />
        )}
        {showTooltip ? (
          <Tooltip title="Primeiro conclua o cadastro do cliente e depois escolha a foto do perfil">
            <Image
              src={previewImage || imageUrl || '/profile-placeholder.png'}
              alt="Profile Picture"
              width={180}
              height={180}
              style={styles.imgProfile}
              onClick={handleImageClick}
            />
          </Tooltip>
        ) : (
          <Image
            src={previewImage || imageUrl || '/profile-placeholder.png'}
            alt="Profile Picture"
            width={180}
            height={180}
            style={styles.imgProfile}
            onClick={handleImageClick}
          />
        )}
      </label>
      <Box sx={styles.statusRating}>
        <Tooltip title="Relacionado ao faturamento e frequência de pedidos deste cliente">
          <Typography variant="subtitle2">Status de Atividade:</Typography>
        </Tooltip>
        <Controller
          name="rating"
          control={control}
          render={({ field }) => (
            <Rating
              sx={styles.rating}
              {...field}
              name="rating"
              value={rating}
              max={3}
              onChange={(event, value) => {
                if (!readOnly) {
                  field.onChange(value);
                  onRatingChange(value || 0);
                }
              }}
              readOnly={readOnly}
            />
          )}
        />
      </Box>
      <Box sx={styles.clientCondition}>
        <Tooltip title="Relacionado a condição deste cliente">
          <Typography variant="subtitle2">Condição do Cliente:</Typography>
        </Tooltip>
        <Box sx={styles.clientConditionButtonBox}>
          <Button
            variant="outlined"
            color="success"
            sx={{
              ...styles.clientConditionButton,
              ...(clientCondition === 'Normal' && {
                backgroundColor: 'green',
                borderColor: 'green',
                /* border: 'none', */
                color: 'white',

                '&:hover': {
                  backgroundColor: 'green', // Manter a cor verde no hover se estiver selecionado
                  borderColor: 'green',
                },
              }),
            }}
            disabled={readOnly}
            onClick={() => {
              if (!readOnly) {
                onConditionChange('Normal');
              }
            }}
          >
            Normal
          </Button>
          <Button
            variant="outlined"
            color="warning"
            sx={{
              ...styles.clientConditionButton,
              ...(clientCondition === 'Especial' && {
                backgroundColor: 'orange',
                /* border: 'none', */
                color: 'black',
                '&:hover': {
                  backgroundColor: 'orange', // Manter a cor verde no hover se estiver selecionado
                  borderColor: 'orange',
                },
              }),
            }}
            disabled={readOnly}
            onClick={() => {
              if (!readOnly) {
                onConditionChange('Especial');
              }
            }}
          >
            Especial
          </Button>
          <Button
            variant="outlined"
            color="error"
            sx={{
              ...styles.clientConditionButton,
              ...(clientCondition === 'Suspenso' && {
                backgroundColor: 'red',
                /* border: 'none', */
                color: 'white',
                '&:hover': {
                  backgroundColor: 'red', // Manter a cor verde no hover se estiver selecionado
                  borderColor: 'red',
                },
              }),
            }}
            disabled={readOnly}
            onClick={() => {
              if (!readOnly) {
                onConditionChange('Suspenso');
              }
            }}
          >
            Suspenso
          </Button>
        </Box>
      </Box>
      <Box
        sx={{
          alignSelf: 'start',
        }}
      >
        <Typography variant="subtitle2" sx={{ marginBottom: '5px' }}>
          Código Corfio: {corfioCode}
        </Typography>{' '}
        <Typography variant="subtitle2" sx={{ marginBottom: '5px' }}>
          Telefone: {phone}
        </Typography>{' '}
        <Typography variant="subtitle2" sx={{ marginBottom: '5px' }}>
          Email: {emailCommercial}
        </Typography>{' '}
      </Box>
      {/* Dialog para exibir a imagem em tamanho maior */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          style: {
            borderRadius: 10,
          },
        }}
      >
        <DialogContent
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Image
            src={previewImage || imageUrl || '/profile-placeholder.png'}
            alt="Profile Picture"
            width={500}
            height={500}
            style={{ borderRadius: '10px' }}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ClientProfile;
