let activeGenreFilter = qs('genre') || null;

function renderGenreGrid(){
  const wrap = document.getElementById('genre-grid');
  wrap.innerHTML = GENRES.map(g=>`<button class="genre-btn ${activeGenreFilter===g?'active':''}" onclick="toggleGenreFilter('${g}')">${g}</button>`).join('');
}
function toggleGenreFilter(g){
  activeGenreFilter = (activeGenreFilter === g) ? null : g;
  renderGenreGrid();
  renderBeatList();
}
function renderBeatList(){
  const q = (document.getElementById('browse-search').value || '').toLowerCase();
  let list = BEATS.filter(b=>{
    const p = producerById(b.producer);
    const matchesQuery = !q || b.title.toLowerCase().includes(q) || p.name.toLowerCase().includes(q) || b.genres.some(g=>g.toLowerCase().includes(q));
    const matchesGenre = !activeGenreFilter || b.genres.includes(activeGenreFilter);
    return matchesQuery && matchesGenre;
  });
  const wrap = document.getElementById('beat-list');
  wrap.innerHTML = list.length ? list.map(beatRowHTML).join('') : `<p style="color:var(--text-secondary);padding:30px 0;text-align:center;">No beats match your search.</p>`;
}

// removeFromCart() in app.js calls this after deleting an item from the drawer,
// so the "in cart" checkmarks on this page's rows stay in sync.
function onCartChanged(){ renderBeatList(); }

document.addEventListener('DOMContentLoaded', () => {
  renderGenreGrid();
  renderBeatList();
});
