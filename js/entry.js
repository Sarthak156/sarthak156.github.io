/* ============================================
   Entry Screen — Mangekyo Sharingan Animation
   ============================================ */

class EntryScreen {
  constructor(onComplete) {
    this.screen = document.getElementById('entry-screen');
    this.svg = document.querySelector('.mangekyo-svg');
    this.onComplete = onComplete;
    this.init();
  }

  init() {
    // After SVG appears (1.5s appear + 0.5s delay = 2s), start spinning
    setTimeout(() => {
      if (this.svg) this.svg.classList.add('spinning');
    }, 2000);

    // Click or wait to proceed
    const proceed = () => {
      this.screen.removeEventListener('click', proceed);
      this.open();
    };

    this.screen.addEventListener('click', proceed);

    // Auto-proceed after 5 seconds
    setTimeout(() => proceed(), 5500);
  }

  open() {
    if (this._opened) return;
    this._opened = true;

    // Accelerate spin
    if (this.svg) {
      this.svg.classList.remove('spinning');
      this.svg.classList.add('accelerating');
    }

    // After acceleration, do iris reveal
    setTimeout(() => {
      // Fade the entry screen
      this.screen.style.transition = 'opacity 0.8s ease';
      this.screen.style.opacity = '0';

      setTimeout(() => {
        this.screen.classList.add('hidden');
        this.screen.style.display = 'none';
        if (this.onComplete) this.onComplete();
      }, 800);
    }, 1500);
  }
}

window.EntryScreen = EntryScreen;
