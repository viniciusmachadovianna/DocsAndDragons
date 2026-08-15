
// --- CONFIG --- //

const DOM = {
  searchInput: document.getElementById("keyword"),
  codex: document.getElementById("codex"),
  template: document.getElementById('card-template'),
}

const activeFilters = new Set(["classes", "equipment", "spells"]);

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

  cardClone.querySelector('.card__title').textContent = item.name;
  cardClone.querySelector('.card__badge').textContent = item.category || '';
  cardClone.querySelector('.card__description').textContent = item.description || '';

  if (article) {
    article.classList.add(`card--${String(item.category || 'item').toLowerCase()}`);
  }

  return cardClone;

}

async function renderList(results=null) {

  if (DOM.searchInput.value.length > 0 && DOM.searchInput.value.length < 3) {
    return;
  }

  DOM.codex.innerHTML = '';

  if (results){

    const fragment = document.createDocumentFragment();

    for (const result of results) {
      const cardClone = createCard(result);
      
      fragment.appendChild(cardClone);
    };

    DOM.codex.appendChild(fragment);
    return;
  }
  else{
    for (const category of activeFilters) {
      
      const categoryItemsInfo =  await loadCategoryItems(category);
      
      for (const itemInfo of categoryItemsInfo) {
        let card = `<li> ${itemInfo.name} | ${itemInfo.codexCategory}</li>`;
        DOM.codex.innerHTML += card;
      }
    }
  }
}

async function handleSearchInput(rawKeyword){
  
  const keyword = normalizeText(rawKeyword);
  const categoryResults = await Promise.all([...activeFilters].map(loadCategoryItems));
  const items = categoryResults.flat();

  let results = filterItems(items, keyword);

  renderList(results);
}

function filterItems(items, keyword){

  return items.filter(item => {
    const itemNormalizedName = normalizeText(item.name || "");
    return itemNormalizedName.includes(keyword);
  });
}

// --- AUX --- //

function changeFilters(tgt){

  //TODO deve respeitar o input
    if (tgt.checked) activeFilters.add(tgt.value);
    else activeFilters.delete(tgt.value);
    renderList();
}

function normalizeText(txt) {
  
  return txt
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
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

const searchFilters = document.getElementById('searchbar').querySelectorAll('input[type=checkbox]')

searchFilters.forEach(filter=> {
  filter.addEventListener('change', (event) => changeFilters(event.target));
});

let timer;
DOM.searchInput.addEventListener('input', (event) => {
  clearTimeout(timer);
  timer = setTimeout(() => handleSearchInput(event.target.value), 300);
});

renderList(); //comment to see html card template
