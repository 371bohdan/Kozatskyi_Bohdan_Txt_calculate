document.getElementById('uploadForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    const response = await fetch(form.action, {
      method: form.method,
      body: formData
    });
  
    const result = await response.text(); // Отримуємо вміст файлу
    document.getElementById('result').textContent = result; // Відображаємо результати на сторінці
  });