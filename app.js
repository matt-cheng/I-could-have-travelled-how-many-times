(function() {
  'use strict';

  const EARTH_CIRCUMFERENCE_MILES = 24901;
  const AVG_SPEED_MPH = 550;

  // Peak traffic congestion data: delay in minutes per mile during peak hours
  // Based on urban congestion indices (INRIX / TomTom style data)
  const CITY_CONGESTION = {
    'los-angeles':    { name: 'Los Angeles',    delayPerMile: 3.2, freeFlowMph: 35 },
    'san-francisco':  { name: 'San Francisco',  delayPerMile: 2.9, freeFlowMph: 30 },
    'new-york':       { name: 'New York',       delayPerMile: 3.5, freeFlowMph: 25 },
    'seattle':        { name: 'Seattle',        delayPerMile: 2.6, freeFlowMph: 32 },
    'chicago':        { name: 'Chicago',        delayPerMile: 2.7, freeFlowMph: 33 },
    'washington-dc':  { name: 'Washington DC',  delayPerMile: 2.8, freeFlowMph: 30 },
    'boston':          { name: 'Boston',         delayPerMile: 2.9, freeFlowMph: 28 },
    'houston':        { name: 'Houston',        delayPerMile: 2.2, freeFlowMph: 38 },
    'atlanta':        { name: 'Atlanta',        delayPerMile: 2.4, freeFlowMph: 36 },
    'miami':          { name: 'Miami',          delayPerMile: 2.5, freeFlowMph: 34 },
    'dallas':         { name: 'Dallas',         delayPerMile: 2.1, freeFlowMph: 38 },
    'denver':         { name: 'Denver',         delayPerMile: 2.0, freeFlowMph: 37 },
    'phoenix':        { name: 'Phoenix',        delayPerMile: 1.8, freeFlowMph: 40 },
    'portland':       { name: 'Portland',       delayPerMile: 2.3, freeFlowMph: 33 },
    'san-diego':      { name: 'San Diego',      delayPerMile: 2.1, freeFlowMph: 36 },
    'austin':         { name: 'Austin',         delayPerMile: 2.3, freeFlowMph: 35 },
    'las-vegas':      { name: 'Las Vegas',      delayPerMile: 1.9, freeFlowMph: 38 }
  };

  function estimateTrafficTime() {
    const cityKey = document.getElementById('city-select').value;
    const distance = +document.getElementById('commute-distance').value;
    const peakPercent = +document.getElementById('peak-percent').value / 100;
    const daysPerWeek = +document.getElementById('days-per-week').value;
    const weeksPerYear = 52;

    if (!cityKey || !distance) return;

    const city = CITY_CONGESTION[cityKey];
    const peakMiles = distance * peakPercent;
    const offPeakMiles = distance * (1 - peakPercent);

    // Extra delay per one-way trip (minutes beyond free-flow)
    const extraDelayOneWay = peakMiles * city.delayPerMile;
    // Round trip extra delay per day
    const dailyExtraMinutes = extraDelayOneWay * 2;
    const weeklyExtraHours = (dailyExtraMinutes * daysPerWeek) / 60;
    const annualExtraHours = weeklyExtraHours * weeksPerYear;

    document.getElementById('dailyTraffic').textContent = Math.round(dailyExtraMinutes);
    document.getElementById('weeklyTraffic').textContent = weeklyExtraHours.toFixed(1);
    document.getElementById('annualTraffic').textContent = Math.round(annualExtraHours);

    const freeFlowTime = (distance / city.freeFlowMph) * 60;
    const actualTime = freeFlowTime + extraDelayOneWay;
    document.getElementById('trafficNote').textContent =
      `In ${city.name}, a ${distance}-mile commute takes ~${Math.round(freeFlowTime)} min free-flow ` +
      `but ~${Math.round(actualTime)} min in peak traffic. ` +
      `That's ${Math.round(annualExtraHours)} hours/year you lose just sitting in traffic.`;

    document.getElementById('trafficResult').style.display = 'block';
    document.getElementById('useEstimateBtn').style.display = 'inline-block';

    window._lastTrafficEstimate = { hours: Math.floor(annualExtraHours), minutes: Math.round((annualExtraHours % 1) * 60) };
  }

  function useTrafficEstimate() {
    if (!window._lastTrafficEstimate) return;
    document.getElementById('hours').value = window._lastTrafficEstimate.hours;
    document.getElementById('minutes').value = window._lastTrafficEstimate.minutes;
    calculateTrips();
    document.getElementById('hours').scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  const COUNTRY_FLAGS = {};
  const airports = [];
  let fromSelect, toSelect;


  function haversine(lat1, lon1, lat2, lon2) {
    const R = 3959;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  function flightTime(miles) {
    return miles / AVG_SPEED_MPH;
  }

  async function loadAirports() {
    const loadingText = document.getElementById('loadingText');
    try {
      loadingText.textContent = 'Fetching worldwide airport database...';
      const res = await fetch('https://raw.githubusercontent.com/mwgg/Airports/master/airports.json');
      if (!res.ok) throw new Error('Failed to fetch airport data');
      const data = await res.json();

      loadingText.textContent = 'Processing airports...';
      let count = 0;
      for (const [id, ap] of Object.entries(data)) {
        if (!ap.iata || ap.iata.length !== 3) continue;
        if (!ap.lat || !ap.lon) continue;
        const lat = parseFloat(ap.lat);
        const lon = parseFloat(ap.lon);
        if (isNaN(lat) || isNaN(lon)) continue;

        airports.push({
          iata: ap.iata,
          name: ap.name || '',
          city: ap.city || '',
          country: ap.country || '',
          lat: lat,
          lon: lon,
          searchText: `${ap.iata} ${ap.name || ''} ${ap.city || ''} ${ap.country || ''}`.toLowerCase()
        });
        count++;
      }

      airports.sort((a, b) => a.city.localeCompare(b.city));

      document.getElementById('loadingCard').style.display = 'none';
      document.getElementById('airportCount').textContent = `${count.toLocaleString()} airports loaded worldwide`;
      initSelects();
      applyUrlParams();
    } catch (err) {
      loadingText.textContent = `Error loading airports: ${err.message}. Retrying...`;
      setTimeout(loadAirports, 3000);
    }
  }

  function initSelects() {
    const options = airports.map(ap => ({
      value: ap.iata,
      text: `${ap.city || ap.name} — ${ap.name} (${ap.iata})`,
      city: ap.city,
      name: ap.name,
      country: ap.country,
      iata: ap.iata
    }));

    const tsConfig = {
      options: options,
      maxOptions: 200,
      searchField: ['city', 'name', 'iata', 'country'],
      sortField: [{ field: 'city', direction: 'asc' }],
      render: {
        option: function(data, escape) {
          return `<div class="option">
            <strong>${escape(data.city || data.name)}</strong>
            <span style="opacity:0.6;margin-left:6px">${escape(data.name)} (${escape(data.iata)})</span>
          </div>`;
        },
        item: function(data, escape) {
          return `<div>${escape(data.city || data.name)} (${escape(data.iata)})</div>`;
        }
      }
    };

    fromSelect = new TomSelect('#from-select', { ...tsConfig, placeholder: 'Search by city, airport, or code...' });
    toSelect = new TomSelect('#to-select', { ...tsConfig, placeholder: 'Search by city, airport, or code...' });

    fromSelect.setValue('LAX');
    toSelect.setValue('HND');
  }

  function getAirport(iata) {
    return airports.find(a => a.iata === iata);
  }

  function calculateTrips() {
    const totalHours = (+document.getElementById('hours').value) + (+document.getElementById('minutes').value / 60);
    const fromCode = fromSelect.getValue();
    const toCode = toSelect.getValue();

    if (!fromCode || !toCode) return;

    const from = getAirport(fromCode);
    const to = getAirport(toCode);
    if (!from || !to) return;

    const dist = haversine(from.lat, from.lon, to.lat, to.lon);
    const flight = flightTime(dist);
    const oneWay = Math.floor(totalHours / flight);
    const roundTrip = Math.floor(totalHours / (flight * 2));

    document.getElementById('funFact').innerHTML =
      `With <b>${totalHours.toFixed(1)} hours</b>, you could have flown from ` +
      `<b>${from.city || from.name} (${fromCode})</b> to ` +
      `<b>${to.city || to.name} (${toCode})</b> ` +
      `<b>${oneWay.toLocaleString()}</b> time${oneWay !== 1 ? 's' : ''}.`;

    const totalMilesFlown = dist * oneWay;
    const worldTrips = totalMilesFlown / EARTH_CIRCUMFERENCE_MILES;
    const worldEl = document.getElementById('worldTrips');
    if (worldTrips >= 0.1) {
      worldEl.innerHTML =
        `That's <b>${totalMilesFlown.toLocaleString(undefined, { maximumFractionDigits: 0 })}</b> miles total — ` +
        `you could have gone <b>around the world ${worldTrips >= 2 ? worldTrips.toFixed(1) : worldTrips.toFixed(2)} time${worldTrips >= 1.5 ? 's' : ''}</b>! ` +
        `<span style="font-size:1.3em">&#127758;</span>`;
      worldEl.style.display = 'block';
    } else {
      worldEl.style.display = 'none';
    }

    document.getElementById('oneWay').textContent = oneWay.toLocaleString();
    document.getElementById('roundTrip').textContent = roundTrip.toLocaleString();
    document.getElementById('flightTime').textContent = flight.toFixed(1);
    document.getElementById('distance').textContent = Math.round(dist).toLocaleString();

    document.getElementById('results').style.display = 'block';
    document.getElementById('comparisonsCard').style.display = 'block';
    document.getElementById('shareBtn').style.display = 'inline-block';

    buildComparisons(from, totalHours);
    updateUrl(fromCode, toCode, document.getElementById('hours').value, document.getElementById('minutes').value);
  }

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function buildComparisons(from, totalHours) {
    const domestic = [
      'JFK', 'LAX', 'ATL', 'ORD', 'DFW', 'SFO', 'MIA', 'SEA', 'BOS', 'DEN',
      'IAH', 'MSP', 'DTW', 'PHX', 'EWR', 'CLT', 'LAS', 'MCO', 'SAN', 'PDX'
    ];
    const international = [
      'LHR', 'CDG', 'NRT', 'HND', 'ICN', 'SIN', 'DXB', 'SYD', 'HKG', 'BKK',
      'FCO', 'AMS', 'FRA', 'BCN', 'MAD', 'IST', 'DEL', 'PEK', 'TPE', 'KUL',
      'MNL', 'MEX', 'GRU', 'EZE', 'JNB', 'CAI', 'YVR', 'NBO', 'LIS', 'DOH'
    ];

    const fromCode = fromSelect.getValue();
    const seenCities = new Set();

    function pickValid(pool, count) {
      const results = [];
      const shuffled = shuffle([...pool]);
      for (const code of shuffled) {
        if (code === fromCode) continue;
        const ap = getAirport(code);
        if (!ap) continue;
        const cityKey = (ap.city || ap.name).toLowerCase();
        if (seenCities.has(cityKey)) continue;
        const d = haversine(from.lat, from.lon, ap.lat, ap.lon);
        const trips = Math.floor(totalHours / flightTime(d));
        if (trips > 0) {
          seenCities.add(cityKey);
          results.push({ airport: ap, dist: d, trips: trips });
        }
        if (results.length >= count) break;
      }
      return results;
    }

    const usPicks = pickValid(domestic, 3);
    const intlPicks = pickValid(international, 3);
    const shown = [...usPicks, ...intlPicks].sort((a, b) => a.dist - b.dist);

    const html = shown.map(c => {
      return `<div class="comparison-item">
        <div class="comparison-info">
          <strong>${c.airport.city || c.airport.name} (${c.airport.iata})</strong>
          <small>${Math.round(c.dist).toLocaleString()} miles</small>
        </div>
        <span class="comparison-trips">${c.trips.toLocaleString()}</span>
      </div>`;
    }).join('');

    document.getElementById('comparisons').innerHTML = html;
  }

  function updateUrl(from, to, hours, minutes) {
    const params = new URLSearchParams();
    params.set('from', from);
    params.set('to', to);
    params.set('hours', hours);
    if (+minutes > 0) params.set('minutes', minutes);
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    history.replaceState(null, '', newUrl);
  }

  function applyUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const from = params.get('from');
    const to = params.get('to');
    const hours = params.get('hours');
    const minutes = params.get('minutes');

    if (from && getAirport(from)) fromSelect.setValue(from);
    if (to && getAirport(to)) toSelect.setValue(to);
    if (hours) document.getElementById('hours').value = hours;
    if (minutes) document.getElementById('minutes').value = minutes;

    if (from || to || hours) {
      calculateTrips();
    }
  }

  function copyShareableLink() {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      const btn = document.getElementById('shareBtn');
      const orig = btn.textContent;
      btn.textContent = 'Copied!';
      setTimeout(() => btn.textContent = orig, 2000);
    });
  }

  function initDarkMode() {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.setAttribute('data-theme', 'dark');
    }

    document.getElementById('darkToggle').addEventListener('click', () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      if (isDark) {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
      }
    });
  }

  document.getElementById('calcBtn').addEventListener('click', calculateTrips);
  document.getElementById('shareBtn').addEventListener('click', copyShareableLink);
  document.getElementById('hours').addEventListener('input', calculateTrips);
  document.getElementById('minutes').addEventListener('input', calculateTrips);
  document.getElementById('estimateBtn').addEventListener('click', estimateTrafficTime);
  document.getElementById('useEstimateBtn').addEventListener('click', useTrafficEstimate);
  document.getElementById('toggleEstimator').addEventListener('click', function(e) {
    e.preventDefault();
    const panel = document.getElementById('trafficEstimator');
    const isHidden = panel.style.display === 'none';
    panel.style.display = isHidden ? 'block' : 'none';
    this.textContent = isHidden
      ? 'Hide traffic estimator'
      : "Don’t know your commute time? Click here to estimate.";
  });

  initDarkMode();
  loadAirports();
})();
