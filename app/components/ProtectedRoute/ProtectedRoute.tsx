'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Cookies from 'js-cookie';

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

  useEffect(() => {
    const token = Cookies.get('token');
    console.log('ProtectedRoute useEffect Token:', token);
    console.log('ProtectedRoute Pathname:', pathname);

    if (!token && !unprotectedRoutes.includes(pathname)) {
      router.push(route);
    } else if (token && pathname === '/') {
      router.push('/dashboard');
    }
  }, [pathname, route, router, unprotectedRoutes]);

  return <>{children}</>;
};

export default ProtectedRoute;

/* import { ReactNode, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Cookies from 'js-cookie';
import Loading from '../MenuNav/Loading/Loading';

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

  useEffect(() => {
    const token = Cookies.get('token');
    console.log('ProtectedRoute useEffect Token:', token);
    console.log('ProtectedRoute Pathname:', pathname);

    if (token) {
      setIsAuthenticated(true);
    } else if (!unprotectedRoutes.includes(pathname)) {
      router.push(route);
    }
    setLoading(false);
  }, [pathname, route, router, unprotectedRoutes]);

  if (loading) {
    return <Loading />; // Ou uma tela de carregamento se preferir
  }

  if (!isAuthenticated && !unprotectedRoutes.includes(pathname)) {
    return <Loading />; // Ou uma tela de carregamento se preferir
  }

  return <>{children}</>;
};

export default ProtectedRoute; */
