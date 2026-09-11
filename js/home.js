function buildHeroWave(){
  const wrap = document.getElementById('hero-wave');
  if(!wrap || wrap.childElementCount) return;
  let bars = '';
  for(let i=0;i<60;i++){
    const h = 10 + Math.round(Math.abs(Math.sin(i*0.5))*80 + Math.random()*15);
    bars += `<span style="height:${h}%;"></span>`;
  }
  wrap.innerHTML = bars;
}

document.addEventListener('DOMContentLoaded', () => {
  buildHeroWave();
  document.getElementById('home-beat-grid').innerHTML = BEATS.slice(0,4).map(beatCardHTML).join('');

  const welcome = qs('welcome');
  if(welcome === 'signup') showToast('Account created — welcome to RedBeats');
  if(welcome === 'login') showToast('Logged in');
  if(qs('ordered') === '1') showToast('Payment successful — check your email for your files');
});
