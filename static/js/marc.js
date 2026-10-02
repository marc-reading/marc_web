// MARC Reading – site behaviour (no dependencies)

(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function each(selector, fn) {
    Array.prototype.forEach.call(document.querySelectorAll(selector), fn);
  }

  // POOKALAM (Onam flower carpet) drawn as rings of petals
  var rings = [
    { n: 28, r: 50, size: 5.2, fill: '#F2B33D' },
    { n: 24, r: 42, size: 5.4, fill: '#F0762B' },
    { n: 20, r: 33, size: 5.2, fill: '#C8262E' },
    { n: 16, r: 24, size: 4.8, fill: '#FFF8E7' },
    { n: 12, r: 15, size: 4.4, fill: '#19A974' },
    { n: 8, r: 7, size: 3.6, fill: '#F0762B' }
  ];

  function pookalam() {
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-62 -62 124 124">' +
      '<circle r="60" fill="#06382A"/><circle r="58" fill="none" stroke="#F2B33D" stroke-width="1"/>';

    rings.forEach(function (ring, index) {
      svg += '<g class="ring" style="--i:' + (rings.length - index) + '">';
      for (var i = 0; i < ring.n; i++) {
        svg += '<ellipse cy="' + -ring.r + '" rx="' + ring.size + '" ry="' + (ring.size * 1.7) +
          '" fill="' + ring.fill + '" transform="rotate(' + (i * 360 / ring.n) + ')"/>';
      }
      svg += '</g>';
    });

    return svg + '<circle r="4" fill="#F2B33D"/></svg>';
  }

  var art = pookalam();
  each('.pookalam', function (el) { el.innerHTML = art; });

  // LOADER: hide once the page has loaded (never keep people waiting long)
  var shownAt = Date.now();

  function hideLoader() {
    setTimeout(function () { root.classList.add('loaded'); },
      Math.max(0, 600 - (Date.now() - shownAt)));
  }

  if (document.readyState === 'complete') hideLoader();
  else window.addEventListener('load', hideLoader);
  setTimeout(function () { root.classList.add('loaded'); }, 3000);

  // MOBILE MENU
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');

  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
    });
  }

  // IN-PAGE LINKS scroll smoothly without adding a # to the address bar
  each('a[href^="#"]', function (link) {
    link.addEventListener('click', function (e) {
      var target = document.getElementById(link.getAttribute('href').slice(1));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  });

  // SCROLL: progress bar + background pookalams turn as the page moves
  var bar = document.createElement('div');
  bar.className = 'progress';
  bar.setAttribute('aria-hidden', 'true');
  document.body.appendChild(bar);

  var decos = document.querySelectorAll('.deco, .card-deco');
  var ticking = false;

  function onScroll() {
    var max = root.scrollHeight - window.innerHeight;
    var y = window.scrollY;
    bar.style.transform = 'scaleX(' + (max > 0 ? y / max : 0) + ')';

    if (!reduceMotion) {
      Array.prototype.forEach.call(decos, function (el, i) {
        el.style.rotate = (y * (i % 2 ? -0.06 : 0.06)) + 'deg';
      });
    }
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(onScroll);
    }
  }, { passive: true });
  onScroll();

  // ROTATING HEADLINE
  var rotator = document.querySelector('.rotator');

  if (rotator && !reduceMotion) {
    var words = rotator.getAttribute('data-words').split('|');
    var index = 0;

    setInterval(function () {
      rotator.classList.add('out');
      setTimeout(function () {
        index = (index + 1) % words.length;
        rotator.textContent = words[index];
        rotator.classList.remove('out');
      }, 400);
    }, 2800);
  }

  // FALLING PETALS in the home hero
  var canvas = document.querySelector('.petals');

  if (canvas && canvas.getContext && !reduceMotion) {
    var ctx = canvas.getContext('2d');
    var colours = ['#F2B33D', '#F0762B', '#C8262E', '#FFF8E7'];
    var petals = [];
    var width, height, visible = true;

    function resize() {
      var ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    function petal(fromTop) {
      return {
        x: Math.random() * width,
        y: fromTop ? -20 : Math.random() * height,
        size: 4 + Math.random() * 6,
        speed: .25 + Math.random() * .6,
        sway: Math.random() * Math.PI * 2,
        spin: Math.random() * Math.PI,
        colour: colours[Math.floor(Math.random() * colours.length)],
        alpha: .35 + Math.random() * .5
      };
    }

    function draw() {
      if (visible) {
        ctx.clearRect(0, 0, width, height);
        petals.forEach(function (p, i) {
          p.y += p.speed;
          p.sway += .012;
          p.spin += .01;
          p.x += Math.sin(p.sway) * .5;
          if (p.y > height + 20) petals[i] = petal(true);

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.spin);
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.colour;
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size * .5, p.size, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });
      }
      requestAnimationFrame(draw);
    }

    resize();
    for (var n = 0; n < 34; n++) petals.push(petal(false));
    window.addEventListener('resize', resize);

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
      }).observe(canvas);
    }
    draw();
  }

  // COUNT-UP NUMBERS ("85+" counts from 0 and keeps its suffix)
  function countUp(el) {
    var match = el.textContent.match(/^(\d+)(.*)$/);
    if (!match) return;
    var target = +match[1], suffix = match[2], start = null;

    function step(time) {
      if (!start) start = time;
      var t = Math.min((time - start) / 1400, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - t, 3))) + suffix;
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // REVEAL ON SCROLL (cards in a row follow each other)
  var reveals = document.querySelectorAll('.reveal');

  each('.people, .gallery, .values, .activities, .sponsors, .event-list', function (group) {
    Array.prototype.forEach.call(group.children, function (child, i) {
      child.classList.add('reveal');
      child.style.setProperty('--d', (i % 4) * 90 + 'ms');
    });
  });
  reveals = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px' });

    Array.prototype.forEach.call(reveals, function (el) { io.observe(el); });

    var counter = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          countUp(entry.target);
          counter.unobserve(entry.target);
        }
      });
    });
    each('[data-count]', function (el) { counter.observe(el); });
  } else {
    Array.prototype.forEach.call(reveals, function (el) { el.classList.add('in'); });
  }

  // GLOW that follows the pointer on the "What We Do" cards
  each('.activities li', function (card) {
    card.addEventListener('pointermove', function (e) {
      var box = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - box.left) + 'px');
      card.style.setProperty('--my', (e.clientY - box.top) + 'px');
    });
  });

  // EVENTS: an event is "past" once its date has gone by
  function isPast(dateText) {
    return new Date(dateText + 'T23:59:59') < new Date();
  }

  var eventList = document.querySelector('[data-events]');

  if (eventList) {
    var cards = Array.prototype.slice.call(eventList.querySelectorAll('.event'));
    var empty = document.querySelector('[data-empty]');
    var filters = document.querySelectorAll('.filter');
    var counts = { all: cards.length, upcoming: 0, past: 0 };

    cards.forEach(function (card) {
      var status = isPast(card.getAttribute('data-date')) ? 'past' : 'upcoming';
      var badge = card.querySelector('.badge');
      card.setAttribute('data-status', status);
      counts[status]++;
      if (badge) {
        badge.textContent = status === 'past' ? 'Past event' : 'Upcoming';
        badge.classList.toggle('badge-past', status === 'past');
      }
    });

    // upcoming first (soonest at the top), then past (most recent first)
    cards.sort(function (a, b) {
      var pa = a.getAttribute('data-status') === 'past', pb = b.getAttribute('data-status') === 'past';
      var da = a.getAttribute('data-date'), db = b.getAttribute('data-date');
      if (pa !== pb) return pa ? 1 : -1;
      return pa ? db.localeCompare(da) : da.localeCompare(db);
    }).forEach(function (card) { eventList.appendChild(card); });

    function apply(filter) {
      var shown = 0;
      cards.forEach(function (card) {
        var match = filter === 'all' || card.getAttribute('data-status') === filter;
        card.hidden = !match;
        if (match) {
          shown++;
          card.classList.add('in');
        }
      });
      if (empty) empty.hidden = shown > 0;
      Array.prototype.forEach.call(filters, function (button) {
        button.setAttribute('aria-pressed', button.getAttribute('data-filter') === filter);
      });
    }

    Array.prototype.forEach.call(filters, function (button) {
      var name = button.getAttribute('data-filter');
      var count = button.querySelector('.count');
      if (count) count.textContent = counts[name];
      button.addEventListener('click', function () { apply(name); });
    });

    var wanted = (location.search.match(/[?&]filter=(upcoming|past)/) || [])[1];
    apply(wanted || 'all');
  }

  // EVENT DETAIL PAGES: swap booking buttons for a "past event" badge
  var dated = document.querySelector('[data-event-date]');
  if (dated && isPast(dated.getAttribute('data-event-date'))) root.classList.add('event-past');

  // VIDEOS: drive the YouTube uploads playlist with our own Previous / Next
  // buttons and build the "All videos" grid from the same playlist.
  var tube = document.getElementById('tubePlayer');

  if (tube) {
    var api = document.createElement('script');
    api.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(api);

    window.onYouTubeIframeAPIReady = function () {
      var grid = document.getElementById('tubeGrid');
      var title = document.getElementById('tubeTitle');
      var pos = document.getElementById('tubePos');
      var more = document.getElementById('tubeMore');
      var items = [];
      var all = [];
      var player = new YT.Player('tubePlayer', {
        events: { onReady: waitForList, onStateChange: sync }
      });

      function waitForList() {
        var tries = 0;
        var timer = setInterval(function () {
          var ids = player.getPlaylist && player.getPlaylist();
          if (ids && ids.length) {
            clearInterval(timer);
            build(ids);
            sync();
          } else if (++tries > 40) {
            clearInterval(timer);
          }
        }, 250);
      }

      function build(ids) {
        if (all.length) return;
        all = ids;
        addBatch();
        document.getElementById('tubeAll').hidden = false;
      }

      // twelve at a time, so a long channel history does not load at once
      function addBatch() {
        all.slice(items.length, items.length + 12).forEach(function (id) {
          var i = items.length;
          var item = document.createElement('button');
          var label = document.createElement('span');
          item.type = 'button';
          item.className = 'tube-item';
          item.innerHTML = '<span class="tube-thumb"><img loading="lazy" alt="" src="https://i.ytimg.com/vi/' +
            id + '/mqdefault.jpg"></span>';
          label.className = 'tube-title';
          label.textContent = 'Video ' + (i + 1);
          item.appendChild(label);

          item.addEventListener('click', function () {
            player.playVideoAt(i);
            tube.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
          });

          grid.appendChild(item);
          items.push(item);

          // YouTube's public oEmbed endpoint gives each video's title
          fetch('https://www.youtube.com/oembed?format=json&url=' +
            encodeURIComponent('https://www.youtube.com/watch?v=' + id))
            .then(function (res) { return res.ok ? res.json() : null; })
            .then(function (data) { if (data && data.title) label.textContent = data.title; })
            .catch(function () { });
        });

        more.hidden = items.length >= all.length;
        sync();
      }

      function sync() {
        if (!all.length) return;
        var index = Math.max(player.getPlaylistIndex(), 0);
        var data = player.getVideoData ? player.getVideoData() : null;

        if (data && data.title) title.textContent = data.title;
        pos.textContent = (index === 0 ? 'Latest video · ' : '') + (index + 1) + ' of ' + all.length;
        items.forEach(function (item, i) {
          item.setAttribute('aria-current', i === index);
        });
      }

      more.addEventListener('click', addBatch);
      document.getElementById('tubePrev').addEventListener('click', function () { player.previousVideo(); });
      document.getElementById('tubeNext').addEventListener('click', function () { player.nextVideo(); });
    };
  }

  // LIGHTBOX (gallery + poster). Links sharing a data-lightbox value form a set.
  var box = document.getElementById('lightbox');

  if (box && box.showModal) {
    var boxImg = box.querySelector('img');
    var prev = box.querySelector('.lb-prev');
    var next = box.querySelector('.lb-next');
    var set = [];
    var current = 0;

    function show(i) {
      current = (i + set.length) % set.length;
      boxImg.src = set[current].href;
      boxImg.alt = set[current].getAttribute('data-caption') || '';
    }

    each('[data-lightbox]', function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        var name = link.getAttribute('data-lightbox');
        set = Array.prototype.slice.call(document.querySelectorAll('[data-lightbox="' + name + '"]'));
        prev.hidden = next.hidden = set.length < 2;
        show(set.indexOf(link));
        box.showModal();
      });
    });

    prev.addEventListener('click', function () { show(current - 1); });
    next.addEventListener('click', function () { show(current + 1); });
    box.querySelector('.lb-close').addEventListener('click', function () { box.close(); });

    box.addEventListener('click', function (e) {
      if (e.target === box || e.target === boxImg) box.close();
    });

    box.addEventListener('keydown', function (e) {
      if (set.length < 2) return;
      if (e.key === 'ArrowLeft') show(current - 1);
      if (e.key === 'ArrowRight') show(current + 1);
    });

    box.addEventListener('close', function () { boxImg.src = ''; });
  }

  // FOOTER YEAR
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
