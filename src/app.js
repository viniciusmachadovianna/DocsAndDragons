
async function loadSpells() {
  const response = await fetch('../data/spells.json');
  const spells = await response.json();
  return spells;
}

async function loadEquipments() {
  const response = await fetch('../data/equipments.json');
  const spells = await response.json();
  return spells;
}

async function loadClasses() {
  const response = await fetch('../data/classes.json');
  const spells = await response.json();
  return spells;
}

async function renderList() {
    const classes = await loadClasses();
    const equipments = await loadEquipments();
    const spells = await loadSpells();
    const codex = document.getElementById('codex');
    codex.innerHTML = '';

    classes.forEach(classInfo => {
        const card = `
        <div class="card">
            <h3>${classInfo.name}</h3>
            <p>hDie: ${classInfo.hitDie} - desc ${classInfo.description}</p>
        </div>
        `;
        
        codex.innerHTML += card;
    });

    equipments.forEach(equipmentInfo => {
        const card = `
        <div class="card">
            <h3>${equipmentInfo.name}</h3>
            <p>Nível: ${equipmentInfo.category} - ${equipmentInfo.damage}</p>
        </div>
        `;
        
        codex.innerHTML += card;
    });
    
    spells.forEach(spellInfo => {
        const card = `
        <div class="card">
            <h3>${spellInfo.name}</h3>
            <p>Nível: ${spellInfo.level} - ${spellInfo.school}</p>
        </div>
        `;
        
        codex.innerHTML += card;
    });
}

renderList();