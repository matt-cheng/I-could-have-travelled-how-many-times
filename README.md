# Sitting in Traffic Sucks

How many flights could you have taken instead of sitting in traffic? Enter your commute details to estimate annual traffic time, then see how many flights that wasted time could buy you.

## Features

- **Flight Comparison** — Pick two airports and see how many one-way or round trips your wasted time equals
- **Traffic Time Estimator** — Hidden by default; expand it to select your city, commute distance, and peak traffic percentage to calculate how many hours per year you lose to congestion. Supports 17 major US cities with built-in congestion data.
- **One-click transfer** — Use the "Use This Estimate" button to pipe your annual traffic hours directly into the flight calculator
- **Full worldwide airport database** — 10,000+ airports with IATA codes, loaded from [mwgg/Airports](https://github.com/mwgg/Airports)
- **City search** — Find airports by city name, airport name, IATA code, or country
- **Shareable URLs** — Results encoded in the URL; share a link and it auto-calculates on load
- **Dark mode** — Toggle between light/dark themes; respects system preference and persists choice
- **Around-the-world comparison** — Shows how many times your total miles would circumnavigate the globe
- **Comparison destinations** — See how many trips you could take to other popular airports

## Usage

Open `index.html` in a browser. No build step or server required.

All fields start empty with placeholder examples to guide input.

1. Enter your hours (and optionally minutes) in the Flight Comparison section (e.g. 207 hours)
2. Search and select departure and arrival airports (e.g. LAX → HND)
3. Click **Calculate** to see how many flights you could have taken
4. Share the URL or click **Copy Shareable Link**

**Don't know your commute time?** Click the link below the Calculate button to expand the Traffic Time Estimator:

1. Select your commute city, distance, and peak traffic percentage
2. Click **Estimate Traffic Time** to see your annual hours lost
3. Click **Use This Estimate** to auto-fill the hours into Flight Comparison

## Supported Cities

Los Angeles, San Francisco, New York, Seattle, Chicago, Washington DC, Boston, Houston, Atlanta, Miami, Dallas, Denver, Phoenix, Portland, San Diego, Austin, Las Vegas

## Files

```
index.html   — Page structure
style.css    — Styles with light/dark theme via CSS variables
app.js       — Traffic estimation, airport loading, search, calculation, URL sync, dark mode
```

## How it works

**Traffic estimation** uses per-city congestion data with two values per city:

- `delayPerMile` — extra minutes of delay per mile during peak traffic (e.g. LA = 3.2, Phoenix = 1.8)
- `freeFlowMph` — speed you'd travel with no traffic (e.g. NY = 25 mph, Houston = 38 mph)

Calculation:

1. Peak miles = commute distance × peak traffic %
2. Extra delay (one way) = peak miles × city's `delayPerMile`
3. Daily extra = one-way delay × 2 (round trip)
4. Weekly = daily × days per week
5. Annual = weekly × 52 weeks

Example: LA, 15-mile commute, 80% peak → `15 × 0.8 × 3.2 = 38.4 extra min/trip` → ~77 min/day → ~6.4 hrs/week → ~320 hrs/year.

The congestion values are hardcoded approximations inspired by INRIX/TomTom congestion indices — not live data.

**Flight time** is estimated as `distance / 550 mph`. Distance uses the haversine formula. The "around the world" stat divides total one-way miles flown by Earth's circumference (24,901 miles).
