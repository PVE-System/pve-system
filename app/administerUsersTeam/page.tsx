import * as React from 'react';

import UsersTeamList from '@/app/components/UsersTeamList/UsersTeamList';
import HeadApp from '../components/HeadApp/HeadApp';
import sharedStyles from '../styles/sharedStyles';
import { Box, Typography } from '@mui/material';

const AdministerUsersTeam: React.FC = () => {
  return (
    <>
      <HeadApp />
      <Box sx={sharedStyles.container}>
        <Typography variant="h4" component="h1" sx={sharedStyles.titlePage}>
          Equipe <span>PVE</span>
        </Typography>
      </Box>
      <UsersTeamList />
    </>
  );
};

export default AdministerUsersTeam;
