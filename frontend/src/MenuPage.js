import React, { useState } from 'react';
import './MenuPage.css';
import { Link, useNavigate } from 'react-router-dom';

function MenuPage() {
  const [viagens, setViagens] = useState([]);
  const [origem, setOrigem] = useState('');
  const [destino, setDestino] = useState('');
  const [erro, setErro] = useState('');
  const [dia, setDia] = useState('');
  const [mes, setMes] = useState('');
  const [ano, setAno] = useState('');


  // Use useNavigate para o redirecionamento
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setViagens([]); // Adiciona esta linha para limpar o estado viagens antes de fazer a busca
    try {
      const url = `http://django-env.eba-rsmuqkjj.us-east-1.elasticbeanstalk.com/api/menu?origem=${origem}&destino=${destino}&dia=${dia}&mes=${mes}&ano=${ano}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Falha ao buscar viagens');
      }
      const data = await response.json();
      if (data.length === 0) {
        setErro('Nenhuma viagem encontrada.');
      } else {
        setViagens(data);
      }
    } catch (error) {
      setErro(error.message);
    }
  };

  // Função para lidar com o logout
  const handleLogout = () => {
    // Redireciona para a página de início no logout
    navigate('/');
  };

  const renderViagens = () => {
    return viagens.map((viagem, index) => (
      <div key={index} className="viagem-card">
        <p><strong>Origem:</strong> {viagem.origem}</p>
        <p><strong>Destino:</strong> {viagem.destino}</p>
        <p><strong>Data:</strong> {viagem.data}</p>
        <p><strong>Hora:</strong> {viagem.hora.split(':')[0]}:{viagem.hora.split(':')[1]}</p>
        <p><strong>Valor:</strong> {viagem.valor}€</p>
        <button onClick={() => navigate(`/viagem/${viagem.id}`)} className="select-button">Selecionar Viagem</button>
      </div>
    ));
  };

  const [data, setData] = useState('');
  return (
    <div className="menu-container">
      <header className="header">
      <h1>Procurar Viagens</h1>
      </header>
      <main className="main-content">
      
      <div className="search-section">
        
      <form onSubmit={handleSubmit} className="search-form">
  <input
    type="text"
    value={origem}
    onChange={(e) => setOrigem(e.target.value)}
    placeholder="Origem"
    className="input-field"
  />
  <input
    type="text"
    value={destino}
    onChange={(e) => setDestino(e.target.value)}
    placeholder="Destino"
    className="input-field"
  />
  <div className="date-input-container">
  <input
    type="int"
    value={dia}
    placeholder="Dia"
    onChange={(e) => setDia(e.target.value)}
    className="input-data"
  />
  <input
    type="int"
    value={mes}
    placeholder="Mês"
    onChange={(e) => setMes(e.target.value)}
    className="input-data"
  />
  <input
    type="int"
    value={ano}
    placeholder="Ano"
    onChange={(e) => setAno(e.target.value)}
    className="input-data"
  />
  </div>
  <button type="submit" className="search-button">Procurar Viagens</button>
</form>

      {erro && <p className="error-message">{erro}</p>}
      
      </div>
      <div className="viagens-list">
        {renderViagens()}

      </div>
      </main>
      <button onClick={handleLogout} className="logout-button">Logout</button>
      <footer className="footer">
        <p>© 2023 Bus Online. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

export default MenuPage;