'use client';

import React from 'react';
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

interface QuotesComposedChartProps {
  data: QuotesComposedChartDatum[];
  title?: string;
  height?: number;
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
        backgroundColor: 'background.paper',
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

const QuotesComposedChart: React.FC<QuotesComposedChartProps> = ({
  data,
  title = 'Cotações (Composed)',
  height = 300,
}) => {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));
  const isSm = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  const computedHeight = height ?? (isXs ? 220 : isSm ? 260 : 300);
  const tickFontSize = isXs ? 10 : isSm ? 12 : 13;
  const barSize = isXs ? 12 : 20;

  return (
    <Box sx={{ width: '100%' }}>
      <Typography
        sx={{
          mb: 2,
          fontSize: { xs: '14px', md: '18px' },
          pl: { xs: 2, md: 7 }, // Padding para alinhar titulo com o início do gráfico (espaço do eixo Y)
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
              right: 12,
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
              /* fill="#03213a" */
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

export default QuotesComposedChart;
