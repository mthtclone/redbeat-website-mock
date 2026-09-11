let payTab = 'card';
let localPay = null;

function orderItemHTML(item){
  const beat = beatById(item.beatId);
  const lic = LICENSES.find(l=>l.id===item.licenseId);
  return `
    <div class="order-item">
      <div class="order-cover" style="background:${beat.gradient};">${initials(beat.title)}</div>
      <div class="order-item-body">
        <div class="order-item-title">${beat.title}</div>
        <div class="order-item-license">${lic ? lic.name : 'Standard Lease'}</div>
        <a class="order-item-edit" href="beat.html?id=${beat.id}">Edit</a>
      </div>
      <div class="order-item-price">${money(item.price)}</div>
    </div>`;
}

function renderCheckout(){
  const wrap = document.getElementById('checkout-items');
  const totalsWrap = document.getElementById('checkout-totals-wrap');
  const cart = getCart();
  if(!cart.length){
    wrap.innerHTML = `<div class="order-empty">Your cart is empty. <a href="browse.html" style="color:#fff;text-decoration:underline;">Browse beats</a> to add a license.</div>`;
    totalsWrap.style.display = 'none';
    return;
  }
  totalsWrap.style.display = 'block';
  wrap.innerHTML = cart.map(orderItemHTML).join('');
  const subtotal = cartSubtotal();
  const tax = subtotal * 0.10;
  const total = subtotal + tax;
  document.getElementById('checkout-subtotal').textContent = money(subtotal);
  document.getElementById('checkout-tax').textContent = money(tax);
  document.getElementById('checkout-total').textContent = money(total);
}
function onCartChanged(){ renderCheckout(); }

function setPayTab(tab){
  payTab = tab;
  document.getElementById('tab-card').classList.toggle('active', tab==='card');
  document.getElementById('tab-local').classList.toggle('active', tab==='local');
  document.getElementById('pay-card-fields').style.display = tab==='card' ? 'block' : 'none';
  document.getElementById('pay-local-fields').style.display = tab==='local' ? 'block' : 'none';
}
function selectLocalPay(which){
  localPay = which;
  document.getElementById('pay-kbz').classList.toggle('selected', which==='kbz');
  document.getElementById('pay-wave').classList.toggle('selected', which==='wave');
}
function completeCheckout(){
  if(!getCart().length){
    showToast('Your cart is empty');
    return;
  }
  saveCart([]);
  window.location.href = 'index.html?ordered=1';
}

document.addEventListener('DOMContentLoaded', renderCheckout);
