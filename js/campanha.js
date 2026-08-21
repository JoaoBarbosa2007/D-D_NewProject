// ============================================================
// CAMPANHA
// ============================================================
// Responsável por criar e salvar uma campanha no localStorage.
// A estrutura permite futuramente trocar o armazenamento local
// por uma API/banco de dados sem precisar refazer a interface.
// ============================================================

const campaignForm = document.getElementById("campaignForm");
const campaignName = document.getElementById("campaignName");
const campaignDescription = document.getElementById("campaignDescription");
const descriptionCounter = document.getElementById("descriptionCounter");

const agentName = document.getElementById("agentName");
const agentRole = document.getElementById("agentRole");
const addAgentBtn = document.getElementById("addAgentBtn");
const agentsList = document.getElementById("agentsList");
const agentsEmpty = document.getElementById("agentsEmpty");

const coverPreview = document.getElementById("coverPreview");
const coverUpload = document.getElementById("coverUpload");
const coverOptions = document.getElementById("coverOptions");

const saveCampaignBtn = document.getElementById("saveCampaignBtn");
const cancelCampaignBtn = document.getElementById("cancelCampaignBtn");

let selectedCover = "./img/slides/imagem1.jpg";
let campaignAgents = [];

// ------------------------------------------------------------
// GERAR CHAVE ÚNICA
// ------------------------------------------------------------

function generateCampaignId() {
  const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let id = "";

  do {
    id = "";
    for (let i = 0; i < 8; i++) {
      id += characters[Math.floor(Math.random() * characters.length)];
    }
  } while (campaignIdExists(id));

  return id;
}

function campaignIdExists(id) {
  const campaigns = JSON.parse(localStorage.getItem("dndCampaigns") || "[]");
  return campaigns.some((campaign) => campaign.id === id);
}

// ------------------------------------------------------------
// CONTADOR DA DESCRIÇÃO
// ------------------------------------------------------------

if (campaignDescription) {
  campaignDescription.addEventListener("input", () => {
    descriptionCounter.textContent = `${campaignDescription.value.length} / 600`;
  });
}

// ------------------------------------------------------------
// CAPA
// ------------------------------------------------------------

coverOptions?.querySelectorAll(".cover-option").forEach((option) => {
  option.addEventListener("click", () => {
    selectedCover = option.dataset.cover;
    coverPreview.src = selectedCover;

    coverOptions.querySelectorAll(".cover-option").forEach((item) => {
      item.classList.toggle("selected", item === option);
    });

    // Caso o usuário volte para uma capa padrão, remove a imagem customizada.
    coverUpload.value = "";
  });
});

coverUpload?.addEventListener("change", () => {
  const file = coverUpload.files[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = (event) => {
    selectedCover = event.target.result;
    coverPreview.src = selectedCover;

    coverOptions.querySelectorAll(".cover-option").forEach((option) => {
      option.classList.remove("selected");
    });
  };

  reader.readAsDataURL(file);
});

// ------------------------------------------------------------
// AGENTES
// ------------------------------------------------------------

function renderAgents() {
  agentsList.querySelectorAll(".agent-item").forEach((item) => item.remove());

  agentsEmpty.style.display = campaignAgents.length ? "none" : "block";

  campaignAgents.forEach((agent, index) => {
    const item = document.createElement("div");
    item.className = "agent-item";

    item.innerHTML = `
      <div class="agent-avatar">⚔</div>
      <div class="agent-info">
        <strong>${escapeHtml(agent.name)}</strong>
        <span>${escapeHtml(agent.role)}</span>
      </div>
      <button type="button" class="remove-agent" data-index="${index}"
              aria-label="Remover ${escapeHtml(agent.name)}">×</button>
    `;

    agentsList.appendChild(item);
  });

  agentsList.querySelectorAll(".remove-agent").forEach((button) => {
    button.addEventListener("click", () => {
      campaignAgents.splice(Number(button.dataset.index), 1);
      renderAgents();
    });
  });
}

function addAgent() {
  const name = agentName.value.trim();

  if (!name) {
    agentName.focus();
    return;
  }

  campaignAgents.push({
    name,
    role: agentRole.value,
  });

  agentName.value = "";
  agentName.focus();
  renderAgents();
}

addAgentBtn?.addEventListener("click", addAgent);

agentName?.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    addAgent();
  }
});

// ------------------------------------------------------------
// ESCAPAR TEXTO
// ------------------------------------------------------------

function escapeHtml(value) {
  const element = document.createElement("div");
  element.textContent = value;
  return element.innerHTML;
}

// ------------------------------------------------------------
// SALVAR CAMPANHA
// ------------------------------------------------------------

function saveCampaign() {
  if (!campaignForm.reportValidity()) return;

  const campaigns = JSON.parse(localStorage.getItem("dndCampaigns") || "[]");

  const campaign = {
    id: generateCampaignId(),
    name: campaignName.value.trim(),
    description: campaignDescription.value.trim(),
    cover: selectedCover,
    agents: campaignAgents,
    createdAt: new Date().toISOString(),
  };

  campaigns.push(campaign);

  localStorage.setItem("dndCampaigns", JSON.stringify(campaigns));
  localStorage.setItem("dndActiveCampaignId", campaign.id);

  alert(`Campanha criada!\n\nChave para entrar: ${campaign.id}`);

  window.location.href = "./carregarCampanha.html";
}

saveCampaignBtn?.addEventListener("click", saveCampaign);

campaignForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  saveCampaign();
});

cancelCampaignBtn?.addEventListener("click", () => {
  window.location.href = "./carregarCampanha.html";
});

// ------------------------------------------------------------
// INICIALIZAÇÃO
// ------------------------------------------------------------

renderAgents();
