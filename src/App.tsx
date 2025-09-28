import { AuthProvider, useAuth } from './contexts/AuthContext';
import Authentication from './components/Authentication';
import FinancialDashboard from './components/FinancialDashboard';
import './App.css';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: '#000000'
      }}>
        <div style={{ color: '#00FF99' }}>Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Authentication />;
  }

  return <FinancialDashboard />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
