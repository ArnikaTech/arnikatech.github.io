(function() {
  const input = document.getElementById('removeBgInput');
  const dropZone = document.getElementById('removeBgDropZone');
  const preview = document.getElementById('removeBgPreview');
  const result = document.getElementById('removeBgResult');
  const pickBtn = document.getElementById('pickColorBtn');
  const colorInput = document.getElementById('removeColor');
  let currentImage = null;
  let removeColors = [];
  
  renderColorList();
  
  dropZone.addEventListener('click', () => input.click());
  dropZone.addEventListener('dragover', (e) => { e.preventDefault(); });
  dropZone.addEventListener('drop', (e) => { 
    e.preventDefault(); 
    if (e.dataTransfer.files.length) { 
      input.files = e.dataTransfer.files; 
      loadFile(); 
    } 
  });
  input.addEventListener('change', loadFile);
  
  function loadFile() {
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
      currentImage = e.target.result;
      document.getElementById('removeBgPreviewImg').src = currentImage;
      preview.classList.remove('d-none');
      result.classList.add('d-none');
    };
    reader.readAsDataURL(file);
  }
  
  document.getElementById('removeThreshold').addEventListener('input', function() {
    document.getElementById('removeThresholdLabel').textContent = this.value;
  });
  
  document.getElementById('addColorBtn').addEventListener('click', function() {
    const color = colorInput.value;
    if (!removeColors.includes(color)) {
      removeColors.push(color);
      renderColorList();
    }
  });
  
  function removeColorFromList(index) {
    removeColors.splice(index, 1);
    renderColorList();
  }
  
  function renderColorList() {
    const container = document.getElementById('colorList');
    if (removeColors.length === 0) {
      container.innerHTML = '<small class="text-secondary">رنگی انتخاب نشده. با قطره‌چکان یا + رنگ اضافه کنید.</small>';
      return;
    }
    container.innerHTML = removeColors.map((color, i) => 
      `<span class="badge px-3 py-2 d-flex align-items-center gap-2" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px;">
        <span style="width: 16px; height: 16px; background: ${color}; border-radius: 4px;"></span>${color}
        <i class="bi bi-x remove-color-btn" data-index="${i}" style="cursor: pointer; color: #ef4444;"></i>
      </span>`
    ).join('');
    
    document.querySelectorAll('.remove-color-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        removeColorFromList(parseInt(this.dataset.index));
      });
    });
  }
  
  // قطره‌چکان
  pickBtn.addEventListener('click', function() {
    if (!currentImage) {
      alert('لطفاً ابتدا یک عکس انتخاب کنید.');
      return;
    }
    
    const img = new Image();
    img.src = currentImage;
    img.onload = function() {
      const canvas = document.createElement('canvas');
      const maxW = 600;
      const scale = Math.min(1, maxW / img.width);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      const tempImg = document.createElement('img');
      tempImg.src = canvas.toDataURL();
      tempImg.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);max-width:90vw;max-height:80vh;z-index:99999;cursor:crosshair;border:2px solid #a78bfa;border-radius:12px;';
      document.body.appendChild(tempImg);
      
      const overlay = document.createElement('div');
      overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:99998;background:rgba(0,0,0,0.5);';
      overlay.addEventListener('click', function() {
        document.body.removeChild(tempImg);
        document.body.removeChild(overlay);
      });
      document.body.appendChild(overlay);
      
      tempImg.addEventListener('click', function(e) {
        e.stopPropagation();
        const rect = tempImg.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const smallCanvas = document.createElement('canvas');
        smallCanvas.width = 1;
        smallCanvas.height = 1;
        const smallCtx = smallCanvas.getContext('2d');
        smallCtx.drawImage(tempImg, x, y, 1, 1, 0, 0, 1, 1);
        const pixel = smallCtx.getImageData(0, 0, 1, 1).data;
        const hex = '#' + [pixel[0], pixel[1], pixel[2]].map(v => v.toString(16).padStart(2, '0')).join('');
        
        colorInput.value = hex;
        
        if (!removeColors.includes(hex)) {
          removeColors.push(hex);
          renderColorList();
        }
        
        document.body.removeChild(tempImg);
        document.body.removeChild(overlay);
      });
    };
  });
  
  // پردازش
  document.getElementById('removeBgBtn').addEventListener('click', function() {
    if (!currentImage || removeColors.length === 0) return;
    
    const threshold = parseInt(document.getElementById('removeThreshold').value);
    const format = document.getElementById('removeBgFormat').value;
    const ext = format.split('/')[1];
    const colorsToRemove = removeColors.map(hex => ({
      r: parseInt(hex.slice(1,3), 16),
      g: parseInt(hex.slice(3,5), 16),
      b: parseInt(hex.slice(5,7), 16)
    }));
    
    const img = new Image();
    img.src = currentImage;
    img.onload = function() {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      for (let i = 0; i < data.length; i += 4) {
        for (const color of colorsToRemove) {
          const distance = Math.sqrt(
            Math.pow(color.r - data[i], 2) + 
            Math.pow(color.g - data[i+1], 2) + 
            Math.pow(color.b - data[i+2], 2)
          );
          if (distance < threshold) { 
            data[i+3] = 0; 
            break; 
          }
        }
      }
      
      ctx.putImageData(imageData, 0, 0);
      
      canvas.toBlob(function(blob) {
        const url = URL.createObjectURL(blob);
        document.getElementById('removeBgOutput').src = url;
        document.getElementById('removeBgOriginal').src = currentImage;
        result.classList.remove('d-none');
        document.getElementById('removeBgDownload').href = url;
        document.getElementById('removeBgDownload').download = 'no-bg.' + ext;
      }, format);
    };
  });
})();