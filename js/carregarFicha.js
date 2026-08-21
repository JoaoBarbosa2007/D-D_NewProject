// ============================================================
// CARREGAR FICHA
// ============================================================

const charactersGrid = document.getElementById("charactersGrid");
const emptyCharacters = document.getElementById("emptyCharacters");

// ============================================================
// PEGAR DADOS SALVOS
// ============================================================

function getSavedCharacter() {
  const savedCharacter = localStorage.getItem("dndCharacter");

  if (!savedCharacter) {
    return null;
  }

  try {
    return JSON.parse(savedCharacter);
  } catch (error) {
    console.error("Erro ao carregar a ficha:", error);
    return null;
  }
}

// ============================================================
// CRIAR CARD
// ============================================================

function createCharacterCard(character) {
  const image = localStorage.getItem("dndCharacterImage") || "./img/icon.png";

  const name =
    character.characterName || character.name || "Personagem sem nome";

  const characterClass =
    character.characterClass || character.class || "Classe não definida";

  const level = character.level || "1";

  const card = document.createElement("article");

  card.className = "character-card";

  card.innerHTML = `
    <div class="character-card-image">
      <img
        src="${image}"
        alt="Retrato de ${name}"
      >
    </div>

    <div class="character-card-content">

      <h2>${name}</h2>

      <div class="character-card-info">
        <span>${characterClass}</span>
        <span>•</span>
        <span>Nível ${level}</span>
      </div>

      <div class="character-card-actions">

        <a
          class="button"
          href="./ficha.html"
        >
          Abrir ficha
        </a>

      </div>

    </div>
  `;

  return card;
}

// ============================================================
// RENDERIZAR
// ============================================================

function renderCharacters() {
  const character = getSavedCharacter();

  if (!character) {
    charactersGrid.innerHTML = "";

    emptyCharacters.style.display = "block";

    return;
  }

  emptyCharacters.style.display = "none";

  charactersGrid.innerHTML = "";

  const card = createCharacterCard(character);

  charactersGrid.appendChild(card);
}

// ============================================================
// INICIALIZAÇÃO
// ============================================================

renderCharacters();
