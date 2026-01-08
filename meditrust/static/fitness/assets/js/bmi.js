// js/bmi.js
// central tracker engine: steps, distance, animations, autosave, and chart triggers

let bmiData = JSON.parse(localStorage.getItem('bmiData') || '[]');
let stepsData = JSON.parse(localStorage.getItem('stepsData') || '[]');

function today(){ return new Date().toLocaleDateString(); }

// ---------------- BMI ----------------
function calculateBMI(){
  const w = parseFloat(document.getElementById('weight').value);
  const hcm = parseFloat(document.getElementById('height').value);
  if(!w || !hcm){ alert('Enter weight and height'); return; }
  const h = hcm/100;
  const bmi = parseFloat((w/(h*h)).toFixed(2));
  bmiData.push({date: today(), bmi});
  localStorage.setItem('bmiData', JSON.stringify(bmiData));
  if(window.renderBMIChart) window.renderBMIChart();
  alert('BMI saved: ' + bmi);
}

// ---------------- Steps engine ----------------
let stepCount = 0;
let tracking = false;
let lastAccel = {x:0,y:0,z:0};
let stepThreshold = 2.0;
let userStepLength = 0.78; // meters per step; overridden with stored height if available
let savedInterval = null;
let detectMovementFn = function(event){
  const acc = event.accelerationIncludingGravity;
  if(!acc) return;
  const dx = Math.abs(acc.x - lastAccel.x);
  const dy = Math.abs(acc.y - lastAccel.y);
  const dz = Math.abs(acc.z - lastAccel.z);
  const movement = dx + dy + dz;
  if(movement > stepThreshold){
    stepCount++;
    animateStep();
    updateStepDisplays();
  }
  lastAccel = {x: acc.x, y: acc.y, z: acc.z};
};

function initFromStorage(){
  // set initial step count from today's saved record if exists
  const rec = stepsData.find(s=>s.date===today());
  if(rec) stepCount = parseInt(rec.steps) || 0;
  // set userStepLength from height (if user stored in mt_user)
  const u = JSON.parse(localStorage.getItem('mt_user') || 'null');
  if(u && u.height){
    // estimate step length from height: typical step length ~ 0.415 * height(m)
    const heightMeters = parseFloat(u.height)/100;
    userStepLength = +(0.415 * heightMeters).toFixed(2);
  }
  updateStepDisplays();
  if(window.renderStepsChart) window.renderStepsChart();
  if(window.renderBMIChart) window.renderBMIChart();
}

function toggleTracking(){
  const btn = document.getElementById('trackBtn');
  if(!tracking){
    // request permission and start
    if(typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function'){
      DeviceMotionEvent.requestPermission().then(res=>{
        if(res === 'granted'){ startTracking(); }
        else { alert('Motion permission denied. Use Manual Save.'); }
      }).catch(err => { console.warn(err); alert('Sensor permission error'); });
    }else{
      startTracking();
    }
  } else {
    stopTracking();
  }
}

function startTracking(){
  tracking = true;
  document.getElementById('trackBtn').innerText = 'Stop Tracking';
  // ensure we have today's record loaded
  const rec = stepsData.find(s=>s.date===today());
  if(rec) stepCount = parseInt(rec.steps) || 0;
  lastAccel = {x:0,y:0,z:0};
  window.addEventListener('devicemotion', detectMovementFn);
  savedInterval = setInterval(saveStepData, 20000);
}

function stopTracking(){
  tracking = false;
  document.getElementById('trackBtn').innerText = 'Start Tracking';
  window.removeEventListener('devicemotion', detectMovementFn);
  if(savedInterval) clearInterval(savedInterval);
  saveStepData();
}

function animateStep(){
  const el = document.getElementById('liveSteps');
  if(!el) return;
  el.classList.add('step-bounce');
  setTimeout(()=> el.classList.remove('step-bounce'),150);
}

function updateStepDisplays(){
  const liveEl = document.getElementById('liveSteps');
  if(liveEl) liveEl.textContent = stepCount;
  const distEl = document.getElementById('distanceKM');
  const meters = stepCount * userStepLength;
  const km = (meters/1000).toFixed(2);
  if(distEl) distEl.textContent = km;
}

function saveStepManual(){
  saveStepData();
  alert('Saved');
}

function saveStepData(){
  const minutesField = document.getElementById('minutes');
  const minutes = minutesField ? parseInt(minutesField.value)||0 : 0;
  // remove today's entry
  stepsData = stepsData.filter(s=>s.date!==today());
  stepsData.push({date: today(), steps: stepCount, minutes});
  localStorage.setItem('stepsData', JSON.stringify(stepsData));
  if(window.renderStepsChart) window.renderStepsChart();
}

// save on unload
window.addEventListener('beforeunload', saveStepData);
