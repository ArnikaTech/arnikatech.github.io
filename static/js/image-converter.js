(function() {
  const imageInput = document.getElementById('imageInput');
  let currentRotation = 0, flipH = 1, flipV = 1, lastBlob = null;
  
  document.getElementById('dropZone').addEventListener('click', () => imageInput.click());
  document.getElementById('dropZone').addEventListener('dragover', (e) => { e.preventDefault(); });
  document.getElementById('dropZone').addEventListener('drop', (e) => { e.preventDefault(); if (e.dataTransfer.files.length) { imageInput.files = e.dataTransfer.files; handleFile(); } });
  imageInput.addEventListener('change', handleFile);
  
  function handleFile() {
    if (!imageInput.files.length) return;
    currentRotation = 0; flipH = 1; flipV = 1;
    lastBlob = null;
    
    const file = imageInput.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      document.getElementById('previewBeforeImg').src = e.target.result;
      document.getElementById('previewBeforeSize').textContent = file.name + ' | ' + (file.size / 1024).toFixed(1) + ' KB';
      document.getElementById('previewBefore').classList.remove('d-none');
      document.getElementById('previewAfter').classList.add('d-none');
      document.getElementById('downloadArea').querySelector('a').href = '#';
      resetConvertBtn();
    };
    reader.readAsDataURL(file);
  }
  
  function resetConvertBtn() {
    const btn = document.getElementById('convertBtn');
    btn.innerHTML = '<i class="bi bi-arrow-repeat"></i><span>اعمال تغییرات</span>';
    btn.style.background = '';
    btn.style.color = '';
    btn.style.border = '';
    btn.disabled = false;
  }
  
  window.rotateImage = function(deg) { currentRotation = (currentRotation + deg) % 360; updatePreview(); };
  window.flipImage = function(dir) { if (dir === 'horizontal') flipH *= -1; else flipV *= -1; updatePreview(); };
  
  document.getElementById('qualityRange').addEventListener('input', function() {
    document.getElementById('qualityLabel').textContent = this.value + '٪';
    updatePreview();
  });
  
  ['formatSelect', 'maxWidth', 'maxHeight', 'percentScale'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('change', updatePreview);
      if (id === 'maxWidth' || id === 'maxHeight') el.addEventListener('input', updatePreview);
    }
  });
  
  function updatePreview() {
    const file = imageInput.files[0];
    if (!file) return;
    
    const format = document.getElementById('formatSelect').value;
    const quality = document.getElementById('qualityRange').value / 100;
    const maxWidth = parseInt(document.getElementById('maxWidth').value) || null;
    const maxHeight = parseInt(document.getElementById('maxHeight').value) || null;
    const percentScale = parseInt(document.getElementById('percentScale').value) || null;
    const prefix = document.getElementById('filenamePrefix').value || 'converted';
    
    const reader = new FileReader();
    reader.onload = function(e) {
      const img = new Image();
      img.onload = function() {
        const canvas = document.createElement('canvas');
        let width = img.width, height = img.height;
        
        if (percentScale) { width *= percentScale / 100; height *= percentScale / 100; }
        if (maxWidth) { height = (maxWidth / width) * height; width = maxWidth; }
        if (maxHeight) { width = (maxHeight / height) * width; height = maxHeight; }
        
        canvas.width = width; canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.save();
        ctx.translate(width / 2, height / 2);
        ctx.rotate((currentRotation * Math.PI) / 180);
        ctx.scale(flipH, flipV);
        ctx.drawImage(img, -width / 2, -height / 2, width, height);
        ctx.restore();
        
        canvas.toBlob(function(blob) {
          lastBlob = blob;
          const url = URL.createObjectURL(blob);
          document.getElementById('previewImage').src = url;
          document.getElementById('originalImage').src = e.target.result;
          document.getElementById('originalSize').textContent = 'حجم: ' + (file.size / 1024).toFixed(1) + ' KB';
          document.getElementById('convertedSize').textContent = 'حجم: ' + (blob.size / 1024).toFixed(1) + ' KB';
          document.getElementById('previewAfter').classList.remove('d-none');
          
          const downloadBtn = document.querySelector('#downloadArea a');
          downloadBtn.href = url;
          downloadBtn.download = prefix + '.' + format.split('/')[1];
        }, format, quality);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
  
  document.getElementById('convertBtn').addEventListener('click', updatePreview);
})();