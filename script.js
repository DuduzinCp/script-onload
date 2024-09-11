// Adicionando o CSS dinamicamente
const style = document.createElement('style');
style.textContent = `
    .track-pkg-container * { box-sizing: border-box; }
    .track-pkg-container {
        font-family: Arial, sans-serif;
        max-width: 600px;
        margin: 20px auto;
        background-color: white;
        border-radius: 8px;
        padding: 20px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .track-pkg-header { text-align: center; margin-bottom: 20px; }
    .track-pkg-header h1 {
        font-size: 24px;
        color: #333;
        margin: 0;
    }
    .track-pkg-input-group {
        display: flex;
        margin-bottom: 20px;
    }
    .track-pkg-input {
        flex-grow: 1;
        padding: 10px;
        font-size: 16px;
        border: 1px solid #ddd;
        border-radius: 4px 0 0 4px;
    }
    .track-pkg-button {
        padding: 10px 20px;
        font-size: 16px;
        background-color: #0066cc;
        color: white;
        border: none;
        border-radius: 0 4px 4px 0;
        cursor: pointer;
    }
    .track-pkg-button:hover {
        background-color: #0052a3;
    }
    .track-pkg-timeline {
        position: relative;
        padding-left: 30px;
    }
    .track-pkg-timeline::before {
        content: '';
        position: absolute;
        left: 15px;
        top: 0;
        bottom: 0;
        width: 2px;
        background: #ffd700;
    }
    .track-pkg-event {
        position: relative;
        margin-bottom: 20px;
    }
    .track-pkg-event::before {
        content: '';
        position: absolute;
        left: -24px;
        top: 0;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: #ffd700;
        border: 2px solid white;
    }
    .track-pkg-event-content {
        background: #f9f9f9;
        padding: 10px;
        border-radius: 4px;
    }
    .track-pkg-event-title {
        font-weight: bold;
        color: #0066cc;
        margin: 0 0 5px 0;
    }
    .track-pkg-event-details {
        font-size: 14px;
        color: #666;
        margin: 0;
    }
    .track-pkg-event-date {
        font-size: 12px;
        color: #999;
        margin: 5px 0 0 0;
    }
    .track-pkg-loading {
        text-align: center;
        display: none;
    }
    .track-pkg-error {
        color: red;
        text-align: center;
        display: none;
    }
`;
document.head.appendChild(style);

// Adicionando o HTML dinamicamente
const container = document.createElement('div');
container.className = 'track-pkg-container';
container.innerHTML = `
    <div class="track-pkg-header">
        <h1>RIVYERA RASTREIO</h1>
    </div>
    <div class="track-pkg-input-group">
        <input type="text" id="track-pkg-number" class="track-pkg-input" placeholder="Digite o código de rastreio ou número do pedido">
        <button id="track-pkg-button" class="track-pkg-button">Rastrear</button>
    </div>
    <div id="track-pkg-loading" class="track-pkg-loading">Carregando...</div>
    <div id="track-pkg-error" class="track-pkg-error"></div>
    <div id="track-pkg-timeline" class="track-pkg-timeline"></div>
`;
document.body.appendChild(container);

// Adicionando a lógica do JavaScript
(function() {
    const trackButton = document.getElementById('track-pkg-button');
    const trackingNumberInput = document.getElementById('track-pkg-number');
    const timelineContainer = document.getElementById('track-pkg-timeline');
    const loadingElement = document.getElementById('track-pkg-loading');
    const errorMessageElement = document.getElementById('track-pkg-error');

    const shopDomain = 'rivyera.myshopify.com'; // Substitua pelo domínio da sua loja
    const accessToken = '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'; // Substitua pelo seu token de acesso

    trackButton.addEventListener('click', handleTrack);

    async function handleTrack() {
        const input = trackingNumberInput.value.trim();
        if (!input) {
            showError('Por favor, insira um código de rastreio ou número de pedido válido.');
            return;
        }

        showLoading(true);
        clearError();
        timelineContainer.innerHTML = '';

        try {
            if (isNaN(input)) {
                // Se não for um número, assume que é um código de rastreio
                await trackPackage(input);
            } else {
                // Se for um número, assume que é um número de pedido
                const trackingNumber = await getTrackingNumberFromOrder(input);
                if (trackingNumber) {
                    await trackPackage(trackingNumber);
                } else {
                    showError('Não foi possível encontrar um código de rastreio para este pedido.');
                }
            }
        } catch (error) {
            showError('Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente mais tarde.');
        } finally {
            showLoading(false);
        }
    }

    async function getTrackingNumberFromOrder(orderId) {
        try {
            const response = await fetch(`https://${shopDomain}/admin/api/2024-07/orders/${orderId}.json`, {
                headers: {
                    'X-Shopify-Access-Token': accessToken
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Dados do pedido:', data);

            const trackingNumber = data.order.fulfillments[0]?.tracking_number;

            if (trackingNumber) {
                console.log('Código de rastreio encontrado:', trackingNumber);
                return trackingNumber;
            } else {
                console.log('Nenhum código de rastreio encontrado no pedido');
                return null;
            }
        } catch (error) {
            console.error('Erro ao buscar o pedido:', error);
            throw error;
        }
    }

    async function trackPackage(trackingNumber) {
        try {
            const response = await fetch('https://api.ship24.com/public/v1/trackers/track', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer apik_MOYtmWdD3zFlvue2ErNdvf1VUxEWQx',
                },
                body: JSON.stringify({
                    trackingNumber: trackingNumber,
                }),
            });

            const data = await response.json();

            if (data.data && data.data.trackings && data.data.trackings[0].events && data.data.trackings[0].events.length > 0) {
                renderTimeline(data.data.trackings[0].events);
            } else {
                timelineContainer.innerHTML = '<p>Seu pedido está sendo preparado e logo será enviado.</p>';
            }
        } catch (error) {
            throw error;
        }
    }

    function renderTimeline(events) {
        events.forEach(event => {
            const eventElement = document.createElement('div');
            eventElement.className = 'track-pkg-event';
            eventElement.innerHTML = `
                <div class="track-pkg-event-content">
                    <p class="track-pkg-event-title">${event.status || 'Status não disponível'}</p>
                    <p class="track-pkg-event-details">${event.location || 'Localização não disponível'}</p>
                    <p class="track-pkg-event-date">
                        ${new Date(event.occurrenceDatetime).toLocaleDateString('pt-BR') || 'Data não disponível'}
                    </p>
                </div>
            `;
            timelineContainer.appendChild(eventElement);
        });
    }

    function showLoading(isLoading) {
        loadingElement.style.display = isLoading ? 'block' : 'none';
    }

    function showError(message) {
        errorMessageElement.textContent = message;
        errorMessageElement.style.display = 'block';
    }

    function clearError() {
        errorMessageElement.textContent = '';
        errorMessageElement.style.display = 'none';
    }
})();
