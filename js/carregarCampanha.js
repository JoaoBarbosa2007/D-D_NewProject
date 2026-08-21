// ============================================================
// CARREGAR CAMPANHAS
// ============================================================

const campaignGrid = document.getElementById("campaignGrid");
const emptyCampaigns = document.getElementById("emptyCampaigns");

// ============================================================
// PEGAR CAMPANHAS SALVAS
// ============================================================

function getSavedCampaigns() {
  try {
    return JSON.parse(localStorage.getItem("dndCampaigns") || "[]");
  } catch (error) {
    console.error("Erro ao carregar campanhas:", error);
    return [];
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

function createCampaignCard(campaign) {
  const card = document.createElement("article");
  card.className = "campaign-card campaign-list-card";

  const agentCount = Array.isArray(campaign.agents)
    ? campaign.agents.length
    : 0;

  card.innerHTML = `
    <div class="campaign-card-cover">
      <img src="${campaign.cover || "./img/icon.png"}"
           alt="Capa da campanha ${escapeHtml(campaign.name)}" />
    </div>

    <div class="campaign-card-content">
      <div class="campaign-card-title">
        <div>
          <h2>${escapeHtml(campaign.name || "Campanha sem nome")}</h2>
          <span>${agentCount} agente${agentCount === 1 ? "" : "s"}</span>
        </div>
      </div>

      <p class="campaign-description">
        ${escapeHtml(campaign.description || "Sem descrição.")}
      </p>

      <div class="campaign-id">
        <span>Chave</span>
        <strong>${escapeHtml(campaign.id)}</strong>
        <button type="button" class="copy-key" data-key="${escapeHtml(campaign.id)}">
          Copiar
        </button>
      </div>

      <div class="campaign-card-actions">
        <button class="button open-campaign" type="button"
                data-id="${escapeHtml(campaign.id)}">Abrir campanha</button>
        <button class="button danger-button delete-campaign" type="button"
                data-id="${escapeHtml(campaign.id)}">Excluir</button>
      </div>
    </div>
  `;

  return card;
}

// ============================================================
// RENDERIZAR
// ============================================================

function renderCampaigns() {
  const campaigns = getSavedCampaigns();

  campaignGrid.innerHTML = "";

  if (!campaigns.length) {
    emptyCampaigns.style.display = "block";
    return;
  }

  emptyCampaigns.style.display = "none";

  campaigns.forEach((campaign) => {
    campaignGrid.appendChild(createCampaignCard(campaign));
  });

  bindCampaignActions();
}

// ============================================================
// AÇÕES
// ============================================================

function bindCampaignActions() {
  document.querySelectorAll(".copy-key").forEach((button) => {
    button.addEventListener("click", async () => {
      const key = button.dataset.key;

      try {
        await navigator.clipboard.writeText(key);
        button.textContent = "Copiado!";
        setTimeout(() => {
          button.textContent = "Copiar";
        }, 1500);
      } catch (error) {
        alert(`Chave da campanha: ${key}`);
      }
    });
  });

  document.querySelectorAll(".open-campaign").forEach((button) => {
    button.addEventListener("click", () => {
      localStorage.setItem("dndActiveCampaignId", button.dataset.id);
      // A página de campanha será o editor da campanha selecionada.
      window.location.href = "./campanha.html";
    });
  });

  document.querySelectorAll(".delete-campaign").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.id;
      const campaigns = getSavedCampaigns();
      const campaign = campaigns.find((item) => item.id === id);

      if (!campaign) return;

      const confirmed = confirm(
        `Deseja excluir a campanha "${campaign.name}"?`,
      );

      if (!confirmed) return;

      const remaining = campaigns.filter((item) => item.id !== id);
      localStorage.setItem("dndCampaigns", JSON.stringify(remaining));

      if (localStorage.getItem("dndActiveCampaignId") === id) {
        localStorage.removeItem("dndActiveCampaignId");
      }

      renderCampaigns();
    });
  });
}

// ============================================================
// INICIALIZAÇÃO
// ============================================================

renderCampaigns();
