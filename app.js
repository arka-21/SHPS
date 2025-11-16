const form = document.getElementById('predictForm');
const resultDiv = document.getElementById('result');
const clearBtn = document.getElementById('clearBtn');

const BACKEND_URL = 'https://shps.onrender.com/';

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  resultDiv.textContent = 'Predicting...';

  const payload = {
    age: Number(document.getElementById('age').value),
    gender: document.getElementById('gender').value,
    symptoms: document.getElementById('symptoms').value.split(',').map(s=>s.trim()).filter(Boolean),
    conditions: document.getElementById('conditions').value.split(',').map(s=>s.trim()).filter(Boolean)
  };

  try{
    const resp = await fetch(BACKEND_URL + '/predict', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(payload)
    });

    if(!resp.ok) throw new Error('Server error: ' + resp.status);
    const data = await resp.json();

    resultDiv.innerHTML = `<strong>Risk:</strong> ${data.risk} <br><strong>Score:</strong> ${data.score} <br><strong>Suggestion:</strong> ${data.suggestion}`;
  }catch(err){
    resultDiv.textContent = 'Failed to get prediction. Is the backend running at ' + BACKEND_URL + '?';
  }
});

clearBtn.addEventListener('click', () =>{
  form.reset();
  resultDiv.textContent = 'No prediction yet. Fill the form and click Predict.';
});
