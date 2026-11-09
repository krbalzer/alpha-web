      // Film plays in place. Nothing loads until the click; then the rendition fits the screen and connection.
      playFilm: (e) => {
        const f = B.film || {};
        if (!f.src) { if (B.filmUrl) window.open(B.filmUrl, '_blank', 'noopener'); return; }
        const box = e && e.currentTarget && e.currentTarget.closest('.film');
        if (!box || box.querySelector('video')) return;
        const w = window.innerWidth, px = w * (window.devicePixelRatio || 1), c = navigator.connection;
        const slow = !!(c && (c.saveData || /(^|-)(2g|3g)$/.test(c.effectiveType || '')));
        const fast = !c || (c.downlink || 0) >= 10;
        const src = !slow && fast && f.uhd && px >= 2880 && w >= 1200 ? f.uhd : !slow && w > 820 ? f.src : (f.small || f.src);
        const v = document.createElement('video');
        v.className = 'film_vid'; v.src = src; v.controls = true; v.playsInline = true; v.preload = 'auto';
        if (B.filmPoster) v.poster = B.filmPoster;
        box.appendChild(v); box.classList.add('is-playing');
        const p = v.play(); if (p && p.catch) p.catch(() => {});
      },
      // cursor label follows the pointer inside the frame
      filmMove: (e) => { const r = e.currentTarget.getBoundingClientRect(); e.currentTarget.style.setProperty('--cx', (e.clientX - r.left) + 'px'); e.currentTarget.style.setProperty('--cy', (e.clientY - r.top) + 'px'); },
      // lights down while the film holds the middle of the screen
      filmSec: (el) => {
        if (!el || el === this._fs || typeof IntersectionObserver === 'undefined') return;
        this._fs = el; const root = el.closest('.pg-brand');
        const io = new IntersectionObserver(([en]) => { if (root) root.classList.toggle('lights-down', en.isIntersecting); }, { rootMargin: '-30% 0px -30% 0px' });
        io.observe(el);
      },
