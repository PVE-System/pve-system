'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Box, Button, IconButton, TextField, Typography } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { format, parseISO } from 'date-fns';
import FlagIcon from '@mui/icons-material/Flag';
import DeleteIcon from '@mui/icons-material/Delete';
import ClientProfile from '@/app/components/ProfileClient/ProfileClient';
import styles from '@/app/components/ClientPageTab3/styles';
import { useRouter } from 'next/navigation';
import { ptBR } from 'date-fns/locale';

interface ClientPageTab3Props {
  clientId: string;
}

interface Comment {
  id: number;
  comment: string;
  date: string;
  favorite: boolean;
}

const ClientPageTab3: React.FC<ClientPageTab3Props> = ({ clientId }) => {
  const { handleSubmit, control, reset } = useForm();
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<Comment[]>([]);
  const [clientData, setClientData] = useState<any>(null);
  const router = useRouter();

  const fetchComments = useCallback(async () => {
    try {
      const commentsResponse = await fetch(
        `/api/getHistoryComments/[id]?id=${clientId}`,
      );
      if (commentsResponse.ok) {
        const commentsData = await commentsResponse.json();
        setComments(Array.isArray(commentsData) ? commentsData : []);
      } else if (commentsResponse.status === 404) {
        console.warn('Comments not found, proceeding with empty data.');
        setComments([]);
      } else {
        throw new Error('Network response was not ok');
      }
    } catch (error) {
      console.error('Error fetching comments data:', error);
    }
  }, [clientId]);

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
      await fetchComments();
      setLoading(false);
    };

    fetchData();
  }, [clientId, fetchClientData, fetchComments]);

  const onSubmit = async (data: any) => {
    const currentDate = new Date();
    const formattedDate = format(currentDate, 'yyyy-MM-dd'); // Formato ISO para armazenar no BD

    const newComment = {
      comment: data.comment,
      date: formattedDate,
      favorite: false,
    };

    try {
      const response = await fetch(`/api/postHistoryComments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId, ...newComment }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Comentário salvo com sucesso, recarregar comentários
      fetchComments();
      reset();
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  const handleFavorite = async (index: number) => {
    const updatedComments = [...comments];
    const targetComment = updatedComments[index];
    targetComment.favorite = !targetComment.favorite;

    try {
      const response = await fetch(
        `/api/favoriteHistoryComment?id=${targetComment.id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            favorite: targetComment.favorite,
          }),
        },
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const updatedComment = await response.json();

      // Garantir que o comentário atualizado tenha a data correta
      const formattedUpdatedComment = {
        ...updatedComment,
        date: updatedComment.date
          ? format(parseISO(updatedComment.date), 'yyyy-MM-dd')
          : 'Data não disponível',
      };

      updatedComments.splice(index, 1);
      if (formattedUpdatedComment.favorite) {
        setComments([formattedUpdatedComment, ...updatedComments]);
      } else {
        setComments([...updatedComments, formattedUpdatedComment]);
      }
    } catch (error) {
      console.error('Error updating favorite status:', error);
    }
  };

  const handleDelete = async (commentId: number) => {
    try {
      const response = await fetch(
        `/api/deleteHistoryComment?id=${commentId}`,
        {
          method: 'DELETE',
        },
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const deletedComment = await response.json();
      const updatedComments = comments.filter(
        (comment) => comment.id !== commentId,
      );
      setComments(updatedComments);
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleRatingChange = (rating: number) => {
    console.log('Rating:', rating);
  };

  const handleConditionChange = (condition: string) => {
    console.log('Condition:', condition);
  };

  const formatCommentDate = (date: string | undefined) => {
    if (!date) return 'Data não disponível';
    return format(parseISO(date), 'dd/MM/yyyy', { locale: ptBR });
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <Box>
      <Box sx={styles.boxContent}>
        <ClientProfile
          rating={clientData?.rating}
          clientCondition={clientData?.clientCondition}
          onRatingChange={handleRatingChange}
          onConditionChange={handleConditionChange}
        />
        <Box sx={styles.boxCol2}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="comment"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  multiline
                  minRows={3}
                  maxRows={6}
                  variant="filled"
                  sx={styles.inputsCol2}
                  InputProps={{
                    style: { minHeight: '150px' },
                    /*                     endAdornment: (
                      <FlagIcon
                        sx={{
                          color:
                            comments.length > 0 && comments[0].favorite
                              ? 'orange'
                              : 'darkgrey',
                          marginBottom: '90px',
                          cursor: 'pointer',
                        }}
                        onClick={() => handleFavorite(0)}
                      />
                    ), */
                  }}
                />
              )}
            />
            <Button
              type="submit"
              variant="contained"
              sx={styles.postCommentsButton}
            >
              Publicar
            </Button>
          </form>
          <Box>
            {Array.isArray(comments) &&
              comments.map((comment, index) => (
                <Box key={comment.id} sx={styles.boxComments}>
                  <Box /* sx={{ flexGrow: 1 }} */>
                    <Typography variant="body1">{comment.comment}</Typography>
                    <Typography variant="caption" sx={styles.commentsData}>
                      {formatCommentDate(comment.date)}
                    </Typography>
                  </Box>
                  <Box sx={styles.commentsContent}>
                    <IconButton onClick={() => handleFavorite(index)}>
                      <FlagIcon
                        sx={{
                          color: comment.favorite ? 'orange' : 'darkgrey',
                          ...styles.commentsIcons,
                        }}
                      />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(comment.id)}>
                      <DeleteIcon sx={styles.commentsIcons} />
                    </IconButton>
                  </Box>
                </Box>
              ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ClientPageTab3;
