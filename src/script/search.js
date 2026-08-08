
// --- CONFIG --- //
const DOM = {
    searchInput: document.getElementById("keyword"),
    codex: document.getElementById("codex"),
}

// --- MAIN --- //

const activeFilters = new Set(["class", "equipment", "spell"]);

async function loadCategoryItems(category) {

    let origin = `/data/${category}.json`;
    const response = await fetch(origin);
    const items = await response.json();
    
    return items;
}

async function renderList() {
    
    const codex = document.getElementById('codex');
    codex.innerHTML = '';
    
    for (const category of activeFilters) {
        
        const categoryItemsInfo =  await loadCategoryItems(category);
        
        for (const itemInfo of categoryItemsInfo) {
            let card = `<li> ${itemInfo.name} | ${itemInfo.codexCategory}</li>`;
            codex.innerHTML += card;
        }
    }
}

renderList();

function filterItems(searchKeyword, categories=null){

  let searchTerm = normalizeText(searchKeyword);
}

// --- AUX --- //

function changeFilters(tgt){
    if (tgt.checked) {
      op = 'Adicionando';
      activeFilters.add(tgt.value)
    }
    else{
      op = 'Removendo';
      activeFilters.delete(tgt.value);
    }
    console.log(`${op} '${tgt.value}' à lista de categorias filtradas`);
    renderList();
}

function normalizeText(txt) {
  
  return txt
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

// --- HANDLERS --- //

const searchFilters = document.getElementById('searchbar').querySelectorAll('input[type=checkbox')

searchFilters.forEach(filter=> {
  let op = '';
  filter.addEventListener('change', (event) => changeFilters(event.target));
});

DOM.searchInput.addEventListener('input', (event) => {
  let searchKeyword = event.target.value;
  filterItems(searchKeyword);
});
;
