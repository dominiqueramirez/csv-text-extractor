// app.js: CSV Text Extractor App

// DOM Elements
const uploadArea = document.getElementById('upload-area');
const fileInput = document.getElementById('file-input');
const filenameDisplay = document.getElementById('filename-display');
const copyBtn = document.getElementById('copy-btn');
const downloadBtn = document.getElementById('download-btn');
const extractedTextArea = document.getElementById('extracted-text');
const toast = document.getElementById('toast');

let extractedText = '';
let extractedSegments = [];
let uploadedFilenames = [];

// --- Upload Area Events ---
function highlightUploadArea(on) {
  uploadArea.classList.toggle('dragover', on);
}

uploadArea.addEventListener('click', () => fileInput.click());
uploadArea.addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === ' ') fileInput.click();
});
uploadArea.addEventListener('dragover', e => {
  e.preventDefault();
  highlightUploadArea(true);
});
uploadArea.addEventListener('dragleave', e => {
  e.preventDefault();
  highlightUploadArea(false);
});
uploadArea.addEventListener('drop', e => {
  e.preventDefault();
  highlightUploadArea(false);
  if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
});
fileInput.setAttribute('multiple', 'multiple');
fileInput.addEventListener('change', e => {
  if (e.target.files.length) handleFiles(e.target.files);
});

function handleFiles(fileList) {
  // Accept FileList or array
  const files = Array.from(fileList);
  let filesProcessed = 0;
  files.forEach(file => {
    if (!file.name.endsWith('.csv')) {
      showToast('Please upload a .csv file.', true);
      return;
    }
    const reader = new FileReader();
    reader.onload = e => {
      const csv = e.target.result;
      try {
        const {text, segments} = extractColumnD(csv, true);
        // Append new content
        if (extractedText) extractedText += '\n\n';
        extractedText += text;
        extractedSegments = extractedSegments.concat(segments);
        uploadedFilenames.push(file.name);
        extractedTextArea.value = extractedText;
        copyBtn.disabled = downloadBtn.disabled = !extractedText;
        renderSegmentsList();
        filesProcessed++;
        if (filesProcessed === files.length) {
          filenameDisplay.textContent = uploadedFilenames.join(', ');
          showToast('Text extracted from column D!', false);
        }
      } catch (err) {
        showToast('Invalid CSV format. Ensure at least 4 columns.', true);
      }
    };
    reader.readAsText(file, 'utf-8');
  });
}

// --- CSV Parsing & Extraction ---
function extractColumnD(csv, returnSegments = false) {
  // Simple CSV parser (handles quoted fields, commas, newlines)
  const rows = [];
  let row = [], field = '', inQuotes = false, i = 0;
  while (i < csv.length) {
    const c = csv[i];
    if (inQuotes) {
      if (c === '"') {
        if (csv[i+1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += c;
    } else {
      if (c === '"') inQuotes = true;
      else if (c === ',') { row.push(field); field = ''; }
      else if (c === '\n' || c === '\r') {
        if (field !== '' || row.length > 0) { row.push(field); rows.push(row); }
        row = []; field = '';
        // Handle \r\n
        if (c === '\r' && csv[i+1] === '\n') i++;
      } else field += c;
    }
    i++;
  }
  if (field !== '' || row.length > 0) { row.push(field); rows.push(row); }
  // Remove empty trailing rows
  while (rows.length && rows[rows.length-1].every(cell => !cell)) rows.pop();
  // Validate at least 4 columns
  if (!rows.length || rows[0].length < 4) throw new Error('Invalid CSV');
  const segments = rows.slice(1).map(r => (r[3] || '').trim());
  const text = segments.join('\n\n').trim();
  return returnSegments ? {text, segments} : text;
}

// --- Copy & Download ---
copyBtn.addEventListener('click', () => {
  if (!extractedText) return;
  navigator.clipboard.writeText(extractedText).then(() => {
    showToast('Copied to clipboard!', false);
  });
});

downloadBtn.addEventListener('click', () => {
  if (!extractedText) return;
  const blob = new Blob([extractedText], { type: 'text/plain;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = (uploadedFilenames.join('_') || 'columnD-text') + '.txt';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
  }, 100);
});

function renderSegmentsList() {
  const list = document.getElementById('segments-list');
  if (!list) return;
  list.innerHTML = '';
  if (!extractedSegments || !extractedSegments.length) {
    list.innerHTML = '<div class="segment-empty">No segments to display.</div>';
    return;
  }
  extractedSegments.forEach((seg, idx) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'segment-row';
    const textDiv = document.createElement('div');
    textDiv.className = 'segment-text';
    textDiv.textContent = seg;
    const btn = document.createElement('button');
    btn.className = 'btn btn-segment-copy';
    btn.innerHTML = '<span>📋</span> Copy';
    btn.onclick = () => {
      navigator.clipboard.writeText(seg).then(() => {
        showToast('Segment copied!', false);
      });
    };
    wrapper.appendChild(textDiv);
    wrapper.appendChild(btn);
    list.appendChild(wrapper);
  });
}

// --- Toast/Feedback ---
function showToast(msg, isError) {
  toast.textContent = msg;
  toast.style.background = isError ? '#b00020' : '#5f2c82';
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 1800);
}

// --- Accessibility: focus style for upload area ---
uploadArea.addEventListener('focus', () => highlightUploadArea(true));
uploadArea.addEventListener('blur', () => highlightUploadArea(false));
