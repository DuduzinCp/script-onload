const addToCartButton = document.querySelector('button[name="add"]');
if (addToCartButton) {
  console.log('Botão "Adicionar ao carrinho" encontrado');
  
  // Cria um contêiner para o PreviewKit
  const previewKitContainer = document.createElement('div');
  previewKitContainer.innerHTML = `
    <style>
      body {
        font-family: Arial, sans-serif;
      }

      .cardOfertas {
        margin-bottom: 10px;
      }
      
      .containerOfertas {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      
      .headerOfertas {
        display: flex;
        align-items: center;
      }
      
      .flex-grow {
        flex: 1 1 0%;
      }
      
      .margin-x {
        margin-left: 8px;
        margin-right: 8px;
      }
      
      .titleOfertas {
        font-size: 14px;
        font-weight: 600;
      }
      
      .dividerOfertas {
        background-color: black;
        width: 100%;
        height: 2px;
      }

      .cardOferta {
        display: flex;
        align-items: center;
        padding: 10px;
        border: 1px solid black;
        border-radius: 8px;
        cursor: pointer;
      }

      .priceOferta {
        flex: 1 1 0%;
      }
    </style>
    <div class="cardOfertas">
      <div class="containerOfertas">
        <div class="headerOfertas">
          <div class="flex-grow">
            <div class="dividerOfertas"> </div>
          </div>
          <h2 class="margin-x titleOfertas">Leve mais Pagando Menos</h2>
          <div class="flex-grow">
            <div class="dividerOfertas"> </div>
          </div>
        </div>
        <label class="cardOferta">
          <input type="radio" name="price-options" value="10">
          <div class="priceOferta">
            <div>
              <span>R$10,00</span>
            </div>
            <div>
              <p>SubTitulo</p>
              <span>R$10,00</span>
            </div>
          </div>
        </label>
      </div>
    </div>
  `;
  // Insere o contêiner acima do botão "Adicionar ao carrinho"
  addToCartButton.parentNode.insertBefore(previewKitContainer, addToCartButton);
} else {
  console.log('Botão "Adicionar ao carrinho" não encontrado');
}
