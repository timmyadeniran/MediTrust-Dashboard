// js/auth.js
// Simple localStorage-based demo auth. Replace with backend as needed.

function registerUser(){
  const username = document.getElementById('regUser').value.trim();
  const password = document.getElementById('regPass').value.trim();
  const height = document.getElementById('regHeight')?.value?.trim() || '';
  if(!username || !password){ alert('Enter username and password'); return; }

  // store single demo user (for simplicity)
  const user = { username, password, height };
  localStorage.setItem('mt_user', JSON.stringify(user));
  alert('Account created. Please login.');
  window.location.href = 'login.html';
}

function loginUser(){
  const username = document.getElementById('logUser').value.trim();
  const password = document.getElementById('logPass').value.trim();
  const stored = JSON.parse(localStorage.getItem('mt_user') || 'null');
  if(!stored || stored.username !== username || stored.password !== password){
    // allow guest login if no account exists
    if(!stored && username === 'guest'){
      localStorage.setItem('mt_logged', JSON.stringify({username:'guest'}));
      window.location.href = 'dashboard.html';
      return;
    }
    alert('Invalid credentials. Create an account or use guest.');
    return;
  }
  localStorage.setItem('mt_logged', JSON.stringify({username: stored.username}));
  window.location.href = 'dashboard.html';
}

function logout(){
  localStorage.removeItem('mt_logged');
  window.location.href = 'login.html';
}

function requireAuth(){
  const logged = JSON.parse(localStorage.getItem('mt_logged') || 'null');
  if(!logged){
    window.location.href = 'login.html';
  }
  return logged;
}
