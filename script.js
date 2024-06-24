window.onload = function() {
  console.log('Janela completamente carregada');
  
  const addToCartButton = document.querySelector('button[name="add"]');
  if (addToCartButton) {
    console.log('Botão "Adicionar ao carrinho" encontrado');
    
    const helloWorldText = document.createElement('div');
    helloWorldText.innerText = 'Olá mundo';
    addToCartButton.parentNode.insertBefore(helloWorldText, addToCartButton);
  } else {
    console.log('Botão "Adicionar ao carrinho" não encontrado');
  }
};
