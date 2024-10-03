'use client';

import * as React from 'react';
import Image from 'next/image';
import { useForm, Controller } from 'react-hook-form';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  CircularProgress,
} from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import sharedStyles from '@/app/styles/sharedStyles';
import styles from './styles';

interface MyFormValues {
  name: string;
  profilePicture: File | null;
}

interface EditProfileUserProps {
  setFormData: React.Dispatch<React.SetStateAction<FormDataState>>;
}

interface FormDataState {
  [key: string]: string;
}

const EditProfileUser: React.FC<EditProfileUserProps> = ({ setFormData }) => {
  const { register, handleSubmit, control, setValue } = useForm<MyFormValues>();
  const [previewImage, setPreviewImage] = React.useState<string | null>(null);
  const [userName, setUserName] = React.useState<string>('');
  const [imageUrl, setImageUrl] = React.useState<string | null>(null); // Estado para armazenar a URL da imagem
  const [loading, setLoading] = React.useState(true);
  const [loadingSave, setLoadingSave] = React.useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get('id'); // Captura o ID do usuário dos parâmetros da URL

  const fetchUserData = React.useCallback(async () => {
    if (userId) {
      try {
        const response = await fetch(`/api/getUser/${userId}`);
        const data = await response.json();
        console.log('Fetched User Data:', data); // Adicionado para verificar os dados
        setUserName(data.name || '');
        setImageUrl(data.imageUrl || null); // Defina a URL da imagem do estado do usuário
        setValue('name', data.name || '');
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false); // Define loading como falso se o ID não estiver disponível
    }
  }, [userId, setValue]);

  React.useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const onSubmit = async (data: MyFormValues) => {
    if (!userId) return;

    setLoadingSave(true); // Inicia o estado de carregamento

    try {
      const response = await fetch(`/api/updateUser/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: userId,
          name: data.name,
          imageUrl,
        }),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.error || 'Failed to update user');
      }

      // Atualizar o nome sem recarregar a página
      setUserName(data.name);
      setFormData((prevFormData: FormDataState) => ({
        ...prevFormData,
        name: data.name,
      }));

      // Redirecionar para o Dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Error updating user name:', error);
    } finally {
      setLoadingSave(false); // Finaliza o estado de carregamento
    }
  };

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      // Ajuste o caminho do upload para incluir o ID do usuário na subpasta
      const uploadResponse = await fetch(
        `/api/uploadImage?pathname=users/id=${userId}/image-${Date.now()}&userId=${userId}`,
        {
          method: 'POST',
          body: formData,
        },
      );

      const uploadData = await uploadResponse.json();
      setImageUrl(uploadData.url); // Defina a URL da imagem no estado

      // Mostre uma prévia da imagem no frontend
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center">
        <CircularProgress />
      </Box>
    );
  }

  if (!userId) {
    return <div>User ID not provided</div>;
  }

  return (
    <Container maxWidth="sm">
      <Box sx={sharedStyles.container}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={styles.formBoxImg}>
            <Button component="label" sx={styles.formButtonImg}>
              {previewImage ? (
                <Image
                  src={previewImage}
                  alt="Preview"
                  width={180}
                  height={180}
                  style={styles.formButtonImg}
                />
              ) : imageUrl ? (
                <Image
                  src={imageUrl}
                  alt="Profile Image"
                  width={180}
                  height={180}
                  style={styles.formButtonImg}
                />
              ) : (
                <Image
                  src="/profile-placeholder.png"
                  alt="Placeholder"
                  width={180}
                  height={180}
                />
              )}
              <input
                id="profile-picture-input"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
            </Button>
          </Box>
          <Box sx={styles.formBoxInput}>
            <Typography variant="h6" sx={styles.formSubTitle}>
              Escolha o nome e foto para seu perfil: {/* {userName} */}
            </Typography>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="text"
                  placeholder="Nome"
                  sx={styles.inputName}
                />
              )}
            />
            <Button
              type="submit"
              variant="contained"
              sx={styles.formButtonSubmit}
              disabled={loadingSave} // Desativa o botão enquanto está carregando
            >
              {loadingSave ? (
                <CircularProgress size={24} />
              ) : (
                'Salvar Alterações'
              )}
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default EditProfileUser;
