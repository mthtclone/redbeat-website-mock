let authMode = "signup";
let selectedRole = null;

function selectRole(role){
  selectedRole = role;
  document.querySelectorAll('.role-option').forEach(el=>{
    el.classList.toggle('selected', el.dataset.role === role);
  });
}

function setAuthMode(mode){
  authMode = mode;
  const isSignup = mode === 'signup';
  document.getElementById('auth-heading').textContent = isSignup ? 'Create your account' : 'Welcome back';
  document.getElementById('auth-sub').textContent = isSignup
    ? 'Join as a producer or an artist to start trading beats.'
    : 'Log in to manage your beats and orders.';
  document.getElementById('role-select').style.display = isSignup ? 'flex' : 'none';
  document.getElementById('confirm-field').style.display = isSignup ? 'block' : 'none';
  document.getElementById('consent-row').style.display = isSignup ? 'flex' : 'none';
  document.getElementById('auth-submit').textContent = isSignup ? 'Create account' : 'Log in';
  document.getElementById('auth-switch').innerHTML = isSignup
    ? 'Already have an account? <button onclick="toggleAuthMode()">Log in</button>'
    : "Don't have an account? <button onclick=\"toggleAuthMode()\">Sign up</button>";
}
function toggleAuthMode(){ setAuthMode(authMode === 'signup' ? 'login' : 'signup'); }

function submitAuth(){
  if(authMode === 'signup' && !selectedRole){
    showToast('Pick a role to continue');
    return;
  }
  // No backend — this is a demo, so we just simulate success and head home.
  window.location.href = 'index.html?welcome=' + (authMode === 'signup' ? 'signup' : 'login');
}

// Support register.html?mode=login to land directly on the log-in view (used by the nav "Login" button)
document.addEventListener('DOMContentLoaded', () => {
  if(qs('mode') === 'login') setAuthMode('login');
});
