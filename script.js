(function () {
  'use strict';

  var APP_KEY = 'webapp_homePageBuddy';
  var APP_VERSION = '001.001';
  var FAVORITES_KEY = 'homePageBuddy.favorites.v1';
  var ENGINE_KEY = 'homePageBuddy.engine.v1';
  var WEATHER_LOCATION_KEY = 'homePageBuddy.weatherLocation.v1';
  var TASKS_KEY = 'homePageBuddy.tasks.v1';
  var TASKS_COLLAPSED_KEY = 'homePageBuddy.tasksCollapsed.v1';
  var FAVORITES_COLLAPSED_KEY = 'homePageBuddy.favoritesCollapsed.v1';
  var SEARCH_HISTORY_KEY = 'homePageBuddy.searchHistory.v1';
  var MAX_SEARCH_HISTORY = 10;



  var WEATHER_CODES = {
    0: { icon: 'sun', label: 'Clear sky' },
    1: { icon: 'cloudSun', label: 'Mainly clear' },
    2: { icon: 'cloudSun', label: 'Partly cloudy' },
    3: { icon: 'cloud', label: 'Overcast' },
    45: { icon: 'cloud', label: 'Fog' },
    48: { icon: 'cloud', label: 'Fog' },
    51: { icon: 'cloudDrizzle', label: 'Light drizzle' },
    53: { icon: 'cloudDrizzle', label: 'Drizzle' },
    55: { icon: 'cloudDrizzle', label: 'Dense drizzle' },
    56: { icon: 'cloudDrizzle', label: 'Freezing drizzle' },
    57: { icon: 'cloudDrizzle', label: 'Freezing drizzle' },
    61: { icon: 'cloudRain', label: 'Slight rain' },
    63: { icon: 'cloudRain', label: 'Rain' },
    65: { icon: 'cloudRain', label: 'Heavy rain' },
    66: { icon: 'cloudRain', label: 'Freezing rain' },
    67: { icon: 'cloudRain', label: 'Freezing rain' },
    71: { icon: 'cloudSnow', label: 'Slight snow' },
    73: { icon: 'cloudSnow', label: 'Snow' },
    75: { icon: 'cloudSnow', label: 'Heavy snow' },
    77: { icon: 'cloudSnow', label: 'Snow grains' },
    80: { icon: 'cloudRain', label: 'Rain showers' },
    81: { icon: 'cloudRain', label: 'Rain showers' },
    82: { icon: 'cloudLightning', label: 'Violent rain showers' },
    85: { icon: 'cloudSnow', label: 'Snow showers' },
    86: { icon: 'cloudSnow', label: 'Snow showers' },
    95: { icon: 'cloudLightning', label: 'Thunderstorm' },
    96: { icon: 'cloudLightning', label: 'Thunderstorm with hail' },
    99: { icon: 'cloudLightning', label: 'Thunderstorm with hail' }
  };

  var SEARCH_ENGINES = [
    { id: 'google', label: 'Google', icon: 'google', url: 'https://www.google.com/search?q=' },
    { id: 'duckduckgo', label: 'DuckDuckGo', icon: 'duckduckgo', url: 'https://duckduckgo.com/?q=' },
    { id: 'bing', label: 'Bing', icon: 'bing', url: 'https://www.bing.com/search?q=' },
    { id: 'youtube', label: 'YouTube', icon: 'youtube', url: 'https://www.youtube.com/results?search_query=' }
  ];

  var QUOTES = [
    { text: 'The only way to do great work is to love what you do.', author: 'Steve Jobs' },
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: 'Winston Churchill' },
    { text: "Believe you can and you're halfway there.", author: 'Theodore Roosevelt' },
    { text: "It always seems impossible until it's done.", author: 'Nelson Mandela' },
    { text: 'The future belongs to those who believe in the beauty of their dreams.', author: 'Eleanor Roosevelt' },
    { text: 'Do what you can, with what you have, where you are.', author: 'Theodore Roosevelt' },
    { text: 'The only limit to our realization of tomorrow is our doubts of today.', author: 'Franklin D. Roosevelt' },
    { text: 'Act as if what you do makes a difference. It does.', author: 'William James' },
    { text: "You miss 100% of the shots you don't take.", author: 'Wayne Gretzky' },
    { text: "Whether you think you can or you think you can't, you're right.", author: 'Henry Ford' },
    { text: 'The best way to predict the future is to create it.', author: 'Peter Drucker' },
    { text: "Everything you've ever wanted is on the other side of fear.", author: 'George Addair' },
    { text: 'Hardships often prepare ordinary people for an extraordinary destiny.', author: 'C.S. Lewis' },
    { text: "Opportunities don't happen. You create them.", author: 'Chris Grosser' },
    { text: "Don't watch the clock; do what it does. Keep going.", author: 'Sam Levenson' },
    { text: 'The way to get started is to quit talking and begin doing.', author: 'Walt Disney' },
    { text: "Your time is limited, so don't waste it living someone else's life.", author: 'Steve Jobs' },
    { text: 'Innovation distinguishes between a leader and a follower.', author: 'Steve Jobs' },
    { text: "Life is what happens when you're busy making other plans.", author: 'John Lennon' },
    { text: 'The only person you are destined to become is the person you decide to be.', author: 'Ralph Waldo Emerson' },
    { text: 'In the middle of difficulty lies opportunity.', author: 'Albert Einstein' },
    { text: 'It does not matter how slowly you go as long as you do not stop.', author: 'Confucius' },
    { text: 'Perseverance is not a long race; it is many short races one after the other.', author: 'Walter Elliot' },
    { text: 'What lies behind us and what lies before us are tiny matters compared to what lies within us.', author: 'Ralph Waldo Emerson' },
    { text: 'Start where you are. Use what you have. Do what you can.', author: 'Arthur Ashe' }
  ];

  var ICONS = Object.assign({}, Buddy.ICONS, {
    check: Buddy.icon('taskCheck'),
    stopwatch: Buddy.icon('stopwatch'),
    timer: Buddy.icon('timer'),
    music: Buddy.icon('music'),
    pause: Buddy.icon('pause'),
    stop: Buddy.icon('stop')
  });
  var escapeHtml = Buddy.escapeHtml;

  var dom = {};
  var state = {
    favorites: [],
    engine: 'google',
    quoteIndex: -1,
    weatherLocation: null,
    tasks: [],
    tasksCollapsed: false,
    favoritesCollapsed: false,
    searchHistory: [],
    utilities: null
  };

  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  function loadFavorites() {
    try {
      var raw = localStorage.getItem(FAVORITES_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function saveFavorites() {
    try { localStorage.setItem(FAVORITES_KEY, JSON.stringify(state.favorites)); } catch (e) {}
  }

  function loadEngine() {
    try {
      var saved = localStorage.getItem(ENGINE_KEY);
      return SEARCH_ENGINES.some(function (e) { return e.id === saved; }) ? saved : 'google';
    } catch (e) {
      return 'google';
    }
  }

  function saveEngine() {
    try { localStorage.setItem(ENGINE_KEY, state.engine); } catch (e) {}
  }

  function loadWeatherLocation() {
    try {
      var raw = localStorage.getItem(WEATHER_LOCATION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function saveWeatherLocation() {
    try { localStorage.setItem(WEATHER_LOCATION_KEY, JSON.stringify(state.weatherLocation)); } catch (e) {}
  }

  function normalizeUrl(url) {
    url = (url || '').trim();
    if (!url) return '';
    if (!/^https?:\/\//i.test(url)) url = 'https://' + url;
    return url;
  }



  var modalApi = Buddy.modal.init();
  var openModal = modalApi.open;
  var closeModal = modalApi.close;

  function openConfirmModal(title, message, confirmLabel, onConfirm, opts) {
    opts = opts || {};
    var danger = opts.danger ? 'btn-danger' : 'btn-primary';
    var html =
      '<p class="modal-message">' + escapeHtml(message) + '</p>' +
      '<div class="modal-actions">' +
      '<button class="btn btn-ghost" id="btnConfirmNo">' + escapeHtml(opts.cancelLabel || 'Cancel') + '</button>' +
      '<button class="btn ' + danger + '" id="btnConfirmYes">' + escapeHtml(confirmLabel) + '</button>' +
      '</div>';
    openModal(title, html, function (body) {
      body.querySelector('#btnConfirmNo').addEventListener('click', closeModal);
      body.querySelector('#btnConfirmYes').addEventListener('click', function () {
        closeModal();
        onConfirm();
      });
    }, { autoSize: true });
  }

  function openSettingsModal() {
    Buddy.settings.open(APP_KEY, openModal, closeModal, { appVersion: APP_VERSION });
  }



  var ENGINE_ROW_HEIGHT = 48;
  var searchHistoryIndex = -1;
  var searchDraftValue = '';

  function engineIndexById(id) {
    for (var i = 0; i < SEARCH_ENGINES.length; i++) {
      if (SEARCH_ENGINES[i].id === id) return i;
    }
    return 0;
  }

  function positionEngineStack(animate) {
    var offset = engineIndexById(state.engine) * ENGINE_ROW_HEIGHT;
    if (!animate) dom.engineStack.style.transition = 'none';
    dom.engineStack.style.transform = 'translateY(-' + offset + 'px)';
    if (!animate) {
      void dom.engineStack.offsetHeight;
      dom.engineStack.style.transition = '';
    }
  }

  function updateEngineSelectorLabel() {
    var engine = SEARCH_ENGINES[engineIndexById(state.engine)];
    dom.engineSelector.setAttribute('aria-label', 'Search engine: ' + engine.label + '. Click to switch.');
  }

  function renderEngineSelector() {
    dom.engineStack.innerHTML = SEARCH_ENGINES.map(function (engine) {
      return '<span class="engine-btn" title="' + escapeHtml(engine.label) + '">' + Buddy.icon(engine.icon) + '</span>';
    }).join('');
    positionEngineStack(false);
    updateEngineSelectorLabel();

    dom.engineSelector.addEventListener('click', function () {
      var nextIndex = (engineIndexById(state.engine) + 1) % SEARCH_ENGINES.length;
      state.engine = SEARCH_ENGINES[nextIndex].id;
      saveEngine();
      positionEngineStack(true);
      updateEngineSelectorLabel();
      dom.searchInput.focus();
    });
  }

  function loadSearchHistory() {
    try {
      var raw = localStorage.getItem(SEARCH_HISTORY_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function saveSearchHistory() {
    try { localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(state.searchHistory)); } catch (e) {}
  }

  function addSearchHistory(query) {
    state.searchHistory = state.searchHistory.filter(function (q) { return q.toLowerCase() !== query.toLowerCase(); });
    state.searchHistory.unshift(query);
    if (state.searchHistory.length > MAX_SEARCH_HISTORY) state.searchHistory.length = MAX_SEARCH_HISTORY;
    saveSearchHistory();
    renderSearchHistory();
  }

  function renderSearchHistory() {
    dom.searchHistory.innerHTML = state.searchHistory.map(function (q) {
      return '<div class="search-history-item">' +
        '<button type="button" class="search-history-run" data-query="' + escapeHtml(q) + '">' +
        ICONS.search + '<span>' + escapeHtml(q) + '</span>' +
        '</button>' +
        '<button type="button" class="search-history-delete" data-query="' + escapeHtml(q) + '" title="Remove" aria-label="Remove from history">' +
        ICONS.x +
        '</button>' +
        '</div>';
    }).join('');

    dom.searchHistory.querySelectorAll('.search-history-run').forEach(function (btn) {
      btn.addEventListener('click', function () {
        runSearch(btn.getAttribute('data-query'));
      });
    });

    dom.searchHistory.querySelectorAll('.search-history-delete').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        removeSearchHistoryItem(btn.getAttribute('data-query'));
      });
    });
  }

  function removeSearchHistoryItem(query) {
    state.searchHistory = state.searchHistory.filter(function (q) { return q !== query; });
    saveSearchHistory();
    searchHistoryIndex = -1;
    renderSearchHistory();
    if (state.searchHistory.length) dom.searchInput.focus();
    else closeSearchHistory();
  }

  function highlightSearchHistoryItem(index) {
    var items = dom.searchHistory.querySelectorAll('.search-history-item');
    items.forEach(function (el) { el.classList.remove('is-active'); });
    if (index >= 0 && items[index]) {
      items[index].classList.add('is-active');
      items[index].scrollIntoView({ block: 'nearest' });
    }
  }

  function openSearchHistory() {
    if (!state.searchHistory.length) return;
    dom.searchHistory.classList.add('is-open');
  }

  function closeSearchHistory() {
    dom.searchHistory.classList.remove('is-open');
    searchHistoryIndex = -1;
  }

  function handleSearchHistoryNav(e) {
    if (!dom.searchHistory.classList.contains('is-open') || !state.searchHistory.length) return;
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;

    e.preventDefault();
    if (searchHistoryIndex === -1) searchDraftValue = dom.searchInput.value;

    if (e.key === 'ArrowDown') {
      searchHistoryIndex = searchHistoryIndex + 1 >= state.searchHistory.length ? -1 : searchHistoryIndex + 1;
    } else {
      searchHistoryIndex = searchHistoryIndex - 1 < -1 ? state.searchHistory.length - 1 : searchHistoryIndex - 1;
    }

    dom.searchInput.value = searchHistoryIndex === -1 ? searchDraftValue : state.searchHistory[searchHistoryIndex];
    highlightSearchHistoryItem(searchHistoryIndex);
  }

  function runSearch(query) {
    query = query.trim();
    if (!query) return;
    addSearchHistory(query);
    closeSearchHistory();
    var engine = SEARCH_ENGINES.filter(function (en) { return en.id === state.engine; })[0] || SEARCH_ENGINES[0];
    window.location.href = engine.url + encodeURIComponent(query);
  }

  function handleSearchSubmit(e) {
    e.preventDefault();
    if (!dom.searchInput.value.trim()) { dom.searchInput.focus(); return; }
    runSearch(dom.searchInput.value);
  }



  var quoteTypeTimer = null;
  var TYPE_SPEED = 20;




  function typeIntoPlaceholder(el, text, onDone) {
    el.placeholder = '';
    var i = 0;
    (function step() {
      if (i < text.length) {
        el.placeholder += text.charAt(i);
        i++;
        quoteTypeTimer = setTimeout(step, TYPE_SPEED);
      } else if (onDone) {
        onDone();
      }
    })();
  }

  function renderQuote(index) {
    state.quoteIndex = index;
    var quote = QUOTES[index];
    clearTimeout(quoteTypeTimer);
    typeIntoPlaceholder(dom.searchInput, quote.text + ' — ' + quote.author);
  }

  function handleQuoteRefresh() {
    if (QUOTES.length <= 1) return;
    var next;
    do {
      next = Math.floor(Math.random() * QUOTES.length);
    } while (next === state.quoteIndex);
    renderQuote(next);
  }



  function pad2(n) {
    return n < 10 ? '0' + n : '' + n;
  }

  function formatTime(date) {
    var hours = date.getHours();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    var hh = hours % 12;
    if (hh === 0) hh = 12;
    return pad2(hh) + ':' + pad2(date.getMinutes()) + ' ' + ampm;
  }

  function updateClock() {
    dom.weatherTime.textContent = formatTime(new Date());
  }



  function renderWeatherLoading() {
    dom.weatherInfo.innerHTML = '<span class="weather-text">Loading…</span>';
  }

  function renderWeatherPrompt() {
    dom.weatherInfo.innerHTML = '<span class="weather-text">Set location</span>';
  }

  function renderWeatherError() {
    dom.weatherInfo.innerHTML = '<span class="weather-text">Weather unavailable</span>';
  }

  function renderWeatherData(current) {
    var code = WEATHER_CODES[current.weathercode] || { icon: 'sun', label: '' };
    dom.weatherInfo.innerHTML =
      '<span class="weather-icon">' + Buddy.icon(code.icon) + '</span>' +
      '<span class="weather-temp">' + Math.round(current.temperature) + '°C</span>';
    dom.weatherWidget.title = state.weatherLocation.name + ' (' + code.label + ') — click to change location';
  }

  function fetchWeather() {
    if (!state.weatherLocation) { renderWeatherPrompt(); return; }
    renderWeatherLoading();
    var url = 'https://api.open-meteo.com/v1/forecast?latitude=' + state.weatherLocation.lat +
      '&longitude=' + state.weatherLocation.lon + '&current_weather=true';
    fetch(url)
      .then(function (res) { if (!res.ok) throw new Error('Request failed'); return res.json(); })
      .then(function (data) {
        if (!data.current_weather) throw new Error('No weather data');
        renderWeatherData(data.current_weather);
      })
      .catch(function () { renderWeatherError(); });
  }

  function detectLocation() {
    if (!navigator.geolocation) { renderWeatherPrompt(); return; }
    renderWeatherLoading();
    navigator.geolocation.getCurrentPosition(function (pos) {
      var lat = pos.coords.latitude;
      var lon = pos.coords.longitude;
      fetch('https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=' + lat + '&longitude=' + lon + '&localityLanguage=en')
        .then(function (res) { return res.json(); })
        .then(function (geo) {
          var name = (geo && (geo.city || geo.locality)) || 'Current location';
          state.weatherLocation = { name: name, lat: lat, lon: lon };
          saveWeatherLocation();
          fetchWeather();
        })
        .catch(function () {
          state.weatherLocation = { name: 'Current location', lat: lat, lon: lon };
          saveWeatherLocation();
          fetchWeather();
        });
    }, function () {
      renderWeatherPrompt();
    }, { timeout: 8000 });
  }

  function searchLocations(query, resultsEl) {
    resultsEl.innerHTML = '<p class="location-status">Searching…</p>';
    fetch('https://geocoding-api.open-meteo.com/v1/search?count=5&name=' + encodeURIComponent(query))
      .then(function (res) { return res.json(); })
      .then(function (data) {
        var results = (data && data.results) || [];
        if (!results.length) { resultsEl.innerHTML = '<p class="location-status">No matches.</p>'; return; }
        resultsEl.innerHTML = results.map(function (loc, i) {
          var label = [loc.name, loc.admin1, loc.country].filter(Boolean).join(', ');
          return '<button type="button" class="location-option" data-index="' + i + '">' + escapeHtml(label) + '</button>';
        }).join('');
        resultsEl.querySelectorAll('.location-option').forEach(function (btn) {
          btn.addEventListener('click', function () {
            var loc = results[Number(btn.getAttribute('data-index'))];
            state.weatherLocation = {
              name: [loc.name, loc.country_code].filter(Boolean).join(', '),
              lat: loc.latitude,
              lon: loc.longitude
            };
            saveWeatherLocation();
            closeModal();
            fetchWeather();
          });
        });
      })
      .catch(function () {
        resultsEl.innerHTML = '<p class="location-status">Search failed.</p>';
      });
  }

  function openLocationModal() {
    var html =
      '<div class="form-group">' +
      '<label for="locationSearchInput">City</label>' +
      '<input type="text" id="locationSearchInput" class="form-control" placeholder="e.g. London" autocomplete="off">' +
      '</div>' +
      '<div id="locationResults" class="location-results"></div>' +
      '<div class="modal-actions">' +
      '<button type="button" class="btn btn-ghost" id="btnUseMyLocation">Use my location</button>' +
      '</div>';

    openModal('Set Weather Location', html, function (body) {
      var input = body.querySelector('#locationSearchInput');
      var results = body.querySelector('#locationResults');
      input.focus();

      var debounceTimer = null;
      input.addEventListener('input', function () {
        clearTimeout(debounceTimer);
        var query = input.value.trim();
        if (!query) { results.innerHTML = ''; return; }
        debounceTimer = setTimeout(function () { searchLocations(query, results); }, 350);
      });

      body.querySelector('#btnUseMyLocation').addEventListener('click', function () {
        closeModal();
        detectLocation();
      });
    }, { autoSize: true });
  }



  function loadTasks() {
    try {
      var raw = localStorage.getItem(TASKS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function saveTasks() {
    try { localStorage.setItem(TASKS_KEY, JSON.stringify(state.tasks)); } catch (e) {}
  }

  function loadTasksCollapsed() {
    try { return localStorage.getItem(TASKS_COLLAPSED_KEY) === '1'; } catch (e) { return false; }
  }

  function saveTasksCollapsed() {
    try { localStorage.setItem(TASKS_COLLAPSED_KEY, state.tasksCollapsed ? '1' : '0'); } catch (e) {}
  }

  function renderTasksCollapsed() {
    dom.tasksSection.classList.toggle('is-collapsed', state.tasksCollapsed);
    dom.tasksCollapseBtn.innerHTML = state.tasksCollapsed ? ICONS.chevronUp : ICONS.chevronDown;
    dom.tasksCollapseBtn.setAttribute('aria-label', state.tasksCollapsed ? 'Expand tasks' : 'Collapse tasks');
    dom.tasksCollapseBtn.title = state.tasksCollapsed ? 'Expand tasks' : 'Collapse tasks';
  }

  function handleToggleTasksCollapsed() {
    state.tasksCollapsed = !state.tasksCollapsed;
    saveTasksCollapsed();
    renderTasksCollapsed();
  }

  function findTask(id) {
    return state.tasks.filter(function (t) { return t.id === id; })[0];
  }



  function spawnConfetti() {
    if (window.Buddy && Buddy.theme && Buddy.theme.isMotionReduced()) return;
    var colors = ['#4f46e5', '#2563eb', '#16a34a', '#e11d48', '#d97706', '#7c3aed', '#eab308', '#0891b2'];
    var count = 60;
    for (var i = 0; i < count; i++) {
      var piece = document.createElement('span');
      piece.className = 'confetti-piece';

      var left = Math.random() * 100;
      var driftX = Math.round(Math.random() * 200 - 100);
      var fallY = window.innerHeight + 40;
      var spin = Math.round(Math.random() * 720 - 360);
      var duration = Math.round(1800 + Math.random() * 1400);
      var delay = Math.round(Math.random() * 400);
      var color = colors[Math.floor(Math.random() * colors.length)];

      piece.style.left = left + 'vw';
      piece.style.setProperty('--drift-x', driftX + 'px');
      piece.style.setProperty('--fall-y', fallY + 'px');
      piece.style.setProperty('--spin', spin + 'deg');
      piece.style.setProperty('--confetti-color', color);
      piece.style.animationDuration = duration + 'ms';
      piece.style.animationDelay = delay + 'ms';
      if (Math.random() < 0.5) piece.style.borderRadius = '50%';

      piece.addEventListener('animationend', function () {
        this.remove();
      });

      dom.confettiLayer.appendChild(piece);
    }
  }

  function renderTasks() {
    dom.tasksCollapseBtn.disabled = !state.tasks.length;

    if (!state.tasks.length) {
      dom.taskList.innerHTML = '';
      return;
    }


    var sorted = state.tasks.slice().sort(function (a, b) { return (a.done ? 1 : 0) - (b.done ? 1 : 0); });

    dom.taskList.innerHTML = sorted.map(function (task) {
      return '<div class="task-item' + (task.done ? ' is-done' : '') + '" data-id="' + task.id + '">' +
        '<label class="task-checkbox-label">' +
        '<input type="checkbox" class="checkbox-input task-checkbox" data-id="' + task.id + '"' + (task.done ? ' checked' : '') + '>' +
        '<span class="checkbox-box">' + ICONS.check + '</span>' +
        '</label>' +
        '<span class="task-text">' + escapeHtml(task.text) + '</span>' +
        '<button type="button" class="task-delete" data-id="' + task.id + '" title="Delete" aria-label="Delete task">' + ICONS.x + '</button>' +
        '</div>';
    }).join('');

    dom.taskList.querySelectorAll('.task-checkbox').forEach(function (checkbox) {
      checkbox.addEventListener('change', function () {
        var task = findTask(checkbox.getAttribute('data-id'));
        if (!task) return;
        task.done = checkbox.checked;
        saveTasks();
        renderTasks();
        if (task.done) spawnConfetti();
      });
    });

    dom.taskList.querySelectorAll('.task-delete').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.getAttribute('data-id');
        state.tasks = state.tasks.filter(function (t) { return t.id !== id; });
        saveTasks();
        renderTasks();
      });
    });
  }

  function handleAddTask() {
    var text = dom.taskInput.value.trim();
    if (!text) { dom.taskInput.focus(); return; }
    state.tasks.push({ id: generateId(), text: text, done: false });
    saveTasks();
    renderTasks();
    dom.taskInput.value = '';
    dom.taskInput.focus();
  }



  function findFavorite(id) {
    return state.favorites.filter(function (f) { return f.id === id; })[0];
  }

  function renderFavorites() {
    var tilesHtml = state.favorites.map(function (fav) {
      return '<a class="fav-tile" href="' + escapeHtml(fav.url) + '" data-id="' + fav.id + '">' +
        '<span class="fav-actions">' +
        '<button type="button" class="fav-action-btn fav-edit" data-id="' + fav.id + '" title="Edit" aria-label="Edit favorite">' + ICONS.edit + '</button>' +
        '<button type="button" class="fav-action-btn fav-delete" data-id="' + fav.id + '" title="Delete" aria-label="Delete favorite">' + ICONS.x + '</button>' +
        '</span>' +
        '<span class="fav-name">' + escapeHtml(fav.name) + '</span>' +
        '</a>';
    }).join('');

    var collapseLabel = state.favoritesCollapsed ? 'Expand bookmarks' : 'Collapse bookmarks';
    dom.favoritesGrid.innerHTML = tilesHtml +
      '<button type="button" class="fav-tile fav-tile-add" id="btnAddFavorite" title="Add favorite" aria-label="Add favorite">' +
      ICONS.plus +
      '</button>' +
      '<button type="button" class="favorites-collapse-btn" id="favoritesCollapseBtn" title="' + collapseLabel + '" aria-label="' + collapseLabel + '">' +
      (state.favoritesCollapsed ? ICONS.chevronRight : ICONS.chevronLeft) +
      '</button>';

    dom.favoritesGrid.querySelectorAll('.fav-edit').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        handleEditFavorite(btn.getAttribute('data-id'));
      });
    });

    dom.favoritesGrid.querySelectorAll('.fav-delete').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        handleDeleteFavorite(btn.getAttribute('data-id'));
      });
    });

    var btnAdd = dom.favoritesGrid.querySelector('#btnAddFavorite');
    if (btnAdd) btnAdd.addEventListener('click', handleAddFavorite);

    var btnCollapse = dom.favoritesGrid.querySelector('#favoritesCollapseBtn');
    if (btnCollapse) btnCollapse.addEventListener('click', handleToggleFavoritesCollapsed);
  }

  function loadFavoritesCollapsed() {
    try { return localStorage.getItem(FAVORITES_COLLAPSED_KEY) === '1'; } catch (e) { return false; }
  }

  function saveFavoritesCollapsed() {
    try { localStorage.setItem(FAVORITES_COLLAPSED_KEY, state.favoritesCollapsed ? '1' : '0'); } catch (e) {}
  }

  function renderFavoritesCollapsed() {
    dom.favoritesSection.classList.toggle('is-collapsed', state.favoritesCollapsed);





    var btn = dom.favoritesGrid.querySelector('#favoritesCollapseBtn');
    if (!btn) return;
    var label = state.favoritesCollapsed ? 'Expand bookmarks' : 'Collapse bookmarks';
    btn.innerHTML = state.favoritesCollapsed ? ICONS.chevronRight : ICONS.chevronLeft;
    btn.setAttribute('aria-label', label);
    btn.title = label;
  }

  function handleToggleFavoritesCollapsed() {
    state.favoritesCollapsed = !state.favoritesCollapsed;
    saveFavoritesCollapsed();
    renderFavoritesCollapsed();
  }

  function openFavoriteModal(existing) {
    var html =
      '<div class="form-group">' +
      '<label for="favNameInput">Name</label>' +
      '<input type="text" id="favNameInput" class="form-control" placeholder="e.g. GitHub" value="' + (existing ? escapeHtml(existing.name) : '') + '">' +
      '</div>' +
      '<div class="form-group">' +
      '<label for="favUrlInput">URL</label>' +
      '<input type="text" id="favUrlInput" class="form-control" placeholder="e.g. github.com" value="' + (existing ? escapeHtml(existing.url) : '') + '">' +
      '</div>' +
      '<div class="modal-actions">' +
      '<button type="button" class="btn btn-ghost" id="btnFavCancel">Cancel</button>' +
      '<button type="button" class="btn btn-primary" id="btnFavSave">Save</button>' +
      '</div>';

    openModal(existing ? 'Edit Favorite' : 'Add Favorite', html, function (body) {
      var nameInput = body.querySelector('#favNameInput');
      var urlInput = body.querySelector('#favUrlInput');
      nameInput.focus();

      body.querySelector('#btnFavCancel').addEventListener('click', closeModal);
      body.querySelector('#btnFavSave').addEventListener('click', function () {
        var name = nameInput.value.trim();
        var url = normalizeUrl(urlInput.value);
        if (!name) { nameInput.focus(); return; }
        if (!url) { urlInput.focus(); return; }

        if (existing) {
          existing.name = name;
          existing.url = url;
        } else {
          state.favorites.push({ id: generateId(), name: name, url: url });
        }
        saveFavorites();
        renderFavorites();
        closeModal();
      });
    }, { autoSize: true });
  }

  function handleAddFavorite() {
    openFavoriteModal(null);
  }

  function handleEditFavorite(id) {
    var fav = findFavorite(id);
    if (fav) openFavoriteModal(fav);
  }

  function handleDeleteFavorite(id) {
    var fav = findFavorite(id);
    if (!fav) return;
    openConfirmModal('Delete Favorite', 'Delete "' + fav.name + '"?', 'Delete', function () {
      state.favorites = state.favorites.filter(function (f) { return f.id !== id; });
      saveFavorites();
      renderFavorites();
    }, { danger: true });
  }



  var UTILITIES_KEY = 'homePageBuddy.utilities.v1';
  var UTILITIES_DEFAULTS = { timerMinutes: 5, musicTrackIndex: 0 };
  var TIMER_PRESETS = [5, 10, 30];

  var MUSIC_TRACKS = [
    { name: 'Beat', file: 'https://isafuianish-dev.github.io/webapp_cdnBuddy/media/beat.mp3' },
    { name: 'Forest', file: 'https://isafuianish-dev.github.io/webapp_cdnBuddy/media/forest.mp3' },
    { name: 'Relaxation', file: 'https://isafuianish-dev.github.io/webapp_cdnBuddy/media/relaxation.mp3' },
    { name: 'Sunset', file: 'https://isafuianish-dev.github.io/webapp_cdnBuddy/media/sunset.mp3' }
  ];

  function loadUtilities() {
    try {
      var raw = localStorage.getItem(UTILITIES_KEY);
      return raw ? Object.assign({}, UTILITIES_DEFAULTS, JSON.parse(raw)) : Object.assign({}, UTILITIES_DEFAULTS);
    } catch (e) {
      return Object.assign({}, UTILITIES_DEFAULTS);
    }
  }

  function saveUtilities() {
    try { localStorage.setItem(UTILITIES_KEY, JSON.stringify(state.utilities)); } catch (e) {}
  }

  function playBeep() {
    try {
      var ctx = new (window.AudioContext || window.webkitAudioContext)();
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) {}
  }

  function minutesToMMSS(totalMinutes) {
    var totalSeconds = Math.round(totalMinutes * 60);
    return pad2(Math.floor(totalSeconds / 60)) + ':' + pad2(totalSeconds % 60);
  }

  function parseMMSS(str) {
    var parts = String(str).split(':');
    var m = parseInt(parts[0], 10) || 0;
    var s = parts.length > 1 ? (parseInt(parts[1], 10) || 0) : 0;
    return Math.max(1, m * 60 + s) / 60;
  }







  function setToolContent(tool, html) {
    var startWidth = tool.offsetWidth;
    tool.innerHTML = html;
    tool.style.width = 'auto';
    var targetWidth = tool.scrollWidth;
    tool.style.width = startWidth + 'px';
    void tool.offsetWidth;
    tool.style.width = targetWidth + 'px';
  }



  var stopwatchElapsed = 0;
  var stopwatchStartTime = null;
  var stopwatchRunning = false;
  var stopwatchTimer = null;
  var stopwatchHovered = false;

  function stopwatchFormat(ms) {
    var totalSeconds = Math.floor(ms / 1000);
    return pad2(Math.floor(totalSeconds / 60)) + ':' + pad2(totalSeconds % 60);
  }

  function currentStopwatchElapsed() {
    return stopwatchElapsed + (stopwatchRunning ? Date.now() - stopwatchStartTime : 0);
  }

  function handleStopwatchAction() {
    if (stopwatchRunning) {
      clearInterval(stopwatchTimer);
      stopwatchRunning = false;
      stopwatchElapsed = 0;
      stopwatchStartTime = null;
    } else {
      stopwatchStartTime = Date.now();
      stopwatchRunning = true;
      stopwatchTimer = setInterval(function () {
        var el = document.getElementById('stopwatchDisplay') || document.getElementById('stopwatchCollapsedTime');
        if (el) el.textContent = stopwatchFormat(currentStopwatchElapsed());
      }, 500);
    }
    refreshStopwatch();
  }

  function renderStopwatchIdle() {
    setToolContent(dom.toolStopwatch, '<span class="util-tool-icon">' + ICONS.stopwatch + '</span>');
  }

  function renderStopwatchCollapsedRunning() {
    setToolContent(dom.toolStopwatch, '<span class="util-tool-time" id="stopwatchCollapsedTime">' + stopwatchFormat(currentStopwatchElapsed()) + '</span>');
  }

  function renderStopwatchExpanded() {
    setToolContent(dom.toolStopwatch,
      '<span class="util-tool-time" id="stopwatchDisplay">' + stopwatchFormat(currentStopwatchElapsed()) + '</span>' +
      '<button type="button" class="util-tool-action" title="' + (stopwatchRunning ? 'Stop and reset' : 'Start') + '" aria-label="' + (stopwatchRunning ? 'Stop and reset' : 'Start') + '">' + (stopwatchRunning ? ICONS.stop : ICONS.play) + '</button>'
    );
    dom.toolStopwatch.querySelector('.util-tool-action').addEventListener('click', handleStopwatchAction);
  }

  function refreshStopwatch() {
    if (stopwatchHovered) renderStopwatchExpanded();
    else if (stopwatchRunning) renderStopwatchCollapsedRunning();
    else renderStopwatchIdle();
  }



  var timerRemaining = 0;
  var timerRunning = false;
  var timerHovered = false;
  var timerTimer = null;

  function timerFormat(totalSeconds) {
    return pad2(Math.floor(totalSeconds / 60)) + ':' + pad2(totalSeconds % 60);
  }

  function handleTimerAction() {
    if (timerRunning) {
      clearInterval(timerTimer);
      timerRunning = false;
      timerRemaining = 0;
    } else {
      timerRemaining = Math.max(1, Math.round(state.utilities.timerMinutes * 60));
      timerRunning = true;
      timerTimer = setInterval(function () {
        timerRemaining--;
        if (timerRemaining <= 0) {
          clearInterval(timerTimer);
          timerRunning = false;
          timerRemaining = 0;
          playBeep();
          refreshTimer();
          return;
        }
        var el = document.getElementById('timerDisplay') || document.getElementById('timerCollapsedTime');
        if (el) el.textContent = timerFormat(timerRemaining);
      }, 1000);
    }
    refreshTimer();
  }

  function renderTimerIdle() {
    setToolContent(dom.toolTimer, '<span class="util-tool-icon">' + ICONS.timer + '</span>');
  }

  function renderTimerCollapsedRunning() {
    setToolContent(dom.toolTimer, '<span class="util-tool-time" id="timerCollapsedTime">' + timerFormat(timerRemaining) + '</span>');
  }

  function renderTimerExpanded() {
    if (timerRunning) {
      setToolContent(dom.toolTimer,
        '<span class="util-tool-time" id="timerDisplay">' + timerFormat(timerRemaining) + '</span>' +
        '<button type="button" class="util-tool-action" title="Stop and reset" aria-label="Stop and reset">' + ICONS.stop + '</button>'
      );
      dom.toolTimer.querySelector('.util-tool-action').addEventListener('click', handleTimerAction);
      return;
    }

    var isPreset = TIMER_PRESETS.indexOf(state.utilities.timerMinutes) !== -1;
    var chipsHtml = TIMER_PRESETS.map(function (m) {
      return '<button type="button" class="util-timer-chip' + (state.utilities.timerMinutes === m ? ' is-selected' : '') + '" data-minutes="' + m + '">' + pad2(m) + ':00</button>';
    }).join('');

    setToolContent(dom.toolTimer,
      chipsHtml +
      '<input type="text" class="util-timer-custom' + (!isPreset ? ' is-selected' : '') + '" id="timerCustomInput" placeholder="MM:SS" value="' + (isPreset ? '' : escapeHtml(minutesToMMSS(state.utilities.timerMinutes))) + '">' +
      '<button type="button" class="util-tool-action" title="Start" aria-label="Start">' + ICONS.play + '</button>'
    );

    dom.toolTimer.querySelectorAll('.util-timer-chip').forEach(function (chip) {
      chip.addEventListener('click', function () {
        state.utilities.timerMinutes = Number(chip.getAttribute('data-minutes'));
        saveUtilities();
        renderTimerExpanded();
      });
    });
    var customInput = document.getElementById('timerCustomInput');
    customInput.addEventListener('change', function () {
      state.utilities.timerMinutes = parseMMSS(customInput.value);
      saveUtilities();
      renderTimerExpanded();
    });
    dom.toolTimer.querySelector('.util-tool-action').addEventListener('click', handleTimerAction);
  }

  function refreshTimer() {
    if (timerHovered) renderTimerExpanded();
    else if (timerRunning) renderTimerCollapsedRunning();
    else renderTimerIdle();
  }



  var musicHovered = false;

  function loadMusicTrack(index, autoplay) {
    state.utilities.musicTrackIndex = index;
    saveUtilities();
    dom.focusAudio.src = MUSIC_TRACKS[index].file;
    dom.focusAudio.loop = true;
    if (autoplay) dom.focusAudio.play().catch(function () {});
  }

  function handleMusicToggle() {
    if (dom.focusAudio.paused) dom.focusAudio.play().catch(function () {});
    else dom.focusAudio.pause();
  }

  function handleMusicNext() {
    loadMusicTrack((state.utilities.musicTrackIndex + 1) % MUSIC_TRACKS.length, true);
    refreshMusic();
  }

  function renderMusicIdle() {
    setToolContent(dom.toolMusic, '<span class="util-tool-icon">' + ICONS.music + '</span>');
  }

  function renderMusicCollapsedPlaying() {
    var track = MUSIC_TRACKS[state.utilities.musicTrackIndex];
    setToolContent(dom.toolMusic, '<span class="util-tool-track-name">' + escapeHtml(track.name) + '</span>');
  }

  function renderMusicExpanded() {
    var track = MUSIC_TRACKS[state.utilities.musicTrackIndex];
    var playing = !dom.focusAudio.paused;
    setToolContent(dom.toolMusic,
      '<span class="util-tool-track-name">' + escapeHtml(track.name) + '</span>' +
      '<button type="button" class="util-tool-action" id="musicToggleBtn" title="' + (playing ? 'Pause' : 'Play') + '" aria-label="' + (playing ? 'Pause' : 'Play') + '">' + (playing ? ICONS.pause : ICONS.play) + '</button>' +
      '<button type="button" class="util-tool-action" id="musicNextBtn" title="Next track" aria-label="Next track">' + ICONS.chevronRight + '</button>'
    );
    document.getElementById('musicToggleBtn').addEventListener('click', handleMusicToggle);
    document.getElementById('musicNextBtn').addEventListener('click', handleMusicNext);
  }

  function refreshMusic() {
    if (musicHovered) renderMusicExpanded();
    else if (!dom.focusAudio.paused) renderMusicCollapsedPlaying();
    else renderMusicIdle();
  }



  var musicBgCtx = null;
  var musicBgWidth = 0;
  var musicBgHeight = 0;
  var musicBgCx = 0;
  var musicBgCy = 0;
  var musicBgMaxRadius = 0;
  var musicBgParticles = [];
  var musicBgRafId = null;
  var musicBgLastTime = null;

  function musicBgIsReducedMotion() {
    return (window.Buddy && Buddy.theme) ? Buddy.theme.isMotionReduced() : window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function musicBgPrimaryColor() {
    return getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim() || '#4f46e5';
  }

  function musicBgHexToRgb(hex) {
    var clean = hex.replace('#', '');
    if (clean.length === 3) clean = clean.split('').map(function (c) { return c + c; }).join('');
    var int = parseInt(clean, 16);
    return [(int >> 16) & 255, (int >> 8) & 255, int & 255];
  }

  function musicBgRgba(rgb, alpha) {
    return 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',' + alpha + ')';
  }

  function musicBgResize() {
    musicBgWidth = window.innerWidth;
    musicBgHeight = window.innerHeight;
    musicBgCx = musicBgWidth / 2;
    musicBgCy = musicBgHeight / 2;
    musicBgMaxRadius = Math.sqrt(musicBgCx * musicBgCx + musicBgCy * musicBgCy);
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    dom.musicBgCanvas.width = musicBgWidth * dpr;
    dom.musicBgCanvas.height = musicBgHeight * dpr;
    dom.musicBgCanvas.style.width = musicBgWidth + 'px';
    dom.musicBgCanvas.style.height = musicBgHeight + 'px';
    musicBgCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function musicBgSpawnParticle() {
    var angle = Math.random() * Math.PI * 2;
    var radius = Math.random() * musicBgMaxRadius * 0.1;
    return {
      angle: angle,
      radius: radius,
      prevRadius: radius,
      speed: 70 + Math.random() * 130,
      width: 1 + Math.random() * 1.8,
      warm: Math.random() < 0.35
    };
  }

  function musicBgCreateParticles() {
    var count = musicBgWidth < 640 ? 55 : 110;
    musicBgParticles = [];
    for (var i = 0; i < count; i++) musicBgParticles.push(musicBgSpawnParticle());
  }

  function musicBgDraw(now) {
    if (musicBgLastTime === null) musicBgLastTime = now;
    var dt = Math.min((now - musicBgLastTime) / 1000, 0.05);
    musicBgLastTime = now;

    musicBgCtx.clearRect(0, 0, musicBgWidth, musicBgHeight);

    var rgb = musicBgHexToRgb(musicBgPrimaryColor());

    musicBgCtx.lineCap = 'round';

    musicBgParticles.forEach(function (p) {
      var progress = p.radius / musicBgMaxRadius;
      p.prevRadius = p.radius;
      p.radius += p.speed * dt * (0.4 + progress * 2.6);
      if (p.radius > musicBgMaxRadius) {
        var fresh = musicBgSpawnParticle();
        p.angle = fresh.angle;
        p.radius = fresh.radius;
        p.prevRadius = fresh.radius;
        p.speed = fresh.speed;
        p.width = fresh.width;
        p.warm = fresh.warm;
        progress = p.radius / musicBgMaxRadius;
      }

      var cos = Math.cos(p.angle);
      var sin = Math.sin(p.angle);
      var x1 = musicBgCx + cos * p.prevRadius;
      var y1 = musicBgCy + sin * p.prevRadius;
      var x2 = musicBgCx + cos * p.radius;
      var y2 = musicBgCy + sin * p.radius;

      var edgeFade = 1 - Math.max(0, progress - 0.85) / 0.15;
      var alpha = Math.min(0.85, progress * 0.95) * edgeFade;
      var lineWidth = p.width * (0.4 + progress * 2.8);

      musicBgCtx.strokeStyle = musicBgRgba(p.warm ? [255, 255, 255] : rgb, alpha);
      musicBgCtx.lineWidth = lineWidth;
      musicBgCtx.beginPath();
      musicBgCtx.moveTo(x1, y1);
      musicBgCtx.lineTo(x2, y2);
      musicBgCtx.stroke();
    });

    musicBgRafId = requestAnimationFrame(musicBgDraw);
  }

  function startMusicBg() {
    dom.musicBgCanvas.classList.add('is-active');
    if (musicBgIsReducedMotion() || musicBgRafId || document.hidden) return;
    musicBgLastTime = null;
    musicBgRafId = requestAnimationFrame(musicBgDraw);
  }

  function stopMusicBg() {
    dom.musicBgCanvas.classList.remove('is-active');
    if (musicBgRafId) cancelAnimationFrame(musicBgRafId);
    musicBgRafId = null;
  }

  function initMusicBg() {
    musicBgCtx = dom.musicBgCanvas.getContext('2d');
    musicBgResize();
    musicBgCreateParticles();

    window.addEventListener('resize', function () {
      musicBgResize();
      musicBgCreateParticles();
    });
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        if (musicBgRafId) { cancelAnimationFrame(musicBgRafId); musicBgRafId = null; }
      } else if (!dom.focusAudio.paused) {
        startMusicBg();
      }
    });
    document.addEventListener('buddy:motionchange', function () {
      if (musicBgIsReducedMotion()) {
        if (musicBgRafId) { cancelAnimationFrame(musicBgRafId); musicBgRafId = null; }
      } else if (!dom.focusAudio.paused) {
        startMusicBg();
      }
    });
  }



  function initUtilitiesHover() {
    dom.toolStopwatch.addEventListener('mouseenter', function () {
      stopwatchHovered = true;
      refreshStopwatch();
    });
    dom.toolStopwatch.addEventListener('mouseleave', function () {
      stopwatchHovered = false;
      refreshStopwatch();
    });

    dom.toolTimer.addEventListener('mouseenter', function () {
      timerHovered = true;
      refreshTimer();
    });
    dom.toolTimer.addEventListener('mouseleave', function () {
      timerHovered = false;
      if (dom.toolTimer.contains(document.activeElement)) return;
      refreshTimer();
    });
    dom.toolTimer.addEventListener('focusout', function () {
      setTimeout(function () {
        if (!timerHovered && !dom.toolTimer.contains(document.activeElement)) refreshTimer();
      }, 0);
    });

    dom.toolMusic.addEventListener('mouseenter', function () {
      musicHovered = true;
      refreshMusic();
    });
    dom.toolMusic.addEventListener('mouseleave', function () {
      musicHovered = false;
      refreshMusic();
    });

    dom.focusAudio.addEventListener('play', function () {
      refreshMusic();
      startMusicBg();
    });
    dom.focusAudio.addEventListener('pause', function () {
      refreshMusic();
      stopMusicBg();
    });
  }







  function birthdayIsReducedMotion() {
    return (window.Buddy && Buddy.theme) ? Buddy.theme.isMotionReduced() : window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function initBirthdayCanvas() {
    var canvas = dom.birthdayCanvas;
    var ctx = canvas.getContext('2d');
    var reduceMotion = birthdayIsReducedMotion();
    var phrase = 'Happy Birthday, Anish!';
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var width = 0;
    var height = 0;
    var particles = [];

    function primaryColor() {
      return getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim() || '#4f46e5';
    }

    function hexToRgba(hex, alpha) {
      var clean = hex.replace('#', '');
      if (clean.length === 3) clean = clean.split('').map(function (c) { return c + c; }).join('');
      var int = parseInt(clean, 16);
      var r = (int >> 16) & 255;
      var g = (int >> 8) & 255;
      var b = int & 255;
      return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
    }

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function spawnParticle() {
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        baseSize: 22 + Math.random() * 26,
        speed: (Math.random() * 0.25 + 0.06) * (Math.random() < 0.5 ? -1 : 1),
        blinkSpeed: 0.3 + Math.random() * 0.6,
        blinkPhase: Math.random() * Math.PI * 2,
        zoomSpeed: 0.12 + Math.random() * 0.25,
        zoomPhase: Math.random() * Math.PI * 2
      };
    }

    function createParticles() {
      var count = width < 640 ? 5 : 9;
      particles = [];
      for (var i = 0; i < count; i++) particles.push(spawnParticle());
    }

    function draw(t) {
      var color = primaryColor();
      ctx.clearRect(0, 0, width, height);
      ctx.textBaseline = 'middle';
      particles.forEach(function (p) {
        p.x += p.speed;
        if (p.x > width + 300) p.x = -300;
        if (p.x < -300) p.x = width + 300;

        var alpha = 0.008 + (Math.sin(t * p.blinkSpeed + p.blinkPhase) * 0.5 + 0.5) * 0.03;
        var scale = 0.8 + (Math.sin(t * p.zoomSpeed + p.zoomPhase) * 0.5 + 0.5) * 0.5;
        var size = p.baseSize * scale;

        ctx.font = '800 ' + size + 'px sans-serif';
        ctx.fillStyle = hexToRgba(color, alpha);
        ctx.fillText(phrase, p.x, p.y);
      });
    }

    var rafId = null;
    var start = performance.now();

    function loop(now) {
      draw((now - start) / 1000);
      rafId = requestAnimationFrame(loop);
    }

    function startLoop() {
      if (!rafId && !document.hidden) rafId = requestAnimationFrame(loop);
    }

    function stop() {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = null;
    }

    resize();
    createParticles();

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop();
      else if (!reduceMotion) startLoop();
    });

    function syncMotion() {
      var nowReduced = birthdayIsReducedMotion();
      if (nowReduced === reduceMotion) return;
      reduceMotion = nowReduced;
      if (reduceMotion) { stop(); draw(0); }
      else startLoop();
    }

    if (reduceMotion) draw(0); else startLoop();
    document.addEventListener('buddy:motionchange', syncMotion);
    if (window.matchMedia) window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', syncMotion);

    window.addEventListener('resize', function () {
      resize();
      createParticles();
      if (reduceMotion) draw(0);
    });
  }

  function checkBirthday() {
    var now = new Date();
    if (now.getMonth() === 5 && now.getDate() === 27) {
      dom.birthdayCanvas.classList.add('is-active');
      initBirthdayCanvas();
    }
  }

  function cacheDom() {
    dom.birthdayCanvas = document.getElementById('birthdayCanvas');
    dom.musicBgCanvas = document.getElementById('musicBgCanvas');
    dom.btnAppsLibrary = document.getElementById('btnAppsLibrary');
    dom.btnSettings = document.getElementById('btnSettings');
    dom.weatherWidget = document.getElementById('weatherWidget');
    dom.weatherTime = document.getElementById('weatherTime');
    dom.weatherInfo = document.getElementById('weatherInfo');
    dom.searchForm = document.getElementById('searchForm');
    dom.engineSelector = document.getElementById('engineSelector');
    dom.engineStack = document.getElementById('engineStack');
    dom.searchInput = document.getElementById('searchInput');
    dom.searchSubmitBtn = document.getElementById('searchSubmitBtn');
    dom.searchHistory = document.getElementById('searchHistory');
    dom.quoteBlock = document.getElementById('quoteBlock');
    dom.quoteText = document.getElementById('quoteText');
    dom.quoteAuthor = document.getElementById('quoteAuthor');
    dom.quoteRefreshBtn = document.getElementById('quoteRefreshBtn');
    dom.favoritesSection = document.getElementById('favoritesSection');
    dom.favoritesGrid = document.getElementById('favoritesGrid');
    dom.tasksSection = document.getElementById('tasksSection');
    dom.taskInput = document.getElementById('taskInput');
    dom.taskAddBtn = document.getElementById('taskAddBtn');
    dom.taskList = document.getElementById('taskList');
    dom.tasksCollapseBtn = document.getElementById('tasksCollapseBtn');
    dom.toolStopwatch = document.getElementById('toolStopwatch');
    dom.toolTimer = document.getElementById('toolTimer');
    dom.toolMusic = document.getElementById('toolMusic');
    dom.focusAudio = document.getElementById('focusAudio');
    dom.confettiLayer = document.getElementById('confettiLayer');
  }

  function init() {
    cacheDom();
    checkBirthday();
    dom.btnAppsLibrary.innerHTML = ICONS.grid;
    dom.btnSettings.innerHTML = ICONS.settings;
    dom.searchSubmitBtn.innerHTML = ICONS.search;
    dom.quoteRefreshBtn.innerHTML = ICONS.repeat;
    dom.taskAddBtn.innerHTML = ICONS.plus;

    state.favorites = loadFavorites();
    state.engine = loadEngine();
    state.weatherLocation = loadWeatherLocation();
    state.tasks = loadTasks();
    state.tasksCollapsed = loadTasksCollapsed();
    state.favoritesCollapsed = loadFavoritesCollapsed();
    state.searchHistory = loadSearchHistory();
    state.utilities = loadUtilities();

    renderEngineSelector();
    renderQuote(Math.floor(Math.random() * QUOTES.length));
    renderFavorites();
    renderFavoritesCollapsed();
    renderTasks();
    renderTasksCollapsed();
    renderSearchHistory();

    var initialTrack = MUSIC_TRACKS[state.utilities.musicTrackIndex] || MUSIC_TRACKS[0];
    dom.focusAudio.src = initialTrack.file;
    dom.focusAudio.loop = true;
    renderStopwatchIdle();
    renderTimerIdle();
    renderMusicIdle();
    initUtilitiesHover();
    initMusicBg();

    if (state.weatherLocation) fetchWeather(); else detectLocation();

    updateClock();
    setInterval(updateClock, 30000);

    dom.btnSettings.addEventListener('click', openSettingsModal);
    dom.weatherWidget.addEventListener('click', openLocationModal);
    dom.searchForm.addEventListener('submit', handleSearchSubmit);
    dom.searchInput.addEventListener('focus', function () {
      if (!dom.searchInput.value.trim()) openSearchHistory();
    });
    dom.searchInput.addEventListener('input', function () {
      searchHistoryIndex = -1;
      if (dom.searchInput.value.trim()) closeSearchHistory();
      else openSearchHistory();
    });
    dom.searchInput.addEventListener('keydown', handleSearchHistoryNav);
    document.addEventListener('click', function (e) {
      if (!dom.searchForm.contains(e.target)) closeSearchHistory();
    });
    dom.quoteRefreshBtn.addEventListener('click', handleQuoteRefresh);
    dom.taskAddBtn.addEventListener('click', handleAddTask);
    dom.taskInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); handleAddTask(); }
    });
    dom.tasksCollapseBtn.addEventListener('click', handleToggleTasksCollapsed);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeSearchHistory();
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
