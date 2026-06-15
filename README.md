# Travel Opportunity Calculator v2

Ever wonder how many flights you could have taken with all that time spent in meetings, on hold, or binge-watching? Enter your hours and pick two airports — this calculator tells you how many times you could have made the trip.

## Features

- **Full worldwide airport database** — 10,000+ airports with IATA codes, loaded from [mwgg/Airports](https://github.com/mwgg/Airports)
- **City search** — Find airports by city name, airport name, IATA code, or country
- **Shareable URLs** — Results are encoded in the URL (`?from=LAX&to=HND&hours=207`); share a link and it auto-calculates on load
- **Dark mode** — Toggle between light/dark themes; respects system preference and persists choice
- **Flag icons** — Emoji country flags shown in search, results, and comparisons
- **Around-the-world comparison** — Shows how many times your total miles would circumnavigate the globe
- **Comparison destinations** — See how many trips you could take to 10 other popular airports

## Usage

Open `index.html` in a browser. No build step or server required.

1. Enter hours (and optionally minutes)
2. Search and select departure and arrival airports
3. Click **Calculate**
4. Share the URL or click **Copy Shareable Link**

## Files

```
index.html   — Page structure
style.css    — Styles with light/dark theme via CSS variables
app.js       — Airport loading, search, calculation, URL sync, dark mode
```

## How it works

Flight time is estimated as `(distance / 550 mph) + 1.5 hours` overhead (taxiing, boarding, etc.). Distance uses the haversine formula. The "around the world" stat divides total one-way miles flown by Earth's circumference (24,901 miles).
