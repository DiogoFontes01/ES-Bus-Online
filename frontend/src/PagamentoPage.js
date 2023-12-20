import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './PagamentoPage.css'; 

function PagamentoPage() {
    const { id_viagem, lugar_id } = useParams();
    const navigate = useNavigate();
    const [mostrarQrCode, setMostrarQrCode] = useState(false);

    const confirmarPagamento = async () => {
      try {
        const response = await fetch('http://django-env.eba-rsmuqkjj.us-east-1.elasticbeanstalk.com/atualizar_lugar/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ lugar_id: lugar_id, viagem_id: id_viagem })
        });

        const data = await response.json();
        if (data.success) {
          alert(data.message);
          setMostrarQrCode(true);
        } else {
          alert(data.error);
        }
      } catch (error) {
        console.error('Erro:', error);
      }
    };

    return (
      <div className="pagamento-container">
        <header className="header">
          <h1>Pagamento do Bilhete</h1>
        </header>
        <main className="main-content">
          <div className="pagamento-card">
            <p>Você selecionou o Lugar {lugar_id} da viagem com id {id_viagem}.</p>
            {!mostrarQrCode && (
              <button className="pagar-btn" onClick={confirmarPagamento}>PAGAR</button>
            )}
            {mostrarQrCode && (
              <div className="qr-code-container">
                <img src="/qr_code.png" alt="QR Code" />
                <p>Download do QR completo para o seu dispositivo. Deverá encontrar nas transferências.</p>
              </div>
            )}
          </div>
          <button onClick={() => navigate('/menu')} className="voltar-btn">MENU</button>
        </main>
        <footer className="footer">
          <p>© 2023 Bus Online. Todos os direitos reservados.</p>
        </footer>
      </div>
    );
}

export default PagamentoPage;