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
// ESCAPAR HTML
// ============================================================

function escapeHtml(value) {
  const element = document.createElement("div");
  element.textContent = value ?? "";
  return element.innerHTML;
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
        src="${escapeHtml(image)}"
        alt="Retrato de ${escapeHtml(name)}"
      >
    </div>

    <div class="character-card-content">

      <h2>${escapeHtml(name)}</h2>

      <div class="character-card-info">
        <span>${escapeHtml(characterClass)}</span>
        <span>•</span>
        <span>Nível ${escapeHtml(level)}</span>
      </div>

      <div class="character-card-actions">

        <a
          class="button"
          href="./ficha.html"
        >
          Abrir ficha
        </a>

        <button class="danger delete-character" type="button">
          Excluir
        </button>

      </div>

    </div>
  `;

  return card;
}

// ============================================================
// DELETAR FICHA
// ============================================================

function deleteCharacter() {
  const character = getSavedCharacter();

  const name =
    character?.characterName || character?.name || "esta ficha";

  const confirmed = confirm(`Deseja excluir "${name}"? Essa ação não pode ser desfeita.`);

  if (!confirmed) return;

  localStorage.removeItem("dndCharacter");
  localStorage.removeItem("dndCharacterImage");

  renderCharacters();
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

  bindCharacterActions();
}

// ============================================================
// AÇÕES DO CARD
// ============================================================

function bindCharacterActions() {
  document.querySelectorAll(".delete-character").forEach((button) => {
    button.addEventListener("click", deleteCharacter);
  });
}

// ============================================================
// BOTÃO "DELETAR" DO CABEÇALHO
// ============================================================

const headerDeleteBtn = document.getElementById("DeleteBtn");

if (headerDeleteBtn) {
  headerDeleteBtn.addEventListener("click", deleteCharacter);
}

// ============================================================
// INICIALIZAÇÃO
// ============================================================

renderCharacters();
