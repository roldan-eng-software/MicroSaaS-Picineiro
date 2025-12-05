import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from './store/authStore';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import SuperuserDashboardPage from './pages/dashboard/SuperuserDashboardPage';
import UserManagementPage from './pages/admin/UserManagementPage'; // Import UserManagementPage
import GlobalSettingsPage from './pages/admin/GlobalSettingsPage'; // Import GlobalSettingsPage
import SystemLogsPage from './pages/admin/SystemLogsPage'; // Import SystemLogsPage
import LandingPage from './pages/landing/LandingPage'; // Import LandingPage

// Componente para decidir qual dashboard mostrar
function DashboardRouter() {
  const { user } = useAuthStore();

  if (!user) {
    // Isso não deveria acontecer se ProtectedRoute funcionar, mas é um fallback
    return <Navigate to="/login" replace />;
  }

  return user.is_superuser ? <SuperuserDashboardPage /> : <DashboardPage />;
}

function ProtectedRoute() {
  const { isAuthenticated, token, fetchUser, user } = useAuthStore();
  const storedToken = localStorage.getItem('token');
  
  useEffect(() => {
    // Se há um token e o usuário ainda não foi carregado, tenta buscar
    if (storedToken && !user && !isAuthenticated) {
      fetchUser();
    }
  }, [storedToken, user, isAuthenticated, fetchUser]);

  // Se não está autenticado e não há token armazenado, redireciona para login
  if (!isAuthenticated && !storedToken) {
    return <Navigate to="/login" replace />;
  }

  // Se está autenticado mas o usuário ainda não foi carregado (fetchUser em andamento)
  if (isAuthenticated && !user) {
    return <div>Loading user data...</div>; // Ou um indicador de carregamento
  }

  // Se está autenticado e o usuário foi carregado, renderiza os filhos (DashboardRouter)
  return <Outlet />;
}


function App() {
  const { token, fetchUser, isAuthenticated } = useAuthStore(); // Adicionar isAuthenticated aqui

  // Tenta buscar o usuário na montagem inicial se houver token
  useEffect(() => {
    if (token) {
      fetchUser();
    }
  }, [token, fetchUser]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Rota para a Landing Page (não autenticados) ou redirecionamento para o Dashboard (autenticados) */}
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />} />
        
        {/* Rotas protegidas */}
        <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardRouter />} /> {/* Usa o DashboardRouter aqui */}
            <Route path="/admin/users" element={<UserManagementPage />} /> {/* Nova rota para gerenciamento de usuários */}
            <Route path="/admin/settings" element={<GlobalSettingsPage />} /> {/* Nova rota para configurações globais */}
            <Route path="/admin/system-logs" element={<SystemLogsPage />} /> {/* Nova rota para logs do sistema */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
