import React, { useEffect, useState } from 'react';
import './TicketsPage.css'; 

function TicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [erro, setErro] = useState('');

  const fetchTickets = async () => {
    try {
      const response = await fetch('http://django-env.eba-rsmuqkjj.us-east-1.elasticbeanstalk.com/api/tickets/');
      const data = await response.json();
      setTickets(data.tickets);
    } catch (error) {
      setErro('Erro ao buscar tickets.');
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleValidate = (ticket) => {
    fetch('http://django-env.eba-rsmuqkjj.us-east-1.elasticbeanstalk.com/api/validar_bilhete/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ticket)
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        console.log('Ticket validated successfully');
        fetchTickets();  // Chamada para atualizar a lista de tickets
      } else {
        console.log('Error validating ticket:', data.error);
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  };

  if (erro) {
    return <div>Erro: {erro}</div>;
  }

  return (
    <div className="tickets-container">
      <header className="header">
        <h1>Tickets</h1>
      </header>
      <main className="main-content">
        <div className="tickets-list">
          {tickets.map((ticket, index) => (
            <div key={index} className="ticket-card">
              <p>Ticket ID: {ticket.ticket_id}</p>
              <p>Status: {ticket.status}</p>
              {ticket.viagem && (
                <>
                  <p>Origem: {ticket.viagem.origem}</p>
                  <p>Destino: {ticket.viagem.destino}</p>
                  <p>Data: {ticket.viagem.data}</p>
                  <p>Hora: {ticket.viagem.hora}</p>
                  <p>Valor: {ticket.viagem.valor}€</p>
                </>
              )}
              {ticket.status === 'Payed' && (
                <button className="validate-btn" onClick={() => handleValidate(ticket)}>Validar Bilhete</button>
              )}
            </div>
          ))}
        </div>
      </main>
      <footer className="footer">
        <p>© 2023 Bus Online. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

export default TicketsPage;
