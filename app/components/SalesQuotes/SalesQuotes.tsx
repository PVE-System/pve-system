import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  Select,
  MenuItem,
  Typography,
  List,
  ListItem,
  IconButton,
  Tooltip,
} from '@mui/material';
import { useSearchParams } from 'next/navigation';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const SalesQuotesPage: React.FC = () => {
  const searchParams = useSearchParams();
  const clientId = searchParams.get('id');
  const [year, setYear] = useState(new Date().getFullYear());
  const [quotes, setQuotes] = useState([]);
  const [totalQuotes, setTotalQuotes] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchQuotes = useCallback(
    async (selectedYear: number) => {
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
    if (clientId) {
      fetchQuotes(year);
    }
  }, [clientId, year, fetchQuotes]);

  const handleAddQuote = async () => {
    try {
      const response = await fetch(`/api/addSalesQuote?clientId=${clientId}`, {
        method: 'POST',
      });
      if (response.ok) {
        fetchQuotes(year); // Atualiza a lista após adicionar uma nova cotação
      } else {
        console.error('Error adding new sales quote');
      }
    } catch (error) {
      console.error('Error adding new sales quote:', error);
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
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
        }}
      >
        <Button variant="contained" onClick={handleAddQuote}>
          Cotação +
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
          quotes.map((quote: { id: number; quoteIdentifier: string }) => (
            <ListItem
              key={quote.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Typography variant="body1">{quote.quoteIdentifier}</Typography>
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
