# Sitting in Traffic Sucks

How many flights could you have taken instead of sitting in traffic? Enter your commute details to estimate annual traffic time, then see how many flights that wasted time could buy you.

## Features

- **Traffic Time Estimator** — Select your city, commute distance, and peak traffic percentage to calculate how many hours per year you lose to congestion. Supports 15 major US cities with built-in congestion data.
- **Flight Comparison** — Pick two airports and see how many one-way or round trips your traffic time equals
- **One-click transfer** — Use the "Use This Estimate" button to pipe your annual traffic hours directly into the flight calculator
- **Full worldwide airport database** — 10,000+ airports with IATA codes, loaded from [mwgg/Airports](https://github.com/mwgg/Airports)
- **City search** — Find airports by city name, airport name, IATA code, or country
- **Shareable URLs** — Results encoded in the URL; share a link and it auto-calculates on load
- **Dark mode** — Toggle between light/dark themes; respects system preference and persists choice
- **Around-the-world comparison** — Shows how many times your total miles would circumnavigate the globe
- **Comparison destinations** — See how many trips you could take to other popular airports

## Usage

Open `index.html` in a browser. No build step or server required.

1. Select your commute city, distance, and peak traffic percentage
2. Click **Estimate Traffic Time** to see your annual hours lost
3. Click **Use This Estimate** to fill in the flight comparison
4. Search and select departure and arrival airports
5. Click **Calculate** to see how many flights you could have taken
6. Share the URL or click **Copy Shareable Link**

## Supported Cities

Los Angeles, San Francisco, New York, Seattle, Chicago, Washington DC, Boston, Houston, Atlanta, Miami, Dallas, Denver, Phoenix, Portland, San Diego

## Files

```
index.html   — Page structure
style.css    — Styles with light/dark theme via CSS variables
app.js       — Traffic estimation, airport loading, search, calculation, URL sync, dark mode
```

## How it works

**Traffic estimation** uses per-city congestion data (extra delay in minutes per mile during peak hours). The estimator calculates how much longer your commute takes versus free-flow conditions, then projects that daily loss across your work year.

**Flight time** is estimated as `distance / 550 mph`. Distance uses the haversine formula. The "around the world" stat divides total one-way miles flown by Earth's circumference (24,901 miles).
