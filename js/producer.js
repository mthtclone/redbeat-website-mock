let following = false;

function toggleFollow(){
  following = !following;
  const btn = document.getElementById('follow-btn');
  btn.textContent = following ? 'Following' : 'Follow';
  btn.classList.toggle('followed', following);
  showToast(following ? 'Now following' : 'Unfollowed');
}

document.addEventListener('DOMContentLoaded', () => {
  const producerId = qs('id') || 'kenji';
  const p = producerById(producerId) || producerById('kenji');

  document.getElementById('profile-banner').style.background = p.gradient;
  document.getElementById('profile-avatar').style.background = p.gradient;
  document.getElementById('profile-avatar').textContent = initials(p.name);
  document.getElementById('profile-name').textContent = p.name;
  document.getElementById('profile-location').textContent = p.location;
  document.getElementById('profile-bio').textContent = p.bio;
  document.getElementById('profile-followers').textContent = p.followers;
  document.getElementById('profile-tracks-count').textContent = p.tracks;
  document.getElementById('profile-sales').textContent = p.sales;
  document.getElementById('profile-genres').innerHTML = p.genres.map(g=>`<span class="pill-tag">${g}</span>`).join('');
  document.title = p.name + ' — RedBeats';

  const tracks = BEATS.filter(b=>b.producer===p.id);
  document.getElementById('profile-track-list').innerHTML = tracks.map(beatRowHTML).join('');
});

function onCartChanged(){
  const producerId = qs('id') || 'kenji';
  const tracks = BEATS.filter(b=>b.producer===producerId);
  document.getElementById('profile-track-list').innerHTML = tracks.map(beatRowHTML).join('');
}
