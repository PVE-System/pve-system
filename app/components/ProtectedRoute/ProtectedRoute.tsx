'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Cookies from 'js-cookie';
import AlertModal from '../AlertModal/AlertModal';

interface ProtectedRouteProps {
  children: ReactNode;
  route: string;
  unprotectedRoutes?: string[];
}

const ProtectedRoute = ({
  children,
  route,
  unprotectedRoutes = ['/login', '/'],
}: ProtectedRouteProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const token = Cookies.get('token');

    if (unprotectedRoutes.includes(pathname)) {
      setIsAuthenticated(true);
      setLoading(false);
    } else if (token) {
      setIsAuthenticated(true);
      setLoading(false);
    } else {
      router.push(route); // Redireciona o usuário
      setShowModal(true); // Exibe o modal após o redirecionamento
      setLoading(false);
    }
  }, [pathname, route, router, unprotectedRoutes]);

  const handleModalClose = () => {
    setShowModal(false);
  };

  if (loading) {
    return null; // Retorna null para não renderizar nada enquanto está carregando
  }
  return (
    <>
      <AlertModal
        open={showModal}
        onClose={handleModalClose}
        onConfirm={handleModalClose}
      />
      {isAuthenticated && children}
    </>
  );
};

export default ProtectedRoute;
