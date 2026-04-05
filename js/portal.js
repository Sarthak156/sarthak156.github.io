/* ============================================
   Portal Gate — Solo Leveling Transition
   ============================================ */

class PortalTransition {
  constructor() {
    this.overlay = document.getElementById('portal-overlay');
    this.gate = this.overlay?.querySelector('.portal-gate');
    this.isTransitioning = false;
  }

  async transition(fromPage, toPage, bg, callback) {
    if (this.isTransitioning) return;
    this.isTransitioning = true;

    // Phase 1: Fade out current page
    if (fromPage) {
      fromPage.style.transition = 'opacity 0.3s ease, filter 0.3s ease';
      fromPage.style.opacity = '0';
      fromPage.style.filter = 'blur(5px)';
    }

    // Phase 2: Crack appears
    await this.wait(200);
    this.gate.className = 'portal-gate crack';

    // Phase 3: Gate opens wide
    await this.wait(400);
    this.gate.className = 'portal-gate opening';

    // Phase 4: Switch page content at peak
    await this.wait(500);
    if (fromPage) {
      fromPage.classList.remove('active');
      fromPage.style.opacity = '';
      fromPage.style.filter = '';
      fromPage.style.transition = '';
    }

    // Switch 3D background
    if (bg && toPage) {
      bg.setPreset(toPage.id.replace('page-', ''));
    }

    if (toPage) {
      toPage.classList.add('active');
    }

    if (callback) callback();

    // Phase 5: Gate closes
    await this.wait(300);
    this.gate.className = 'portal-gate closing';

    // Phase 6: Clean up
    await this.wait(600);
    this.gate.className = 'portal-gate';
    this.isTransitioning = false;
  }

  wait(ms) {
    return new Promise(r => setTimeout(r, ms));
  }
}

window.PortalTransition = PortalTransition;
