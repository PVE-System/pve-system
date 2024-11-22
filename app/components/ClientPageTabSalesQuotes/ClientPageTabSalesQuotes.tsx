/* 'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  List,
  ListItem,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import ClientProfile from '@/app/components/ProfileClient/ProfileClient';
import styles from '@/app/components/ClientPageTabAnnotation/styles';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

interface ClientPageSalesQuotesProps {
  clientId: string;
}

interface Quote {
  id: number;
  quoteIdentifier: string;
}

const ClientPageTabSalesQuotes: React.FC<ClientPageSalesQuotesProps> = ({
  clientId,
}) => {
  const [loading, setLoading] = useState(true);
  const [clientData, setClientData] = useState<any>(null);
  const [year, setYear] = useState(new Date().getFullYear());
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [totalQuotes, setTotalQuotes] = useState(0);
  const [addingQuote, setAddingQuote] = useState(false);
  const [loadingClient, setLoadingClient] = useState(true);

  const router = useRouter();

  // Busca os dados do cliente
  const fetchClientData = useCallback(async () => {
    if (!clientId) return;
    setLoadingClient(true);
    try {
      const response = await fetch(`/api/getClient/${clientId}`);
      const data = await response.json();

      // Ajusta os dados do cliente com valores padrão
      setClientData({
        rating: data.rating || 0,
        clientCondition: data.clientCondition || 'Normal',
        companyName: data.companyName || '',
        corfioCode: data.corfioCode || '',
        phone: data.phone || '',
        emailCommercial: data.emailCommercial || '',
        imageUrl: data.imageUrl || null,
      });
    } catch (error) {
      console.error('Error fetching client data:', error);
    } finally {
      setLoadingClient(false);
    }
  }, [clientId]);

  // Busca as cotações
  const fetchQuotes = useCallback(
    async (selectedYear: number) => {
      if (!clientId) return;
      setLoading(true);
      try {
        const response = await fetch(
          `/api/getSalesQuotes?clientId=${clientId}&year=${selectedYear}`,
        );
        const data = await response.json();
        if (response.ok) {
          setQuotes(data.quotes);
          setTotalQuotes(data.total);
        } else {
          console.error('Error fetching sales quotes:', data.error);
        }
      } catch (error) {
        console.error('Error fetching sales quotes:', error);
      } finally {
        setLoading(false);
      }
    },
    [clientId],
  );

  useEffect(() => {
    fetchClientData();
    fetchQuotes(year);
  }, [fetchClientData, fetchQuotes, year]);

  const addSalesQuote = async () => {
    if (!clientId) return;
    setAddingQuote(true);
    try {
      const userId = Cookies.get('userId');
      if (!userId) {
        console.error('User ID not found in cookies');
        return;
      }

      const response = await fetch(`/api/addSalesQuote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientId,
          userId: Number(userId),
        }),
      });

      if (response.ok) {
        console.log('Sales quote added successfully');
        fetchQuotes(year);
      } else {
        const data = await response.json();
        console.error('Error adding sales quote:', data.error);
      }
    } catch (error) {
      console.error('Error adding sales quote:', error);
    } finally {
      setAddingQuote(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        console.log('Copied to clipboard:', text);
      },
      (error) => {
        console.error('Failed to copy text to clipboard:', error);
      },
    );
  };

  const handleRatingChange = (rating: number) => {
    console.log('Rating:', rating);
  };

  const handleConditionChange = (condition: string) => {
    console.log('Condition:', condition);
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
          phone={clientData?.phone}
          emailCommercial={clientData?.emailCommercial}
          onRatingChange={handleRatingChange}
          onConditionChange={handleConditionChange}
          readOnly={false}
          imageUrl={clientData?.imageUrl}
          enableImageUpload={false}
        />
        <Box sx={styles.boxCol2}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px',
            }}
          >
            <Button
              variant="contained"
              onClick={addSalesQuote}
              disabled={addingQuote}
            >
              {addingQuote ? 'Adicionando...' : 'Cotação +'}
            </Button>
            <Select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              displayEmpty
              sx={{ minWidth: '150px' }}
            >
              {Array.from({ length: 10 }, (_, i) => {
                const yearOption = new Date().getFullYear() - i;
                return (
                  <MenuItem key={yearOption} value={yearOption}>
                    {yearOption}
                  </MenuItem>
                );
              })}
            </Select>
            <Typography variant="subtitle1">
              Total de cotações no ano {year}: {totalQuotes}
            </Typography>
          </Box>

          <List>
            {loading ? (
              <Typography variant="body1">Carregando...</Typography>
            ) : quotes.length > 0 ? (
              quotes.map((quote) => (
                <ListItem
                  key={quote.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px',
                  }}
                >
                  <Typography variant="body1">
                    Nome da Cotação: {quote.quoteIdentifier}
                  </Typography>
                  <Tooltip title="Copiar nome">
                    <IconButton
                      onClick={() => copyToClipboard(quote.quoteIdentifier)}
                    >
                      <ContentCopyIcon />
                    </IconButton>
                  </Tooltip>
                </ListItem>
              ))
            ) : (
              <Typography variant="body1">
                Nenhuma cotação encontrada para o ano {year}.
              </Typography>
            )}
          </List>
        </Box>
      </Box>
    </Box>
  );
};

export default ClientPageTabSalesQuotes;
 */

'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  List,
  ListItem,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import ClientProfile from '@/app/components/ProfileClient/ProfileClient';
import styles from '@/app/components/ClientPageTabAnnotation/styles';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

interface ClientPageSalesQuotesProps {
  clientId: string;
}

interface Quote {
  id: number;
  quoteIdentifier: string;
}

const ClientPageTabSalesQuotes: React.FC<ClientPageSalesQuotesProps> = ({
  clientId,
}) => {
  const [loadingClient, setLoadingClient] = useState(true);
  const [loadingQuotes, setLoadingQuotes] = useState(true);
  const [clientData, setClientData] = useState<any>(null);
  const [year, setYear] = useState(new Date().getFullYear());
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [totalQuotes, setTotalQuotes] = useState(0);
  const [addingQuote, setAddingQuote] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const ITEMS_PER_PAGE = 5;

  // Calcular os itens da página atual
  const startIndex = currentPage * ITEMS_PER_PAGE;
  const currentItems = quotes.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Total de páginas
  const totalPages = Math.ceil(quotes.length / ITEMS_PER_PAGE);

  // Fetch Client Data
  const fetchClientData = useCallback(async () => {
    setLoadingClient(true);
    try {
      const response = await fetch(`/api/getClient/${clientId}`);
      if (!response.ok) throw new Error('Erro ao buscar dados do cliente');
      const data = await response.json();
      setClientData(data);
    } catch (error) {
      console.error('Error fetching client data:', error);
    } finally {
      setLoadingClient(false);
    }
  }, [clientId]);

  // Fetch Quotes
  const fetchQuotes = useCallback(
    async (selectedYear: number) => {
      setLoadingQuotes(true);
      try {
        const response = await fetch(
          `/api/getSalesQuotes?clientId=${clientId}&year=${selectedYear}`,
        );
        const data = await response.json();
        if (!response.ok) throw new Error('Erro ao buscar cotações');

        // Ordena as cotações em ordem decrescente
        const sortedQuotes = data.quotes.sort(
          (a: { id: number }, b: { id: number }) => b.id - a.id,
        );

        setQuotes(sortedQuotes);
        setTotalQuotes(data.total);
      } catch (error) {
        console.error('Error fetching sales quotes:', error);
      } finally {
        setLoadingQuotes(false);
      }
    },
    [clientId],
  );

  useEffect(() => {
    fetchClientData();
  }, [fetchClientData]);

  useEffect(() => {
    fetchQuotes(year);
  }, [fetchQuotes, year]);

  const addSalesQuote = async () => {
    setAddingQuote(true);
    try {
      const userId = Cookies.get('userId');
      if (!userId) throw new Error('ID do usuário não encontrado');
      const response = await fetch(`/api/addSalesQuote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId, userId: Number(userId) }),
      });
      if (!response.ok) throw new Error('Erro ao adicionar cotação');
      fetchQuotes(year); // Atualiza as cotações
    } catch (error) {
      console.error('Error adding sales quote:', error);
    } finally {
      setAddingQuote(false);
    }
  };

  if (loadingClient || loadingQuotes) {
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
          rating={clientData?.rating || 0}
          clientCondition={clientData?.clientCondition || ''}
          companyName={clientData?.companyName || ''}
          corfioCode={clientData?.corfioCode || ''}
          phone={clientData?.phone || ''}
          emailCommercial={clientData?.emailCommercial || ''}
          onRatingChange={() => {}}
          onConditionChange={() => {}}
          readOnly={false}
          imageUrl={clientData?.imageUrl || null}
          enableImageUpload={false}
        />
        <Box sx={styles.boxCol2}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px',
            }}
          >
            <Tooltip title="Registrar cotação e gerar código da negociação">
              <Button
                variant="contained"
                onClick={addSalesQuote}
                disabled={addingQuote}
                sx={{
                  backgroundColor: 'green',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: '120px', // Para evitar que o botão fique pequeno demais
                  '&:hover': {
                    backgroundColor: 'darkgreen',
                  },
                }}
              >
                {addingQuote ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Cotação +'
                )}
              </Button>
            </Tooltip>
            <Button variant="contained">
              <Typography variant="subtitle1">
                Total {year}: {totalQuotes}
              </Typography>
            </Button>

            <Select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              displayEmpty
              sx={{ minWidth: '150px' }}
            >
              {Array.from({ length: 10 }, (_, i) => {
                const yearOption = new Date().getFullYear() - i;
                return (
                  <MenuItem key={yearOption} value={yearOption}>
                    {yearOption}
                  </MenuItem>
                );
              })}
            </Select>
          </Box>

          {/* Lista paginada */}
          <List>
            {currentItems.length > 0 ? (
              currentItems.map((quote) => (
                <ListItem
                  key={quote.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px',
                  }}
                >
                  <Typography variant="body1">
                    Cotação: {quote.quoteIdentifier}
                  </Typography>
                  <Tooltip title="Copiar código da negociação.">
                    <IconButton
                      onClick={() =>
                        navigator.clipboard.writeText(quote.quoteIdentifier)
                      }
                    >
                      <ContentCopyIcon />
                    </IconButton>
                  </Tooltip>
                </ListItem>
              ))
            ) : (
              <Typography variant="body1">
                Nenhuma cotação encontrada para o ano {year}.
              </Typography>
            )}
          </List>

          {/* Controles de paginação */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: '10px',
              gap: '10px',
            }}
          >
            <IconButton
              disabled={currentPage === 0}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="body2">
              Página {currentPage + 1} de {totalPages}
            </Typography>
            <IconButton
              disabled={currentPage >= totalPages - 1}
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
              }
            >
              <ArrowForwardIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ClientPageTabSalesQuotes;
