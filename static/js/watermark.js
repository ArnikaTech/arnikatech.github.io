(function() {
  const input = document.getElementById('watermarkInput');
  const dropZone = document.getElementById('watermarkDropZone');
  const preview = document.getElementById('watermarkPreview');
  const result = document.getElementById('watermarkResult');
  
  dropZone.addEventListener('click', () => input.click());
  dropZone.addEventListener('dragover', (e) => { e.preventDefault(); });
  dropZone.addEventListener('drop', (e) => { e.preventDefault(); if (e.dataTransfer.files.length) { input.files = e.dataTransfer.files; handleFile(); } });
  input.addEventListener('change', handleFile);
  
  function handleFile() {
    if (!input.files.length) return;
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      document.getElementById('watermarkPreviewImg').src = e.target.result;
      preview.classList.remove('d-none');
      result.classList.add('d-none');
    };
    reader.readAsDataURL(file);
  }
  
  document.getElementById('watermarkOpacity').addEventListener('input', function() {
    document.getElementById('watermarkOpacityLabel').textContent = this.value + '٪';
  });
  
  document.getElementById('watermarkAngle').addEventListener('input', function() {
    document.getElementById('watermarkAngleLabel').textContent = this.value + '°';
  });
  
  document.getElementById('watermarkSpacing').addEventListener('input', function() {
    document.getElementById('watermarkSpacingLabel').textContent = this.value + 'px';
  });
  
  document.getElementById('watermarkType').addEventListener('change', function() {
    const isPattern = this.value === 'pattern';
    document.getElementById('spacingOption').style.display = isPattern ? 'block' : 'none';
    document.getElementById('watermarkAngle').value = isPattern ? -30 : 0;
    document.getElementById('watermarkAngleLabel').textContent = (isPattern ? -30 : 0) + '°';
  });
  
  document.getElementById('watermarkBtn').addEventListener('click', function() {
    const file = input.files[0];
    if (!file) return;
    
    const btn = document.getElementById('watermarkBtn');
    const origHTML = btn.innerHTML;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>در حال اعمال...';
    btn.disabled = true;
    
    const reader = new FileReader();
    reader.onload = function(e) {
      const img = new Image();
      img.onload = function() {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        
        const text = document.getElementById('watermarkText').value || 'آرنیکاتک';
        const opacity = document.getElementById('watermarkOpacity').value / 100;
        const fontSize = parseInt(document.getElementById('watermarkFontSize').value) || 28;
        const font = document.getElementById('watermarkFont').value;
        const position = document.getElementById('watermarkPosition').value;
        const type = document.getElementById('watermarkType').value;
        const format = document.getElementById('watermarkFormat').value;
        const ext = format.split('/')[1];
        
        ctx.font = `bold ${fontSize}px "${font}", Vazirmatn, Tahoma, sans-serif`;
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.strokeStyle = `rgba(0, 0, 0, ${opacity * 0.5})`;
        ctx.lineWidth = 1;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        if (type === 'single') {
          let x, y;
          const padding = 20;
          const textMetrics = ctx.measureText(text);
          const textWidth = textMetrics.width;
          
          switch(position) {
            case 'bottom-right': 
            x = canvas.width - textWidth / 2 - padding; 
            y = canvas.height - padding; 
            ctx.textAlign = 'right';
            ctx.textBaseline = 'bottom';
            break;
            case 'bottom-left': 
            x = textWidth / 2 + padding; 
            y = canvas.height - padding;
            ctx.textAlign = 'left';
            ctx.textBaseline = 'bottom';
            break;
            case 'top-right': 
            x = canvas.width - textWidth / 2 - padding; 
            y = padding;
            ctx.textAlign = 'right';
            ctx.textBaseline = 'top';
            break;
            case 'top-left': 
            x = textWidth / 2 + padding; 
            y = padding;
            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';
            break;
            case 'center': 
            x = canvas.width / 2; 
            y = canvas.height / 2;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            break;
          }
          
          const angle = parseInt(document.getElementById('watermarkAngle').value) || 0;
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate((angle * Math.PI) / 180);
          ctx.strokeText(text, 0, 0);
          ctx.fillText(text, 0, 0);
          ctx.restore();
        } else {
          const angle = parseInt(document.getElementById('watermarkAngle').value) || -30;
          const spacing = Math.max(80, parseInt(document.getElementById('watermarkSpacing').value) || 180);
          
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          
          ctx.save();
          ctx.translate(canvas.width / 2, canvas.height / 2);
          ctx.rotate((angle * Math.PI) / 180);
          
          const cols = Math.ceil(canvas.width * 2 / spacing) + 2;
          const rows = Math.ceil(canvas.height * 2 / spacing) + 2;
          
          for (let row = -rows; row < rows; row++) {
            for (let col = -cols; col < cols; col++) {
              const x = col * spacing;
              const y = row * spacing;
              ctx.strokeText(text, x, y);
              ctx.fillText(text, x, y);
            }
          }
          
          ctx.restore();
        }
        
        canvas.toBlob(function(blob) {
          const url = URL.createObjectURL(blob);
          document.getElementById('watermarkOutput').src = url;
          result.classList.remove('d-none');
          
          const downloadBtn = document.getElementById('watermarkDownload');
          downloadBtn.href = url;
          downloadBtn.download = 'watermarked.' + ext;
          
          btn.innerHTML = origHTML;
          btn.disabled = false;
        }, format, 0.9);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
  
  document.getElementById('watermarkReset').addEventListener('click', function() {
    document.getElementById('watermarkText').value = 'آرنیکاتک';
    document.getElementById('watermarkType').value = 'single';
    document.getElementById('watermarkPosition').value = 'bottom-right';
    document.getElementById('watermarkFont').value = 'Vazirmatn';
    document.getElementById('watermarkFontSize').value = '28';
    document.getElementById('watermarkOpacity').value = '25';
    document.getElementById('watermarkOpacityLabel').textContent = '۲۵٪';
    document.getElementById('watermarkAngle').value = '0';
    document.getElementById('watermarkAngleLabel').textContent = '۰°';
    document.getElementById('watermarkSpacing').value = '180';
    document.getElementById('watermarkSpacingLabel').textContent = '۱۸۰px';
    document.getElementById('watermarkFormat').value = 'image/png';
    document.getElementById('spacingOption').style.display = 'none';
    result.classList.add('d-none');
  });
})();