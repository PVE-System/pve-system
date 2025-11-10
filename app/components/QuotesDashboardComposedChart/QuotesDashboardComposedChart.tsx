'use client';

import React, { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  TooltipProps,
} from 'recharts';
import { Box, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { orange } from '@mui/material/colors';

export interface QuotesComposedChartDatum {
  label: string;
  count: number;
}

interface QuotesDashboardComposedChartProps {
  title?: string;
  height?: number;
  clientId?: number; // opcional: permitir filtrar por cliente se desejar
  onLoadComplete?: () => void; // Callback quando o gráfico terminar de carregar
}

const CustomTooltip: React.FC<TooltipProps<number, string>> = ({
  active,
  payload,
  label,
}) => {
  if (!active || !payload || payload.length === 0) return null;
  const value = payload[0]?.value as number | undefined;
  return (
    <Box
      sx={{
        backgroundColor: 'background.alternative',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        px: 1.5,
        py: 1,
        boxShadow: 2,
      }}
    >
      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
        {label}
      </Typography>
      <Typography variant="body2">Cotações: {value ?? 0}</Typography>
    </Box>
  );
};

const QuotesDashboardComposedChart: React.FC<
  QuotesDashboardComposedChartProps
> = ({
  title = 'Gráfico sobre cotações:',
  height = 300,
  clientId,
  onLoadComplete,
}) => {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));
  const isSm = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  const computedHeight = height ?? (isXs ? 220 : isSm ? 260 : 300);
  const tickFontSize = isXs ? 10 : isSm ? 12 : 13;
  const barSize = isXs ? 12 : 20;

  const [data, setData] = useState<QuotesComposedChartDatum[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const qs = clientId ? `?clientId=${clientId}` : '';
        const res = await fetch(`/api/getSalesQuotesLast12Months${qs}`);
        const json = await res.json();
        if (!res.ok || !json.success) {
          throw new Error('Falha ao carregar dados do gráfico (12 meses)');
        }
        setData(json.data as QuotesComposedChartDatum[]);
      } catch (e) {
        console.error(e);
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [clientId]);

  // Notificar quando o gráfico terminar de carregar e renderizar
  useEffect(() => {
    if (!loading && data.length > 0 && onLoadComplete) {
      // Aguardar um pouco para garantir que o gráfico renderizou completamente
      const timer = setTimeout(() => {
        onLoadComplete();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [loading, data, onLoadComplete]);

  return (
    <Box
      sx={{
        width: '100%',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,

        /* maxWidth: { xs: '100%', sm: '100%', md: '1200px', lg: '1400px' }, */
        /* mx: 'auto', */ // Centraliza quando atinge maxWidth
      }}
    >
      <Typography
        sx={{
          mb: 2,
          mt: 2,
          fontSize: { xs: '12px', md: '18px' },
          textAlign: 'center',
        }}
      >
        {title}
      </Typography>
      <Box sx={{ width: '100%', height: computedHeight }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            // Responsive margin para telas menores
            margin={{
              top: 10,
              right: isXs ? 20 : 40, // Mais espaço à direita em telas maiores
              bottom: isXs ? 20 : 10,
              left: isXs ? -40 : 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: tickFontSize }}
              angle={isXs ? -25 : 0}
              tickMargin={isXs ? 12 : 8}
              height={isXs ? 35 : undefined}
            />
            <YAxis allowDecimals={false} tick={{ fontSize: tickFontSize }} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="count"
              fill="#033157"
              stroke="#90caf9"
            />
            <Bar dataKey="count" barSize={barSize} fill={orange[700]} />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#0d47a1"
              strokeWidth={2}
              dot={{ r: isXs ? 0 : 2 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default QuotesDashboardComposedChart;
