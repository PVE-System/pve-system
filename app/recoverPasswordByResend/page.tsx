'use client';

import React from 'react';
import RecoverPassword from '../components/RecoverPassword/RecoverPassword';
import ProtectedRouteAdminPage from '../components/ProtectedRouteAdminPage/ProtectedRouteAdminPage';

export default function RecoverPasswordPage() {
  return (
    <ProtectedRouteAdminPage>
      <RecoverPassword />
    </ProtectedRouteAdminPage>
  );
}
