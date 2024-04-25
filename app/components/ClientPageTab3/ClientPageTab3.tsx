import React, { useState } from 'react';
import { Box, Button, FormControl, TextField, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import FlagIcon from '@mui/icons-material/Flag';

import ClientProfile from '@/app/components/ProfileClient/ProfileClient';
import styles from '@/app/components/ClientPageTab3/styles';

interface Comment {
  comment: string;
  date: string;
  favorite: boolean;
}

const ClientPageTab3: React.FC = () => {
  const { handleSubmit, control, reset } = useForm();
  const [comments, setComments] = useState<Comment[]>([]);

  const onSubmit = (data: any) => {
    const currentDate = new Date();
    const formattedDate = format(currentDate, 'dd/MM/yyyy HH:mm:ss');

    const newComment = {
      comment: data.comment,
      date: formattedDate,
      favorite: false,
    };

    setComments([newComment, ...comments]);

    console.log('Novo comentário:', data.comment);
    console.log('Data de postagem:', formattedDate);

    reset();
  };

  // Fiz uma tentativa de lógica para que um post que for favoritado, fique no topo da lista.
  const handleFavorite = (index: number) => {
    const updatedComments = [...comments];
    updatedComments[index].favorite = !updatedComments[index].favorite;

    if (updatedComments[index].favorite && index !== 0) {
      const favoriteComment = updatedComments.splice(index, 1)[0];
      setComments([favoriteComment, ...updatedComments]);
    } else {
      setComments(updatedComments);
    }
    console.log(
      `Post ${index + 1} favoritado: ${updatedComments[index].favorite ? 'Sim' : 'Não'}`,
    );
  };

  return (
    <Box>
      <Box sx={styles.boxContent}>
        <ClientProfile />
        <Box sx={styles.boxCol2}>
          <FormControl onSubmit={handleSubmit(onSubmit)}>
            <TextField
              multiline
              minRows={3}
              maxRows={6}
              variant="filled"
              sx={styles.inputsCol2}
              InputProps={{
                style: { minHeight: '150px' },
                endAdornment: (
                  <FlagIcon
                    sx={{
                      color:
                        comments.length > 0 && comments[0].favorite
                          ? 'orange'
                          : 'primary',
                      marginBottom: '90px',
                      cursor: 'pointer',
                    }}
                    onClick={() => handleFavorite(0)}
                  />
                ),
              }}
              {...control.register('comment')}
            />
            <Button
              type="submit"
              variant="contained"
              onClick={() => handleSubmit(onSubmit)()}
            >
              Publicar
            </Button>
          </FormControl>
        </Box>
      </Box>
      <Box sx={styles.boxButton}>
        <Button
          type="submit"
          variant="contained"
          onClick={handleSubmit(onSubmit)}
          sx={styles.deleteButton}
        >
          Deletar
        </Button>
        <Button
          type="submit"
          variant="contained"
          onClick={handleSubmit(onSubmit)}
          sx={styles.editButton}
        >
          Editar
        </Button>
      </Box>
    </Box>
  );
};

export default ClientPageTab3;
