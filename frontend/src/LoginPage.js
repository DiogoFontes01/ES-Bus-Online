import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://django-env.eba-rsmuqkjj.us-east-1.elasticbeanstalk.com/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password
        }),
      });

      const data = await response.json();
      if (response.status === 200) {
        // Aqui você pode armazenar os tokens no localStorage, por exemplo
        localStorage.setItem('accessToken', data.access);
        localStorage.setItem('refreshToken', data.refresh);
        // Redireciona para a página /menu
        navigate('/menu');
      } else {
        setError(data.error || 'Erro ao fazer login');
      }
    } catch (error) {
      setError('Erro ao conectar ao servidor');
    }
  };

  return (
    <div className="loginpage-container">
      <header className="header">
        <h1>Entrar</h1>
      </header>
      <main className="main-content">
        <div className="login-card">
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="text"
            placeholder="Nome de utilizador"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input-field"
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
          />
          <button type="submit" className="submit-button">Entrar</button>
          {error && <p className="error-message">{error}</p>}
        </form>
        </div>
      </main>
      <footer className="footer">
        <p>© 2023 Bus Online. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

export default LoginPage;
