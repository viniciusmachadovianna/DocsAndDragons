
// --- CONFIG --- //

const DOM = {
  searchInput: document.getElementById("keyword"),
  codex: document.getElementById("codex"),
}

const activeFilters = new Set(["classes", "equipment", "spells"]);

// --- MAIN --- //

async function loadCategoryItems(category) {

  try{
    let origin = `/data/codexCategories/${category}.json`;
    const response = await fetch(origin);
    const items = await response.json();

    return items;
  }
  catch(e){
    throw new Error(e);
  }
    
}

async function renderList(results=null) {

  if (!DOM.codex) return;

  if (DOM.searchInput.value.length > 0 && DOM.searchInput.value.length < 3) {
    return;
  }

  DOM.codex.innerHTML = '';
  if (results){
    console.log(results);
    const html = results.map(item => {
      const name = escapeHtml(item.name);
      return `<li> ${item.name} | ${item.codexCategory}</li>`;
    }).join('');

    DOM.codex.innerHTML = html;
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

  renderList(results, keyword);
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

DOM.searchInput.addEventListener('input', (event) => {
  handleSearchInput(event.target.value);
});
;

renderList();
