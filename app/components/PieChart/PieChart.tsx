import {
  Box,
  Card,
  CardContent,
  Theme,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { PieChart, Pie, Cell, Legend } from 'recharts';

const SimpleChart = () => {
  const data = [
    { name: 'MS', value: 236 },
    { name: 'MT', value: 171 },
    { name: 'Outros', value: 67 },
    { name: 'Total', value: 474 },
  ];

  const COLORS = ['#FFC107', '#FF5722', '#2196F3', '#4CAF50'];

  const isSmallScreen = useMediaQuery('(max-width:600px)');

  return (
    <Box sx={{ textAlign: 'center' }}>
      <Card
        variant="outlined"
        sx={{
          marginBottom: '20px',
          background: (theme: Theme) => theme.palette.background.alternative,
          borderRadius: 4,
          border: '1px solid white',
        }}
      >
        <CardContent>
          <Typography variant="h6" color={'white'}>
            Gráfico dos cadastros:
          </Typography>
          <Box width={isSmallScreen ? '100%' : 'auto'}>
            <PieChart width={isSmallScreen ? 250 : 300} height={230}>
              <Pie
                dataKey="value"
                data={data}
                cx={isSmallScreen ? 125 : 150}
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
        </CardContent>
      </Card>
    </Box>
  );
};

export default SimpleChart;