
// --- CONFIG --- //

const DOM = {
  searchInput: document.getElementById("keyword"),
  codex: document.getElementById("codex"),
  template: document.getElementById('card-template'),
  totalFound: document.getElementById('totalFound'),
  totalItens: document.getElementById('totalItens'),
}

const activeFilters = new Set(["classes", "equipment", "spells", "rules"]);

// --- MAIN --- //

async function loadCategoryItems(category) {

  try{
    let origin = `/data/${category}.json`;
    const response = await fetch(origin);
    const items = await response.json();

    return items;
  }
  catch(e){
    throw new Error(e);
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

  let totalItens = 0;
  for (const category of activeFilters) {
    const categoryItemsInfo = await loadCategoryItems(category);

    for (const itemInfo of categoryItemsInfo) {
      fragment.appendChild(createCard(itemInfo));
    }
    totalItens += categoryItemsInfo.length;
  }

  DOM.totalItens.textContent = totalItens;
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

  const categoryResults = await Promise.all([...activeFilters].map(loadCategoryItems));
  const items = categoryResults.flat();
  const results = filterItems(items, keyword);
  DOM.totalItens.textContent = results.length;

  renderSearchResults(results);
}

function filterItems(items, keyword) {
  return items.filter((item) => {
    const itemNormalizedName = normalizeText(item.name || '');
    const itemNormalizedDescription = normalizeText(item.description || '');
    return itemNormalizedName.includes(keyword) || itemNormalizedDescription.includes(keyword);
  });
}

// --- AUX --- //

function changeFilters(tgt) {
  if (tgt.checked) activeFilters.add(tgt.value);
  else activeFilters.delete(tgt.value);

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

renderDefaultCatalog();
