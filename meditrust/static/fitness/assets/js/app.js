// js/app.js
const logged = JSON.parse(localStorage.getItem('mt_logged') || 'null');
if(!logged){
  // if no logged user but user opens the dashboard, allow guest view or redirect to login
  // for demo we redirect:
  // window.location.href = 'login.html';
}
// show user
document.addEventListener('DOMContentLoaded', () => {
  const user = logged?.username || 'Guest';
  const usernameEl = document.getElementById('userName');
  if(usernameEl) usernameEl.textContent = user;

  const dd = new Date();
  document.getElementById('todayDate').textContent = dd.toLocaleDateString();

  // initialize data lists if missing
  if(!localStorage.getItem('bmiData')) localStorage.setItem('bmiData', JSON.stringify([]));
  if(!localStorage.getItem('stepsData')) localStorage.setItem('stepsData', JSON.stringify([]));

  // initialize trackers from saved data
  initFromStorage();
});
function openHistory(){ window.location.href = 'workout-history.html'; }
function zeroToday(){ if(confirm('Reset steps for today?')){ const d = new Date().toLocaleDateString(); let steps = JSON.parse(localStorage.getItem('stepsData')||'[]'); steps = steps.filter(s=>s.date!==d); localStorage.setItem('stepsData', JSON.stringify(steps)); alert('Today reset'); location.reload(); } }
