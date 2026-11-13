/**
 * Suruchi weds Vikky — Royal Wedding Invitation
 * Interactive Script: Audio player, Countdown, Petals Canvas,
 * Bilingual Toggle, Google Calendar, and WhatsApp Sharing.
 */

document.addEventListener('DOMContentLoaded', () => {
  initAudioEngine();
  initWelcomeOverlay();
  initCountdownTimer();
  initPetalShower();
  initLanguageToggle();
  setupGlobalTouchUnlock();
});

/* ==========================================================================
   1. AUDIO ENGINE (iOS & Safari Optimized: Aaj Sajeya + Synth Fallback)
   ========================================================================== */
let audioContext = null;
let isAudioPlaying = false;
let synthInterval = null;
let synthGain = null;
const audioElement = document.getElementById('wedding-audio');
const musicToggleBtn = document.getElementById('music-toggle-btn');
const musicLabel = document.getElementById('music-label');

function initAudioEngine() {
  if (audioElement) {
    // iOS Safari safely handle volume
    try {
      audioElement.volume = 0.8;
    } catch (e) {
      // iOS volume is read-only
    }

    // Preload audio on initial page load
    try {
      audioElement.load();
    } catch (e) {}

    // Event listeners
    audioElement.addEventListener('playing', () => {
      setMusicState(true);
    });

    audioElement.addEventListener('pause', () => {
      if (!isAudioPlaying) {
        setMusicState(false);
      }
    });

    audioElement.addEventListener('ended', () => {
      // Mobile Safari loop reinforcement
      audioElement.currentTime = 0;
      audioElement.play().catch(() => {});
    });

    audioElement.addEventListener('error', (e) => {
      console.warn('Audio tag error, fallback ready:', e);
    });
  }

  // Floating music controller click & touch listeners
  if (musicToggleBtn) {
    ['click', 'touchend'].forEach(evt => {
      musicToggleBtn.addEventListener(evt, (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleMusic();
      }, { passive: false });
    });
  }

  // Auto-pause when page loses focus / background tab
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (isAudioPlaying) {
        pauseAudioInternal();
        isAudioPlaying = true; // flag to resume
      }
    } else {
      if (isAudioPlaying) {
        playAudioInternal();
      }
    }
  });
}

function startAudio() {
  playAudioInternal();
}

function toggleMusic() {
  if (isAudioPlaying) {
    pauseAudioInternal();
    setMusicState(false);
  } else {
    playAudioInternal();
    setMusicState(true);
  }
}

function playAudioInternal() {
  isAudioPlaying = true;

  // 1. Try HTML5 Audio (Direct user gesture for iOS)
  if (audioElement) {
    try {
      audioElement.volume = 0.8;
    } catch (e) {}

    const playPromise = audioElement.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        setMusicState(true);
      }).catch(err => {
        console.warn('HTML5 Audio play prevented or failed, trying secondary path:', err);
        // If current source had issue, try alternate path
        if (!audioElement.src || !audioElement.src.includes('music/')) {
          audioElement.src = 'music/aaj-sajeya.mp3';
          audioElement.load();
          audioElement.play().then(() => {
            setMusicState(true);
          }).catch(() => {
            startWeddingSynthMelody();
          });
        } else {
          startWeddingSynthMelody();
        }
      });
    }
  } else {
    startWeddingSynthMelody();
  }

  // 2. Pre-unlock WebAudio context synchronously in user gesture
  if (!audioContext && (window.AudioContext || window.webkitAudioContext)) {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      audioContext = new AudioCtx();
    } catch (e) {}
  }
  if (audioContext && audioContext.state === 'suspended') {
    audioContext.resume().catch(() => {});
  }
}

function pauseAudioInternal() {
  if (audioElement && !audioElement.paused) {
    audioElement.pause();
  }
  stopWeddingSynthMelody();
  setMusicState(false);
}

function setMusicState(playing) {
  isAudioPlaying = playing;
  if (musicToggleBtn) {
    if (playing) {
      musicToggleBtn.classList.add('playing');
      musicLabel.textContent = currentLang === 'hi' ? 'संगीत चालू' : 'Playing';
    } else {
      musicToggleBtn.classList.remove('playing');
      musicLabel.textContent = currentLang === 'hi' ? 'संगीत बंद' : 'Paused';
    }
  }
}

/**
 * Global Touch Unlocker for Mobile Safari / iOS
 * If iOS required additional tap, any touch on screen guarantees audio starts
 */
function setupGlobalTouchUnlock() {
  const unlock = () => {
    if (isAudioPlaying && audioElement && audioElement.paused) {
      audioElement.play().catch(() => {});
    }
    if (isAudioPlaying && audioContext && audioContext.state === 'suspended') {
      audioContext.resume().catch(() => {});
    }
  };

  ['touchstart', 'touchend', 'click'].forEach(evt => {
    document.addEventListener(evt, unlock, { passive: true });
  });
}

/**
 * Auspicious Indian Wedding Shehnai & Santoor Synthesizer Fallback
 * Plays traditional Raga notes (Sa, Re, Ga, Pa, Dha)
 */
function startWeddingSynthMelody() {
  if (synthInterval) return; // already running

  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    if (!audioContext) {
      audioContext = new AudioCtx();
    }
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }

    synthGain = audioContext.createGain();
    synthGain.gain.setValueAtTime(0.12, audioContext.currentTime);
    synthGain.connect(audioContext.destination);

    // Traditional auspicious wedding raga frequencies (Raga Yaman / Bilawal notes in C)
    const scale = [
      261.63, // C4 (Sa)
      293.66, // D4 (Re)
      329.63, // E4 (Ga)
      392.00, // G4 (Pa)
      440.00, // A4 (Dha)
      523.25, // C5 (Taar Sa)
      587.33  // D5 (Taar Re)
    ];

    // Melodic sequence evoking traditional shehnai auspiciousness
    const melody = [
      0, 1, 2, 3, 4, 3, 2, 1,
      0, 2, 3, 4, 5, 4, 3, 2,
      4, 5, 6, 5, 4, 3, 2, 0
    ];

    let noteIndex = 0;

    function playNote(freq, duration) {
      if (!audioContext || audioContext.state !== 'running') return;
      
      const osc = audioContext.createOscillator();
      const oscGain = audioContext.createGain();
      
      // Shehnai timbre (rich sawtooth blended with sine)
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, audioContext.currentTime);

      // Lowpass filter for warm traditional reed tone
      const filter = audioContext.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, audioContext.currentTime);

      const now = audioContext.currentTime;
      oscGain.gain.setValueAtTime(0, now);
      oscGain.gain.linearRampToValueAtTime(0.08, now + 0.08); // gentle attack
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(filter);
      filter.connect(oscGain);
      oscGain.connect(synthGain);

      osc.start(now);
      osc.stop(now + duration);
    }

    playNote(scale[melody[noteIndex]], 0.55);
    synthInterval = setInterval(() => {
      noteIndex = (noteIndex + 1) % melody.length;
      playNote(scale[melody[noteIndex]], 0.55);
    }, 450);

    setMusicState(true);
  } catch (e) {
    console.error('Synth playback error', e);
  }
}

function stopWeddingSynthMelody() {
  if (synthInterval) {
    clearInterval(synthInterval);
    synthInterval = null;
  }
}

/* ==========================================================================
   2. SCREEN 0: WELCOME OVERLAY & CARD UNSEAL
   ========================================================================== */
let isOverlayOpened = false;

function openInvitationCard() {
  if (isOverlayOpened) return;
  isOverlayOpened = true;

  const welcomeOverlay = document.getElementById('welcome-overlay');
  if (welcomeOverlay) {
    welcomeOverlay.classList.add('opened');
  }

  // 1. Trigger audio play directly within the user gesture (CRITICAL FOR iOS)
  try {
    startAudio();
  } catch (err) {
    console.warn('Audio playback error:', err);
  }

  // 2. Smooth scroll into the invitation card
  setTimeout(() => {
    const heroSection = document.getElementById('hero');
    if (heroSection) {
      heroSection.scrollIntoView({ behavior: 'smooth' });
    }
  }, 300);

  showToast(currentLang === 'hi' ? 'सस्नेह निमंत्रण पत्र में आपका स्वागत है! 🌸' : 'Welcome to the Wedding Invitation! 🌸');
}

// Global exposure for inline onclick attribute
window.openInvitationCard = openInvitationCard;

function initWelcomeOverlay() {
  const openCardBtn = document.getElementById('open-card-btn');
  if (openCardBtn) {
    openCardBtn.addEventListener('click', openInvitationCard);
    openCardBtn.addEventListener('touchend', () => {
      openInvitationCard();
    }, { passive: true });
  }
}

/* ==========================================================================
   3. COUNTDOWN TIMER (24 November 2026, 19:00:00 IST)
   ========================================================================== */
function initCountdownTimer() {
  // Wedding Date: 24 Nov 2026, 19:00:00 IST (+05:30)
  const weddingDate = new Date('2026-11-24T19:00:00+05:30').getTime();

  const daysEl = document.getElementById('timer-days');
  const hoursEl = document.getElementById('timer-hours');
  const minsEl = document.getElementById('timer-mins');
  const secsEl = document.getElementById('timer-secs');

  function updateTimer() {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    if (distance <= 0) {
      if (daysEl) daysEl.textContent = '00';
      if (hoursEl) hoursEl.textContent = '00';
      if (minsEl) minsEl.textContent = '00';
      if (secsEl) secsEl.textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minsEl) minsEl.textContent = String(minutes).padStart(2, '0');
    if (secsEl) secsEl.textContent = String(seconds).padStart(2, '0');
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

/* ==========================================================================
   4. FALLING PETALS & GOLDEN PARTICLES CANVAS
   ========================================================================== */
let petalsActive = true;
function initPetalShower() {
  const canvas = document.getElementById('petals-canvas');
  const toggleBtn = document.getElementById('petals-toggle-btn');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const petalsCount = window.innerWidth < 600 ? 22 : 36;
  const petals = [];

  const petalColors = [
    'rgba(240, 98, 146, 0.7)',  // Soft Rose Pink
    'rgba(225, 29, 72, 0.65)',  // Festive Red/Maroon
    'rgba(253, 224, 71, 0.75)', // Golden Marigold
    'rgba(245, 158, 11, 0.7)',  // Saffron
    'rgba(212, 175, 55, 0.85)'  // Gold Sparkle
  ];

  for (let i = 0; i < petalsCount; i++) {
    petals.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 8 + 6,
      speedX: Math.random() * 1.5 - 0.75,
      speedY: Math.random() * 1.2 + 0.8,
      rotation: Math.random() * 360,
      rotationSpeed: Math.random() * 2 - 1,
      color: petalColors[Math.floor(Math.random() * petalColors.length)],
      isSparkle: Math.random() > 0.6
    });
  }

  function renderPetals() {
    if (!petalsActive) {
      ctx.clearRect(0, 0, width, height);
      return;
    }

    ctx.clearRect(0, 0, width, height);

    petals.forEach(p => {
      p.x += p.speedX;
      p.y += p.speedY;
      p.rotation += p.rotationSpeed;

      if (p.y > height + 20) {
        p.y = -20;
        p.x = Math.random() * width;
      }
      if (p.x > width + 20) p.x = -20;
      if (p.x < -20) p.x = width + 20;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);

      ctx.fillStyle = p.color;

      if (p.isSparkle) {
        // Golden diamond sparkle
        ctx.beginPath();
        ctx.moveTo(0, -p.size * 0.6);
        ctx.lineTo(p.size * 0.4, 0);
        ctx.lineTo(0, p.size * 0.6);
        ctx.lineTo(-p.size * 0.4, 0);
        ctx.closePath();
        ctx.fill();
      } else {
        // Organic flower petal shape
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(p.size, -p.size * 0.5, p.size, p.size * 1.5, 0, p.size * 2);
        ctx.bezierCurveTo(-p.size, p.size * 1.5, -p.size, -p.size * 0.5, 0, 0);
        ctx.fill();
      }

      ctx.restore();
    });

    requestAnimationFrame(renderPetals);
  }

  requestAnimationFrame(renderPetals);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      petalsActive = !petalsActive;
      toggleBtn.textContent = petalsActive ? '🌸' : '🍂';
      showToast(petalsActive ? 'पुष्प वर्षा चालू' : 'पुष्प वर्षा बंद');
      if (petalsActive) requestAnimationFrame(renderPetals);
    });
  }
}

/* ==========================================================================
   5. BILINGUAL TOGGLE (Hindi / English)
   ========================================================================== */
let currentLang = 'hi';

function initLanguageToggle() {
  const langToggleBtn = document.getElementById('lang-toggle-btn');
  const langBadge = document.getElementById('lang-badge');

  if (langToggleBtn) {
    langToggleBtn.addEventListener('click', () => {
      currentLang = currentLang === 'hi' ? 'en' : 'hi';
      langBadge.textContent = currentLang === 'hi' ? 'EN' : 'हिंदी';
      document.documentElement.lang = currentLang;

      // Update all elements with data-hi and data-en
      document.querySelectorAll('[data-hi]').forEach(el => {
        const val = el.getAttribute(`data-${currentLang}`);
        if (val) {
          el.innerHTML = val;
        }
      });

      // Update music button label
      if (musicLabel) {
        if (isAudioPlaying) {
          musicLabel.textContent = currentLang === 'hi' ? 'संगीत चालू' : 'Playing';
        } else {
          musicLabel.textContent = currentLang === 'hi' ? 'संगीत' : 'Music';
        }
      }

      showToast(currentLang === 'hi' ? 'हिंदी भाषा चुनी गई' : 'Switched to English');
    });
  }
}

/* ==========================================================================
   6. ADD TO GOOGLE CALENDAR
   ========================================================================== */
function addToGoogleCalendar(eventKey) {
  const events = {
    tilak: {
      title: 'तिलक समारोह — सुरुचि संग विक्की | Suruchi weds Vikky',
      start: '20261119T100000',
      end: '20261119T160000',
      details: 'सुरुचि कुमारी एवं विक्की कुमार का पावन तिलक समारोह। स्थान: गोनावाँ रोड, हरनौत, नालंदा (बिहार)।',
      location: 'Gonawan Road, Harnaut, Nalanda, Bihar 803110'
    },
    haldi: {
      title: 'मड़वा, हल्दी एवं मटकोर — सुरुचि संग विक्की | Suruchi weds Vikky',
      start: '20261122T100000',
      end: '20261122T170000',
      details: 'पारंपरिक हल्दी उबटन, मंगल गीत एवं मड़वा पूजन। स्थान: गोनावाँ रोड, हरनौत, नालंदा (बिहार)।',
      location: 'Gonawan Road, Harnaut, Nalanda, Bihar 803110'
    },
    sangeet: {
      title: 'संगीत एवं मेंहदी — सुरुचि संग विक्की | Suruchi weds Vikky',
      start: '20261123T160000',
      end: '20261123T220000',
      details: 'शाम-ए-संगीत एवं मेंहदी उत्सव। स्थान: गोनावाँ रोड, हरनौत, नालंदा (बिहार)।',
      location: 'Gonawan Road, Harnaut, Nalanda, Bihar 803110'
    },
    vivah: {
      title: 'शुभ विवाह : सुरुचि संग विक्की | Grand Wedding - Suruchi weds Vikky',
      start: '20261124T190000',
      end: '20261125T040000',
      details: 'बारात आगमन, प्रीतिभोज एवं शुभ विवाह पाणिग्रहण संस्कार। स्थान: गोनावाँ रोड, हरनौत, नालंदा (बिहार) - 803110।',
      location: 'Gonawan Road, Harnaut, Nalanda, Bihar 803110'
    }
  };

  const ev = events[eventKey] || events.vivah;
  const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(ev.title)}&dates=${ev.start}/${ev.end}&details=${encodeURIComponent(ev.details)}&location=${encodeURIComponent(ev.location)}`;
  
  window.open(gcalUrl, '_blank', 'noopener,noreferrer');
}

/* ==========================================================================
   7. COPY VENUE ADDRESS TO CLIPBOARD
   ========================================================================== */
function copyVenueAddress() {
  const addressText = "गोनावाँ रोड, हरनौत, जिला– नालंदा (बिहार) – 803110";
  
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(addressText).then(() => {
      showToast(currentLang === 'hi' ? 'पता कॉपी हो गया! 📋' : 'Address copied to clipboard! 📋');
    }).catch(() => {
      fallbackCopy(addressText);
    });
  } else {
    fallbackCopy(addressText);
  }
}

function fallbackCopy(text) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.left = "-9999px";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
    showToast(currentLang === 'hi' ? 'पता कॉपी हो गया! 📋' : 'Address copied! 📋');
  } catch (err) {
    showToast(text);
  }
  document.body.removeChild(textArea);
}

/* ==========================================================================
   8. SHARE ON WHATSAPP & WEB SHARE API
   ========================================================================== */
function shareOnWhatsApp() {
  const currentUrl = window.location.href;
  const shareTitle = "💍 सुरुचि संग विक्की — पावन परिणयोत्सव 🌸";
  const shareText = `॥ श्री गणेशाय नमः ॥
स्नेही स्वजन,
सुरुचि कुमारी संग विक्की कुमार के पावन विवाह का सस्नेह निमंत्रण! 🙏

📅 दिनांक: 24 नवंबर 2026 (मंगलवार)
🏡 स्थान: गोनावाँ रोड, हरनौत, नालंदा (बिहार)

डिजिटल निमंत्रण पत्र देखने व संगीत सुनने हेतु लिंक खोलें:
${currentUrl}`;

  if (navigator.share) {
    navigator.share({
      title: shareTitle,
      text: shareText,
      url: currentUrl
    }).catch(err => {
      console.log('Share canceled or failed', err);
      fallbackWhatsAppShare(shareText);
    });
  } else {
    fallbackWhatsAppShare(shareText);
  }
}

function fallbackWhatsAppShare(text) {
  const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
  window.open(waUrl, '_blank', 'noopener,noreferrer');
}

/* ==========================================================================
   9. TOAST NOTIFICATION
   ========================================================================== */
let toastTimeout = null;
function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = msg;
  toast.classList.add('show');

  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 2800);
}

// Make functions globally available for inline onclick attributes
window.openInvitationCard = openInvitationCard;
window.addToGoogleCalendar = addToGoogleCalendar;
window.copyVenueAddress = copyVenueAddress;
window.shareOnWhatsApp = shareOnWhatsApp;
