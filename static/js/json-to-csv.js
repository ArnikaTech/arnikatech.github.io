(function() {
  // Tab switching
  const tab1 = document.getElementById('tabJsonToCsv');
  const tab2 = document.getElementById('tabCsvToJson');
  const section1 = document.getElementById('jsonToCsvSection');
  const section2 = document.getElementById('csvToJsonSection');
  
  tab1.addEventListener('click', () => {
    tab1.style.background = 'rgba(109,40,217,0.2)'; tab1.style.color = '#c4b5fd'; tab1.style.border = '1px solid rgba(109,40,217,0.3)';
    tab2.style.background = ''; tab2.style.color = '#9ca3af'; tab2.style.border = '1px solid transparent';
    section1.classList.remove('d-none'); section2.classList.add('d-none');
  });
  tab2.addEventListener('click', () => {
    tab2.style.background = 'rgba(109,40,217,0.2)'; tab2.style.color = '#c4b5fd'; tab2.style.border = '1px solid rgba(109,40,217,0.3)';
    tab1.style.background = ''; tab1.style.color = '#9ca3af'; tab1.style.border = '1px solid transparent';
    section2.classList.remove('d-none'); section1.classList.add('d-none');
  });
  
  // JSON → CSV
  const jsonInput = document.getElementById('jsonInput');
  const csvOutput = document.getElementById('csvOutput');
  const tablePreview = document.getElementById('tablePreview');
  const copyCsvBtn = document.getElementById('copyCsvBtn');
  const downloadCsvBtn = document.getElementById('downloadCsvBtn');
  
  document.getElementById('convertToCsvBtn').addEventListener('click', () => {
    try {
      const data = JSON.parse(jsonInput.value);
      const array = Array.isArray(data) ? data : [data];
      if (!array.length) return;
      const headers = Object.keys(array[0]);
      const lines = [headers.join(',')];
      array.forEach(row => lines.push(headers.map(h => `"${String(row[h]||'').replace(/"/g,'""')}"`).join(',')));
      const csv = lines.join('\n');
      csvOutput.value = csv;
      
      let html = '<table class="table table-sm mb-0" style="font-size:0.8rem;"><thead><tr>' + headers.map(h => `<th class="text-end text-white">${h}</th>`).join('') + '</tr></thead><tbody>';
      array.forEach(row => html += '<tr>' + headers.map(h => `<td class="text-secondary">${row[h]||''}</td>`).join('') + '</tr>');
      html += '</tbody></table>';
      tablePreview.innerHTML = html;
      copyCsvBtn.classList.remove('d-none'); downloadCsvBtn.classList.remove('d-none');
    } catch(e) {
      csvOutput.value = ''; tablePreview.innerHTML = `<small class="text-danger">${e.message}</small>`;
    }
  });
  
  copyCsvBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(csvOutput.value);
    copyCsvBtn.innerHTML = '<i class="bi bi-check-lg"></i> کپی شد';
    setTimeout(() => copyCsvBtn.innerHTML = '<i class="bi bi-clipboard"></i> کپی', 2000);
  });
  
  downloadCsvBtn.addEventListener('click', () => {
    const blob = new Blob(['\uFEFF'+csvOutput.value], {type:'text/csv'});
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'data.csv'; a.click();
  });
  
  // CSV → JSON
  const csvInput = document.getElementById('csvInput');
  const jsonOutput = document.getElementById('jsonOutput');
  const copyJsonBtn = document.getElementById('copyJsonBtn');
  const downloadJsonBtn = document.getElementById('downloadJsonBtn');
  
  document.getElementById('convertToJsonBtn').addEventListener('click', () => {
    try {
      const lines = csvInput.value.trim().split('\n').filter(l => l.trim());
      if (lines.length < 2) return;
      const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g,''));
      const result = [];
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g,''));
        const obj = {};
        headers.forEach((h, idx) => obj[h] = values[idx] || '');
        result.push(obj);
      }
      jsonOutput.value = JSON.stringify(result, null, 2);
      copyJsonBtn.classList.remove('d-none'); downloadJsonBtn.classList.remove('d-none');
    } catch(e) {
      jsonOutput.value = ''; 
    }
  });
  
  copyJsonBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(jsonOutput.value);
    copyJsonBtn.innerHTML = '<i class="bi bi-check-lg"></i> کپی شد';
    setTimeout(() => copyJsonBtn.innerHTML = '<i class="bi bi-clipboard"></i> کپی', 2000);
  });
  
  downloadJsonBtn.addEventListener('click', () => {
    const blob = new Blob([jsonOutput.value], {type:'application/json'});
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'data.json'; a.click();
  });
})();