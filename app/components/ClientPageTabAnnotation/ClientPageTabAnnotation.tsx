'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  TextField,
  Tooltip,
  Typography,
  Snackbar,
} from '@mui/material';
import Alert from '@mui/material/Alert';
import { useForm, Controller } from 'react-hook-form';
import { format, parseISO } from 'date-fns';
import FlagIcon from '@mui/icons-material/Flag';
import DeleteIcon from '@mui/icons-material/Delete';
import ClientProfile from '@/app/components/ProfileClient/ProfileClient';
import styles from '@/app/components/ClientPageTabAnnotation/styles';
import { useRouter } from 'next/navigation';
import { ptBR } from 'date-fns/locale';
import { orange } from '@mui/material/colors';

interface ClientPageTabAnnotationProps {
  clientId: string;
}

interface Comment {
  id: number;
  comment: string;
  date: string;
  favorite: boolean;
  userName: string; // Adicionado para armazenar o nome do usuário
}

const ClientPageTabAnnotation: React.FC<ClientPageTabAnnotationProps> = ({
  clientId,
}) => {
  const { handleSubmit, control, reset } = useForm();
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<Comment[]>([]);
  const [clientData, setClientData] = useState<any>(null);
  const [loadingPost, setLoadingPost] = React.useState(false);
  const [loadingDelete, setLoadingDelete] = React.useState<number | null>(null);
  const [loadingFavorite, setLoadingFavorite] = React.useState<number | null>(
    null,
  );
  const [lastVisitData, setLastVisitData] = useState<{
    hasHistory: boolean;
    lastVisitConfirmedAt: string | null;
    lastVisitDescription?: string | null;
    routeName?: string | null;
    scheduledDate?: string | null;
  } | null>(null);

  const router = useRouter();

  // Snackbars
  const [snackbarSuccessOpen, setSnackbarSuccessOpen] = useState(false);
  const [snackbarError, setSnackbarError] = useState<{
    open: boolean;
    message?: string;
    errorId?: string | null;
    at?: string;
    contentText?: string;
  }>({ open: false });

  const getVercelRequestId = (res: Response) => {
    try {
      return res.headers.get('x-vercel-id');
    } catch {
      return null;
    }
  };

  const fetchComments = useCallback(async () => {
    try {
      const commentsResponse = await fetch(
        `/api/getHistoryComments/${clientId}`,
      );
      if (commentsResponse.ok) {
        const commentsData = await commentsResponse.json();
        console.log('Fetched comments:', commentsData); // Verifique se o `id` está presente em cada comentário
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
      const clientResponse = await fetch(`/api/getClient/${clientId}`);
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
    if (!clientId) {
      console.error('Client ID is missing');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        await fetchClientData();
        await fetchComments();
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [clientId, fetchClientData, fetchComments]);

  // Buscar histórico de visitas do cliente (mesmo padrão das outras abas)
  // Inclui polling para atualizar o conteúdo quando currentVisitDescription mudar
  useEffect(() => {
    if (!clientId || isNaN(Number(clientId))) {
      return;
    }

    let intervalId: NodeJS.Timeout | null = null;

    const fetchVisitHistory = async () => {
      try {
        const response = await fetch(
          `/api/getVisitClientHistory?clientId=${clientId}`,
        );
        if (!response.ok) {
          console.error('Erro ao buscar histórico de visitas');
          return;
        }
        const data = await response.json();
        setLastVisitData(data);
      } catch (error) {
        console.error('Erro ao buscar histórico de visitas:', error);
      }
    };

    fetchVisitHistory();
    intervalId = setInterval(fetchVisitHistory, 15000);

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [clientId]);

  const onSubmit = async (data: any) => {
    setLoadingPost(true); // Ativa o loading do botão "Publicar"
    const currentDate = new Date();
    const formattedDate = format(currentDate, 'yyyy-MM-dd');

    const newComment = {
      clientId,
      comment: data.comment,
      date: formattedDate,
      favorite: false,
    };

    try {
      const response = await fetch('/api/postHistoryComments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newComment),
      });

      if (!response.ok) {
        let errMsg = 'Não foi possível salvar seu registro';
        let errorId = getVercelRequestId(response);
        try {
          const err = await response.json();
          errMsg = err?.error || errMsg;
          errorId = err?.errorId || errorId;
        } catch {}
        const at = new Date().toLocaleString();
        setSnackbarError({
          open: true,
          message: `${errMsg}, tente novamente daqui alguns minutos`,
          errorId,
          at,
          contentText: data.comment,
        });
        return;
      }

      fetchComments();
      reset();
      setSnackbarSuccessOpen(true);
    } catch (error: any) {
      const at = new Date().toLocaleString();
      setSnackbarError({
        open: true,
        message: error?.message || 'Erro desconhecido ao salvar',
        errorId: null,
        at,
        contentText: data.comment,
      });
    } finally {
      setLoadingPost(false); // Desativa o loading ao final
    }
  };

  const handleFavorite = async (commentId: number) => {
    setLoadingFavorite(commentId); // Ativa o loading para o comentário específico
    const updatedComments = [...comments];
    const targetComment = updatedComments.find(
      (comment) => comment.id === commentId,
    );

    if (!targetComment) {
      console.error('Comment ID is missing or undefined');
      return;
    }

    targetComment.favorite = !targetComment.favorite;

    try {
      const response = await fetch(
        `/api/favoriteHistoryComment?id=${targetComment.id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ favorite: targetComment.favorite }),
        },
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const updatedComment = await response.json();

      const formattedUpdatedComment = {
        ...updatedComment,
        date: updatedComment.date
          ? format(parseISO(updatedComment.date), 'yyyy-MM-dd')
          : 'Data não disponível',
        userName: targetComment.userName,
      };

      // Remove o comentário atualizado da lista
      const remainingComments = updatedComments.filter(
        (comment) => comment.id !== commentId,
      );

      // Adiciona o comentário atualizado ao topo se favoritado, ou ao final se não favoritado
      const reorderedComments = formattedUpdatedComment.favorite
        ? [formattedUpdatedComment, ...remainingComments]
        : [...remainingComments, formattedUpdatedComment];

      setComments(reorderedComments);
    } catch (error) {
      console.error('Error updating favorite status:', error);
    } finally {
      setLoadingFavorite(null); // Desativa o loading ao final
    }
  };

  const handleDelete = async (commentId: number) => {
    setLoadingDelete(commentId); // Ativa o loading para o comentário específico
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
    } finally {
      setLoadingDelete(null); // Desativa o loading ao final
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
    return (
      <Box sx={styles.loadComponent}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={styles.boxContent}>
        <ClientProfile
          rating={clientData?.rating}
          clientCondition={clientData?.clientCondition}
          companyName={clientData?.companyName}
          corfioCode={clientData?.corfioCode}
          whatsapp={clientData?.whatsapp}
          emailCommercial={clientData?.emailCommercial}
          onRatingChange={handleRatingChange}
          onConditionChange={handleConditionChange}
          readOnly={false}
          imageUrl={clientData?.imageUrl}
          enableImageUpload={false}
          lastVisitData={lastVisitData}
        />
        <Box sx={styles.boxCol2}>
          {/* Descrição atual da visita (somente leitura) */}
          <Box>
            <Typography variant="subtitle1" sx={{ fontSize: '14px' }}>
              Descrição da visita mais recente:
            </Typography>
            <TextField
              value={lastVisitData?.lastVisitDescription || ''}
              placeholder="Sem descrição disponível"
              variant="filled"
              fullWidth
              multiline
              minRows={2}
              InputProps={{ readOnly: true }}
              sx={{
                ...styles.inputsCol2,
                '& .MuiInputBase-input': { fontSize: '14px' },
              }}
            />
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ fontSize: '14px' }}>
              Publicar uma anotação:
            </Typography>

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
                    }}
                  />
                )}
              />
              <Box sx={styles.boxButton}>
                <Button
                  type="submit"
                  variant="contained"
                  sx={styles.postCommentsButton}
                >
                  {loadingPost ? <CircularProgress size={24} /> : 'Publicar'}
                </Button>
              </Box>
            </form>
          </Box>
          <Box>
            {Array.isArray(comments) &&
              comments.map((comment, index) => (
                <Box key={comment.id} sx={styles.boxComments}>
                  <Box>
                    <Typography variant="body2">{comment.comment}</Typography>
                    <Typography variant="overline" sx={styles.commentsData}>
                      {formatCommentDate(comment.date)} - {comment.userName}
                    </Typography>
                  </Box>
                  <Box sx={styles.commentsContent}>
                    <Tooltip title={'Favoritar ou desfavoritar comentário'}>
                      <IconButton
                        onClick={() => handleFavorite(comment.id)}
                        disabled={loadingFavorite === comment.id}
                      >
                        {loadingFavorite === comment.id ? (
                          <CircularProgress size={24} />
                        ) : (
                          <FlagIcon
                            sx={{
                              color: comment.favorite
                                ? orange[800]
                                : 'darkgrey',
                              width: 20,
                            }}
                          />
                        )}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={'Deletar comentário'}>
                      <IconButton
                        onClick={() => handleDelete(comment.id)}
                        disabled={loadingDelete === comment.id}
                      >
                        {loadingDelete === comment.id ? (
                          <CircularProgress size={24} />
                        ) : (
                          <DeleteIcon sx={styles.commentsIcons} />
                        )}
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              ))}
          </Box>
        </Box>
      </Box>
      {/* Snackbars de publicação */}
      <Snackbar
        open={snackbarSuccessOpen}
        autoHideDuration={8000}
        onClose={() => setSnackbarSuccessOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbarSuccessOpen(false)}
          severity="success"
          sx={{ width: '100%' }}
        >
          Seu registro foi salvo com sucesso!
        </Alert>
      </Snackbar>

      <Snackbar
        open={snackbarError.open}
        onClose={() => setSnackbarError({ open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbarError({ open: false })}
          severity="error"
          sx={{ width: '100%', wordBreak: 'break-word' }}
        >
          Não foi possível salvar seu registro, tente novamente daqui alguns
          minutos.
          {snackbarError.message ? ` Detalhes: ${snackbarError.message}` : ''}
          {snackbarError.errorId ? ` | Código: ${snackbarError.errorId}` : ''}
          {snackbarError.at ? ` | ${snackbarError.at}` : ''}
          {snackbarError.contentText
            ? (() => {
                const txt = snackbarError.contentText || '';
                const short = txt.length > 20 ? `${txt.slice(0, 20)}...` : txt;
                return ` | Conteúdo: ${short}`;
              })()
            : ''}
          {snackbarError.contentText ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
              <Button
                color="primary"
                variant="contained"
                size="small"
                onClick={() =>
                  navigator.clipboard.writeText(snackbarError.contentText || '')
                }
              >
                Copiar texto da sua publicação
              </Button>
            </Box>
          ) : null}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ClientPageTabAnnotation;
