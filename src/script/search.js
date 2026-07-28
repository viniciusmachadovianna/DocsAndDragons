
const DOM = {
    searchInput: document.getElementById("keyword"),
    codex: document.getElementById("codex"),
}

function normalizeText(txt) {
  return txt
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

let searchKeyword = DOM.searchInput.value;
// DOM.searchInput.addEventListener('input', handleSearchInput(searchKeyword))
