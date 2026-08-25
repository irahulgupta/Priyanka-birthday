/* ==========================================================================
 *  🎂 BIRTHDAY WEBSITE — script.js
 *
 *  ┌────────────────────────────────────────────────────────────────────┐
 *  │  EVERYTHING YOU NEED TO EDIT IS IN THE CONFIG BLOCK BELOW.         │
 *  │  Change the text, save the file, refresh index.html. That's it.     │
 *  └────────────────────────────────────────────────────────────────────┘
 * ========================================================================== */

const birthdayConfig = {
  /* ---- 1. THE NAMES ---------------------------------------------------- */
  friendName: "Priyanka",             // 👈 your friend's name
  yourName:   "Rahul",            // 👈 your name (shows in the signature)

  /* ---- 2. THE MESSAGE -------------------------------------------------- */
  // This is typed out letter by letter. Use \n\n for a blank line.
  message:
    "Another year older… and somehow, still not wiser. Impressive! 😎\n\n" +
    "I hope your birthday is as awesome as you think you are! " +
    "May this year gives you good food, more beer, crazy adventures, lots of money, " +
    "And enough common sense to survive all of them.\n\n" +
    "Stay crazy, stay funny, and for once, try keeping your ass at home on the weekend!🙏🏻 \n\n" +
    "Have an awesome birthday, you legendary idiot! 🥳\n\n" +
    "Enjoy it before your knees start reminding you how old you actually are! ❤️",

  // Small line under the big "Happy Birthday" title
  heroSubtitle: "Today is all about celebrating YOU! ❤️",

  /* ---- 3. THE FILES (put them in the assets/ folder) ------------------- */
  photo:  "assets/friend.jpg",              // 👈 the main round portrait
  video:  "assets/birthday-video.mp4",      // 👈 the surprise video
  music:  "assets/birthday-music.mp3",      // 👈 background song
  gallery: [                                // 👈 memory photos (add/remove freely)
    { src: "assets/photo1.jpg", caption: "Meta Dayyy... 😄" },
    { src: "assets/photo2.jpg", caption: "Certified good times ✨" },
    { src: "assets/photo3.jpg", caption: "Blurry- Rapido rides 😂" },
    { src: "assets/photo4.jpg", caption: "Sunset at C5 🥳" }
  ],

  /* ---- 4. THE FUNNY CARDS --------------------------------------------- */
  traits: [
    { emoji: "🍻", label: "Beer Paglu",                 note: "Sunday ho ya Monday, beer is mandatory!" },
    { emoji: "🚩", label: "Walking Red Flag",           note: "But somehow still adorable." },
    { emoji: "📸", label: "Selfie Scientist",           note: "47 photos. Still choosing the first one." },
    { emoji: "💃", label: "Weekend Princess",           note: "Always ready with some plans." },
    { emoji: "🤣", label: "Banter Partner.     ",       note: "Vibing, roasting, repeating" },
    { emoji: "🍽️", label: "Professional Food Tester",   note: "Knows every spot/cafe/restro in town" }
  ],

  /* ---- 5. LITTLE EXTRAS ----------------------------------------------- */
  startMusicOnOpen: true,   // start the song on the "Open Your Surprise" click
  emojiRain: ["🎉", "🎈", "🎂", "🎁", "✨", "💜", "🥳", "🎊", "❤️", "⭐"]
};

/* ==========================================================================
 *  ⬆⬆⬆  END OF CONFIG — you don't need to touch anything below this line ⬆⬆⬆
 * ========================================================================== */

(function () {
  "use strict";

  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const rand = (min, max) => Math.random() * (max - min) + min;
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  const reduceMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /** Freeze / unfreeze page scrolling (welcome screen + lightbox). */
  function setScrollLock(on) {
    document.documentElement.classList.toggle("is-locked", on);
    document.body.classList.toggle("is-locked", on);
  }

  /* ------------------------------------------------------------------
   * Fallback artwork — used when a photo file is missing, so the page
   * never shows a broken image icon.
   * ------------------------------------------------------------------ */
  function placeholderImage(emoji, label) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800">
      <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#8b5cf6"/><stop offset=".5" stop-color="#ff4fd8"/>
        <stop offset="1" stop-color="#38bdf8"/></linearGradient></defs>
      <rect width="800" height="800" fill="url(#g)"/>
      <text x="400" y="380" font-size="210" text-anchor="middle" dominant-baseline="middle">${emoji}</text>
      <text x="400" y="530" font-size="46" fill="rgba(255,255,255,.92)" text-anchor="middle"
            font-family="Segoe UI, Helvetica, Arial, sans-serif">${label}</text>
    </svg>`;
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  }

  /* ==================================================================
   * 1) TEXT FROM CONFIG
   * ================================================================== */
  function applyText() {
    document.title = `Happy Birthday, ${birthdayConfig.friendName}! 🎂`;
    $$("[data-friend-name]").forEach((el) => (el.textContent = birthdayConfig.friendName));
    $$("[data-your-name]").forEach((el) => (el.textContent = birthdayConfig.yourName));

    const sub = $("[data-hero-subtitle]");
    if (sub && birthdayConfig.heroSubtitle) sub.textContent = birthdayConfig.heroSubtitle;

    const photo = $("#friendPhoto");
    if (photo) {
      photo.alt = `A photo of ${birthdayConfig.friendName}`;
      photo.addEventListener("error", function handle() {
        photo.removeEventListener("error", handle);
        photo.src = placeholderImage("🎂", "add assets/friend.jpg");
      });
      photo.src = birthdayConfig.photo; // set last so the handler is ready
    }
  }

  /* ==================================================================
   * 2) CONFETTI / FIREWORKS ENGINE (plain canvas, no libraries)
   * ================================================================== */
  const FX = (function () {
    const canvas = $("#fxCanvas");
    const ctx = canvas ? canvas.getContext("2d") : null;
    let bits = [];
    let running = false;
    let w = 0, h = 0;

    const COLORS = ["#ff4fd8", "#c084fc", "#38bdf8", "#ffd166", "#fff1a8", "#7dffc4", "#ffffff"];

    function resize() {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function loop() {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);

      for (let i = bits.length - 1; i >= 0; i--) {
        const p = bits[i];
        p.vy += p.gravity;
        p.vx *= p.drag;
        p.vy *= p.drag;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        p.life -= 1;

        const fade = Math.min(1, p.life / 34);
        if (p.life <= 0 || p.y > h + 60) { bits.splice(i, 1); continue; }

        ctx.save();
        ctx.globalAlpha = Math.max(0, fade);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;

        if (p.shape === "circle") {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === "streak") {
          ctx.fillRect(-p.size / 6, -p.size, p.size / 3, p.size * 2);
        } else {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.62);
        }
        ctx.restore();
      }

      if (bits.length) {
        requestAnimationFrame(loop);
      } else {
        running = false;
        ctx.clearRect(0, 0, w, h);
      }
    }

    function start() {
      if (!running && bits.length) { running = true; requestAnimationFrame(loop); }
    }

    function push(list) {
      if (!ctx || reduceMotion) return;
      // keep the particle count sane on slow devices
      if (bits.length > 1400) bits.splice(0, bits.length - 1400);
      bits = bits.concat(list);
      start();
    }

    function confetti(x, y, count = 90, spread = Math.PI * 2, power = 12) {
      const list = [];
      for (let i = 0; i < count; i++) {
        const a = spread === Math.PI * 2 ? rand(0, Math.PI * 2) : rand(-spread / 2, spread / 2) - Math.PI / 2;
        const v = rand(power * 0.35, power);
        list.push({
          x, y,
          vx: Math.cos(a) * v,
          vy: Math.sin(a) * v,
          gravity: rand(0.16, 0.3),
          drag: 0.985,
          size: rand(7, 14),
          color: pick(COLORS),
          shape: Math.random() < 0.35 ? "circle" : "rect",
          rot: rand(0, Math.PI * 2),
          vr: rand(-0.28, 0.28),
          life: rand(110, 190)
        });
      }
      push(list);
    }

    function firework(x, y) {
      const hue = pick(COLORS);
      const list = [];
      const n = 46;
      for (let i = 0; i < n; i++) {
        const a = (Math.PI * 2 * i) / n + rand(-0.06, 0.06);
        const v = rand(4, 9.5);
        list.push({
          x, y,
          vx: Math.cos(a) * v,
          vy: Math.sin(a) * v,
          gravity: 0.075,
          drag: 0.955,
          size: rand(4, 7.5),
          color: Math.random() < 0.75 ? hue : "#ffffff",
          shape: "circle",
          rot: 0, vr: 0,
          life: rand(52, 96)
        });
      }
      // a few bright streaks for sparkle
      for (let i = 0; i < 10; i++) {
        const a = rand(0, Math.PI * 2);
        list.push({
          x, y,
          vx: Math.cos(a) * rand(2, 11),
          vy: Math.sin(a) * rand(2, 11),
          gravity: 0.06, drag: 0.94,
          size: rand(5, 9), color: "#fff8d6", shape: "streak",
          rot: a, vr: 0, life: rand(30, 60)
        });
      }
      push(list);
    }

    /** Multiple fireworks over a few seconds. */
    function fireworkShow(rounds = 7, gap = 320) {
      for (let i = 0; i < rounds; i++) {
        setTimeout(() => {
          firework(rand(w * 0.12, w * 0.88), rand(h * 0.12, h * 0.55));
        }, i * gap);
      }
    }

    /** Confetti raining from the top edge. */
    function rain(count = 130) {
      const list = [];
      for (let i = 0; i < count; i++) {
        list.push({
          x: rand(0, w), y: rand(-h * 0.4, -20),
          vx: rand(-1.6, 1.6), vy: rand(2, 6),
          gravity: rand(0.03, 0.09), drag: 0.999,
          size: rand(7, 15), color: pick(COLORS),
          shape: Math.random() < 0.3 ? "circle" : "rect",
          rot: rand(0, 6), vr: rand(-0.2, 0.2),
          life: rand(220, 420)
        });
      }
      push(list);
    }

    function cannonsFromSides() {
      confetti(0, h * 0.72, 70, Math.PI / 2.4, 20);
      confetti(w, h * 0.72, 70, Math.PI / 2.4, 20);
    }

    if (canvas) {
      resize();
      window.addEventListener("resize", resize);
    }
    return { confetti, firework, fireworkShow, rain, cannonsFromSides, get width() { return w; }, get height() { return h; } };
  })();

  /* ==================================================================
   * 3) FLOATING PARTICLES / BALLOONS / EMOJIS  (DOM based, cheap)
   * ================================================================== */
  function buildParticles() {
    const layer = $("#particleLayer");
    if (!layer || reduceMotion) return;
    const count = window.innerWidth < 700 ? 16 : 30;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
      const dot = document.createElement("span");
      dot.className = "particle";
      const size = rand(3, 8);
      dot.style.width = size + "px";
      dot.style.height = size + "px";
      dot.style.left = rand(0, 100) + "vw";
      dot.style.animationDuration = rand(14, 30) + "s";
      dot.style.animationDelay = "-" + rand(0, 24) + "s";
      dot.style.setProperty("--drift", rand(-90, 90) + "px");
      dot.style.opacity = rand(0.25, 0.75);
      if (i % 4 === 0) dot.style.background = "#ffd9f6";
      if (i % 5 === 0) dot.style.background = "#bde9ff";
      frag.appendChild(dot);
    }
    layer.appendChild(frag);
  }

  function releaseBalloons(count = 14) {
    const layer = $("#balloonLayer");
    if (!layer || reduceMotion) return;
    const colors = ["#ff4fd8", "#c084fc", "#38bdf8", "#ffd166", "#7dffc4", "#ff8fa3"];
    for (let i = 0; i < count; i++) {
      const b = document.createElement("span");
      b.className = "balloon";
      b.style.left = rand(2, 94) + "vw";
      b.style.setProperty("--b", pick(colors));
      b.style.setProperty("--sway", rand(-70, 70) + "px");
      const dur = rand(7, 13);
      b.style.animationDuration = dur + "s";
      b.style.animationDelay = rand(0, 1.6) + "s";
      const scale = rand(0.7, 1.35);
      b.style.width = 54 * scale + "px";
      b.style.height = 68 * scale + "px";
      layer.appendChild(b);
      setTimeout(() => b.remove(), (dur + 2.2) * 1000);
    }
  }

  function rainEmojis(count = 18) {
    const layer = $("#emojiLayer");
    if (!layer || reduceMotion) return;
    for (let i = 0; i < count; i++) {
      const e = document.createElement("span");
      e.className = "float-emoji";
      e.textContent = pick(birthdayConfig.emojiRain);
      e.style.left = rand(2, 94) + "vw";
      e.style.fontSize = rand(1.4, 3.1) + "rem";
      e.style.setProperty("--sway", rand(-90, 90) + "px");
      e.style.setProperty("--spin", rand(-320, 320) + "deg");
      const dur = rand(6, 11);
      e.style.animationDuration = dur + "s";
      e.style.animationDelay = rand(0, 1.4) + "s";
      layer.appendChild(e);
      setTimeout(() => e.remove(), (dur + 2) * 1000);
    }
  }

  /* ==================================================================
   * 4) SCROLL REVEAL
   * ================================================================== */
  let revealObserver = null;
  function initReveal() {
    $$("[data-reveal]").forEach((el) => {
      if (el.dataset.delay) el.style.setProperty("--d", el.dataset.delay);
    });

    if (reduceMotion || !("IntersectionObserver" in window)) {
      $$("[data-reveal]").forEach((el) => el.classList.add("is-in"));
      return;
    }

    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      // low threshold + a small bottom inset: anything that peeks into the
      // viewport reveals, so fast scrolling never leaves a blank section
      { threshold: 0.01, rootMargin: "0px 0px -40px 0px" }
    );
    $$("[data-reveal]").forEach((el) => revealObserver.observe(el));
  }
  function observeReveal(el) {
    if (el.dataset.delay) el.style.setProperty("--d", el.dataset.delay);
    if (revealObserver) revealObserver.observe(el);
    else el.classList.add("is-in");
  }

  /* ==================================================================
   * 5) TYPING ANIMATION FOR THE MESSAGE
   * ================================================================== */
  function initTyping() {
    const target = $("#typedMessage");
    const a11y = $("#typedMessageA11y");
    if (!target) return;

    const text = birthdayConfig.message || "";
    if (a11y) a11y.textContent = text; // screen readers get it in one go

    if (reduceMotion) { target.textContent = text; return; }

    let started = false;
    const type = () => {
      if (started) return;
      started = true;
      target.classList.add("is-typing");
      let i = 0;
      const step = () => {
        // type a couple of characters per frame-ish for a lively pace
        const chunk = text[i] === "\n" ? 1 : 2;
        target.textContent = text.slice(0, (i += chunk));
        if (i < text.length) {
          setTimeout(step, text[i - 1] === "." ? 90 : 26);
        } else {
          target.textContent = text;
          setTimeout(() => target.classList.remove("is-typing"), 2200);
        }
      };
      setTimeout(step, 380);
    };

    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => entries.forEach((e) => { if (e.isIntersecting) { type(); io.disconnect(); } }),
        { threshold: 0.3 }
      );
      io.observe(target);
    } else {
      type();
    }
  }

  /* ==================================================================
   * 6) TRAIT CARDS
   * ================================================================== */
  function buildTraits() {
    const grid = $("#traitGrid");
    if (!grid) return;

    birthdayConfig.traits.forEach((t, i) => {
      const li = document.createElement("li");
      li.className = "trait";
      li.setAttribute("data-reveal", "");
      li.dataset.delay = String(i % 3);
      li.tabIndex = 0;
      li.innerHTML =
        `<span class="trait__emoji" aria-hidden="true"></span>` +
        `<span class="trait__label"></span>` +
        `<p class="trait__note"></p>`;
      li.querySelector(".trait__emoji").textContent = t.emoji || "🎉";
      li.querySelector(".trait__label").textContent = t.label || "";
      li.querySelector(".trait__note").textContent = t.note || "";

      // tap/click = tiny confetti puff right on the card
      const poke = (ev) => {
        li.classList.add("is-poked");
        setTimeout(() => li.classList.remove("is-poked"), 700);
        const r = li.getBoundingClientRect();
        const x = ev && ev.clientX ? ev.clientX : r.left + r.width / 2;
        const y = ev && ev.clientY ? ev.clientY : r.top + r.height / 2;
        FX.confetti(x, y, 26, Math.PI * 2, 8);
      };
      li.addEventListener("click", poke);
      li.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); poke(); }
      });

      grid.appendChild(li);
      observeReveal(li);
    });
  }

  /* ==================================================================
   * 7) GALLERY + LIGHTBOX (missing files are skipped)
   * ================================================================== */
  const gallery = { items: [], index: 0 };

  function buildGallery() {
    const grid = $("#gallery");
    const empty = $("#galleryEmpty");
    if (!grid) return;

    const list = birthdayConfig.gallery || [];
    let pending = list.length;
    if (!pending) { if (empty) empty.hidden = false; return; }

    list.forEach((item, i) => {
      const probe = new Image();
      probe.onload = () => addShot(item, i, probe.naturalWidth, probe.naturalHeight, done);
      probe.onerror = () => done();          // file not there → just skip it
      probe.src = item.src;
    });

    function done() {
      pending -= 1;
      if (pending > 0) return;
      // sort so the cards keep the order given in the config
      const shots = $$(".shot", grid).sort(
        (a, b) => Number(a.dataset.order) - Number(b.dataset.order)
      );
      shots.forEach((s) => grid.appendChild(s));
      gallery.items = shots.map((s) => ({
        src: s.dataset.src,
        caption: s.dataset.caption || ""
      }));
      if (!gallery.items.length && empty) empty.hidden = false;
    }

    function addShot(item, order, natW, natH, cb) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "shot";
      btn.setAttribute("data-reveal", "");
      btn.dataset.delay = String(order % 4);
      btn.dataset.order = String(order);
      btn.dataset.src = item.src;
      btn.dataset.caption = item.caption || "";
      btn.setAttribute("aria-label",
        (item.caption ? item.caption + " — " : "") + "open photo in full size");

      const img = document.createElement("img");
      img.src = item.src;
      img.alt = item.caption || "A happy memory";
      img.loading = "lazy";
      img.decoding = "async";
      if (natW && natH) { img.width = natW; img.height = natH; }
      btn.appendChild(img);

      if (item.caption) {
        const tag = document.createElement("span");
        tag.className = "shot__tag";
        tag.textContent = item.caption;
        btn.appendChild(tag);
      }

      btn.addEventListener("click", () => openLightbox(item.src));
      grid.appendChild(btn);
      observeReveal(btn);
      cb();
    }
  }

  let lastFocused = null;

  function openLightbox(src) {
    const box = $("#lightbox");
    const img = $("#lightboxImg");
    if (!box || !img) return;

    const idx = gallery.items.findIndex((it) => it.src === src);
    gallery.index = idx < 0 ? 0 : idx;
    lastFocused = document.activeElement;
    if (!gallery.items.length) gallery.items = [{ src: src, caption: "" }];

    showCurrent();
    box.hidden = false;
    setScrollLock(true);

    const multi = gallery.items.length > 1;
    $("#lightboxPrev").hidden = !multi;
    $("#lightboxNext").hidden = !multi;
    $("#lightboxClose").focus();
  }

  function showCurrent() {
    const item = gallery.items[gallery.index];
    if (!item) return;
    const img = $("#lightboxImg");
    img.src = item.src;
    img.alt = item.caption || "A happy memory";
  }

  function closeLightbox() {
    const box = $("#lightbox");
    if (!box || box.hidden) return;
    box.hidden = true;
    setScrollLock(false);
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }

  function stepLightbox(dir) {
    if (!gallery.items.length) return;
    gallery.index = (gallery.index + dir + gallery.items.length) % gallery.items.length;
    showCurrent();
  }

  function initLightbox() {
    const box = $("#lightbox");
    if (!box) return;
    $("#lightboxClose").addEventListener("click", closeLightbox);
    $("#lightboxPrev").addEventListener("click", () => stepLightbox(-1));
    $("#lightboxNext").addEventListener("click", () => stepLightbox(1));
    box.addEventListener("click", (e) => { if (e.target === box) closeLightbox(); });

    document.addEventListener("keydown", (e) => {
      if (box.hidden) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") stepLightbox(-1);
      if (e.key === "ArrowRight") stepLightbox(1);
    });

    // swipe on touch devices
    let x0 = null;
    box.addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; }, { passive: true });
    box.addEventListener("touchend", (e) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 55) stepLightbox(dx < 0 ? 1 : -1);
      x0 = null;
    }, { passive: true });
  }

  /* ==================================================================
   * 8) VIDEO (graceful fallback when the file is missing)
   * ================================================================== */
  function initVideo() {
    const video = $("#birthdayVideo");
    const fallback = $("#videoFallback");
    if (!video || !fallback) return;

    const fail = () => {
      video.hidden = true;
      fallback.hidden = false;
    };

    video.addEventListener("error", fail);
    video.addEventListener("loadeddata", () => { fallback.hidden = true; video.hidden = false; });

    if (!birthdayConfig.video) { fail(); return; }

    const source = document.createElement("source");
    source.src = birthdayConfig.video;
    source.type = "video/mp4";
    source.addEventListener("error", fail);
    video.appendChild(source);
    video.load();

    // safety net: if nothing loaded after a few seconds, show the friendly note
    setTimeout(() => {
      if (video.readyState === 0) fail();
    }, 3500);
  }

  /* ==================================================================
   * 9) MUSIC
   * ================================================================== */
  const music = { el: null, ok: true, on: false };

  function toast(msg) {
    let t = $(".toast");
    if (!t) {
      t = document.createElement("div");
      t.className = "toast";
      t.setAttribute("role", "status");
      document.body.appendChild(t);
    }
    t.textContent = msg;
    requestAnimationFrame(() => t.classList.add("is-on"));
    clearTimeout(t._timer);
    t._timer = setTimeout(() => t.classList.remove("is-on"), 4200);
  }

  function initMusic() {
    const audio = $("#bgMusic");
    const btn = $("#musicBtn");
    if (!audio || !btn) return;
    music.el = audio;

    audio.volume = 0.45;

    audio.addEventListener("error", () => {
      music.ok = false;
      setMusicLabel(false, "No music file");
    });

    if (birthdayConfig.music) {
      audio.preload = "metadata";   // lets us detect a missing file early
      audio.src = birthdayConfig.music;
    } else {
      music.ok = false;
      setMusicLabel(false, "No music file");
    }

    btn.addEventListener("click", () => {
      if (!music.ok) {
        toast("🎵 Add a file called birthday-music.mp3 to the assets folder to hear a song.");
        return;
      }
      music.on ? stopMusic() : playMusic(true);
    });
  }

  function setMusicLabel(on, override) {
    const btn = $("#musicBtn");
    if (!btn) return;
    btn.setAttribute("aria-pressed", on ? "true" : "false");
    btn.setAttribute("aria-label", on ? "Turn background music off" : "Turn background music on");
    $(".music-btn__label", btn).textContent = override || (on ? "Music On" : "Music Off");
  }

  function playMusic(userAsked) {
    if (!music.el || !music.ok || !birthdayConfig.music) return;
    const p = music.el.play();
    if (p && typeof p.catch === "function") {
      p.then(() => {
        music.on = true;
        setMusicLabel(true);
      }).catch(() => {
        music.on = false;
        setMusicLabel(false);
        if (userAsked) toast("🎵 The browser blocked the audio. Try tapping the button once more.");
      });
    } else {
      music.on = true;
      setMusicLabel(true);
    }
  }

  function stopMusic() {
    if (!music.el) return;
    music.el.pause();
    music.on = false;
    setMusicLabel(false);
  }

  /* ==================================================================
   * 10) OPENING THE SURPRISE
   * ================================================================== */
  function initOpening() {
    const welcome = $("#welcome");
    const party = $("#party");
    const openBtn = $("#openBtn");
    if (!welcome || !party || !openBtn) return;

    let opened = false;

    function open() {
      if (opened) return;
      opened = true;

      // music needs a real user gesture — this click is it
      if (birthdayConfig.startMusicOnOpen) playMusic(false);

      const r = openBtn.getBoundingClientRect();
      FX.confetti(r.left + r.width / 2, r.top + r.height / 2, 150, Math.PI * 2, 17);
      FX.cannonsFromSides();
      FX.fireworkShow(5, 300);
      releaseBalloons(12);
      rainEmojis(14);

      welcome.classList.add("is-gone");
      party.hidden = false;
      setScrollLock(false);

      // the observer set up in boot() fires as soon as the party becomes visible
      requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "auto" }));

      setTimeout(() => { welcome.remove(); }, reduceMotion ? 30 : 1000);
      setTimeout(() => FX.rain(90), 500);
    }

    openBtn.addEventListener("click", open);

    // a hover-time tease
    openBtn.addEventListener("pointerenter", () => {
      const r = openBtn.getBoundingClientRect();
      FX.confetti(r.left + r.width / 2, r.top, 12, Math.PI / 2, 7);
    });

    // the skip link should also open the party
    const skip = $(".skip-link");
    if (skip) skip.addEventListener("click", open);
  }

  /* ==================================================================
   * 11) THE BIG CELEBRATE BUTTON
   * ================================================================== */
  function initCelebrate() {
    const btn = $("#celebrateBtn");
    const counter = $("#celebrateCount");
    if (!btn) return;

    const lines = [
      "That's the spirit! 🎉",
      "Again?! I like your style. 🎊",
      "The confetti budget is officially blown. 💸",
      "Neighbours are complaining. Worth it. 🎈",
      "Okay this is now a full-blown party. 🥳",
      "You are unstoppable today. ⭐"
    ];
    let clicks = 0;

    btn.addEventListener("click", () => {
      clicks += 1;
      const r = btn.getBoundingClientRect();
      FX.confetti(r.left + r.width / 2, r.top + r.height / 2, 170, Math.PI * 2, 19);
      FX.cannonsFromSides();
      FX.fireworkShow(8, 260);
      FX.rain(110);
      releaseBalloons(16);
      rainEmojis(22);

      if (counter) {
        counter.textContent = lines[Math.min(clicks, lines.length) - 1];
      }
      if (reduceMotion && counter) {
        counter.textContent = "🎉 Happy Birthday! (animations are reduced on your device)";
      }
    });
  }

  /* ==================================================================
   * 12) EXTRA SPARKLE — fireworks when the final section arrives
   * ================================================================== */
  function initAutoFireworks() {
    const target = $("#celebration");
    if (!target || reduceMotion || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          FX.fireworkShow(4, 420);
          releaseBalloons(8);
          io.disconnect();
        }
      }),
      { threshold: 0.4 }
    );
    io.observe(target);
  }

  /* ==================================================================
   * BOOT
   * ================================================================== */
  /** Run a setup step in isolation: one broken feature can never take the
   *  whole page down (most importantly, never the "Open Your Surprise" button). */
  function safely(name, fn) {
    try {
      fn();
    } catch (err) {
      console.warn("[birthday] skipped " + name + ":", err);
    }
  }

  function boot() {
    // The gift button is wired up FIRST so nothing else can stop the surprise
    // from opening, even if a later feature hits a problem.
    safely("opening", initOpening);
    safely("text", applyText);
    safely("reveal", initReveal);      // must run before the generated cards
    safely("traits", buildTraits);
    safely("gallery", buildGallery);
    safely("lightbox", initLightbox);
    safely("video", initVideo);
    safely("music", initMusic);
    safely("typing", initTyping);
    safely("celebrate", initCelebrate);
    safely("particles", buildParticles);
    safely("autoFireworks", initAutoFireworks);

    // gentle welcome sparkle
    if (!reduceMotion) setTimeout(() => FX.fireworkShow(2, 900), 700);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
