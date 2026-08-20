// ============================================================
// FICHA D&D 5E
// Cálculos automáticos
// ============================================================

// ------------------------------------------------------------
// ELEMENTOS
// ------------------------------------------------------------

const abilities = [
  "strength",
  "dexterity",
  "constitution",
  "intelligence",
  "wisdom",
  "charisma",
];

// ------------------------------------------------------------
// MODIFICADOR DE ATRIBUTO
// ------------------------------------------------------------

function getModifier(score) {
  return Math.floor((Number(score) - 10) / 2);
}

function formatModifier(value) {
  return value >= 0 ? `+${value}` : `${value}`;
}

// ------------------------------------------------------------
// BÔNUS DE PROFICIÊNCIA
// ------------------------------------------------------------

function getProficiencyBonus(level) {
  level = Number(level);

  if (level >= 17) return 6;
  if (level >= 13) return 5;
  if (level >= 9) return 4;
  if (level >= 5) return 3;

  return 2;
}

// ------------------------------------------------------------
// ATUALIZA ATRIBUTOS
// ------------------------------------------------------------

function updateAbilities() {
  abilities.forEach((ability) => {
    const scoreElement = document.getElementById(ability);

    const modifierElement = document.getElementById(`${ability}Mod`);

    const score = Number(scoreElement.value) || 0;

    const modifier = getModifier(score);

    modifierElement.textContent = formatModifier(modifier);
  });
}

// ------------------------------------------------------------
// PROFICIÊNCIA
// ------------------------------------------------------------

function updateProficiency() {
  const level = Number(document.getElementById("level").value) || 1;

  const proficiency = getProficiencyBonus(level);

  document.getElementById("proficiencyBonus").textContent =
    formatModifier(proficiency);
}

// ------------------------------------------------------------
// INICIATIVA
// ------------------------------------------------------------

function updateInitiative() {
  const dexterity = Number(document.getElementById("dexterity").value) || 0;

  const modifier = getModifier(dexterity);

  document.getElementById("initiative").textContent = formatModifier(modifier);
}

// ------------------------------------------------------------
// SALVAGUARDAS
// ------------------------------------------------------------

function updateSavingThrows() {
  const proficiency = getProficiencyBonus(
    Number(document.getElementById("level").value) || 1,
  );

  document.querySelectorAll(".saving-prof").forEach((checkbox) => {
    const ability = checkbox.dataset.ability;

    const score = Number(document.getElementById(ability).value) || 0;

    const modifier = getModifier(score);

    const total = modifier + (checkbox.checked ? proficiency : 0);

    document.getElementById(`save-${ability}`).textContent =
      formatModifier(total);
  });
}

// ------------------------------------------------------------
// PERÍCIAS
// ------------------------------------------------------------

function updateSkills() {
  const proficiency = getProficiencyBonus(
    Number(document.getElementById("level").value) || 1,
  );

  document.querySelectorAll(".skill-prof").forEach((checkbox) => {
    const ability = checkbox.dataset.ability;

    const skill = checkbox.dataset.skill;

    const score = Number(document.getElementById(ability).value) || 0;

    const modifier = getModifier(score);

    const total = modifier + (checkbox.checked ? proficiency : 0);

    document.getElementById(`skill-${skill}`).textContent =
      formatModifier(total);
  });
}

// ------------------------------------------------------------
// MAGIAS
// ------------------------------------------------------------

function updateSpells() {
  const ability = document.getElementById("spellAbility").value;

  if (!ability) {
    document.getElementById("spellSaveDC").textContent = "—";

    document.getElementById("spellAttack").textContent = "—";

    return;
  }

  const score = Number(document.getElementById(ability).value) || 0;

  const modifier = getModifier(score);

  const level = Number(document.getElementById("level").value) || 1;

  const proficiency = getProficiencyBonus(level);

  const spellDC = 8 + proficiency + modifier;

  const spellAttack = proficiency + modifier;

  document.getElementById("spellSaveDC").textContent = spellDC;

  document.getElementById("spellAttack").textContent =
    formatModifier(spellAttack);
}

// ------------------------------------------------------------
// ATUALIZA TUDO
// ------------------------------------------------------------

function updateAll() {
  updateAbilities();

  updateProficiency();

  updateInitiative();

  updateSavingThrows();

  updateSkills();

  updateSpells();
}

// ------------------------------------------------------------
// EVENTOS
// ------------------------------------------------------------

document.querySelectorAll("input, textarea, select").forEach((element) => {
  element.addEventListener("input", updateAll);

  element.addEventListener("change", updateAll);
});

// ============================================================
// IMAGEM DO PERSONAGEM
// ============================================================

const imageUpload = document.getElementById("imageUpload");

const characterImage = document.getElementById("characterImage");

const portraitPlaceholder = document.getElementById("portraitPlaceholder");

const removeImage = document.getElementById("removeImage");

// ------------------------------------------------------------
// MOSTRAR IMAGEM
// ------------------------------------------------------------

function displayCharacterImage(imageData) {
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

// ------------------------------------------------------------
// ESCOLHER IMAGEM
// ------------------------------------------------------------

imageUpload.addEventListener("change", function () {
  const file = this.files[0];

  if (!file) return;

  // Verifica se é uma imagem
  if (!file.type.startsWith("image/")) {
    alert("Selecione um arquivo de imagem.");

    return;
  }

  const reader = new FileReader();

  reader.onload = function (event) {
    const imageData = event.target.result;

    displayCharacterImage(imageData);

    localStorage.setItem("dndCharacterImage", imageData);
  };

  reader.readAsDataURL(file);
});
// ------------------------------------------------------------
// REMOVER IMAGEM
// ------------------------------------------------------------

removeImage.addEventListener("click", function () {
  const confirmation = confirm("Deseja remover o retrato do personagem?");

  if (!confirmation) return;

  localStorage.removeItem("dndCharacterImage");

  imageUpload.value = "";

  displayCharacterImage(null);
});
// ------------------------------------------------------------
// SALVAR NO LOCALSTORAGE
// ------------------------------------------------------------

function saveCharacter() {
  const data = {};

  document.querySelectorAll("input, textarea, select").forEach((element) => {
    if (!element.id) return;

    if (element.type === "checkbox") {
      data[element.id] = element.checked;
    } else {
      data[element.id] = element.value;
    }
  });

  localStorage.setItem("dndCharacter", JSON.stringify(data));

  alert("Ficha salva!");
}

// ------------------------------------------------------------
// CARREGAR FICHA
// ------------------------------------------------------------

function loadCharacter() {
  const saved = localStorage.getItem("dndCharacter");

  if (!saved) return;

  const data = JSON.parse(saved);

  document.querySelectorAll("input, textarea, select").forEach((element) => {
    if (!element.id) return;

    if (!(element.id in data)) return;

    if (element.type === "checkbox") {
      element.checked = data[element.id];
    } else {
      element.value = data[element.id];
    }
  });

  updateAll();
}

// ------------------------------------------------------------
// LIMPAR FICHA
// ------------------------------------------------------------

function clearCharacter() {
  const confirmation = confirm(
    "Tem certeza que deseja apagar todos os dados da ficha?",
  );

  if (!confirmation) return;

  localStorage.removeItem("dndCharacter");

  location.reload();
}

// ------------------------------------------------------------
// BOTÕES
// ------------------------------------------------------------

document.getElementById("saveBtn").addEventListener("click", saveCharacter);

document.getElementById("clearBtn").addEventListener("click", clearCharacter);

// ------------------------------------------------------------
// INICIALIZAÇÃO
// ------------------------------------------------------------

loadCharacter();

updateAll();
