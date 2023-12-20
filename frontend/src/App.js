import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import LoginPage from './LoginPage';
import MenuPage from './MenuPage';
import DetalhesViagemPage from './DetalhesViagemPage';
import TicketsPage from './TicketsPage';
import PagamentoPage from './PagamentoPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/viagem/:viagemId" element={<DetalhesViagemPage />} />
        <Route path="/tickets" element={<TicketsPage />} />
        <Route path="/pagamento/:id_viagem/:lugar_id" element={<PagamentoPage />} />
      </Routes>
    </Router>
  );
}

export default App;
