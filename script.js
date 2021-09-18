const olClass = '.cart__items';

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
  const pPrice = document.querySelector('p');
  const priceSplit = event.target.innerText.split('$');
  pPrice.innerText = (parseFloat(pPrice.innerText) - parseFloat(priceSplit[1]));
  event.target.parentNode.removeChild(event.target);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function saveData() {
  const ol4 = document.querySelector(olClass);
  const saveItens = localStorage.setItem('texto', ol4.innerHTML);
  return saveItens;
}

function saveData2() {
  const paragraphPrice = document.querySelector('.total-price');
  const saveCount = localStorage.setItem('count', paragraphPrice.innerText);
  return saveCount;
}

function createPriceParagraph() {
  const sectionDir = document.querySelector('.cart');
  const pPrice = document.createElement('p');
  pPrice.classList.add('total-price');
  sectionDir.appendChild(pPrice);
  pPrice.innerText = 0;
}

async function getCartApi(productID) {
  const dataCart = await fetch(`https://api.mercadolibre.com/items/${productID}`);
  const dataFull2 = await dataCart.json();
  const ol2 = document.querySelector(olClass);
  ol2.appendChild(createCartItemElement(
    { sku: dataFull2.id, name: dataFull2.title, salePrice: dataFull2.price },
    ));
  const pPric = document.querySelector('p');
  pPric.innerText = (parseFloat(pPric.innerText) + parseFloat(dataFull2.price));
  ol2.addEventListener('change', saveData());
  ol2.addEventListener('change', saveData2());
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

function createLoadingParagraph() {
  const body = document.querySelector('body');
  const pLoading = document.createElement('h1');
  pLoading.classList.add('loading');
  body.appendChild(pLoading);
  pLoading.innerText = 'Loading';
}

function removeLoadingParagraph() {
  const pLoading = document.querySelector('h1');
  pLoading.remove();
}

async function getFullApi() {
  createLoadingParagraph();
  const data = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const dataFull = await data.json();
  const arrayProdutos = getComputerApi(dataFull.results);
  arrayProdutos.forEach((product) => {
    const printProduct = createProductItemElement(product);
    const sectionProduct = document.querySelector('.items');
    sectionProduct.appendChild(printProduct);
  });
  removeLoadingParagraph();
}

function reloadItem() {
  const ol3 = document.querySelector(olClass);
  ol3.innerHTML = localStorage.getItem('texto');
  const li = document.querySelectorAll('.cart__item');
  li.forEach((singleLi) => {
    singleLi.addEventListener('click', cartItemClickListener);
  });
}

function reloadItem2() {
  const paragraphPrice = document.querySelector('.total-price');
  console.log(paragraphPrice.innerText);
  console.log(paragraphPrice);
  if (!paragraphPrice) {
    console.log('entrou');
    paragraphPrice.innerText = localStorage.getItem('count');
  }
}

function clearButton() {
  const clearBut = document.querySelector('.empty-cart');
  const ol5 = document.querySelector(olClass);
  clearBut.addEventListener('click', () => {
    while (ol5.firstChild) {
      ol5.removeChild(ol5.firstChild);
    }
  });
}

window.onload = () => {
  getFullApi();
  createPriceParagraph();
  reloadItem();
  reloadItem2();
  clearButton();
 };
