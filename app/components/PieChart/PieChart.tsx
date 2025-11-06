import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  useMediaQuery,
  CircularProgress,
} from '@mui/material';
import { PieChart, Pie, Cell, Legend } from 'recharts';
import styles from '@/app/components/PieChart/style';
import sharedStyles from '@/app/styles/sharedStyles';

const SimpleChart = () => {
  const [data, setData] = useState([
    { name: 'MS', value: 0 },
    { name: 'MT', value: 0 },
    { name: 'Outras UF', value: 0 },
    /* { name: 'Total', value: 0 }, */
  ]);
  const [loading, setLoading] = useState(true);
  const [totalClients, setTotalClients] = useState(0);
  const isSmallScreen = useMediaQuery('(max-width:600px)');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/getAllClients');
        const result = await response.json();
        const clients = result.clients;

        let msCount = 0;
        let mtCount = 0;
        let otherCount = 0;

        // Contar os estados com comparação case-insensitive e eliminando espaços extras
        clients.forEach((client: { state: string }) => {
          const state = client.state.trim().toLowerCase();
          if (state === 'ms') {
            msCount += 1;
          } else if (state === 'mt') {
            mtCount += 1;
          } else {
            otherCount += 1;
          }
        });

        const totalCount = clients.length;
        const chartData = [
          { name: 'MS', value: msCount },
          { name: 'MT', value: mtCount },
          { name: 'Outras UF', value: otherCount },
          /* { name: 'Total', value: totalCount }, */
        ];

        setData(chartData);
        setTotalClients(totalCount);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch client data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const COLORS = ['#2196F3', '#4CAF50', '#985afc'];

  return (
    <Box sx={{ textAlign: 'center' }}>
      <Card variant="outlined" sx={styles.cardPieChart}>
        <CardContent>
          <Typography variant="h6" sx={sharedStyles.subtitleSize}>
            Gráfico sobre cadastros:
          </Typography>
          <Box width={isSmallScreen ? '100%' : 'auto'}>
            <PieChart width={isSmallScreen ? 250 : 300} height={230}>
              <Pie
                dataKey="value"
                data={data}
                cx={isSmallScreen ? '50px' : '50px'}
                cy={150}
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                startAngle={180}
                endAngle={0}
                label
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </Box>
          <Box
            sx={{
              mt: 2,
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'center',
              alignItems: 'center',
              gap: { xs: 0, sm: 0.5 },
              textAlign: 'center',
            }}
          >
            <Typography variant="body1" component="span">
              Total de clientes cadastrados:
            </Typography>
            <Typography variant="body1" component="span">
              <strong>{totalClients}</strong>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SimpleChart;
