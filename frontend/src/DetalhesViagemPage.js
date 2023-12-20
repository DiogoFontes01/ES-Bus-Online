import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './DetalhesViagemPage.css'; 

function DetalhesViagemPage() {
  const [viagem, setViagem] = useState(null);
  const { viagemId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchViagemDetalhes = async () => {
      try {
        const response = await fetch(`http://django-env.eba-rsmuqkjj.us-east-1.elasticbeanstalk.com/api/viagem/${viagemId}`);
        
        if (!response.ok) {
          throw new Error(`Erro na resposta da API (status ${response.status})`);
        } 
  
        const data = await response.json();
        setViagem(data);
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchViagemDetalhes();
  }, [viagemId]);

  const comprarBilhete = async (e) => {
    e.preventDefault();
  
    const selectedRadioButton = document.querySelector('input[name="lugar_selecionado"]:checked');
    if (!selectedRadioButton) {
      alert('Por favor, selecione um lugar.');
      return;
    }
  
    const selectedLugar = selectedRadioButton.value;
  
    const response = await fetch(`http://django-env.eba-rsmuqkjj.us-east-1.elasticbeanstalk.com/api/comprar_bilhete/${viagemId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ selectedLugar }),
    });
  
    if (response.ok) {
      navigate(`/pagamento/${viagemId}/${selectedLugar}`);
    } else {
      // Trate possíveis erros na requisição
    }
  };

  if (!viagem) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="detalhes-viagem-container" >
      <header className="header">
      <h1>Detalhes da Viagem</h1>
      </header>
      <main className="main-content">
      <div className="viagem-card">
      <p><strong>Origem:</strong> {viagem.origem}</p>
      <p><strong>Destino:</strong> {viagem.destino}</p>
      <p><strong>Data:</strong> {viagem.data}</p>
      <p><strong>Hora:</strong> {viagem.hora}</p>
      <p><strong>Preço:</strong> {viagem.valor}€</p>

      <h2>Lugares Disponíveis</h2>
<form onSubmit={comprarBilhete} className="lugares-form">
  <div className="lugares-disponiveis">
    <div className="autocarro">
      {viagem.lugares_de_autocarros && viagem.lugares_de_autocarros.map((lugar_disponivel, index) => (
        <div className={`lugar ${lugar_disponivel ? 'disponivel' : 'indisponivel'}`} key={index}>
          <label>
            <input type="radio" name="lugar_selecionado" value={index + 1} />
            <span className="assento">{index + 1}</span>
          </label>
        </div>
      ))}
    </div>
  </div>
  <button type="submit" id="comprar-btn">Comprar Bilhete</button>
</form>

      </div>
      <button onClick={() => navigate(-1)} className="voltar-btn">Voltar para o Menu</button>
      </main>
      <footer className="footer">
        <p>© 2023 Bus Online. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

export default DetalhesViagemPage;