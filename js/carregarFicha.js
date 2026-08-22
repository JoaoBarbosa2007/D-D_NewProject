// ============================================================
// CARREGAR FICHAS
// ============================================================
// Agora o sistema trabalha com uma lista de fichas.
// Cada ficha possui um ID próprio e sua própria imagem.
// A chave dndActiveCharacterId informa qual ficha está aberta.
// ============================================================

const charactersGrid = document.getElementById("charactersGrid");
const emptyCharacters = document.getElementById("emptyCharacters");

// ============================================================
// ARMAZENAMENTO
// ============================================================

const CHARACTERS_KEY = "dndCharacters";
const ACTIVE_CHARACTER_KEY = "dndActiveCharacterId";

function getSavedCharacters() {
  try {
    const saved = JSON.parse(localStorage.getItem(CHARACTERS_KEY) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch (error) {
    console.error("Erro ao carregar fichas:", error);
    return [];
  }
}

// Migra automaticamente a ficha antiga, caso exista.
function migrateOldCharacter() {
  const characters = getSavedCharacters();

  if (characters.length > 0) {
    return characters;
  }

  const oldCharacter = localStorage.getItem("dndCharacter");

  if (!oldCharacter) {
    return [];
  }

  try {
    const data = JSON.parse(oldCharacter);

    const migrated = [{
      id: crypto.randomUUID ? crypto.randomUUID() : `character-${Date.now()}`,
      data,
      image: localStorage.getItem("dndCharacterImage") || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }];

    localStorage.setItem(CHARACTERS_KEY, JSON.stringify(migrated));
    localStorage.setItem(ACTIVE_CHARACTER_KEY, migrated[0].id);

    localStorage.removeItem("dndCharacter");
    localStorage.removeItem("dndCharacterImage");

    return migrated;
  } catch (error) {
    console.error("Erro ao migrar a ficha antiga:", error);
    return [];
  }
}

function setActiveCharacter(id) {
  localStorage.setItem(ACTIVE_CHARACTER_KEY, id);
}

function clearActiveCharacter() {
  localStorage.removeItem(ACTIVE_CHARACTER_KEY);
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
  const data = character.data || character;

  const image = character.image || "./img/icon.png";

  const name =
    data.characterName || data.name || "Personagem sem nome";

  const characterClass =
    data.characterClass || data.class || "Classe não definida";

  const level = data.level || "1";

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
        <button
          class="button open-character"
          type="button"
          data-id="${escapeHtml(character.id)}"
        >
          Abrir ficha
        </button>

        <button
          class="danger delete-character"
          type="button"
          data-id="${escapeHtml(character.id)}"
        >
          Excluir
        </button>
      </div>
    </div>
  `;

  return card;
}

// ============================================================
// EXCLUIR FICHA
// ============================================================

function deleteCharacter(id) {
  const characters = getSavedCharacters();
  const character = characters.find((item) => item.id === id);

  if (!character) return;

  const data = character.data || character;
  const name = data.characterName || data.name || "esta ficha";

  const confirmed = confirm(
    `Deseja excluir "${name}"? Essa ação não pode ser desfeita.`,
  );

  if (!confirmed) return;

  const remaining = characters.filter((item) => item.id !== id);

  localStorage.setItem(CHARACTERS_KEY, JSON.stringify(remaining));

  if (localStorage.getItem(ACTIVE_CHARACTER_KEY) === id) {
    clearActiveCharacter();
  }

  renderCharacters();
}

// ============================================================
// RENDERIZAR
// ============================================================

function renderCharacters() {
  const characters = migrateOldCharacter();

  charactersGrid.innerHTML = "";

  if (!characters.length) {
    emptyCharacters.style.display = "block";
    return;
  }

  emptyCharacters.style.display = "none";

  characters.forEach((character) => {
    charactersGrid.appendChild(createCharacterCard(character));
  });

  bindCharacterActions();
}

// ============================================================
// AÇÕES DOS CARDS
// ============================================================

function bindCharacterActions() {
  document.querySelectorAll(".open-character").forEach((button) => {
    button.addEventListener("click", () => {
      setActiveCharacter(button.dataset.id);
      window.location.href = "./ficha.html";
    });
  });

  document.querySelectorAll(".delete-character").forEach((button) => {
    button.addEventListener("click", () => {
      deleteCharacter(button.dataset.id);
    });
  });
}

// ============================================================
// NOVA FICHA
// ============================================================
// Impede que clicar em "Criar personagem" abra a ficha anterior.

document.querySelectorAll('a[href="./ficha.html"]').forEach((link) => {
  link.addEventListener("click", () => {
    clearActiveCharacter();
  });
});

// ============================================================
// INICIALIZAÇÃO
// ============================================================

renderCharacters();
