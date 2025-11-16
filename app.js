const form = document.getElementById('predictForm');
const resultDiv = document.getElementById('result');
const clearBtn = document.getElementById('clearBtn');

// NO trailing slash here
const BACKEND_URL = 'https://shps.onrender.com';

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  resultDiv.textContent = 'Predicting...';

  const payload = {
    age: Number(document.getElementById('age').value),
    gender: document.getElementById('gender').value,
    symptoms: document.getElementById('symptoms').value.split(',').map(s=>s.trim()).filter(Boolean),
    conditions: document.getElementById('conditions').value.split(',').map(s=>s.trim()).filter(Boolean)
  };

  try {
    const url = BACKEND_URL + '/predict'; // becomes https://shps.onrender.com/predict
    console.log('Sending request to', url, 'payload:', payload);

    const resp = await fetch(url, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(payload)
    });

    if (!resp.ok) {
      // try to capture any error body text from the server for debugging
      let text = await resp.text().catch(()=>`(no body, status ${resp.status})`);
      const errMsg = `Server responded with ${resp.status}. Body: ${text}`;
      console.error(errMsg);
      resultDiv.textContent = 'Server error: ' + resp.status + '. See console for details.';
      return;
    }

    const data = await resp.json();
    resultDiv.innerHTML = `<strong>Risk:</strong> ${data.risk} <br><strong>Score:</strong> ${data.score} <br><strong>Suggestion:</strong> ${data.suggestion}`;
  } catch (err) {
    // show the real error in console and to the user
    console.error('Fetch error:', err);
    resultDiv.textContent = 'Failed to get prediction. See console for details.';
  }
});

clearBtn.addEventListener('click', () =>{
  form.reset();
  resultDiv.textContent = 'No prediction yet. Fill the form and click Predict.';
});
