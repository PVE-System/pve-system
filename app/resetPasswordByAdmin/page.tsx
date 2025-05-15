import React from 'react';
import ResetPasswordByAdmin from '../components/ResetPasswordByAdmin/ResetPasswordByAdmin';
import ProtectedRouteAdminPage from '../components/ProtectedRouteAdminPage/ProtectedRouteAdminPage';

export default function ResetPasswordPage() {
  return (
    <ProtectedRouteAdminPage>
      <ResetPasswordByAdmin />
    </ProtectedRouteAdminPage>
  );
}
