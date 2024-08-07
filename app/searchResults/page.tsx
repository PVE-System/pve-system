import * as React from 'react';

import SearchResults from '@/app/components/SearchResults/SearchResults';
import HeadApp from '../components/HeadApp/HeadApp';
import sharedStyles from '../styles/sharedStyles';
import { Box, Typography } from '@mui/material';

const SearchResultsPage: React.FC = () => {
  return (
    <>
      <HeadApp />
      <Box sx={sharedStyles.container}>
        <Typography variant="h4" component="h1" sx={sharedStyles.titlePage}>
          Resultados da sua <span>Busca</span>
        </Typography>
      </Box>
      <SearchResults />
    </>
  );
};

export default SearchResultsPage;
