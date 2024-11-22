/* import {
  Box,
  Button,
  Typography,
  Select,
  MenuItem,
  List,
  ListItem,
  Tooltip,
  IconButton,
  CircularProgress,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import React, { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import ClientProfile from '@/app/components/ProfileClient/ProfileClient';
import Cookies from 'js-cookie';
import styles from '../EditClient/styles';

// Define a tipagem para os dados do cliente
interface Quote {
  id: number;
  quoteIdentifier: string;
}

interface ClientData {
  rating: number;
  clientCondition: string;
  companyName: string;
  corfioCode: string;
  phone: string;
  emailCommercial: string;
  imageUrl?: string | null;
}

const SalesQuotesPage: React.FC = () => {
  const searchParams = useSearchParams();
  const clientId = searchParams.get('id');
  const [year, setYear] = useState(new Date().getFullYear());
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [totalQuotes, setTotalQuotes] = useState(0);
  const [loading, setLoading] = useState(false);
  const [addingQuote, setAddingQuote] = useState(false);
  const [clientData, setClientData] = useState<ClientData | null>(null); // Corrigido para iniciar como `null`
  const [loadingClient, setLoadingClient] = useState(true);

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

  return (
    <Box sx={{ padding: '20px' }}>
      {loadingClient ? (
        <CircularProgress />
      ) : (
        clientData && (
          <ClientProfile
            rating={clientData.rating}
            clientCondition={clientData.clientCondition}
            companyName={clientData.companyName}
            corfioCode={clientData.corfioCode}
            phone={clientData.phone}
            emailCommercial={clientData.emailCommercial}
            readOnly={true}
            imageUrl={clientData.imageUrl}
            enableImageUpload={false}
            onRatingChange={(newRating) =>
              console.log('Nova avaliação:', newRating)
            }
            onConditionChange={(newCondition) =>
              console.log('Nova condição:', newCondition)
            }
          />
        )
      )}
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
  );
};

export default SalesQuotesPage;
 */
