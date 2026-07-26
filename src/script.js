function log(msg){
    console.log(msg)
}

const SEARCH_KEYWORD = document.getElementById("keyword")
SEARCH_KEYWORD.addEventListener('input', () => log(SEARCH_KEYWORD.value))

async function loadSpells() {
  const resposta = await fetch('../data/spells.json');
  const spells = await resposta.json();
  return spells;
}

async function renderizarLista() {
  const spells = await loadSpells();
  const codex = document.getElementById('codex');
  codex.innerHTML = '';

  spells.forEach(spell => {
    const card = `
      <div class="card">
        <h3>${spell.name}</h3>
        <p>Nível: ${spell.level} - ${spell.school}</p>
      </div>
    `;
    
    codex.innerHTML += card;
  });
}

renderizarLista();
