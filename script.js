document.addEventListener('DOMContentLoaded', () => {
  
  // ========== 1. TYPING ANIMATION FOR NAME ==========
  const nameElement = document.getElementById('typing-name');
  if (nameElement) {
    const fullName = 'PREM SINGHA';
    let charIndex = 0;
    
    function typeNextChar() {
      if (charIndex < fullName.length) {
        nameElement.textContent = fullName.substring(0, charIndex + 1);
        charIndex++;
        setTimeout(typeNextChar, 120);
      } else { 
        nameElement.classList.add('typing-complete'); 
      }
    }
    setTimeout(typeNextChar, 800);
  }

  // ========== 2. MOBILE DETECTION & PERFORMANCE TUNING ==========
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
  const particleCount = isMobile ? 40 : Math.min(80, Math.floor(window.innerWidth / 15));
  const particleSpeed = isMobile ? 0.2 : 0.4;

  // ========== 3. PARTICLE BACKGROUND ==========
  const canvas = document.getElementById('particles-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    
    function resizeCanvas() {
      const dpr = isMobile ? 1 : (window.devicePixelRatio || 1);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * (isMobile ? 2 : 2.5) + 0.5;
        this.speedX = (Math.random() - 0.5) * particleSpeed;
        this.speedY = (Math.random() - 0.5) * particleSpeed;
        this.opacity = Math.random() * 0.6 + 0.2;
        this.gold = Math.random() > 0.3;
      }
      update() {
        this.x += this.speedX; this.y += this.speedY;
        if (this.x < 0) this.x = canvas.width; if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height; if (this.y > canvas.height) this.y = 0;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.gold ? `rgba(212, 175, 55, ${this.opacity})` : `rgba(255, 255, 255, ${this.opacity * 0.7})`;
        ctx.fill();
      }
    }

    const particles = [];
    for (let i = 0; i < particleCount; i++) particles.push(new Particle());

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
      
      // Connections only on desktop for performance
      if (!isMobile) {
        particles.forEach((p1, i) => {
          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dx = p1.x - p2.x, dy = p1.y - p2.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 120) {
              ctx.beginPath();
              ctx.strokeStyle = `rgba(212, 175, 55, ${0.15 * (1 - distance/120)})`;
              ctx.lineWidth = 0.5;
              ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
            }
          }
        });
      }
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  // ========== 4. SCROLL ANIMATIONS ==========
  const animatedElements = document.querySelectorAll('[data-animate]');
  if (animatedElements.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => { entry.target.classList.add('visible'); }, parseInt(delay));
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
    animatedElements.forEach(el => observer.observe(el));
  }

  // ========== 5. 3D TILT (DESKTOP) / SCALE (MOBILE) ==========
  const tiltElements = document.querySelectorAll('.tilt-card');
  tiltElements.forEach(element => {
    if (isMobile) {
      element.addEventListener('touchstart', function(e) { 
        this.style.transform = 'scale(1.02)'; 
        this.style.boxShadow = 'var(--shadow-glow)'; 
      }, {passive: true});
      element.addEventListener('touchend', function() { 
        this.style.transform = 'scale(1)'; 
        this.style.boxShadow = 'var(--shadow-soft)'; 
      });
    } else {
      element.addEventListener('mousemove', (e) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left, y = e.clientY - rect.top;
        const centerX = rect.width / 2, centerY = rect.height / 2;
        const rotateX = (y - centerY) / 15, rotateY = (centerX - x) / 15;
        element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        const glow = element.querySelector('.card-glow, .message-glow');
        if (glow) { 
          glow.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`); 
          glow.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`); 
        }
      });
      element.addEventListener('mouseleave', () => { 
        element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)'; 
      });
    }
  });

  // ========== 6. SCROLL HINT AUTO-HIDE ==========
  const scrollHint = document.getElementById('scroll-hint');
  let userScrolled = false;
  
  function hideScrollHint() {
    if (!userScrolled && scrollHint) { 
      scrollHint.classList.add('hidden'); 
      userScrolled = true; 
    }
  }
  
  if (scrollHint) {
    window.addEventListener('scroll', hideScrollHint, { passive: true });
    window.addEventListener('touchstart', hideScrollHint, { passive: true });
    scrollHint.addEventListener('click', () => { 
      hideScrollHint(); 
      document.querySelector('.message-section')?.scrollIntoView({ behavior: 'smooth' }); 
    });
  }

  // ========== 7. COUNTDOWN TIMER ==========
  const countdownContainer = document.getElementById('countdown');
  if (countdownContainer) {
    const eventDate = new Date('2026-05-10T17:00:00+05:30');
    const daysEl = document.getElementById('days'); 
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes'); 
    const secondsEl = document.getElementById('seconds');

    function updateCountdown() {
      const now = new Date(); 
      const diff = eventDate - now;
      
      if (diff <= 0) { 
        countdownContainer.innerHTML = '<p class="event-started">🎉 कार्यक्रम शुरू हो चुका है। आपका स्वागत है!</p>'; 
        return; 
      }
      
      const d = Math.floor(diff / (1000 * 60 * 60 * 24)); 
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)); 
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      
      animateNumberChange(daysEl, d); 
      animateNumberChange(hoursEl, h); 
      animateNumberChange(minutesEl, m); 
      animateNumberChange(secondsEl, s);
    }
    
    function animateNumberChange(element, newValue) {
      if (!element) return;
      const current = parseInt(element.textContent) || 0;
      if (current !== newValue) { 
        element.style.transform = 'scale(1.15)'; 
        element.style.textShadow = '0 0 25px var(--accent-glow-strong)';
        setTimeout(() => { 
          element.textContent = String(newValue).padStart(2, '0'); 
          element.style.transform = 'scale(1)'; 
          element.style.textShadow = '0 0 20px var(--accent-glow)'; 
        }, 150); 
      }
    }
    
    updateCountdown(); 
    setInterval(updateCountdown, 1000);
  }

  // ========== 8. CONFETTI EFFECT (Direct Call - No Loader Wait) ==========
  function createConfetti() {
    const container = document.getElementById('confetti-container');
    if (!container) return;
    
    const colors = ['#d4af37', '#f8e6a0', '#ffffff', '#b8c1d1'];
    for (let i = 0; i < 60; i++) {
      const c = document.createElement('div'); 
      c.className = 'confetti';
      c.style.left = Math.random() * 100 + 'vw'; 
      c.style.background = colors[Math.floor(Math.random() * colors.length)];
      c.style.width = Math.random() * 8 + 6 + 'px'; 
      c.style.height = c.style.width;
      c.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px'; 
      c.style.animationDelay = Math.random() * 1.5 + 's';
      c.style.animationDuration = Math.random() * 2 + 2.5 + 's'; 
      container.appendChild(c);
      setTimeout(() => c.remove(), 5000);
    }
  }
  // Confetti ko direct call karo (loader ka wait nahi)
  setTimeout(() => createConfetti(), 500);

  // ========== 9. PARALLAX SCROLL ==========
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    document.querySelectorAll('.parallax-layer').forEach((layer, index) => { 
      layer.style.transform = `translateY(${scrolled * (0.3 + index * 0.15)}px)`; 
    });
  }, {passive: true});

  // ========== 10. IMAGE REVEAL ON SCROLL ==========
  const imageSection = document.getElementById('invitation-image');
  if (imageSection) {
    const imgObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target.querySelector('.invitation-img');
          if (img) { 
            img.style.opacity = '0'; 
            img.style.transform = 'scale(0.95)';
            setTimeout(() => { 
              img.style.transition = 'opacity 0.8s ease, transform 0.8s ease'; 
              img.style.opacity = '1'; 
              img.style.transform = 'scale(1)'; 
            }, 200); 
          }
          imgObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    imgObs.observe(imageSection);
  }
});
