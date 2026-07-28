const categories = ["spells","equipment","classes"]

async function loadCategoryItems(category) {

    const response = await fetch(`/data/${category}.json`);
    const items = await response.json();
    
    return items;
}

async function renderList() {
    
    const codex = document.getElementById('codex');
    codex.innerHTML = '';
    
    for (const category of categories) {
        
        const categoryItemsInfo =  await loadCategoryItems(category);
        
        for (const itemInfo of categoryItemsInfo) {
            let card = `<li> ${itemInfo.name} | ${itemInfo.codexCategory}</li>`;
            codex.innerHTML += card;
        }
    }
}

renderList();