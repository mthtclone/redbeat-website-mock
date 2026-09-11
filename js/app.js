/* ============================================================
   RedBeats — shared app logic
   Loaded on every page. Handles data, cart persistence (via
   localStorage, since this is a static, backend-free site) and
   markup helpers shared between pages (beat cards/rows, toast,
   cart drawer).
   ============================================================ */

/* ----------------------------- DATA MODEL ----------------------------- */
const GENRES = ["Pop","Hip-Hop","Rap","R&B","Trap","House","Dubstep","Synthwave"];

const PRODUCERS = {
  kenji: {
    id:"kenji", name:"Kenji Vox", location:"Osaka, Japan",
    bio:"Late-night trap and house from a one-room studio above a ramen shop. Every drum hit is sampled from the block.",
    followers:"12.4K", tracks:4, sales:"890", genres:["Trap","House"],
    gradient:"linear-gradient(135deg,#A01212,#2A2A2A 70%)"
  },
  nova: {
    id:"nova", name:"Nova Reyes", location:"Los Angeles, CA",
    bio:"Synthwave and dream-pop textures built on vintage hardware. If it doesn't glow, it doesn't ship.",
    followers:"8.1K", tracks:2, sales:"430", genres:["Synthwave","Pop"],
    gradient:"linear-gradient(135deg,#2A2A2A,#C81D25 70%)"
  },
  mars: {
    id:"mars", name:"Mars Oduya", location:"Atlanta, GA",
    bio:"Warm R&B chords and tape-saturated bass, made for slow drives and long nights.",
    followers:"5.6K", tracks:2, sales:"210", genres:["R&B"],
    gradient:"linear-gradient(160deg,#A01212,#121212 75%)"
  },
  fumes: {
    id:"fumes", name:"DJ Fumes", location:"Chicago, IL",
    bio:"Boom-bap purist. Dusty samples, hard drums, no shortcuts.",
    followers:"9.9K", tracks:2, sales:"610", genres:["Hip-Hop","Rap"],
    gradient:"linear-gradient(200deg,#2A2A2A,#A01212 80%)"
  },
  sable: {
    id:"sable", name:"Sable Rae", location:"Toronto, ON",
    bio:"Radio-ready pop production with a sharp, modern low end.",
    followers:"6.3K", tracks:1, sales:"175", genres:["Pop"],
    gradient:"linear-gradient(135deg,#C81D25,#121212 70%)"
  },
  priya: {
    id:"priya", name:"Priya Nox", location:"London, UK",
    bio:"Heavy-bass dubstep with a cinematic build. Not for the faint of ear.",
    followers:"7.2K", tracks:1, sales:"260", genres:["Dubstep"],
    gradient:"linear-gradient(155deg,#121212,#A01212 65%)"
  }
};

const BEATS = [
  { id:"b1", title:"Concrete Bloom", producer:"kenji", genres:["Trap"], price:29.99,
    gradient:"linear-gradient(135deg,#A01212,#2A2A2A 70%)",
    description:"A dusty, half-time trap beat built around a warped vocal chop and a sub that doesn't quit. Recorded live in one take on a Sunday afternoon." },
  { id:"b2", title:"Neon Static", producer:"nova", genres:["Synthwave"], price:34.99,
    gradient:"linear-gradient(135deg,#2A2A2A,#C81D25 70%)",
    description:"Arpeggiated synths over a driving four-on-the-floor pulse. Built for a chase scene that hasn't been filmed yet." },
  { id:"b3", title:"Low Tide", producer:"mars", genres:["R&B"], price:24.99,
    gradient:"linear-gradient(160deg,#A01212,#121212 75%)",
    description:"Rhodes chords, brushed drums, and a bassline that breathes. Room for a vocalist to stretch out." },
  { id:"b4", title:"Corner Store", producer:"fumes", genres:["Hip-Hop"], price:29.99,
    gradient:"linear-gradient(200deg,#2A2A2A,#A01212 80%)",
    description:"Sampled horns and a boom-bap loop chopped from a record nobody remembers the name of." },
  { id:"b5", title:"Afterglow", producer:"sable", genres:["Pop"], price:27.99,
    gradient:"linear-gradient(135deg,#C81D25,#121212 70%)",
    description:"Bright, wide, radio-ready. A drop built for a chorus that hits on the first listen." },
  { id:"b6", title:"Midnight Freight", producer:"kenji", genres:["Trap","House"], price:32.99,
    gradient:"linear-gradient(145deg,#121212,#A01212 60%)",
    description:"Rolling hi-hats over a house-leaning low end. Made for a room with the lights off." },
  { id:"b7", title:"Glass Ceiling", producer:"priya", genres:["Dubstep"], price:39.99,
    gradient:"linear-gradient(155deg,#121212,#A01212 65%)",
    description:"A slow build into a bass drop that was mixed at 2am and never touched again." },
  { id:"b8", title:"Backseat Sermon", producer:"fumes", genres:["Rap"], price:24.99,
    gradient:"linear-gradient(210deg,#2A2A2A,#C81D25 75%)",
    description:"Sparse and moody, built to leave space for the verse to do the work." }
];

const LICENSES = [
  { id:"mp3", name:"MP3 Lease", price:20, desc:"Untagged MP3, non-exclusive, up to 10,000 streams" },
  { id:"wav", name:"WAV Lease", price:40, desc:"Untagged WAV + MP3, non-exclusive, up to 100,000 streams" },
  { id:"premium", name:"Premium Lease", price:100, desc:"WAV + trackout stems, non-exclusive, unlimited streams" },
  { id:"exclusive", name:"Exclusive", price:500, desc:"Full ownership transfer, beat retired from the store" }
];

/* ----------------------------- HELPERS ----------------------------- */
function money(n){ return "$" + n.toFixed(2); }
function initials(name){ return name.split(" ").map(w=>w[0]).slice(0,2).join(""); }
function beatById(id){ return BEATS.find(b=>b.id===id); }
function producerById(id){ return PRODUCERS[id]; }
function qs(param){ return new URLSearchParams(window.location.search).get(param); }

/* ----------------------------- CART (localStorage) -----------------------------
   The site has no backend, so the cart is persisted in the browser via
   localStorage under one key. Every page reads/writes the same key, which is
   what lets the cart survive real page navigations between beat.html,
   browse.html, checkout.html, etc.
------------------------------------------------------------------------- */
const CART_KEY = "redbeats_cart";

function getCart(){
  try{
    return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
  }catch(e){
    return [];
  }
}
function saveCart(cart){
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}
function addToCart(beatId, licenseId, price){
  const cart = getCart();
  cart.push({ cartId: Date.now() + Math.random().toString(16).slice(2), beatId, licenseId, price });
  saveCart(cart);
  renderCartDrawer();
}
function removeFromCart(cartId){
  const cart = getCart().filter(c => c.cartId !== cartId);
  saveCart(cart);
  renderCartDrawer();
  if(typeof onCartChanged === "function") onCartChanged();
}
function cartCount(){ return getCart().length; }
function cartSubtotal(){ return getCart().reduce((s,c)=>s+c.price,0); }

/* ----------------------------- TOAST ----------------------------- */
function showToast(msg){
  const t = document.getElementById('toast');
  if(!t) return;
  document.getElementById('toast-text').textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(()=>t.classList.remove('show'), 2200);
}

/* ----------------------------- QUICK ADD (home / browse / beat cards) ----------------------------- */
function quickAdd(beatId, btnEl){
  const beat = beatById(beatId);
  addToCart(beat.id, "standard", beat.price);
  showToast(beat.title + " added to cart");
  if(btnEl){
    btnEl.classList.add('added');
    const icon = btnEl.querySelector('.material-symbols-outlined');
    if(icon) icon.textContent = 'check';
  }
}

/* ----------------------------- SHARED MARKUP: BEAT CARD / ROW ----------------------------- */
function beatCardHTML(beat){
  const p = producerById(beat.producer);
  const inCart = getCart().some(c=>c.beatId===beat.id);
  return `
    <div class="beat-card">
      <div class="beat-cover" style="background:${beat.gradient};" onclick="location.href='beat.html?id=${beat.id}'">
        <span class="cover-letter">${initials(beat.title)}</span>
        <div class="cover-play"><span class="material-symbols-outlined" style="font-size:18px;">play_arrow</span></div>
      </div>
      <div class="beat-body">
        <div class="beat-title" onclick="location.href='beat.html?id=${beat.id}'">${beat.title}</div>
        <div class="beat-producer" onclick="location.href='producer.html?id=${beat.producer}'">${p.name}</div>
        <div class="beat-tags">${beat.genres.map(g=>`<span class="pill-tag">${g}</span>`).join('')}</div>
        <div class="beat-footer">
          <span class="beat-price">${money(beat.price)}</span>
          <button class="add-cart-btn ${inCart?'added':''}" onclick="quickAdd('${beat.id}', this)" aria-label="Add to cart">
            <span class="material-symbols-outlined" style="font-size:18px;">${inCart?'check':'add_shopping_cart'}</span>
          </button>
        </div>
      </div>
    </div>`;
}

function rowWaveHTML(seed){
  let bars='';
  for(let i=0;i<26;i++){
    const h = 20 + Math.round(Math.abs(Math.sin((i+seed)*0.7))*80);
    bars += `<span style="height:${h}%;"></span>`;
  }
  return bars;
}

function beatRowHTML(beat, idx){
  const p = producerById(beat.producer);
  const inCart = getCart().some(c=>c.beatId===beat.id);
  return `
    <div class="beat-row">
      <div class="row-cover" style="background:${beat.gradient};" onclick="location.href='beat.html?id=${beat.id}'">${initials(beat.title)}</div>
      <div class="row-info">
        <div class="row-title-block">
          <div class="row-title" onclick="location.href='beat.html?id=${beat.id}'">${beat.title}</div>
          <div class="row-sub" onclick="location.href='producer.html?id=${beat.producer}'">${p.name}</div>
        </div>
        <div class="row-wave">${rowWaveHTML(idx || 0)}</div>
        <div class="row-tags">${beat.genres.map(g=>`<span class="pill-tag outline">${g}</span>`).join('')}</div>
      </div>
      <div class="row-price">${money(beat.price)}</div>
      <button class="add-cart-btn ${inCart?'added':''}" onclick="quickAdd('${beat.id}', this)" aria-label="Add to cart">
        <span class="material-symbols-outlined" style="font-size:18px;">${inCart?'check':'add_shopping_cart'}</span>
      </button>
    </div>`;
}

/* ----------------------------- CART DRAWER (present on every page except register.html) ----------------------------- */
function cartItemHTML(item){
  const beat = beatById(item.beatId);
  const lic = LICENSES.find(l=>l.id===item.licenseId);
  return `
    <div class="cart-item">
      <div class="cart-item-cover" style="background:${beat.gradient};">${initials(beat.title)}</div>
      <div>
        <div class="cart-item-title">${beat.title}</div>
        <div class="cart-item-sub">${producerById(beat.producer).name} · ${lic ? lic.name : 'Standard Lease'}</div>
      </div>
      <div class="cart-item-actions">
        <span class="cart-item-price">${money(item.price)}</span>
        <button class="cart-item-delete" onclick="removeFromCart('${item.cartId}')" aria-label="Remove"><span class="material-symbols-outlined" style="font-size:19px;">delete</span></button>
      </div>
    </div>`;
}

function renderCartDrawer(){
  const badge = document.getElementById('cart-badge-nav');
  if(!badge) return; // register.html has no drawer/badge
  const cart = getCart();
  const count = cart.length;
  badge.style.display = count ? 'flex' : 'none';
  badge.textContent = count;

  const itemsWrap = document.getElementById('cart-items');
  if(!count){
    itemsWrap.innerHTML = `<div class="cart-empty"><span class="material-symbols-outlined">shopping_cart</span><p>Your cart is empty.<br>Browse beats to find your next lease.</p></div>`;
  } else {
    itemsWrap.innerHTML = cart.map(cartItemHTML).join('');
  }
  document.getElementById('cart-subtotal').textContent = money(cartSubtotal());
}
function openCart(){
  document.getElementById('cart-drawer').classList.add('open');
  document.getElementById('scrim').classList.add('open');
}
function closeCart(){
  document.getElementById('cart-drawer').classList.remove('open');
  document.getElementById('scrim').classList.remove('open');
}
function goToCheckout(){
  window.location.href = 'checkout.html';
}
function subscribeNewsletter(){ showToast('Subscribed — see you in your inbox'); }

/* Run on every page load */
document.addEventListener('DOMContentLoaded', renderCartDrawer);
