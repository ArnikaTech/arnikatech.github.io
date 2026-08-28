(function() {
  const input = document.getElementById('ocrInput');
  const dropZone = document.getElementById('ocrDropZone');
  const preview = document.getElementById('ocrPreview');
  const result = document.getElementById('ocrResult');
  const progress = document.getElementById('ocrProgress');
  
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
    reader.onload = (e) => {
      document.getElementById('ocrImage').src = e.target.result;
      preview.classList.remove('d-none');
      result.classList.add('d-none');
      progress.classList.add('d-none');
    };
    reader.readAsDataURL(file);
  }
  
  document.getElementById('ocrBtn').addEventListener('click', async function() {
    const file = input.files[0];
    if (!file) return;
    
    if (typeof Tesseract === 'undefined') {
      alert('کتابخانه در حال بارگذاری است. صبر کنید.');
      return;
    }
    
    const btn = document.getElementById('ocrBtn');
    btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>در حال پردازش...';
    btn.disabled = true;
    progress.classList.remove('d-none');
    result.classList.add('d-none');
    
    try {
      const lang = document.getElementById('ocrLang').value;
      const worker = await Tesseract.createWorker(lang, 1, {
        logger: (m) => console.log(m)
      });
      
      const { data } = await worker.recognize(file);
      await worker.terminate();
      
      document.getElementById('ocrText').textContent = data.text || 'متنی یافت نشد.';
      progress.classList.add('d-none');
      result.classList.remove('d-none');
      btn.innerHTML = '<i class="bi bi-search"></i><span>استخراج متن</span>';
      btn.disabled = false;
    } catch (error) {
      console.error(error);
      progress.classList.add('d-none');
      btn.innerHTML = '<i class="bi bi-search"></i><span>استخراج متن</span>';
      btn.disabled = false;
      document.getElementById('ocrText').textContent = 'خطا: ' + error.message;
      result.classList.remove('d-none');
    }
  });
  
  // کپی
  document.getElementById('copyTextBtn').addEventListener('click', function() {
    navigator.clipboard.writeText(document.getElementById('ocrText').textContent);
    const btn = document.getElementById('copyTextBtn');
    btn.innerHTML = '<i class="bi bi-check-lg"></i> کپی شد';
    setTimeout(() => { btn.innerHTML = '<i class="bi bi-clipboard"></i> کپی'; }, 2000);
  });
  
  // دانلود
  document.getElementById('downloadTextBtn').addEventListener('click', function() {
    const text = document.getElementById('ocrText').textContent;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'ocr_result.txt';
    a.click();
  });
})();