
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css'; // Importe seu CSS aqui


function HomePage() {
  let navigate = useNavigate();

  return (
    <div className="homepage-container">
      <header className="header">
        <h1>Bem-vindo ao Bus Online</h1>
      </header>
      <main className="main-content">
        <section className="info-section">
          <p>Descubra as rotas mais rápidas e compre os seus bilhetes facilmente.</p>
        </section>
        <section className="button-section">
          <button className="button login" onClick={() => navigate('/login')}>Entrar</button>
          <button className="button tickets" onClick={() => navigate('/tickets')}>Bilhetes</button>
        </section>
        <img src="/bus.jpg" alt="Ônibus" />
      </main>
      <footer className="footer">
        <p>© 2023 Bus Online. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

export default HomePage;
