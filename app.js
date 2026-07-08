// ===== STATE =====
let fotos = [];
let zoom = 1;

document.getElementById('data').valueAsDate = new Date();

// ===== AUTO REPORT NUMBER =====
(function initReportNum() {
  const key = 'rdo_report_num';
  const stored = localStorage.getItem(key);
  const nextNum = stored ? parseInt(stored) : 1;
  document.getElementById('reportNum').value = String(nextNum).padStart(3, '0');
})();

// ===== SVG ICONS (flat design, matching original) =====
const ICONS = {
  worker: `<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="7" r="3.5" fill="#2d7dd2"/><path d="M12 12c-4 0-7 2-7 4.5V20h14v-3.5c0-2.5-3-4.5-7-4.5z" fill="#2d7dd2"/><rect x="8" y="3" width="8" height="3" rx="1.5" fill="#f5a623"/></svg>`,
  sun: `<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="4" fill="#f5a623"/><g stroke="#f5a623" stroke-width="2" stroke-linecap="round"><line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></g></svg>`,
  people: `<svg viewBox="0 0 24 24" fill="none"><circle cx="9" cy="7" r="2.5" fill="#2d7dd2"/><path d="M9 11c-3 0-5 1.5-5 3v2h10v-2c0-1.5-2-3-5-3z" fill="#2d7dd2"/><circle cx="17" cy="7" r="2.5" fill="#2d7dd2" opacity="0.6"/><path d="M17 11c-3 0-5 1.5-5 3v2h10v-2c0-1.5-2-3-5-3z" fill="#2d7dd2" opacity="0.6"/></svg>`,
  clock: `<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#2d7dd2" stroke-width="2" fill="none"/><path d="M12 7v5l3 3" stroke="#2d7dd2" stroke-width="2" stroke-linecap="round"/></svg>`,
  clima: `<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="10" r="4" fill="#f5a623"/><path d="M6 18h12" stroke="#0d47a1" stroke-width="2" stroke-linecap="round"/><path d="M8 20h8" stroke="#0d47a1" stroke-width="2" stroke-linecap="round"/></svg>`,
  hammer: `<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="14" width="4" height="7" rx="1" fill="#8B7355" transform="rotate(-45 5 17.5)"/><rect x="10" y="3" width="7" height="4" rx="1" fill="#2d7dd2"/></svg>`,
  hourglass: `<svg viewBox="0 0 24 24" fill="none"><path d="M6 2h12v4l-4 3 4 3v4H6v-4l4-3-4-3V2z" fill="#f5a623" opacity="0.3"/><path d="M6 2h12v4l-4 3 4 3v4H6v-4l4-3-4-3V2z" stroke="#f5a623" stroke-width="1.5" fill="none"/></svg>`,
  chart: `<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="14" width="4" height="7" rx="1" fill="#4caf50"/><rect x="10" y="8" width="4" height="13" rx="1" fill="#2d7dd2"/><rect x="17" y="4" width="4" height="17" rx="1" fill="#f5a623"/></svg>`,
  clipboard: `<svg viewBox="0 0 24 24" fill="none"><rect x="5" y="3" width="14" height="18" rx="2" stroke="#2d7dd2" stroke-width="1.5" fill="none"/><rect x="8" y="1" width="8" height="4" rx="1" fill="#2d7dd2"/><line x1="8" y1="10" x2="16" y2="10" stroke="#2d7dd2" stroke-width="1.5"/><line x1="8" y1="14" x2="16" y2="14" stroke="#2d7dd2" stroke-width="1.5"/></svg>`,
  camera: `<svg viewBox="0 0 24 24" fill="none"><rect x="2" y="6" width="20" height="14" rx="2" fill="#555"/><circle cx="12" cy="13" r="4" fill="#fff"/><circle cx="12" cy="13" r="2" fill="#555"/><rect x="8" y="4" width="8" height="3" rx="1" fill="#555"/></svg>`,
  box: `<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="8" width="18" height="13" rx="1" fill="#8B7355"/><path d="M3 8l9-5 9 5" stroke="#6B5B3D" stroke-width="1.5" fill="none"/><line x1="12" y1="3" x2="12" y2="21" stroke="#6B5B3D" stroke-width="1"/></svg>`,
  warning: `<svg viewBox="0 0 24 24" fill="none"><path d="M12 3L2 21h20L12 3z" fill="#f5a623"/><text x="12" y="18" text-anchor="middle" font-size="14" font-weight="bold" fill="#fff">!</text></svg>`,
  wrench: `<svg viewBox="0 0 24 24" fill="none"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.6-3.6a4 4 0 0 1-5 5L13 14a1 1 0 0 0-1.4 0l-1.6 1.6a1 1 0 0 0 0 1.4l5.3 5.3a4 4 0 0 1-5-5l3.3-3.3" stroke="#2d7dd2" stroke-width="1.5" fill="none"/></svg>`,
};

// ===== FOTO HANDLING =====
document.getElementById('fotos').addEventListener('change', function(e) {
  fotos = [];
  const preview = document.getElementById('fotos-preview');
  preview.innerHTML = '';
  Array.from(e.target.files).slice(0, 14).forEach((file) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      fotos.push(ev.target.result);
      const img = document.createElement('img');
      img.src = ev.target.result;
      preview.appendChild(img);
      if (fotos.length === Math.min(e.target.files.length, 14)) generatePreview();
    };
    reader.readAsDataURL(file);
  });
});

// ===== DYNAMIC LISTS =====
function addEquipe() {
  const div = document.createElement('div');
  div.className = 'equipe-row';
  div.innerHTML = `<input type="number" name="eq-qtd" value="1" min="0"><input type="text" name="eq-funcao" value="" placeholder="Função"><button type="button" class="btn-remove" onclick="removeEquipe(this)">✕</button>`;
  document.getElementById('equipe-list').appendChild(div);
}
function removeEquipe(btn) { btn.parentElement.remove(); }

function addServico() {
  const div = document.createElement('div');
  div.className = 'servico-row';
  div.innerHTML = `<input type="text" name="servico" value="" placeholder="Descrição do serviço"><button type="button" class="btn-remove" onclick="removeServico(this)">✕</button>`;
  document.getElementById('servicos-list').appendChild(div);
}
function removeServico(btn) { btn.parentElement.remove(); }

function addPendente() {
  const div = document.createElement('div');
  div.className = 'servico-row';
  div.innerHTML = `<input type="text" name="pendente" value="" placeholder="Descrição da pendência"><button type="button" class="btn-remove" onclick="removePendente(this)">✕</button>`;
  document.getElementById('pendentes-list').appendChild(div);
}
function removePendente(btn) { btn.parentElement.remove(); }

// ===== ZOOM =====
function zoomPreview(delta) {
  zoom = Math.max(0.5, Math.min(1.5, zoom + delta));
  document.getElementById('zoom-level').textContent = Math.round(zoom * 100) + '%';
  document.getElementById('rdo-preview').style.transform = `scale(${zoom})`;
}

// ===== COLLECT DATA =====
function collectData() {
  const dateInput = document.getElementById('data').value;
  const [y, m, d] = dateInput.split('-');
  const dateFormatted = `${d} / ${m} / ${y}`;

  const equipe = [];
  document.querySelectorAll('.equipe-row').forEach(row => {
    const qtd = row.querySelector('[name="eq-qtd"]').value;
    const funcao = row.querySelector('[name="eq-funcao"]').value;
    if (funcao) equipe.push({ qtd: parseInt(qtd), funcao });
  });

  const servicos = [];
  document.querySelectorAll('[name="servico"]').forEach(inp => {
    if (inp.value.trim()) servicos.push(inp.value.trim());
  });

  const pendentes = [];
  document.querySelectorAll('[name="pendente"]').forEach(inp => {
    if (inp.value.trim()) pendentes.push(inp.value.trim());
  });

  return {
    empresa: document.getElementById('empresa').value,
    cnpj: document.getElementById('cnpj').value,
    reportNum: document.getElementById('reportNum').value,
    obraNome: document.getElementById('obraNome').value,
    obraDesc: document.getElementById('obraDesc').value,
    dateFormatted,
    turno: `${document.getElementById('turnoInicio').value} às ${document.getElementById('turnoFim').value}`,
    respTecnico: document.getElementById('respTecnico').value,
    clima: document.getElementById('clima').value,
    climaDesc: document.getElementById('climaDesc').value,
    equipe,
    totalEquipe: equipe.reduce((sum, e) => sum + e.qtd, 0),
    servicos,
    pendentes,
    avanco: document.getElementById('avanco').value,
    situacao: document.getElementById('situacao').value,
    materiaisRecebidos: document.getElementById('materiaisRecebidos').value.trim(),
    materiaisFalta: document.getElementById('materiaisFalta').value.trim(),
    problemas: document.getElementById('problemas').value.trim(),
    fotos
  };
}

// ===== GENERATE PREVIEW =====
function generatePreview() {
  const d = collectData();
  const preview = document.getElementById('rdo-preview');

  const equipeSlots = [...d.equipe];
  while (equipeSlots.length < 4) equipeSlots.push({ qtd: '', funcao: '' });

  let equipeCardsHTML = equipeSlots.slice(0, 4).map(e =>
    `<div class="rdo-equipe-card">
      <div class="rdo-equipe-num">${e.qtd}</div>
      <div class="rdo-equipe-label">${e.funcao}</div>
    </div>`
  ).join('');

  let servicosRowsHTML = d.servicos.map(s =>
    `<tr class="rdo-servicos-row">
      <td class="rdo-servicos-bullet">›</td>
      <td>${s}</td>
    </tr>`
  ).join('');

  let pendentesRowsHTML = d.pendentes.map((p, i) =>
    `<tr class="rdo-pendente-row">
      <td class="rdo-servicos-bullet">›</td>
      <td>${p}</td>
    </tr>`
  ).join('');

  const fotoSlots = [];
  for (let i = 0; i < 14; i++) {
    if (d.fotos[i]) {
      fotoSlots.push(`<div class="rdo-foto-slot"><img src="${d.fotos[i]}"><span class="rdo-foto-num">Foto ${String(i+1).padStart(2,'0')}</span></div>`);
    } else {
      fotoSlots.push(`<div class="rdo-foto-slot">Foto ${String(i+1).padStart(2,'0')}</div>`);
    }
  }

  // Extra sections
  let extraHTML = '';
  if (d.materiaisRecebidos) {
    extraHTML += `
    <div class="rdo-extra-section">
      <div class="rdo-section-title"><span class="icon">${ICONS.box}</span> MATERIAIS RECEBIDOS</div>
      <div class="rdo-extra-box">${d.materiaisRecebidos}</div>
    </div>`;
  }
  if (d.materiaisFalta) {
    extraHTML += `
    <div class="rdo-extra-section">
      <div class="rdo-section-title"><span class="icon">${ICONS.warning}</span> MATERIAIS EM FALTA</div>
      <div class="rdo-extra-box">${d.materiaisFalta}</div>
    </div>`;
  }
  if (d.problemas) {
    extraHTML += `
    <div class="rdo-extra-section">
      <div class="rdo-section-title"><span class="icon">${ICONS.wrench}</span> PROBLEMAS COM MÁQUINA / FERRAMENTA</div>
      <div class="rdo-extra-box">${d.problemas}</div>
    </div>`;
  }

  preview.innerHTML = `
    <!-- HEADER -->
    <div class="rdo-header">
      <div class="rdo-header-left">
        <div class="rdo-company">${d.empresa}</div>
        <div class="rdo-title">RDO</div>
        <div class="rdo-subtitle">RELATÓRIO DIÁRIO DE OBRA</div>
      </div>
      <div class="rdo-header-right">
        <div class="rdo-date-box">
          <div class="rdo-date">${d.dateFormatted}</div>
          <div class="rdo-report-num">RELATÓRIO N° ${d.reportNum}</div>
        </div>
        <div class="rdo-cnpj">CNPJ: ${d.cnpj}</div>
      </div>
    </div>

    <!-- OBRA BAR -->
    <div class="rdo-obra-bar">
      <div class="rdo-obra-name">${d.obraNome}</div>
      <div class="rdo-obra-desc">${d.obraDesc}</div>
    </div>

    <!-- INFO CARDS -->
    <div class="rdo-info-cards">
      <div class="rdo-info-card">
        <div class="rdo-info-icon">${ICONS.worker}</div>
        <div class="rdo-info-label">RESP. TÉCNICO</div>
        <div class="rdo-info-value">${d.respTecnico}</div>
      </div>
      <div class="rdo-info-card">
        <div class="rdo-info-icon">${ICONS.sun}</div>
        <div class="rdo-info-label">CONDIÇÃO CLIMÁTICA</div>
        <div class="rdo-info-value">${d.clima}</div>
      </div>
      <div class="rdo-info-card">
        <div class="rdo-info-icon">${ICONS.people}</div>
        <div class="rdo-info-label">TOTAL EM CAMPO</div>
        <div class="rdo-info-value">${d.totalEquipe} profissionais</div>
      </div>
      <div class="rdo-info-card">
        <div class="rdo-info-icon">${ICONS.clock}</div>
        <div class="rdo-info-label">TURNO</div>
        <div class="rdo-info-value">${d.turno}</div>
      </div>
    </div>

    <!-- CLIMA BOX -->
    <div class="rdo-clima-box">
      <span class="icon">${ICONS.clima}</span>
      <div><strong>Condições Climáticas:</strong> ${d.climaDesc}</div>
    </div>

    <!-- EQUIPE -->
    <div class="rdo-section">
      <div class="rdo-section-title"><span class="icon">${ICONS.people}</span> EQUIPE EM CAMPO</div>
      <div class="rdo-equipe-grid">${equipeCardsHTML}</div>
      <div class="rdo-equipe-total">
        ${equipeSlots.slice(0,3).map(() => '<div></div>').join('')}
        <div style="text-align:center">
          <div class="rdo-equipe-num">${d.totalEquipe}</div>
          <div class="rdo-equipe-label">TOTAL</div>
        </div>
      </div>
    </div>

    <!-- SERVIÇOS -->
    <div class="rdo-section">
      <div class="rdo-section-title"><span class="icon">${ICONS.hammer}</span> SERVIÇOS EM EXECUÇÃO</div>
      <div class="rdo-servicos-header"><span class="num">01</span> SERVIÇOS EM EXECUÇÃO</div>
      <table class="rdo-servicos-table">${servicosRowsHTML}</table>
    </div>

    <!-- PENDENTES -->
    ${d.pendentes.length > 0 ? `
    <div class="rdo-section">
      <div class="rdo-section-title"><span class="icon">${ICONS.hourglass}</span> SERVIÇOS PENDENTES</div>
      <div class="rdo-pendentes-wrapper">
        <table class="rdo-servicos-table">${pendentesRowsHTML}</table>
      </div>
    </div>` : ''}

    <!-- AVANÇO -->
    <div class="rdo-section">
      <div class="rdo-section-title"><span class="icon">${ICONS.chart}</span> AVANÇO FÍSICO GERAL</div>
    </div>
    <div class="rdo-avanco-box">
      <div class="rdo-avanco-pct">${d.avanco}%</div>
      <div class="rdo-avanco-bar-container">
        <div class="rdo-avanco-bar-bg">
          <div class="rdo-avanco-bar-fill" style="width:${d.avanco}%"></div>
        </div>
        <div class="rdo-avanco-label">AVANÇO FÍSICO GERAL DA OBRA</div>
      </div>
    </div>

    <!-- SITUAÇÃO -->
    <div class="rdo-section">
      <div class="rdo-section-title"><span class="icon">${ICONS.clipboard}</span> SITUAÇÃO GERAL DA OBRA</div>
    </div>
    <div class="rdo-situacao-box">${d.situacao}</div>

    <!-- EXTRA SECTIONS -->
    ${extraHTML}

    <!-- FOTOS -->
    <div class="rdo-section">
      <div class="rdo-section-title"><span class="icon">${ICONS.camera}</span> REGISTRO FOTOGRÁFICO</div>
    </div>
    <div class="rdo-fotos-grid">${fotoSlots.join('')}</div>
    <div class="rdo-fotos-footer">
      ${d.fotos.length} fotos registradas  |  ${d.dateFormatted}  |  ${d.obraNome}
    </div>
  `;
}

// ===== AI TEXT PARSER =====
async function parseWithAI() {
  const text = document.getElementById('ai-text').value.trim();
  if (!text) { showAIStatus('Digite um texto sobre o dia da obra.', 'error'); return; }

  const apiKey = document.getElementById('ai-key').value.trim();
  if (!apiKey) { showAIStatus('Informe a API Key do MiMo.', 'error'); return; }

  const apiBase = document.getElementById('ai-base').value.trim() || 'https://generativelanguage.googleapis.com/v1beta';
  const model = document.getElementById('ai-model').value.trim() || 'gemini-2.0-flash';

  localStorage.setItem('rdo_api_key', apiKey);
  localStorage.setItem('rdo_api_base', apiBase);
  localStorage.setItem('rdo_api_model', model);

  const btn = document.querySelector('.btn-ai');
  btn.disabled = true;
  btn.classList.add('loading');
  showAIStatus('🤖 Analisando texto e preenchendo formulário...', 'loading');

  const systemPrompt = `Você é um parser de relatórios de obra. Dado um texto em linguagem natural sobre o dia de trabalho em uma obra de construção civil, extraia as informações e retorne APENAS um JSON válido (sem markdown, sem explicação) com esta estrutura exata:

{
  "empresa": "nome da empresa (se mencionado, senão vazio)",
  "cnpj": "CNPJ (se mencionado, senão vazio)",
  "reportNum": "número do relatório (se mencionado, senão vazio)",
  "obraNome": "nome da obra (se mencionado, senão vazio)",
  "obraDesc": "descrição da obra (se mencionado, senão vazio)",
  "respTecnico": "nome do responsável técnico (se mencionado, senão vazio)",
  "clima": "condição climática resumida (ex: Sol, nublado)",
  "climaDesc": "descrição detalhada do clima",
  "equipe": [{"qtd": 2, "funcao": "Pedreiros"}, {"qtd": 4, "funcao": "Ajudantes"}],
  "servicos": ["descrição do serviço 1", "descrição do serviço 2"],
  "pendentes": ["pendência 1", "pendência 2"],
  "avanco": 65,
  "situacao": "resumo geral da situação da obra",
  "turnoInicio": "07h00",
  "turnoFim": "17h00",
  "materiaisRecebidos": "materiais recebidos hoje (se mencionado, senão vazio)",
  "materiaisFalta": "materiais em falta (se mencionado, senão vazio)",
  "problemas": "problemas com máquinas ou ferramentas (se mencionado, senão vazio)"
}

Regras:
- Se uma informação não estiver no texto, use string vazia ou array vazio
- avanco deve ser número de 0 a 100 (estime com base no progresso descrito)
- equipe: extraia TODAS as funções e quantidades mencionadas
- servicos: extraia cada atividade como item separado
- pendentes: extraia serviços que ficaram para o próximo dia
- Mantenha os termos técnicos de construção como no texto original
- Retorne APENAS o JSON, nada mais`;

  try {
    // Use proxy to avoid CORS
    const resp = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, apiKey, apiBase, model }),
    });

    const data = await resp.json();
    if (!resp.ok) throw new Error(data.error || 'Erro desconhecido');

    fillForm(data);
    showAIStatus('✅ Formulário preenchido com sucesso!', 'success');
  } catch (err) {
    showAIStatus('❌ ' + err.message, 'error');
  } finally {
    btn.disabled = false;
    btn.classList.remove('loading');
  }
}

function showAIStatus(msg, type) {
  const el = document.getElementById('ai-status');
  el.textContent = msg;
  el.className = type;
}

function fillForm(data) {
  if (data.empresa) document.getElementById('empresa').value = data.empresa;
  if (data.cnpj) document.getElementById('cnpj').value = data.cnpj;
  if (data.reportNum) document.getElementById('reportNum').value = data.reportNum;
  if (data.obraNome) document.getElementById('obraNome').value = data.obraNome;
  if (data.obraDesc) document.getElementById('obraDesc').value = data.obraDesc;
  if (data.respTecnico) document.getElementById('respTecnico').value = data.respTecnico;
  if (data.clima) document.getElementById('clima').value = data.clima;
  if (data.climaDesc) document.getElementById('climaDesc').value = data.climaDesc;
  if (data.turnoInicio) document.getElementById('turnoInicio').value = data.turnoInicio;
  if (data.turnoFim) document.getElementById('turnoFim').value = data.turnoFim;
  if (data.situacao) document.getElementById('situacao').value = data.situacao;
  if (data.materiaisRecebidos) document.getElementById('materiaisRecebidos').value = data.materiaisRecebidos;
  if (data.materiaisFalta) document.getElementById('materiaisFalta').value = data.materiaisFalta;
  if (data.problemas) document.getElementById('problemas').value = data.problemas;
  if (data.avanco !== undefined) {
    document.getElementById('avanco').value = data.avanco;
    document.getElementById('avancoVal').textContent = data.avanco + '%';
  }

  if (data.equipe && data.equipe.length > 0) {
    const list = document.getElementById('equipe-list');
    list.innerHTML = '';
    data.equipe.forEach(e => {
      const div = document.createElement('div');
      div.className = 'equipe-row';
      div.innerHTML = `<input type="number" name="eq-qtd" value="${e.qtd}" min="0"><input type="text" name="eq-funcao" value="${e.funcao}"><button type="button" class="btn-remove" onclick="removeEquipe(this)">✕</button>`;
      list.appendChild(div);
    });
  }

  if (data.servicos && data.servicos.length > 0) {
    const list = document.getElementById('servicos-list');
    list.innerHTML = '';
    data.servicos.forEach(s => {
      const div = document.createElement('div');
      div.className = 'servico-row';
      div.innerHTML = `<input type="text" name="servico" value="${s}"><button type="button" class="btn-remove" onclick="removeServico(this)">✕</button>`;
      list.appendChild(div);
    });
  }

  if (data.pendentes && data.pendentes.length > 0) {
    const list = document.getElementById('pendentes-list');
    list.innerHTML = '';
    data.pendentes.forEach(p => {
      const div = document.createElement('div');
      div.className = 'servico-row';
      div.innerHTML = `<input type="text" name="pendente" value="${p}"><button type="button" class="btn-remove" onclick="removePendente(this)">✕</button>`;
      list.appendChild(div);
    });
  }

  generatePreview();
}

// ===== EXPORT DOCX =====
async function exportDOCX() {
  const d = collectData();
  const { Document, Packer, Paragraph, Table, TableRow, TableCell, TextRun, AlignmentType, WidthType, BorderStyle, ShadingType, convertInchesToTwip, ImageRun } = docx;

  const DARK = '0d2b4e', BLUE = '2d7dd2', ORANGE = 'f5a623', GRAY = '666666';
  const GRAY_LABEL = 'aaaaaa', BLUE_LIGHT = 'e3f2fd', GRAY_BG = 'f4f6f9', GREEN_BG = 'e8f5e9';
  const borderNone = { style: BorderStyle.NONE, size: 0 };
  const borderThin = { style: BorderStyle.SINGLE, size: 1, color: 'e0e0e0' };

  async function dataURLToArrayBuffer(dataURL) {
    const resp = await fetch(dataURL);
    return resp.arrayBuffer();
  }

  const sections = [];

  // HEADER
  sections.push(new Table({ rows: [
    new TableRow({ children: [
      new TableCell({ children: [
        new Paragraph({ children: [new TextRun({ text: d.empresa, font: 'Arial', size: 14, color: ORANGE, bold: true })] }),
        new Paragraph({ children: [new TextRun({ text: 'RDO', font: 'Arial', size: 56, color: 'ffffff', bold: true })] }),
        new Paragraph({ children: [new TextRun({ text: 'RELATÓRIO DIÁRIO DE OBRA', font: 'Arial', size: 16, color: GRAY_LABEL })] }),
      ], shading: { type: ShadingType.CLEAR, fill: DARK }, borders: { top: borderNone, bottom: borderNone, left: borderNone, right: borderNone } }),
      new TableCell({ children: [
        new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: d.dateFormatted, font: 'Arial', size: 32, color: DARK, bold: true })] }),
        new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'RELATÓRIO N° ' + d.reportNum, font: 'Arial', size: 14, color: GRAY_LABEL })] }),
        new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'CNPJ: ' + d.cnpj, font: 'Arial', size: 14, color: GRAY_LABEL })] }),
      ], shading: { type: ShadingType.CLEAR, fill: DARK }, borders: { top: borderNone, bottom: borderNone, left: borderNone, right: borderNone }, width: { size: 3000, type: WidthType.DXA } }),
    ] }),
    new TableRow({ children: [new TableCell({ children: [
      new Paragraph({ children: [new TextRun({ text: d.obraNome, font: 'Arial', size: 26, color: 'ffffff', bold: true })] }),
      new Paragraph({ children: [new TextRun({ text: d.obraDesc, font: 'Arial', size: 16, color: GRAY_LABEL })] }),
    ], shading: { type: ShadingType.CLEAR, fill: DARK }, columnSpan: 2, borders: { top: borderNone, bottom: borderNone, left: borderNone, right: borderNone } })] }),
  ], width: { size: 100, type: WidthType.PERCENTAGE } }));

  // INFO CARDS
  const infoItems = [
    { label: 'RESP. TÉCNICO', value: d.respTecnico },
    { label: 'CONDIÇÃO CLIMÁTICA', value: d.clima },
    { label: 'TOTAL EM CAMPO', value: d.totalEquipe + ' profissionais' },
    { label: 'TURNO', value: d.turno },
  ];
  sections.push(new Table({ rows: [new TableRow({ children: infoItems.map(item =>
    new TableCell({ children: [
      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: item.label, font: 'Arial', size: 14, color: BLUE, bold: true })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: item.value, font: 'Arial', size: 22, color: DARK, bold: true })] }),
    ], borders: { top: borderThin, bottom: borderThin, left: borderThin, right: borderThin } })
  ) }) ], width: { size: 100, type: WidthType.PERCENTAGE } }));

  // CLIMA
  sections.push(new Table({ rows: [new TableRow({ children: [new TableCell({ children: [
    new Paragraph({ children: [new TextRun({ text: 'Condições Climáticas: ', font: 'Arial', size: 19, color: '0d47a1', bold: true }), new TextRun({ text: d.climaDesc, font: 'Arial', size: 19, color: '0d47a1' })] }),
  ], shading: { type: ShadingType.CLEAR, fill: BLUE_LIGHT }, borders: { top: borderNone, bottom: borderNone, left: { style: BorderStyle.SINGLE, size: 12, color: BLUE }, right: borderNone } }) ] }) ], width: { size: 100, type: WidthType.PERCENTAGE } }));

  // EQUIPE
  const eqCards = d.equipe.slice(0, 4);
  while (eqCards.length < 4) eqCards.push({ qtd: '', funcao: '' });
  sections.push(new Paragraph({ spacing: { before: 200 }, children: [new TextRun({ text: 'EQUIPE EM CAMPO', font: 'Arial', size: 22, color: DARK, bold: true })] }));
  sections.push(new Table({ rows: [
    new TableRow({ children: eqCards.map(e => new TableCell({ children: [
      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: String(e.qtd), font: 'Arial', size: 42, color: BLUE, bold: true })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: e.funcao, font: 'Arial', size: 17, color: GRAY })] }),
    ], shading: { type: ShadingType.CLEAR, fill: GRAY_BG }, borders: { top: borderThin, bottom: borderThin, left: borderThin, right: borderThin } })) }),
    new TableRow({ children: [
      new TableCell({ children: [], borders: borderNone }),
      new TableCell({ children: [], borders: borderNone }),
      new TableCell({ children: [], borders: borderNone }),
      new TableCell({ children: [
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: String(d.totalEquipe), font: 'Arial', size: 42, color: ORANGE, bold: true })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'TOTAL', font: 'Arial', size: 17, color: GRAY_LABEL })] }),
      ], shading: { type: ShadingType.CLEAR, fill: DARK }, borders: { top: borderThin, bottom: borderThin, left: borderThin, right: borderThin } }),
    ] }),
  ], width: { size: 100, type: WidthType.PERCENTAGE } }));

  // SERVIÇOS
  sections.push(new Paragraph({ spacing: { before: 300 }, children: [new TextRun({ text: 'SERVIÇOS EM EXECUÇÃO', font: 'Arial', size: 22, color: DARK, bold: true })] }));
  const servRows = [new TableRow({ children: [new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '01  SERVIÇOS EM EXECUÇÃO', font: 'Arial', size: 20, color: 'ffffff', bold: true })] })], shading: { type: ShadingType.CLEAR, fill: DARK }, columnSpan: 2, borders: { top: borderNone, bottom: borderNone, left: borderNone, right: borderNone } })] })];
  d.servicos.forEach(s => { servRows.push(new TableRow({ children: [
    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '›', font: 'Arial', size: 18, color: BLUE, bold: true })] })], width: { size: 500, type: WidthType.DXA }, borders: { top: borderNone, bottom: borderThin, left: borderNone, right: borderNone } }),
    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: s, font: 'Arial', size: 18 })] })], borders: { top: borderNone, bottom: borderThin, left: borderNone, right: borderNone } }),
  ] })); });
  sections.push(new Table({ rows: servRows, width: { size: 100, type: WidthType.PERCENTAGE } }));

  // PENDENTES
  if (d.pendentes.length > 0) {
    sections.push(new Paragraph({ spacing: { before: 300 }, children: [new TextRun({ text: 'SERVIÇOS PENDENTES', font: 'Arial', size: 22, color: DARK, bold: true })] }));
    const pendRows = [];
    d.pendentes.forEach(p => { pendRows.push(new TableRow({ children: [
      new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '›', font: 'Arial', size: 18, color: BLUE, bold: true })] })], width: { size: 500, type: WidthType.DXA }, shading: { type: ShadingType.CLEAR, fill: 'fff9e6' }, borders: { top: borderNone, bottom: borderThin, left: { style: BorderStyle.SINGLE, size: 12, color: ORANGE }, right: borderNone } }),
      new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: p, font: 'Arial', size: 18 })] })], shading: { type: ShadingType.CLEAR, fill: 'fff9e6' }, borders: { top: borderNone, bottom: borderThin, left: borderNone, right: borderNone } }),
    ] })); });
    sections.push(new Table({ rows: pendRows, width: { size: 100, type: WidthType.PERCENTAGE } }));
  }

  // AVANÇO
  sections.push(new Paragraph({ spacing: { before: 300 }, children: [new TextRun({ text: 'AVANÇO FÍSICO GERAL', font: 'Arial', size: 22, color: DARK, bold: true })] }));
  sections.push(new Table({ rows: [new TableRow({ children: [
    new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: d.avanco + '%', font: 'Arial', size: 56, color: ORANGE, bold: true })] })], shading: { type: ShadingType.CLEAR, fill: DARK }, width: { size: 2500, type: WidthType.DXA }, borders: { top: borderNone, bottom: borderNone, left: borderNone, right: borderNone } }),
    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'AVANÇO FÍSICO GERAL DA OBRA', font: 'Arial', size: 14, color: GRAY_LABEL, bold: true })] })], shading: { type: ShadingType.CLEAR, fill: DARK }, borders: { top: borderNone, bottom: borderNone, left: borderNone, right: borderNone } }),
  ] }) ], width: { size: 100, type: WidthType.PERCENTAGE } }));

  // SITUAÇÃO
  sections.push(new Paragraph({ spacing: { before: 300 }, children: [new TextRun({ text: 'SITUAÇÃO GERAL DA OBRA', font: 'Arial', size: 22, color: DARK, bold: true })] }));
  sections.push(new Table({ rows: [new TableRow({ children: [new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: d.situacao, font: 'Arial', size: 19, color: '2e7d32' })] })], shading: { type: ShadingType.CLEAR, fill: GREEN_BG }, borders: { top: borderNone, bottom: borderNone, left: { style: BorderStyle.SINGLE, size: 12, color: '4caf50' }, right: borderNone } })] }) ], width: { size: 100, type: WidthType.PERCENTAGE } }));

  // EXTRA SECTIONS
  if (d.materiaisRecebidos) {
    sections.push(new Paragraph({ spacing: { before: 300 }, children: [new TextRun({ text: 'MATERIAIS RECEBIDOS', font: 'Arial', size: 22, color: DARK, bold: true })] }));
    sections.push(new Table({ rows: [new TableRow({ children: [new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: d.materiaisRecebidos, font: 'Arial', size: 18 })] })], shading: { type: ShadingType.CLEAR, fill: GRAY_BG }, borders: borderThin })] }) ], width: { size: 100, type: WidthType.PERCENTAGE } }));
  }
  if (d.materiaisFalta) {
    sections.push(new Paragraph({ spacing: { before: 300 }, children: [new TextRun({ text: 'MATERIAIS EM FALTA', font: 'Arial', size: 22, color: DARK, bold: true })] }));
    sections.push(new Table({ rows: [new TableRow({ children: [new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: d.materiaisFalta, font: 'Arial', size: 18 })] })], shading: { type: ShadingType.CLEAR, fill: GRAY_BG }, borders: borderThin })] }) ], width: { size: 100, type: WidthType.PERCENTAGE } }));
  }
  if (d.problemas) {
    sections.push(new Paragraph({ spacing: { before: 300 }, children: [new TextRun({ text: 'PROBLEMAS COM MÁQUINA / FERRAMENTA', font: 'Arial', size: 22, color: DARK, bold: true })] }));
    sections.push(new Table({ rows: [new TableRow({ children: [new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: d.problemas, font: 'Arial', size: 18 })] })], shading: { type: ShadingType.CLEAR, fill: GRAY_BG }, borders: borderThin })] }) ], width: { size: 100, type: WidthType.PERCENTAGE } }));
  }

  // FOTOS
  sections.push(new Paragraph({ spacing: { before: 300 }, children: [new TextRun({ text: 'REGISTRO FOTOGRÁFICO', font: 'Arial', size: 22, color: DARK, bold: true })] }));
  const fotoRows = [];
  for (let i = 0; i < 14; i += 3) {
    const rowCells = [];
    for (let j = i; j < i + 3 && j < 14; j++) {
      const cellChildren = [];
      if (d.fotos[j]) {
        try {
          const imgBuf = await dataURLToArrayBuffer(d.fotos[j]);
          cellChildren.push(new Paragraph({ alignment: AlignmentType.CENTER, children: [new ImageRun({ data: imgBuf, transformation: { width: 200, height: 150 }, type: 'jpg' })] }));
        } catch(e) {
          cellChildren.push(new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `Foto ${String(j+1).padStart(2,'0')}`, font: 'Arial', size: 14, color: GRAY_LABEL })] }));
        }
      } else {
        cellChildren.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 100 }, children: [new TextRun({ text: `Foto ${String(j+1).padStart(2,'0')}`, font: 'Arial', size: 14, color: GRAY_LABEL })] }));
      }
      rowCells.push(new TableCell({ children: cellChildren, shading: { type: ShadingType.CLEAR, fill: GRAY_BG }, borders: borderThin, width: { size: 3333, type: WidthType.DXA } }));
    }
    fotoRows.push(new TableRow({ children: rowCells }));
  }
  sections.push(new Table({ rows: fotoRows, width: { size: 100, type: WidthType.PERCENTAGE } }));
  sections.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 100 }, children: [new TextRun({ text: `${d.fotos.length} fotos registradas  |  ${d.dateFormatted}  |  ${d.obraNome}`, font: 'Arial', size: 11, color: GRAY_LABEL })] }));

  const doc = new Document({ sections: [{ properties: { page: { margin: { top: convertInchesToTwip(0.5), bottom: convertInchesToTwip(0.5), left: convertInchesToTwip(0.6), right: convertInchesToTwip(0.6) } } }, children: sections }] });
  const blob = await Packer.toBlob(doc);
  saveAs(blob, `RDO_${d.dateFormatted.replace(/\s\/\s/g, '-')}.docx`);

  // Auto-increment report number
  const key = 'rdo_report_num';
  const current = parseInt(localStorage.getItem(key) || '1');
  const next = current + 1;
  localStorage.setItem(key, String(next));
  document.getElementById('reportNum').value = String(next).padStart(3, '0');
}

// ===== EXPORT PDF =====
function exportPDF() {
  const el = document.getElementById('rdo-preview');
  const d = collectData();

  // Temporarily disable edit mode outlines
  const editableEls = el.querySelectorAll('[contenteditable]');
  editableEls.forEach(e => {
    e.style.outline = 'none';
    e.style.cursor = 'default';
  });

  const opt = {
    margin: [5, 5, 5, 5],
    filename: `RDO_${d.dateFormatted.replace(/\s\/\s/g, '-')}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, letterRendering: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
  };

  html2pdf().set(opt).from(el).save().then(() => {
    // Restore edit mode outlines if active
    if (editMode) {
      editableEls.forEach(e => {
        e.style.outline = '2px dashed #7c3aed';
        e.style.cursor = 'text';
      });
    }
  });
}

// ===== EDIT MODE =====
let editMode = false;

function toggleEdit() {
  editMode = !editMode;
  const btn = document.getElementById('btn-edit');
  const preview = document.getElementById('rdo-preview');

  if (editMode) {
    btn.textContent = '💾 Salvar Edições';
    btn.classList.add('active');
    makePreviewEditable();
  } else {
    btn.textContent = '✏️ Editar Preview';
    btn.classList.remove('active');
    syncPreviewToForm();
    generatePreview();
  }
}

function makePreviewEditable() {
  const preview = document.getElementById('rdo-preview');
  // Make key text elements editable
  const editableSelectors = [
    '.rdo-company', '.rdo-title', '.rdo-subtitle',
    '.rdo-obra-name', '.rdo-obra-desc',
    '.rdo-info-value', '.rdo-info-label',
    '.rdo-clima-box',
    '.rdo-equipe-num', '.rdo-equipe-label',
    '.rdo-servicos-row td:last-child',
    '.rdo-pendente-row td:last-child',
    '.rdo-avanco-pct',
    '.rdo-situacao-box',
    '.rdo-extra-box',
    '.rdo-foto-num'
  ];

  editableSelectors.forEach(sel => {
    preview.querySelectorAll(sel).forEach(el => {
      el.contentEditable = 'true';
      el.style.outline = '2px dashed #7c3aed';
      el.style.outlineOffset = '2px';
      el.style.cursor = 'text';
      el.style.minHeight = '1em';
    });
  });

  // Also make table cells editable
  preview.querySelectorAll('.rdo-servicos-row td:last-child, .rdo-pendente-row td:last-child').forEach(el => {
    el.contentEditable = 'true';
    el.style.outline = '2px dashed #7c3aed';
    el.style.outlineOffset = '2px';
  });
}

function syncPreviewToForm() {
  const preview = document.getElementById('rdo-preview');

  // Sync text fields back to form
  const empresa = preview.querySelector('.rdo-company');
  if (empresa) document.getElementById('empresa').value = empresa.textContent.trim();

  const obraName = preview.querySelector('.rdo-obra-name');
  if (obraName) document.getElementById('obraNome').value = obraName.textContent.trim();

  const obraDesc = preview.querySelector('.rdo-obra-desc');
  if (obraDesc) document.getElementById('obraDesc').value = obraDesc.textContent.trim();

  const situacao = preview.querySelector('.rdo-situacao-box');
  if (situacao) document.getElementById('situacao').value = situacao.textContent.trim();

  const climaBox = preview.querySelector('.rdo-clima-box');
  if (climaBox) {
    const text = climaBox.textContent.replace('Condições Climáticas:', '').trim();
    document.getElementById('climaDesc').value = text;
  }

  // Sync info cards
  const infoValues = preview.querySelectorAll('.rdo-info-value');
  const infoLabels = preview.querySelectorAll('.rdo-info-label');
  if (infoValues[0]) document.getElementById('respTecnico').value = infoValues[0].textContent.trim();
  if (infoValues[1]) document.getElementById('clima').value = infoValues[1].textContent.trim();
  if (infoValues[3]) {
    const turno = infoValues[3].textContent.trim();
    const parts = turno.split(' às ');
    if (parts.length === 2) {
      document.getElementById('turnoInicio').value = parts[0];
      document.getElementById('turnoFim').value = parts[1];
    }
  }

  // Sync equipe
  const eqNums = preview.querySelectorAll('.rdo-equipe-card .rdo-equipe-num');
  const eqLabels = preview.querySelectorAll('.rdo-equipe-card .rdo-equipe-label');
  const equipeList = document.getElementById('equipe-list');
  equipeList.innerHTML = '';
  eqNums.forEach((num, i) => {
    const qtd = parseInt(num.textContent) || 0;
    const funcao = eqLabels[i]?.textContent.trim() || '';
    if (funcao) {
      const div = document.createElement('div');
      div.className = 'equipe-row';
      div.innerHTML = `<input type="number" name="eq-qtd" value="${qtd}" min="0"><input type="text" name="eq-funcao" value="${funcao}"><button type="button" class="btn-remove" onclick="removeEquipe(this)">✕</button>`;
      equipeList.appendChild(div);
    }
  });

  // Sync servicos
  const servRows = preview.querySelectorAll('.rdo-servicos-row td:last-child');
  const servList = document.getElementById('servicos-list');
  servList.innerHTML = '';
  servRows.forEach(td => {
    const text = td.textContent.trim();
    if (text) {
      const div = document.createElement('div');
      div.className = 'servico-row';
      div.innerHTML = `<input type="text" name="servico" value="${text}"><button type="button" class="btn-remove" onclick="removeServico(this)">✕</button>`;
      servList.appendChild(div);
    }
  });

  // Sync pendentes
  const pendRows = preview.querySelectorAll('.rdo-pendente-row td:last-child');
  const pendList = document.getElementById('pendentes-list');
  pendList.innerHTML = '';
  pendRows.forEach(td => {
    const text = td.textContent.trim();
    if (text) {
      const div = document.createElement('div');
      div.className = 'servico-row';
      div.innerHTML = `<input type="text" name="pendente" value="${text}"><button type="button" class="btn-remove" onclick="removePendente(this)">✕</button>`;
      pendList.appendChild(div);
    }
  });

  // Sync avanço
  const avancoEl = preview.querySelector('.rdo-avanco-pct');
  if (avancoEl) {
    const val = parseInt(avancoEl.textContent) || 0;
    document.getElementById('avanco').value = val;
    document.getElementById('avancoVal').textContent = val + '%';
  }

  // Sync extras
  const extraBoxes = preview.querySelectorAll('.rdo-extra-box');
  const extraTitles = preview.querySelectorAll('.rdo-section-title');
  extraBoxes.forEach((box, i) => {
    const title = extraTitles[i + 6]?.textContent.trim() || ''; // offset by standard sections
    if (title.includes('RECEBIDOS')) document.getElementById('materiaisRecebidos').value = box.textContent.trim();
    if (title.includes('FALTA')) document.getElementById('materiaisFalta').value = box.textContent.trim();
    if (title.includes('PROBLEMAS')) document.getElementById('problemas').value = box.textContent.trim();
  });
}

// ===== INIT =====
generatePreview();
