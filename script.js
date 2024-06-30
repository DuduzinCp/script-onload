// UTILS FUNCS
function formatToBRL(value) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

function calculateKitPrice(kit, productPrice) {
  const basePrice = productPrice * (kit.quantity || 1);
  if (kit.priceType === 'default') {
    return basePrice;
  } else if (kit.priceType === 'percentage') {
    return basePrice - (basePrice * (Number(kit.discountPercentage) / 100));
  } else if (kit.priceType === 'custom') {
    return Number(kit.customPrice);
  }
  return basePrice; // Retorna o preço base por padrão
}

// Função para inicializar os selects de variantes
async function initializeVariantSelects(productData) {
  let variants = productData.variants;
  let variantAttributes = {};

  productData.options.forEach(option => {
    variantAttributes[option.name] = option.values;
  });

  return { variantAttributes, variants };
}

// Função para criar o contêiner do PreviewKit
function createPreviewKitContainer(variantAttributes, offer, kits, productPrice) {
  console.log('BorderRadios Offer:', offer)
  const previewKitContainer = document.createElement('div');
  previewKitContainer.innerHTML = `
    <style>
      body {
        font-family: Arial, sans-serif;
      }

      .card-ofertas {
        margin-bottom: 10px;
      }
      
      .container-ofertas {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      
      .header-ofertas {
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
      
      .title-ofertas {
        font-size: 14px;
        font-weight: 600;
      }
      
      .divider-ofertas {
        background-color: black;
        width: 100%;
        height: 2px;
      }

      .card-oferta {
        display: flex;
        flex-direction: column;
        padding: 10px;
        border: 1px solid black;
        border-radius: ${offer.border}px;
        border-color: ${offer.borderColor};
        cursor: pointer;
        position: relative;
      }

      .card-oferta-container {
        display: flex;
        align-items: center;
        padding-top: 10px;
      }

      .price-oferta {
        flex: 1 1 0%;
        padding-left: 10px;
        padding-right: 10px;
      }

      .card-oferta .flex {
        display: flex;
      }

      .card-oferta .items-center {
        align-items: center;
      }

      .card-oferta .padding-2 {
        padding: 8px;
      }

      .card-oferta .rounded-full {
        border-radius: 50%;
      }

      .card-oferta .border-2 {
        border-width: 2px;
      }

      .card-oferta .cursor-pointer {
        cursor: pointer;
      }

      .card-oferta .flex-1 {
        flex: 1;
      }

      .card-oferta .justify-between {
        justify-content: space-between;
      }

      .card-oferta .gap-2 {
        gap: 8px;
      }

      .card-oferta .font-bold {
        font-weight: bold;
      }

      .card-oferta .text-xs {
        font-size: 12px;
      }

      .card-oferta .padding-x-2 {
        padding-left: 8px;
        padding-right: 8px;
      }

      .card-oferta .padding-y-1 {
        padding-top: 4px;
        padding-bottom: 4px;
      }

      .card-oferta .rounded {
        border-radius: 4px;
      }

      .card-oferta .text-sm {
        font-size: 14px;
      }

      .card-oferta .line-through {
        text-decoration: line-through;
      }

      .etiqueta-oferta {
        font-size: 12px;
        background-color: #f0f0f0;
        padding-left: 8px;
        padding-right: 8px;
        padding-top: 4px;
        padding-bottom: 4px;
        border-radius: 4px;
      }

      .variant-container {
        margin-top: 8px;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .variant-select {
        width: 100%;
        height: 30px;
      }

      .keys-container {
        display: flex;
        gap: 4px;
      }

      .badge-mais-vendido {
        position: absolute;
        top: -4px;
        right: 4px;
        background-color: ${offer.badgeBackgroundColor};
        color: ${offer.badgeColor};
        padding: 2px 8px;
        font-size: 10px;
        font-weight: bold;
        border-radius: 4px;
      }
    </style>
    <div class="card-ofertas">
      <div class="container-ofertas">
        <div class="header-ofertas">
          <div class="flex-grow">
            <div class="divider-ofertas"> </div>
          </div>
          <h2 class="margin-x title-ofertas" style="color: ${offer.titleColor}; font-size: ${offer.fontSize}px;">${offer.title}</h2>
          <div class="flex-grow">
            <div class="divider-ofertas"> </div>
          </div>
        </div>
        ${kits.map(kit => `
          <label class="card-oferta" style="background-color: ${offer.cardsBackground}; position: relative;">
            ${kit.selectedByDefault === 'true' ? '<span class="badge-mais-vendido">MAIS VENDIDO</span>' : ''}
            <div class="card-oferta-container">
              <input type="radio" name="price-options" ${kit.selectedByDefault === 'true' ? 'checked' : ''} value="${calculateKitPrice(kit, productPrice)}">
              <div class="price-oferta">
                <div class="flex justify-between items-center">
                  <div class="flex gap-2 items-center">
                    <span class="font-bold" style="color: ${offer.titleColor}; font-size: ${offer.fontSize}px;">${kit.title}</span>
                    ${kit.label ? `<span class="etiqueta-oferta" style="background-color: ${offer.labelBackgroundColor}; color: ${offer.labelColor};">${kit.label}</span>` : ''}
                  </div>
                  <span class="font-bold" style="color: ${offer.priceColor}; font-size: ${offer.fontSize}px;">
                    ${formatToBRL(calculateKitPrice(kit, productPrice))}
                  </span>
                </div>
                <div class="flex justify-between items-center text-sm" style="color: ${offer.subtitleColor};">
                  <span>${kit.subtitle}</span>
                  <span class="line-through" style="color: ${offer.discountPriceColor};">
                    ${kit.priceType === 'percentage' ? formatToBRL(productPrice * (kit.quantity || 1)) : ''}
                  </span>
                </div>
              </div>
            </div>
            ${Array.from({ length: kit.quantity || 1 }, (_, index) => `
              <div class="variant-container">
                <p>#${index + 1}</p>
                ${Object.keys(variantAttributes).map(attributeName => `
                  <select name="${attributeName}_${index + 1}" class="variant-select">
                    ${variantAttributes[attributeName].map(attributeValue => `
                      <option value="${attributeValue}">${attributeValue}</option>
                    `).join('')}
                  </select>
                `).join('')}
              </div>
            `).join('')}
          </label>
        `).join('')}
      </div>
    </div>
  `;

  return previewKitContainer;
}

// Função para buscar as ofertas do produto
async function fetchOffers(productId) {
  try {
    const response = await fetch(`https://ripe-loans-coast-phases.trycloudflare.com/api/offers?productId=${encodeURIComponent(productId)}`);
    if (!response.ok) {
      throw new Error('Erro ao buscar ofertas');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao buscar ofertas:', error);
    return null;
  }
}

// Função para pegar o preço do produto
function getProductPrice(productData) {
  const salePriceNumber = productData.price / 100; // Convertendo de centavos para reais
  return salePriceNumber;
}

// Função principal
async function main() {
  const productId = document.querySelector('input[name="id"]').value;
  console.log('ID do produto:', productId);

  // buscar as informações do produto
  let productData;
  try {
    // Obter o handle do produto (assumindo que está disponível em algum lugar da página)
    const productHandle = document.querySelector('meta[property="og:url"]').content.split('/').pop();
    console.log('productHandle:', productHandle);

    // Fazer a requisição usando a URL correta
    const response = await fetch(`/products/${productHandle}.js`);
    if (!response.ok) {
      throw new Error('Erro ao buscar informações do produto');
    }
    productData = await response.json();
    console.log('Informações do produto:', productData);
  } catch (error) {
    console.error('Erro ao buscar informações do produto:', error);
    return;
  }

  // buscar as ofertas configuradas para este produto
  console.log('Buscando ofertas para o produto:', productData.title);
  const data = await fetchOffers(productData.id);
  const offer = data.offer;

  if (!offer || !offer.kits) {
    console.log('Nenhuma oferta encontrada para este produto');
    return;
  }
  console.log('Ofertas encontradas:', data);

  console.log('Kits:', offer?.kits);

  console.log('Inicializando selects de variantes para o produto:', productData.id);
  const { variantAttributes, variants } = await initializeVariantSelects(productData);
  console.log('Atributos das variantes:', variantAttributes);

  const addToCartButton = document.querySelector('button[name="add"]');

  const productPrice = getProductPrice(productData);
  console.log('Preço do produto:', productPrice);

  if (addToCartButton) {
    console.log('Botão "Adicionar ao carrinho" encontrado');
    const previewKitContainer = createPreviewKitContainer(variantAttributes, offer, offer?.kits, productPrice);
    addToCartButton.parentNode.insertBefore(previewKitContainer, addToCartButton);

    // Clonar o botão "Adicionar ao carrinho"
    const newAddToCartButton = addToCartButton.cloneNode(true);
    newAddToCartButton.addEventListener('click', async (event) => {
      event.preventDefault();
      const selectedKit = document.querySelector('input[name="price-options"]:checked');
      if (selectedKit) {
        const kit = offer.kits.find(k => calculateKitPrice(k, productPrice) === parseFloat(selectedKit.value) || (selectedKit.value === 'default' && k.priceType === 'default'));
        if (kit) {
          // Seleciona apenas os contêiners de variante que estão no kit
          const kitVariantContainers = selectedKit.closest('.card-oferta').querySelectorAll('.variant-container');
          console.log('kitVariantContainers:', kitVariantContainers);
          for (let i = 0; i < (kit.quantity || 1); i++) {
            const variantSelections = {};
            kitVariantContainers[i].querySelectorAll('select').forEach(select => {
              console.log('Select Name:', select.name);
              const attributeName = select.name.split('_')[0]; // Extrai o nome original do atributo
              variantSelections[attributeName] = select.value;
            });
            console.log('Variant Selections:', variantSelections);

            // Adicionar ao carrinho
            const variantId = variants.find(variant => {
              const variantOptions = variant.options.join(' / ');
              const selectionOptions = Object.values(variantSelections).join(' / ');
              return variantOptions === selectionOptions;
            })?.id;
            console.log('ID da variante selecionada:', variantId);
            if (variantId) {
              console.log('Adicionando ao carrinho...');
              await fetch('/cart/add.js', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  items: [{
                    id: variantId,
                    quantity: 1,
                  }],
                }),
              });
              console.log('Produto adicionado ao carrinho com sucesso!');
            }
          }
        }
      }
    });
    addToCartButton.parentNode.replaceChild(newAddToCartButton, addToCartButton);
  } else {
    console.log('Botão "Adicionar ao carrinho" não encontrado');
  }
}

// Executa a função principal
main();
