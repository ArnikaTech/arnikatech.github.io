(function() {
  const input = document.getElementById('compressorInput');
  const dropZone = document.getElementById('compressorDropZone');
  const preview = document.getElementById('compressorPreview');
  const result = document.getElementById('compressorResult');
  let allResults = [];
  
  dropZone.addEventListener('click', () => input.click());
  dropZone.addEventListener('dragover', (e) => { e.preventDefault(); });
  dropZone.addEventListener('drop', (e) => { e.preventDefault(); if (e.dataTransfer.files.length) { input.files = e.dataTransfer.files; handleFiles(); } });
  input.addEventListener('change', handleFiles);
  
  async function handleFiles() {
    const files = input.files;
    if (!files.length) return;
    
    let totalSize = 0;
    let html = '';
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      totalSize += file.size;
      const dataUrl = await readFileAsDataURL(file);
      html += '<div class="text-center" style="width: 80px;"><img src="' + dataUrl + '" class="rounded-2" style="width: 60px; height: 60px; object-fit: cover; background: rgba(0,0,0,0.3);"><small class="text-secondary d-block text-truncate" style="font-size: 0.6rem;">' + file.name.substring(0, 10) + '</small></div>';
    }
    
    document.getElementById('compressorFileList').innerHTML = html;
    document.getElementById('compressorTotalSize').textContent = files.length + ' فایل | حجم کل: ' + (totalSize / 1024).toFixed(1) + ' KB';
    preview.classList.remove('d-none');
    result.classList.add('d-none');
  }
  
  function readFileAsDataURL(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.readAsDataURL(file);
    });
  }
  
  document.getElementById('compressorQuality').addEventListener('input', function() {
    document.getElementById('compressorQualityLabel').textContent = this.value + '٪';
  });
  
  document.getElementById('compressBtn').addEventListener('click', async function() {
    const files = input.files;
    if (!files.length) return;
    
    const compressBtn = document.getElementById('compressBtn');
    const originalText = compressBtn.innerHTML;
    compressBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>در حال پردازش...';
    compressBtn.disabled = true;
    
    const quality = document.getElementById('compressorQuality').value / 100;
    const maxWidth = parseInt(document.getElementById('compressorMaxWidth').value) || null;
    const format = document.getElementById('compressorFormat').value;
    const prefix = document.getElementById('compressorPrefix').value || 'compressed';
    allResults = [];
    
    let html = '';
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const blob = await compressImage(file, quality, maxWidth, format);
      const url = URL.createObjectURL(blob);
      const saved = ((1 - blob.size / file.size) * 100).toFixed(0);
      
      allResults.push({ blob, name: prefix + '_' + (i+1) + '.' + format.split('/')[1] });
      
      html += '<div class="col-md-6 mb-3"><div class="p-3 rounded-3" style="background: rgba(18,20,35,0.3); border: 1px solid rgba(255,255,255,0.04);">' +
      '<img src="' + url + '" class="w-100 rounded-2 mb-2" style="height: 150px; object-fit: contain; background: rgba(0,0,0,0.3);">' +
      '<div class="d-flex justify-content-between align-items-center"><small class="text-secondary">' + file.name.substring(0, 20) + '</small>' +
      '<small class="text-success">' + saved + '٪ ذخیره</small></div>' +
      '<a href="' + url + '" download="' + prefix + '_' + (i+1) + '.' + format.split('/')[1] + '" class="btn btn-sm rounded-3 w-100 mt-2" style="background: rgba(109,40,217,0.15); color: #c4b5fd; border: 1px solid rgba(109,40,217,0.2);"><i class="bi bi-download"></i> دانلود</a>' +
      '</div></div>';
    }
    
    document.getElementById('compressorResultsList').innerHTML = html;
    result.classList.remove('d-none');
    document.getElementById('downloadAllBtn').classList.remove('d-none');
    
    compressBtn.innerHTML = '<i class="bi bi-check-lg"></i><span>فشرده‌سازی انجام شد</span>';
    compressBtn.style.background = 'rgba(16, 185, 129, 0.15)';
    compressBtn.style.color = '#34d399';
    compressBtn.style.border = '1px solid rgba(16, 185, 129, 0.2)';
    compressBtn.disabled = true;
  });
  
  input.addEventListener('change', function() {
  const compressBtn = document.getElementById('compressBtn');
  compressBtn.innerHTML = '<i class="bi bi-file-zip"></i><span>فشرده‌سازی</span>';
  compressBtn.style.background = '';
  compressBtn.style.color = '';
  compressBtn.style.border = '';
  compressBtn.disabled = false;
  
  // مخفی کردن نتایج و دکمه دانلود
  document.getElementById('compressorResult').classList.add('d-none');
  document.getElementById('downloadAllBtn').classList.add('d-none');
  document.getElementById('compressorResultsList').innerHTML = '';
  document.getElementById('downloadAllBtn').href = '#';
  
  // پاک کردن URL های blob قبلی
  const images = document.querySelectorAll('#compressorResultsList img, #compressorPreviewImg');
  images.forEach(img => {
    if (img.src.startsWith('blob:')) URL.revokeObjectURL(img.src);
  });
  
  allResults = [];
  handleFiles();
});
  
  function compressImage(file, quality, maxWidth, format) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
          const canvas = document.createElement('canvas');
          let width = img.width, height = img.height;
          if (maxWidth && width > maxWidth) { height = (maxWidth / width) * height; width = maxWidth; }
          canvas.width = width; canvas.height = height;
          canvas.getContext('2d').drawImage(img, 0, 0, width, height);
          canvas.toBlob(resolve, format, quality);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  }
  
  document.getElementById('downloadAllBtn').addEventListener('click', async function() {
    if (!allResults.length) return;
    
    const zip = new JSZip();
    allResults.forEach(r => zip.file(r.name, r.blob));
    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(content);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'compressed_images.zip';
    a.click();
  });
})();