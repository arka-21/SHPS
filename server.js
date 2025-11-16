const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// defensive helper to normalise input
function normaliseArray(x){
  if (!x) return [];
  if (Array.isArray(x)) return x.map(s => String(s).toLowerCase());
  if (typeof x === 'string') return x.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
  return [];
}

function computeRisk({age, symptoms, conditions}){
  let score = 0;
  const symptomWeights = {fever:20,cough:15,breathlessness:30,chestpain:35,headache:5,nausea:10};

  // guard: symptoms may not be an array
  (Array.isArray(symptoms) ? symptoms : []).forEach(s => {
    const key = String(s).toLowerCase();
    score += (symptomWeights[key] || 8);
  });

  if(age >= 60) score += 25; else if(age >= 40) score += 10;
  if(conditions.includes('diabetes')) score += 15;
  if(conditions.includes('hypertension')) score += 12;

  if(score >= 80) return {risk:'High', score: Math.min(100, Math.round(score)), suggestion:'Seek immediate medical attention.'};
  if(score >= 40) return {risk:'Medium', score: Math.min(100, Math.round(score)), suggestion:'Consult a doctor soon; consider tests.'};
  return {risk:'Low', score: Math.min(100, Math.round(score)), suggestion:'Monitor symptoms at home.'};
}

app.get('/', (req, res) => {
  res.send('Smart Health Prediction System backend is running.');
});

app.post('/predict', (req,res) =>{
  try {
    const payload = req.body || {};
    const age = Number(payload.age) || 0;
    const symptoms = normaliseArray(payload.symptoms);
    const conditions = normaliseArray(payload.conditions);

    const result = computeRisk({age, symptoms, conditions});
    return res.json(result);
  } catch (err) {
    console.error('Error in /predict:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log('Server started on port', PORT));
