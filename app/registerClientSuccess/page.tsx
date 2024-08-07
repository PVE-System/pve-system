import * as React from 'react';

import RegisterClientSuccess from '../components/RegisterClientSuccess/RegisterClientSuccess';
import HeadApp from '../components/HeadApp/HeadApp';

const RegisterSuccessPage: React.FC = () => {
  return (
    <>
      <HeadApp />
      <RegisterClientSuccess />
    </>
  );
};

export default RegisterSuccessPage;
