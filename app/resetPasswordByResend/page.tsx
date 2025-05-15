'use client';

import React from 'react';
import ResetPasswordComponent from '../components/ResetPasswordByResend/ResetPasswordByResend';
import ProtectedRouteAdminPage from '../components/ProtectedRouteAdminPage/ProtectedRouteAdminPage';

export default function RecoverPasswordPage() {
  return (
    <ProtectedRouteAdminPage>
      <ResetPasswordComponent />
    </ProtectedRouteAdminPage>
  );
}
