// =========================================================
// Happy Birthday — interactions
// =========================================================

document.addEventListener('DOMContentLoaded', () => {
  const opener = document.getElementById('opener');
  const site = document.getElementById('site');
  const audio = document.getElementById('bgAudio');
  const petalsContainer = document.getElementById('petals');

  // ---- Ambient floating petals ----
  const PETAL_EMOJIS = ['🌸', '🌺', '🌷', '🌼', '🌹'];
  const PETAL_COUNT = 16;

  function spawnPetal() {
    const petal = document.createElement('span');
    petal.className = 'petal';
    petal.textContent = PETAL_EMOJIS[Math.floor(Math.random() * PETAL_EMOJIS.length)];
    petal.style.left = Math.random() * 100 + 'vw';
    petal.style.setProperty('--drift', (Math.random() * 120 - 60) + 'px');
    petal.style.fontSize = (14 + Math.random() * 14) + 'px';
    const duration = 8 + Math.random() * 8;
    petal.style.animationDuration = duration + 's';
    petalsContainer.appendChild(petal);
    setTimeout(() => petal.remove(), duration * 1000 + 500);
  }

  for (let i = 0; i < PETAL_COUNT; i++) {
    setTimeout(() => spawnPetal(), i * 600);
  }
  setInterval(spawnPetal, 900);

  // ---- Gift opener ----
  function openGift() {
    opener.classList.add('fade-out');
    site.classList.remove('hidden');
    document.body.style.overflow = 'auto';

    // try to start background music softly (optional asset)
    if (audio) {
      audio.play().catch(() => {
        /* autoplay may be blocked — pasangan kamu bisa pakai player musik di pojok */
      });
    }

    setTimeout(() => {
      opener.remove();
    }, 700);
  }

  opener.addEventListener('click', openGift);
  opener.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') openGift();
  });
  opener.setAttribute('tabindex', '0');
  opener.setAttribute('role', 'button');
  opener.setAttribute('aria-label', 'Tap to open your birthday gift');

  // lock scroll until opened
  document.body.style.overflow = 'hidden';

  // ---- Garden flower cards (tap-to-bloom on touch devices) ----
  const flowerCards = document.querySelectorAll('.flower-card');
  flowerCards.forEach((card) => {
    card.addEventListener('click', () => {
      card.classList.toggle('bloomed');
    });
  });

  // ---- Mini music player (Spotify-style) ----
  const player = document.getElementById('musicPlayer');
  const pillOpenBtn = document.getElementById('playerToggleOpen');
  const collapseBtn = document.getElementById('playerCollapse');
  const playPauseBtn = document.getElementById('playerPlayPause');
  const prevBtn = document.getElementById('playerPrev');
  const nextBtn = document.getElementById('playerNext');
  const seek = document.getElementById('playerSeek');
  const volume = document.getElementById('playerVolume');
  const currentTimeEl = document.getElementById('playerCurrent');
  const durationEl = document.getElementById('playerDuration');

  function formatTime(sec) {
    if (!isFinite(sec) || isNaN(sec)) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  if (player && audio) {
    // expand / collapse card
    pillOpenBtn.addEventListener('click', () => {
      player.classList.add('open');
      pillOpenBtn.setAttribute('aria-expanded', 'true');
    });
    collapseBtn.addEventListener('click', () => {
      player.classList.remove('open');
      pillOpenBtn.setAttribute('aria-expanded', 'false');
    });

    // play / pause
    function togglePlay() {
      if (audio.paused) {
        audio.play().catch(() => { /* file belum tersedia di assets/audio/song.mp3 */ });
      } else {
        audio.pause();
      }
    }
    playPauseBtn.addEventListener('click', togglePlay);

    // prev = restart from 0, next = jump to end (loop will restart it)
    prevBtn.addEventListener('click', () => { audio.currentTime = 0; });
    nextBtn.addEventListener('click', () => { audio.currentTime = 0; audio.play().catch(() => {}); });

    // seek bar
    seek.addEventListener('input', () => {
      if (audio.duration) {
        audio.currentTime = (seek.value / 100) * audio.duration;
      }
    });

    // volume
    volume.addEventListener('input', () => {
      audio.volume = volume.value / 100;
    });
    audio.volume = volume.value / 100;

    // sync UI with audio state
    audio.addEventListener('play', () => {
      player.classList.add('playing');
      playPauseBtn.classList.add('is-playing');
      playPauseBtn.setAttribute('aria-pressed', 'true');
    });
    audio.addEventListener('pause', () => {
      player.classList.remove('playing');
      playPauseBtn.classList.remove('is-playing');
      playPauseBtn.setAttribute('aria-pressed', 'false');
    });
    audio.addEventListener('loadedmetadata', () => {
      durationEl.textContent = formatTime(audio.duration);
    });
    audio.addEventListener('timeupdate', () => {
      currentTimeEl.textContent = formatTime(audio.currentTime);
      if (audio.duration) {
        seek.value = (audio.currentTime / audio.duration) * 100;
      }
    });
  }
});