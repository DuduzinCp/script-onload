document.addEventListener('DOMContentLoaded', function() {
  const addToCartButton = document.querySelector('button[name="add"]');
  if (addToCartButton) {
    const helloWorldText = document.createElement('div');
    helloWorldText.innerText = 'Olá mundo';
    addToCartButton.parentNode.insertBefore(helloWorldText, addToCartButton);
  }
});
