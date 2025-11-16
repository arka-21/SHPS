const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

function computeRisk({age, symptoms, conditions}){
  let score = 0;
  const symptomWeights = {fever:20,cough:15,breathlessness:30,chestpain:35,headache:5,nausea:10};
  symptoms.forEach(s => { score += symptomWeights[s] || 8; });
  if(age >= 60) score += 25; else if(age >= 40) score += 10;
  if(conditions.includes('diabetes')) score += 15;
  if(conditions.includes('hypertension')) score += 12;

  if(score >= 80) return {risk:'High', score, suggestion:'Seek immediate medical attention.'};
  if(score >= 40) return {risk:'Medium', score, suggestion:'Consult a doctor soon; consider tests.'};
  return {risk:'Low', score, suggestion:'Monitor symptoms at home.'};
}

app.post('/predict', (req,res) =>{
  const payload = req.body || {};
  const age = Number(payload.age) || 0;
  const symptoms = payload.symptoms || [];
  const conditions = payload.conditions || [];
  res.json(computeRisk({age, symptoms, conditions}));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log('Server started on port', PORT));
