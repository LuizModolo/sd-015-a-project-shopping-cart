function getComputerApi(result) {
  return result.reduce((obj, actual) => {
    let finalObj = obj;
    finalObj = [...finalObj, { sku: actual.id, name: actual.title, image: actual.thumbnail }];
    return finalObj;
  }, []);
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function cartItemClickListener(event) {
  // coloque seu código aqui

}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function getCartApi(productID) {
  const dataCart = await fetch(`https://api.mercadolibre.com/items/${productID}`);
  const dataFull2 = await dataCart.json();
  const ol = document.querySelector('ol');
  ol.appendChild(createCartItemElement({ sku: dataFull2.id, name: dataFull2.title, salePrice: dataFull2.price }));
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  if (element === 'button') {
    e.className = className;
    e.innerText = innerText;
    e.addEventListener('click', (event) => {
      getCartApi(event.target.parentNode.querySelector('.item__sku').innerText);
    });
    return e;
  }
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
}

async function getFullApi() {
  const data = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const dataFull = await data.json();
  const arrayProdutos = getComputerApi(dataFull.results);
  arrayProdutos.forEach((product) => {
    const printProduct = createProductItemElement(product);
    const sectionProduct = document.querySelector('.items');
    sectionProduct.appendChild(printProduct);
  });
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

window.onload = () => {
  getFullApi();
 };
