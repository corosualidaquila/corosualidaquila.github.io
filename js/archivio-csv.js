/* ============================================================
   ARCHIVIO — generazione automatica da archivio.csv
   
   Struttura CSV:
   nome,link,tipo,categoria
   tipo: testo | spartito
   categoria: natale | pasqua | altro
   ============================================================ */

async function buildArchivioFromCSV() {
  try {
    const response = await fetch('js/archivio.csv');
    if (!response.ok) throw new Error('CSV non trovato');
    const text = await response.text();
    const files = parseCSV(text);

    // [gridId, tipo, categoria, isAZ]
    const sezioni = [
      ['grid-t-natale', 'testo',    'natale', false],
      ['grid-t-pasqua', 'testo',    'pasqua', false],
      ['t-altri',       'testo',    'altro',  true ],
      ['grid-s-natale', 'spartito', 'natale', false],
      ['grid-s-pasqua', 'spartito', 'pasqua', false],
      ['s-altri',       'spartito', 'altro',  true ],
    ];

    sezioni.forEach(([id, tipo, categoria, isAZ]) => {
      const subset = files.filter(f => f.tipo === tipo && f.categoria === categoria);
      if (isAZ) {
        renderAlphaGrid(subset, id);
      } else {
        renderFlatGrid(subset, id);
      }
    });

  } catch (err) {
    console.error('Errore caricamento archivio.csv:', err);
  }
}

/* ── Parsing CSV ── */
function parseCSV(text) {
  const lines = text.trim().split('\n');
  const files = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const parts = line.split(',');
    if (parts.length < 4) continue;

    const nome      = parts[0].trim();
    const categoria = parts[parts.length - 1].trim();
    const tipo      = parts[parts.length - 2].trim();
    const link      = parts.slice(1, parts.length - 2).join(',').trim();

    files.push({
      nome:     formatTitle(nome),
      link:     link,
      tipo:     tipo,
      categoria:categoria,
      lettera:  formatTitle(nome)[0].toUpperCase()
    });
  }

  files.sort((a, b) => a.nome.localeCompare(b.nome, 'it'));
  return files;
}

function formatTitle(raw) {
  const name = raw.replace(/\.pdf$/i, '').trim();
  return name.length > 0 ? name[0].toUpperCase() + name.slice(1).toLowerCase() : name;
}

function toDriveDownload(link) {
  const match = link.match(/\/d\/([a-zA-Z0-9_-]+)/);
  return match ? `https://drive.google.com/uc?export=download&id=${match[1]}` : link;
}

function makeCard(f, isSparto) {
  const a = document.createElement('a');
  a.className = 'file-card';
  a.href      = toDriveDownload(f.link);
  a.download  = '';
  a.innerHTML = `
    <div class="file-icon ${isSparto ? 'mus' : 'pdf'}">
      <i class="fas ${isSparto ? 'fa-music' : 'fa-file-pdf'}"></i>
    </div>
    <div class="file-info">
      <div class="file-name">${f.nome}</div>
      <div class="file-meta">${isSparto ? 'PDF · Spartito' : 'PDF'}</div>
    </div>
    <i class="fas fa-download file-dl"></i>`;
  return a;
}

/* ── Lista piatta per Natale / Pasqua (appende al file-grid esistente) ── */
function renderFlatGrid(files, gridId) {
  const grid = document.getElementById(gridId);
  if (!grid || files.length === 0) return;

  const isSparto = gridId.startsWith('grid-s-');
  grid.innerHTML = '';
  files.forEach(f => grid.appendChild(makeCard(f, isSparto)));
}

/* ── Griglia A-Z per Altri (popola il container direttamente) ── */
function renderAlphaGrid(files, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const isSparto = containerId.startsWith('s-');
  const hint     = container.querySelector('.upload-hint');
  container.innerHTML = '';
  if (hint) container.appendChild(hint);

  if (files.length === 0) return;

  const groups = {};
  files.forEach(f => {
    groups[f.lettera] = groups[f.lettera] || [];
    groups[f.lettera].push(f);
  });

  Object.keys(groups).sort().forEach(letter => {
    const group = document.createElement('div');
    group.className = 'alpha-group';

    const letterEl = document.createElement('div');
    letterEl.className = 'alpha-letter';
    letterEl.textContent = letter;
    group.appendChild(letterEl);

    const grid = document.createElement('div');
    grid.className = 'file-grid';
    groups[letter].forEach(f => grid.appendChild(makeCard(f, isSparto)));

    group.appendChild(grid);
    container.appendChild(group);
  });
}

document.addEventListener('DOMContentLoaded', buildArchivioFromCSV);
