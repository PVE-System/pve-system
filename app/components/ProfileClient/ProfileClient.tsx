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
  whatsapp: string;
  onRatingChange: (rating: number) => void;
  onConditionChange: (condition: string) => void;
  readOnly?: boolean;
  imageUrl?: string | null; // Adiciona a propriedade imageUrl como opcional
  onImageChange?: (file: File) => void; // Callback para quando a imagem for alterada
  showTooltip?: boolean;
  enableImageUpload?: boolean;
  lastVisitData?: {
    hasHistory: boolean;
    lastVisitConfirmedAt: string | null;
  } | null;
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
  whatsapp,
  onRatingChange,
  onConditionChange,
  readOnly,
  imageUrl,
  onImageChange, // Recebe o callback do componente pai
  showTooltip = false, // Valor padrão é false
  enableImageUpload = false,
  lastVisitData,
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

  const formatPhoneForWhatsApp = (whatsapp?: string) => {
    if (!whatsapp) {
      console.warn('Número de WhatsApp não está definido.');
      return '#'; // Retorna um link vazio ou um valor padrão
    }

    // Remove todos os caracteres que não são números
    const cleanedPhone = whatsapp.replace(/\D/g, '');

    // Adiciona o código do país (55 para Brasil) no início
    const formattedPhone = `55${cleanedPhone}`;

    return `https://wa.me/${formattedPhone}`;
  };

  // Função para formatar a data da última visita
  const formatLastVisitDate = (dateString: string | null) => {
    if (!dateString) return 'Pendente';

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch (error) {
      console.error('Erro ao formatar data:', error);
      return 'Pendente';
    }
  };

  // Função para obter o texto da última visita
  const getLastVisitText = () => {
    if (!lastVisitData || !lastVisitData.hasHistory) {
      return 'Pendente';
    }

    return formatLastVisitDate(lastVisitData.lastVisitConfirmedAt);
  };

  return (
    <Box>
      <Box sx={styles.boxProfile}>
        <Typography variant="h6" component="div" sx={styles.companyName}>
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
                priority
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
              priority
            />
          )}
        </label>
        <Box sx={styles.statusRating}>
          <Tooltip title="Relacionado ao faturamento e frequência de pedidos deste cliente">
            <Typography variant="subtitle2" component="div">
              Status de Atividade:
            </Typography>
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
            <Typography variant="subtitle2" component="div">
              Condição do Cliente:
            </Typography>
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
            width: '100%',
            maxWidth: '100%',
            overflowWrap: 'break-word',
            wordBreak: 'break-word',
          }}
        >
          <Typography
            variant="subtitle2"
            component="div"
            sx={{
              marginBottom: '5px',
              wordBreak: 'break-word',
              color: lastVisitData?.hasHistory
                ? 'text.primary'
                : 'text.secondary',
              fontWeight: lastVisitData?.hasHistory ? 'normal' : 'normal',
            }}
          >
            Última Visita: {getLastVisitText()}
          </Typography>
          <Typography
            variant="subtitle2"
            component="div"
            sx={{ marginBottom: '5px', wordBreak: 'break-word' }}
          >
            Código Corfio: {corfioCode}
          </Typography>{' '}
          <Typography
            variant="subtitle2"
            component="div"
            sx={{ marginBottom: '5px', wordBreak: 'break-word' }}
          >
            WhatsApp:{' '}
            {whatsapp ? (
              <a
                href={formatPhoneForWhatsApp(whatsapp)}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'green', textDecoration: 'none' }}
              >
                {whatsapp}
              </a>
            ) : null}
          </Typography>
          <Typography
            variant="subtitle2"
            component="div"
            sx={{ marginBottom: '5px', wordBreak: 'break-word' }}
          >
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
    </Box>
  );
};

export default ClientProfile;
