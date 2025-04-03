'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/app/contex/authContext';
import AlertModalGeneric from '../AlertModalGeneric/AlertModalGeneric';

const ProtectedRouteAdminPage = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user, loading } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false); // Estado para controlar o redirecionamento
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (loading) return; // Aguarda o carregamento antes de validar

    if (!user) {
      // Se não tem usuário (logout), redireciona diretamente
      router.push('/');
      return;
    }

    if (user.role !== 'admin') {
      // Se não é admin, ativa o modal para bloquear a tela
      setShowModal(true);
    }
  }, [user, loading, router]);

  const handleCloseModal = () => {
    // Antes de fechar o modal, remove ele da tela para evitar conflitos
    setShowModal(false);
    setIsRedirecting(true); // Indica que o redirecionamento está em andamento
    router.push('/dashboard'); // Redireciona para o dashboard
  };

  // Se o redirecionamento estiver em andamento, não renderiza nada
  if (isRedirecting) {
    return null;
  }

  if (loading) {
    return <p>Carregando...</p>; // Mostra algo enquanto carrega
  }

  if (showModal) {
    return (
      <AlertModalGeneric
        title="Acesso Negado"
        message="Você não tem permissão para acessar esta página."
        onClose={handleCloseModal} // Agora garantimos que ele some antes do redirect
        open={showModal}
      />
    );
  }

  return <>{children}</>;
};

export default ProtectedRouteAdminPage;
