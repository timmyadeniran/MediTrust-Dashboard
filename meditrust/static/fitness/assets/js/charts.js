// js/charts.js
function renderBMIChart(){
  const ctx = document.getElementById('bmiChart').getContext('2d');
  const data = JSON.parse(localStorage.getItem('bmiData') || '[]');
  const labels = data.map(d=>d.date);
  const values = data.map(d=>d.bmi);
  if(window.bmiChartInstance) window.bmiChartInstance.destroy();
  window.bmiChartInstance = new Chart(ctx, {
    type:'line',
    data:{ labels, datasets:[{ label:'BMI', data:values, borderColor:'#00a3e0', tension:0.3, fill:false }]},
    options:{ responsive:true, maintainAspectRatio:false }
  });
}
function renderStepsChart(){
  const ctx = document.getElementById('stepsChart').getContext('2d');
  const data = JSON.parse(localStorage.getItem('stepsData') || '[]');
  // show last 7 entries (by date)
  const last7 = data.slice(-14).slice(-7); // safe
  const labels = last7.map(d=>d.date);
  const values = last7.map(d=>d.steps);
  if(window.stepsChartInstance) window.stepsChartInstance.destroy();
  window.stepsChartInstance = new Chart(ctx, {
    type:'bar',
    data:{ labels, datasets:[{ label:'Steps', data:values, backgroundColor:'#007bb5' }]},
    options:{ responsive:true, maintainAspectRatio:false }
  });
}
// expose functions
window.renderBMIChart = renderBMIChart;
window.renderStepsChart = renderStepsChart;
document.addEventListener('DOMContentLoaded', ()=>{ renderBMIChart(); renderStepsChart(); });
