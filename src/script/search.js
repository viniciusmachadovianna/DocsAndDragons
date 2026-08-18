
// --- CONFIG --- //

const DOM = {
  searchInput: document.getElementById("keyword"),
  codex: document.getElementById("codex"),
  template: document.getElementById('card-template'),
  totalFound: document.getElementById('totalFound'),
  totalItens: document.getElementById('totalItens'),
}

const activeFilters = new Set(["classes", "equipment", "spells", "rules"]);
let database = []
// --- MAIN --- //

async function initApp(){

  await loadCategoryItems();
  renderDefaultCatalog();
}

async function loadCategoryItems() {

    for (const category of activeFilters) {
    const response = await fetch(`/data/${category}.json`);
    const items = await response.json();

    database.push(...items);
  }
}

function createCard(item){

  const cardClone = DOM.template.content.cloneNode(true);
  const article = cardClone.querySelector('.card');
  const titleNode = cardClone.querySelector('.card__title');
  const badgeNode = cardClone.querySelector('.card__category');
  const descriptionNode = cardClone.querySelector('.card__description');

  if (titleNode) titleNode.textContent = item.name || '';
  if (badgeNode) badgeNode.textContent = item.codexCategory || '';
  if (descriptionNode) descriptionNode.textContent = item.description || '';

  if (article) {
    const categoryKey = (item.codexCategory || item.category || 'item').toLowerCase();
    article.classList.add(`card--${categoryKey}`);
  }

  return cardClone;
}

async function renderDefaultCatalog() {

  const fragment = document.createDocumentFragment();

  for (const item of database) {
    fragment.appendChild(createCard(item));
  }

  DOM.totalItens.textContent = database.length;
  DOM.codex.replaceChildren(fragment);
}

async function renderSearchResults(results = []) {

  DOM.codex.innerHTML = '';

  if (!Array.isArray(results) || results.length === 0) {
    return;
  }

  const fragment = document.createDocumentFragment();
  
  for (const result of results) {
    fragment.appendChild(createCard(result));
  }
  
  DOM.totalFound.textContent = results.length;
  DOM.codex.appendChild(fragment);
}

async function handleSearchInput(rawKeyword) {
  const keyword = normalizeText(rawKeyword.trim());

  if (!keyword) {
    renderDefaultCatalog();
    return;
  }

  if (keyword.length < 3) {
    DOM.codex.innerHTML = '';
    return;
  }

  const results = filterItems(keyword);
  DOM.totalFound.textContent = results.length;
  DOM.totalItens.textContent = results.length;


  renderSearchResults(results);
}

function filterItems(keyword) {
  
  return database.filter((item) => {
    const itemNormalizedName = normalizeText(item.name || '');
    const itemNormalizedDescription = normalizeText(item.description || '');
    return itemNormalizedName.includes(keyword) || itemNormalizedDescription.includes(keyword);
  });
}

// --- AUX --- //

async function changeFilters(tgt) { //checkboxes bugadas
  if (tgt.checked) activeFilters.add(tgt.value);
  else activeFilters.delete(tgt.value);

  await loadCategoryItems();

  const keyword = DOM.searchInput.value.trim();

  if (keyword && normalizeText(keyword).length >= 3) {
    handleSearchInput(keyword);
    return;
  }

  renderDefaultCatalog();
}

function normalizeText(txt) {
  return String(txt)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function escapeHtml(input) {
  return String(input)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// --- HANDLERS --- //

const searchFilters = document.getElementById('searchbar').querySelectorAll('input[type=checkbox]');

searchFilters.forEach((filter) => {
  filter.addEventListener('change', (event) => changeFilters(event.target));
});

let timer;
DOM.searchInput.addEventListener('input', (event) => {
  clearTimeout(timer);
  timer = setTimeout(() => handleSearchInput(event.target.value), 300);
});

initApp();
