// ============================================================
// FICHA D&D 5E
// ============================================================

// ============================================================
// ATRIBUTOS
// ============================================================

const abilities = [
  "strength",
  "dexterity",
  "constitution",
  "intelligence",
  "wisdom",
  "charisma",
];

// ============================================================
// TABELA DE XP
// ============================================================

const experienceTable = {
  1: 0,
  2: 300,
  3: 900,
  4: 2700,
  5: 6500,
  6: 14000,
  7: 23000,
  8: 34000,
  9: 48000,
  10: 64000,
  11: 85000,
  12: 100000,
  13: 120000,
  14: 140000,
  15: 165000,
  16: 195000,
  17: 225000,
  18: 265000,
  19: 305000,
  20: 355000,
};

// ============================================================
// MODIFICADOR DE ATRIBUTO
// ============================================================

function getModifier(score) {
  return Math.floor((Number(score) - 10) / 2);
}

function formatModifier(value) {
  return value >= 0 ? `+${value}` : `${value}`;
}

// ============================================================
// CALCULAR NÍVEL PELO XP
// ============================================================

function getLevelFromXP(xp) {
  xp = Math.max(0, Number(xp) || 0);

  let level = 1;

  for (const [currentLevel, requiredXP] of Object.entries(experienceTable)) {
    if (xp >= requiredXP) {
      level = Number(currentLevel);
    } else {
      break;
    }
  }

  return level;
}

// ============================================================
// XP → NÍVEL
// ============================================================

function updateLevelFromXP() {
  const experienceElement = document.getElementById("experience");

  const levelElement = document.getElementById("level");

  if (!experienceElement || !levelElement) {
    return;
  }

  const xp = Math.max(0, Number(experienceElement.value) || 0);

  experienceElement.value = xp;

  const level = getLevelFromXP(xp);

  levelElement.value = level;
}

// ============================================================
// NÍVEL → XP
// ============================================================

function updateXPFromLevel() {
  const experienceElement = document.getElementById("experience");

  const levelElement = document.getElementById("level");

  if (!experienceElement || !levelElement) {
    return;
  }

  let level = Number(levelElement.value) || 1;

  // Limita o nível entre 1 e 20
  level = Math.max(1, Math.min(20, level));

  levelElement.value = level;

  // Define o XP mínimo do nível
  experienceElement.value = experienceTable[level];
}

// ============================================================
// PROGRESSO DE XP
// ============================================================

function getExperienceProgress(xp) {
  xp = Math.max(0, Number(xp) || 0);

  const level = getLevelFromXP(xp);

  // Nível 20
  if (level >= 20) {
    return {
      level: 20,
      currentXP: xp,
      currentLevelXP: experienceTable[20],
      nextLevelXP: null,
      progress: 100,
    };
  }

  const currentLevelXP = experienceTable[level];

  const nextLevelXP = experienceTable[level + 1];

  const progress =
    ((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;

  return {
    level,
    currentXP: xp,
    currentLevelXP,
    nextLevelXP,
    progress: Math.max(0, Math.min(100, progress)),
  };
}

// ============================================================
// BÔNUS DE PROFICIÊNCIA
// ============================================================

function getProficiencyBonus(level) {
  level = Number(level) || 1;

  if (level >= 17) return 6;

  if (level >= 13) return 5;

  if (level >= 9) return 4;

  if (level >= 5) return 3;

  return 2;
}

// ============================================================
// ATRIBUTOS
// ============================================================

function updateAbilities() {
  abilities.forEach((ability) => {
    const scoreElement = document.getElementById(ability);

    const modifierElement = document.getElementById(`${ability}Mod`);

    if (!scoreElement || !modifierElement) {
      return;
    }

    const score = Number(scoreElement.value) || 0;

    const modifier = getModifier(score);

    modifierElement.textContent = formatModifier(modifier);
  });
}

// ============================================================
// PROFICIÊNCIA
// ============================================================

function updateProficiency() {
  const levelElement = document.getElementById("level");

  const proficiencyElement = document.getElementById("proficiencyBonus");

  if (!levelElement || !proficiencyElement) {
    return;
  }

  const level = Number(levelElement.value) || 1;

  const proficiency = getProficiencyBonus(level);

  proficiencyElement.textContent = formatModifier(proficiency);
}

// ============================================================
// INICIATIVA
// ============================================================

function updateInitiative() {
  const dexterityElement = document.getElementById("dexterity");

  const initiativeElement = document.getElementById("initiative");

  if (!dexterityElement || !initiativeElement) {
    return;
  }

  const dexterity = Number(dexterityElement.value) || 0;

  const modifier = getModifier(dexterity);

  initiativeElement.textContent = formatModifier(modifier);
}

// ============================================================
// SALVAGUARDAS
// ============================================================

function updateSavingThrows() {
  const levelElement = document.getElementById("level");

  if (!levelElement) {
    return;
  }

  const level = Number(levelElement.value) || 1;

  const proficiency = getProficiencyBonus(level);

  document.querySelectorAll(".saving-prof").forEach((checkbox) => {
    const ability = checkbox.dataset.ability;

    const abilityElement = document.getElementById(ability);

    const resultElement = document.getElementById(`save-${ability}`);

    if (!abilityElement || !resultElement) {
      return;
    }

    const score = Number(abilityElement.value) || 0;

    const modifier = getModifier(score);

    const total = modifier + (checkbox.checked ? proficiency : 0);

    resultElement.textContent = formatModifier(total);
  });
}

// ============================================================
// PERÍCIAS
// ============================================================

function updateSkills() {
  const levelElement = document.getElementById("level");

  if (!levelElement) {
    return;
  }

  const level = Number(levelElement.value) || 1;

  const proficiency = getProficiencyBonus(level);

  document.querySelectorAll(".skill-prof").forEach((checkbox) => {
    const ability = checkbox.dataset.ability;

    const skill = checkbox.dataset.skill;

    const abilityElement = document.getElementById(ability);

    const resultElement = document.getElementById(`skill-${skill}`);

    if (!abilityElement || !resultElement) {
      return;
    }

    const score = Number(abilityElement.value) || 0;

    const modifier = getModifier(score);

    const total = modifier + (checkbox.checked ? proficiency : 0);

    resultElement.textContent = formatModifier(total);
  });
}

// ============================================================
// MAGIAS
// ============================================================

function updateSpells() {
  const spellAbilityElement = document.getElementById("spellAbility");

  const spellSaveDCElement = document.getElementById("spellSaveDC");

  const spellAttackElement = document.getElementById("spellAttack");

  const levelElement = document.getElementById("level");

  if (
    !spellAbilityElement ||
    !spellSaveDCElement ||
    !spellAttackElement ||
    !levelElement
  ) {
    return;
  }

  const ability = spellAbilityElement.value;

  if (!ability) {
    spellSaveDCElement.textContent = "—";

    spellAttackElement.textContent = "—";

    return;
  }

  const abilityElement = document.getElementById(ability);

  if (!abilityElement) {
    return;
  }

  const score = Number(abilityElement.value) || 0;

  const modifier = getModifier(score);

  const level = Number(levelElement.value) || 1;

  const proficiency = getProficiencyBonus(level);

  const spellDC = 8 + proficiency + modifier;

  const spellAttack = proficiency + modifier;

  spellSaveDCElement.textContent = spellDC;

  spellAttackElement.textContent = formatModifier(spellAttack);
}

// ============================================================
// ATUALIZAR CÁLCULOS
// ============================================================

function updateAllCalculations() {
  updateAbilities();

  updateProficiency();

  updateInitiative();

  updateSavingThrows();

  updateSkills();

  updateSpells();
}

// ============================================================
// XP ALTERADO
// ============================================================

function handleExperienceChange() {
  updateLevelFromXP();

  updateAllCalculations();
}

// ============================================================
// NÍVEL ALTERADO
// ============================================================

function handleLevelChange() {
  updateXPFromLevel();

  updateAllCalculations();
}

// ============================================================
// IMAGEM DO PERSONAGEM
// ============================================================

const imageUpload = document.getElementById("imageUpload");

const characterImage = document.getElementById("characterImage");

const portraitPlaceholder = document.getElementById("portraitPlaceholder");

const removeImage = document.getElementById("removeImage");

// ============================================================
// MOSTRAR IMAGEM
// ============================================================

function displayCharacterImage(imageData) {
  if (!characterImage || !portraitPlaceholder) {
    return;
  }

  if (!imageData) {
    characterImage.src = "";

    characterImage.style.display = "none";

    portraitPlaceholder.style.display = "block";

    return;
  }

  characterImage.src = imageData;

  characterImage.style.display = "block";

  portraitPlaceholder.style.display = "none";
}

// ============================================================
// UPLOAD DA IMAGEM
// ============================================================

if (imageUpload) {
  imageUpload.addEventListener("change", function () {
    const file = this.files[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Selecione um arquivo de imagem.");

      return;
    }

    const reader = new FileReader();

    reader.onload = function (event) {
      const imageData = event.target.result;

      displayCharacterImage(imageData);

      // A imagem fica em memória na ficha atual e será salva junto com ela.\n      currentCharacterImage = imageData;
    };

    reader.readAsDataURL(file);
  });
}

// ============================================================
// REMOVER IMAGEM
// ============================================================

if (removeImage) {
  removeImage.addEventListener("click", function () {
    const confirmation = confirm("Deseja remover o retrato do personagem?");

    if (!confirmation) {
      return;
    }

    currentCharacterImage = "";

    if (imageUpload) {
      imageUpload.value = "";
    }

    displayCharacterImage(null);
  });
}

// ============================================================
// ARMAZENAMENTO DE MÚLTIPLAS FICHAS
// ============================================================

const CHARACTERS_KEY = "dndCharacters";
const ACTIVE_CHARACTER_KEY = "dndActiveCharacterId";

let currentCharacterImage = "";

function getCharacters() {
  try {
    const saved = JSON.parse(localStorage.getItem(CHARACTERS_KEY) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch (error) {
    console.error("Erro ao ler as fichas:", error);
    return [];
  }
}

function generateCharacterId() {
  if (crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `character-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function getActiveCharacterId() {
  return localStorage.getItem(ACTIVE_CHARACTER_KEY);
}

function getActiveCharacter() {
  const id = getActiveCharacterId();

  if (!id) {
    return null;
  }

  return getCharacters().find((character) => character.id === id) || null;
}

function saveCharacters(characters) {
  localStorage.setItem(CHARACTERS_KEY, JSON.stringify(characters));
}

// ============================================================
// MIGRAÇÃO DA ESTRUTURA ANTIGA
// ============================================================

function migrateOldCharacter() {
  const characters = getCharacters();

  if (characters.length) {
    return characters;
  }

  const oldCharacter = localStorage.getItem("dndCharacter");

  if (!oldCharacter) {
    return [];
  }

  try {
    const data = JSON.parse(oldCharacter);

    const migrated = [{
      id: generateCharacterId(),
      data,
      image: localStorage.getItem("dndCharacterImage") || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }];

    saveCharacters(migrated);
    localStorage.setItem(ACTIVE_CHARACTER_KEY, migrated[0].id);

    localStorage.removeItem("dndCharacter");
    localStorage.removeItem("dndCharacterImage");

    return migrated;
  } catch (error) {
    console.error("Erro ao migrar a ficha antiga:", error);
    return [];
  }
}

// ============================================================
// SALVAR FICHA
// ============================================================

function saveCharacter() {
  const data = {};

  document.querySelectorAll("input, textarea, select").forEach((element) => {
    if (!element.id) {
      return;
    }

    if (element.type === "checkbox") {
      data[element.id] = element.checked;
    } else {
      data[element.id] = element.value;
    }
  });

  const characters = migrateOldCharacter();
  let activeId = getActiveCharacterId();
  const now = new Date().toISOString();

  // Se nenhuma ficha estiver aberta, cria uma nova.
  if (!activeId) {
    activeId = generateCharacterId();

    characters.push({
      id: activeId,
      data,
      image: currentCharacterImage || "",
      createdAt: now,
      updatedAt: now,
    });

    localStorage.setItem(ACTIVE_CHARACTER_KEY, activeId);
  } else {
    const index = characters.findIndex((character) => character.id === activeId);

    if (index === -1) {
      characters.push({
        id: activeId,
        data,
        image: currentCharacterImage || "",
        createdAt: now,
        updatedAt: now,
      });
    } else {
      characters[index].data = data;
      characters[index].image = currentCharacterImage || "";
      characters[index].updatedAt = now;
    }
  }

  saveCharacters(characters);

  alert("Ficha salva!");
}

// ============================================================
// CARREGAR FICHA
// ============================================================

function loadCharacter() {
  let characters = migrateOldCharacter();
  const activeId = getActiveCharacterId();

  // Sem ID ativo = página de criação de uma nova ficha.
  if (!activeId) {
    currentCharacterImage = "";
    displayCharacterImage(null);
    return;
  }

  const character = characters.find((item) => item.id === activeId);

  if (!character) {
    localStorage.removeItem(ACTIVE_CHARACTER_KEY);
    currentCharacterImage = "";
    displayCharacterImage(null);
    return;
  }

  const data = character.data || character;

  document.querySelectorAll("input, textarea, select").forEach((element) => {
    if (!element.id || !(element.id in data)) {
      return;
    }

    if (element.type === "checkbox") {
      element.checked = data[element.id];
    } else {
      element.value = data[element.id];
    }
  });

  currentCharacterImage = character.image || "";
  displayCharacterImage(currentCharacterImage);

  updateAllCalculations();
}

// ============================================================
// LIMPAR / EXCLUIR A FICHA ATUAL
// ============================================================

function clearCharacter() {
  const activeId = getActiveCharacterId();

  // Em uma ficha ainda não salva, apenas limpa os campos.
  if (!activeId) {
    const confirmation = confirm(
      "Tem certeza que deseja limpar todos os campos desta nova ficha?",
    );

    if (!confirmation) return;

    document.querySelectorAll("input, textarea, select").forEach((element) => {
      if (element.type === "checkbox") {
        element.checked = false;
      } else {
        element.value = "";
      }
    });

    currentCharacterImage = "";
    displayCharacterImage(null);
    updateAllCalculations();
    return;
  }

  const characters = getCharacters();
  const character = characters.find((item) => item.id === activeId);

  if (!character) return;

  const data = character.data || character;
  const name = data.characterName || data.name || "esta ficha";

  const confirmation = confirm(
    `Deseja excluir "${name}"? Essa ação não pode ser desfeita.`,
  );

  if (!confirmation) return;

  const remaining = characters.filter((item) => item.id !== activeId);

  saveCharacters(remaining);
  localStorage.removeItem(ACTIVE_CHARACTER_KEY);

  window.location.href = "./carregarFicha.html";
}

// ============================================================
// BOTÕES
// ============================================================

const saveButton = document.getElementById("saveBtn");

const clearButton = document.getElementById("clearBtn");

if (saveButton) {
  saveButton.addEventListener("click", saveCharacter);
}

if (clearButton) {
  clearButton.addEventListener("click", clearCharacter);
}

// ============================================================
// EVENTOS DOS CAMPOS
// ============================================================

document.querySelectorAll("input, textarea, select").forEach((element) => {
  // ------------------------------------------------------
  // XP
  // ------------------------------------------------------

  if (element.id === "experience") {
    element.addEventListener("input", handleExperienceChange);

    element.addEventListener("change", handleExperienceChange);

    return;
  }

  // ------------------------------------------------------
  // NÍVEL
  // ------------------------------------------------------

  if (element.id === "level") {
    element.addEventListener("change", handleLevelChange);

    return;
  }

  // ------------------------------------------------------
  // DEMAIS CAMPOS
  // ------------------------------------------------------

  element.addEventListener("input", updateAllCalculations);

  element.addEventListener("change", updateAllCalculations);
});

// ============================================================
// INICIALIZAÇÃO
// ============================================================

loadCharacter();

// Garante que XP e nível estejam sincronizados
const experienceElement = document.getElementById("experience");

const levelElement = document.getElementById("level");

if (experienceElement && levelElement) {
  // Se houver XP salvo, XP é a fonte inicial
  updateLevelFromXP();
}

// Atualiza todos os cálculos
updateAllCalculations();

// ============================================================
// ABAS DA FICHA
// ============================================================

const sideLinks = document.querySelectorAll(".side-link");

const tabPanels = document.querySelectorAll(".tab-panel");

// ============================================================
// MENU LATERAL (GAVETA NO MOBILE)
// ============================================================

const sideMenu = document.getElementById("sideMenu");
const sideMenuFab = document.getElementById("sideMenuFab");
const sideMenuBackdrop = document.getElementById("sideMenuBackdrop");

function openSideMenu() {
  if (!sideMenu) return;
  sideMenu.classList.add("open");
  sideMenuBackdrop?.classList.add("visible");
}

function closeSideMenu() {
  if (!sideMenu) return;
  sideMenu.classList.remove("open");
  sideMenuBackdrop?.classList.remove("visible");
}

function toggleSideMenu() {
  if (!sideMenu) return;
  sideMenu.classList.contains("open") ? closeSideMenu() : openSideMenu();
}

sideMenuFab?.addEventListener("click", toggleSideMenu);
sideMenuBackdrop?.addEventListener("click", closeSideMenu);

function openTab(tabName) {
  sideLinks.forEach((link) => {
    link.classList.toggle("active", link.dataset.tab === tabName);
  });

  tabPanels.forEach((panel) => {
    panel.classList.toggle("active", panel.dataset.tabPanel === tabName);
  });

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

sideLinks.forEach((link) => {
  link.addEventListener("click", () => {
    openTab(link.dataset.tab);
    closeSideMenu();
  });
});
// ============================================================
// INPUT NUMBER COM BOTÕES + E -
// ============================================================

function setupNumberInputs() {
  const numberInputs = document.querySelectorAll('input[type="number"]');

  numberInputs.forEach((input) => {
    // Evita criar os botões duas vezes
    if (input.parentElement.classList.contains("number-control")) {
      return;
    }

    // Cria o container
    const container = document.createElement("div");

    container.className = "number-control";

    // Coloca o input dentro do container
    input.parentNode.insertBefore(container, input);

    container.appendChild(input);

    // ------------------------------------------------------
    // BOTÃO +
    // ------------------------------------------------------

    const increaseButton = document.createElement("button");

    increaseButton.type = "button";

    increaseButton.className = "number-button number-increase";

    increaseButton.textContent = "+";

    // ------------------------------------------------------
    // BOTÃO -
    // ------------------------------------------------------

    const decreaseButton = document.createElement("button");

    decreaseButton.type = "button";

    decreaseButton.className = "number-button number-decrease";

    decreaseButton.textContent = "−";

    // ------------------------------------------------------
    // POSICIONAMENTO
    // ------------------------------------------------------

    container.insertBefore(decreaseButton, input);

    container.appendChild(increaseButton);

    // ------------------------------------------------------
    // AUMENTAR
    // ------------------------------------------------------

    increaseButton.addEventListener("click", () => {
      const step = Number(input.step) || 1;

      const max = input.max !== "" ? Number(input.max) : Infinity;

      let value = Number(input.value) || 0;

      value += step;

      value = Math.min(value, max);

      input.value = value;

      input.dispatchEvent(
        new Event("input", {
          bubbles: true,
        }),
      );

      input.dispatchEvent(
        new Event("change", {
          bubbles: true,
        }),
      );
    });

    // ------------------------------------------------------
    // DIMINUIR
    // ------------------------------------------------------

    decreaseButton.addEventListener("click", () => {
      const step = Number(input.step) || 1;

      const min = input.min !== "" ? Number(input.min) : -Infinity;

      let value = Number(input.value) || 0;

      value -= step;

      value = Math.max(value, min);

      input.value = value;

      input.dispatchEvent(
        new Event("input", {
          bubbles: true,
        }),
      );

      input.dispatchEvent(
        new Event("change", {
          bubbles: true,
        }),
      );
    });
  });
}

// Inicializa os inputs
setupNumberInputs();
