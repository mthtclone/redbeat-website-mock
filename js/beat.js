let currentBeatId = null;
let selectedLicense = 'mp3';
let playerPlaying = false;
let playerElapsed = 0;
const playerDuration = 168; // 2:48
let playerTimer = null;

function formatTime(sec){
  const m = Math.floor(sec/60);
  const s = Math.floor(sec%60).toString().padStart(2,'0');
  return `${m}:${s}`;
}
function buildDetailWaveform(){
  const wrap = document.getElementById('detail-waveform');
  wrap.innerHTML = '';
  for(let i=0;i<46;i++){
    const h = 20 + Math.round(Math.abs(Math.sin(i*0.6))*75 + Math.random()*10);
    const span = document.createElement('span');
    span.style.height = h+'%';
    wrap.appendChild(span);
  }
}
function updateDetailWaveformFill(){
  const wrap = document.getElementById('detail-waveform');
  const bars = wrap.children;
  const ratio = playerElapsed / playerDuration;
  const filledCount = Math.floor(ratio * bars.length);
  for(let i=0;i<bars.length;i++){
    bars[i].classList.toggle('filled', i < filledCount);
  }
}
function togglePlayer(){
  playerPlaying = !playerPlaying;
  const icon = document.querySelector('#detail-play-btn .material-symbols-outlined');
  icon.textContent = playerPlaying ? 'pause' : 'play_arrow';
  if(playerPlaying){
    playerTimer = setInterval(()=>{
      playerElapsed += 1;
      if(playerElapsed >= playerDuration) playerElapsed = 0;
      document.getElementById('player-current').textContent = formatTime(playerElapsed);
      updateDetailWaveformFill();
    }, 1000);
  } else {
    clearInterval(playerTimer);
  }
}

function licenseCardHTML(lic){
  const selected = selectedLicense === lic.id;
  return `
    <div class="license-card ${selected?'selected':''}" onclick="selectLicense('${lic.id}')">
      <div class="license-row-inner">
        <div class="license-radio"></div>
        <div>
          <div class="license-name">${lic.name}</div>
          <div class="license-desc">${lic.desc}</div>
        </div>
      </div>
      <div class="license-price">$${lic.price}</div>
    </div>`;
}
function selectLicense(id){
  selectedLicense = id;
  document.getElementById('license-stack').innerHTML = LICENSES.map(licenseCardHTML).join('');
}

function relatedTrackHTML(beat){
  return `
    <div class="related-track">
      <div class="related-cover" style="background:${beat.gradient};">${initials(beat.title)}</div>
      <div>
        <div class="related-title" onclick="location.href='beat.html?id=${beat.id}'">${beat.title}</div>
        <div class="related-price">${money(beat.price)}</div>
      </div>
      <button class="related-add" onclick="quickAdd('${beat.id}', this)" aria-label="Add to cart">
        <span class="material-symbols-outlined" style="font-size:16px;">add</span>
      </button>
    </div>`;
}

function buyLicense(){
  const beat = beatById(currentBeatId);
  const lic = LICENSES.find(l=>l.id===selectedLicense);
  addToCart(beat.id, lic.id, lic.price);
  showToast(`${lic.name} for "${beat.title}" added to cart`);
  openCart();
}

document.addEventListener('DOMContentLoaded', () => {
  currentBeatId = qs('id') || 'b1';
  const beat = beatById(currentBeatId) || beatById('b1');
  currentBeatId = beat.id;
  const p = producerById(beat.producer);

  document.title = beat.title + ' — RedBeats';
  document.getElementById('detail-cover').style.background = beat.gradient;
  document.getElementById('detail-cover').textContent = initials(beat.title);
  document.getElementById('detail-title').textContent = beat.title;
  const producerEl = document.getElementById('detail-producer');
  producerEl.textContent = p.name;
  producerEl.style.cursor = 'pointer';
  producerEl.onclick = () => location.href = 'producer.html?id=' + beat.producer;
  document.getElementById('player-duration').textContent = formatTime(playerDuration);

  buildDetailWaveform();
  document.getElementById('license-stack').innerHTML = LICENSES.map(licenseCardHTML).join('');
  document.getElementById('detail-description').textContent = beat.description;

  document.getElementById('sidebar-avatar').style.background = p.gradient;
  document.getElementById('sidebar-avatar').textContent = initials(p.name);
  document.getElementById('sidebar-producer-name').textContent = p.name;
  document.getElementById('sidebar-producer-name').style.cursor = 'pointer';
  document.getElementById('sidebar-producer-name').onclick = () => location.href = 'producer.html?id=' + beat.producer;
  document.getElementById('sidebar-producer-loc').textContent = p.location;
  document.getElementById('sidebar-view-profile').href = 'producer.html?id=' + beat.producer;

  const related = BEATS.filter(b=>b.id!==beat.id).sort(()=>0.5-Math.random()).slice(0,4);
  document.getElementById('related-tracks').innerHTML = related.map(relatedTrackHTML).join('');
});
