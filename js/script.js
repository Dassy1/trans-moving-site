                // CONFIG
    const LOCATIONIQ_KEY = 'pk.18e40ff86d2fabf5880004656b5096fc'; // Restrict by referrer in dashboard or proxy via your backend
    const AUTOCOMPLETE_URL = 'https://us1.locationiq.com/v1/autocomplete.php';

    // Bias to Canada (since your business serves Canada). Change to '' to allow anywhere, or 'ng' for Nigeria, etc.
    const COUNTRY_BIAS = '';

  // Helpers
  const debounce = (fn, wait = 250) => {
        let t;
    return (...args) => {clearTimeout(t); t = setTimeout(() => fn(...args), wait); };
  };

    function buildList(container, items, onSelect) {
        container.innerHTML = '';
    const list = document.createElement('div');
    list.className = 'list';
    items.forEach((it, idx) => {
    const div = document.createElement('div');
    div.className = 'suggestion-item';
    div.dataset.idx = idx;
    const type = it.type || it.class || '';
    const road = it.address?.road || it.address?.pedestrian || '';
    div.innerHTML = `
    <div>${it.display_name}</div>
    <small>${type}${road ? ' · ' + road : ''}</small>
    `;
    div.addEventListener('click', () => onSelect(idx));
    list.appendChild(div);
    });
    container.appendChild(list);
    container.hidden = false;
}

    function highlight(container, index) {
    const nodes = container.querySelectorAll('.suggestion-item');
    nodes.forEach(n => n.classList.remove('active'));
    if (index >= 0 && nodes[index]) nodes[index].classList.add('active');
}

// to return city/town/village
    function pickCity(addr) {
    return addr?.city || addr?.town || addr?.village || addr?.hamlet || '';
}

    function pickProvince(addr) {
    return addr?.state || addr?.province || '';
}

    // Extract postal
    function pickPostal(addr) {
    return addr?.postcode || '';
}

    // Autocomplete binder
    function attachAutocomplete({input, container, onChosen}) {
        let items = [];
    let active = -1;

    const fetchSuggestions = debounce(async (q) => {
        if (!q || q.trim().length < 2) {container.hidden = true; items = []; return; }

    const url = new URL(AUTOCOMPLETE_URL);
    url.searchParams.set('key', LOCATIONIQ_KEY);
    url.searchParams.set('q', q.trim());
    url.searchParams.set('format', 'json');
    url.searchParams.set('addressdetails', '1');
    if (COUNTRY_BIAS) url.searchParams.set('countrycodes', COUNTRY_BIAS);

    try {
        const res = await fetch(url.toString());
    if (!res.ok) throw new Error('LocationIQ error');
    const data = await res.json();
    items = Array.isArray(data) ? data : [];
    if (items.length === 0) {container.hidden = true; return; }
    buildList(container, items, selectIndex);
    active = -1;
    } catch (e) {
        console.error(e);
    container.hidden = true;
    }
    }, 220);

    function selectIndex(idx) {
    const chosen = items[idx];
    if (!chosen) return;
    input.value = chosen.display_name;
    onChosen(chosen);
    container.hidden = true;
    items = [];
    active = -1;
    }

    input.addEventListener('input', (e) => fetchSuggestions(e.target.value));
    input.addEventListener('keydown', (e) => {
    if (container.hidden || items.length === 0) return;

    const max = items.length - 1;
    if (e.key === 'ArrowDown') {
        e.preventDefault(); active = Math.min(max, active + 1); highlight(container, active);
    } else if (e.key === 'ArrowUp') {
        e.preventDefault(); active = Math.max(0, active - 1); highlight(container, active);
    } else if (e.key === 'Enter') {
        e.preventDefault(); if (active >= 0) selectIndex(active);
    } else if (e.key === 'Escape') {
        container.hidden = true; items = []; active = -1;
    }
    });

    document.addEventListener('click', (e) => {
        if (!container.contains(e.target) && e.target !== input) container.hidden = true;
    });
  }

    // Hooking up the two fields
    const fromInput = document.getElementById('move_from');
    const fromBox = document.getElementById('fromSuggestions');
    const toInput = document.getElementById('move_to');
    const toBox = document.getElementById('toSuggestions');

    attachAutocomplete({
        input: fromInput,
    container: fromBox,
    onChosen: (place) => {
        document.getElementById('from_lat').value = place.lat || '';
    document.getElementById('from_lng').value = place.lon || '';
    const addr = place.address || { };
    document.getElementById('from_city').value = pickCity(addr);
    document.getElementById('from_province').value = pickProvince(addr);
    document.getElementById('from_postal').value = pickPostal(addr);
    }
  });

    attachAutocomplete({
        input: toInput,
    container: toBox,
    onChosen: (place) => {
        document.getElementById('to_lat').value = place.lat || '';
    document.getElementById('to_lng').value = place.lon || '';
    const addr = place.address || { };
    document.getElementById('to_city').value = pickCity(addr);
    document.getElementById('to_province').value = pickProvince(addr);
    document.getElementById('to_postal').value = pickPostal(addr);
    }
  });

  // Optional: validate we captured coords before submit
  document.getElementById('quoteForm').addEventListener('submit', (e) => {
        // Example: if user didn't pick a suggestion, you can still geocode on the server.
        // Here we just allow submit; your backend can verify/fallback.
    });

