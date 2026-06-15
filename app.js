const routes = {

  "LAX-HND": 11.5,
  "LAX-NRT": 11.0,
  "LAX-KIX": 12.0,

  "LAX-TPE": 14.0,
  "LAX-ICN": 13.0,
  "LAX-HKG": 15.0,

  "LAX-SYD": 15.0,
  "LAX-AKL": 13.5,

  "LAX-CDG": 11.0,
  "LAX-LHR": 10.5,
  "LAX-FCO": 12.0,

  "LAX-JFK": 5.5,
  "LAX-BOS": 5.8,
  "LAX-MIA": 5.2,

  "SFO-HND": 10.8,
  "JFK-HND": 14.0
};

const comparisonDestinations = [
  {
    destination: "Tokyo 🇯🇵",
    hours: 11.5
  },
  {
    destination: "Taipei 🇹🇼",
    hours: 14
  },
  {
    destination: "Seoul 🇰🇷",
    hours: 13
  },
  {
    destination: "Hong Kong 🇭🇰",
    hours: 15
  },
  {
    destination: "Honolulu 🌴",
    hours: 6
  },
  {
    destination: "New York 🗽",
    hours: 5.5
  },
  {
    destination: "London 🇬🇧",
    hours: 10.5
  },
  {
    destination: "Paris 🇫🇷",
    hours: 11
  },
  {
    destination: "Rome 🇮🇹",
    hours: 12
  },
  {
    destination: "Sydney 🇦🇺",
    hours: 15
  }
];

function calculateTrips() {

  const hours =
    Number(
      document.getElementById("hours").value
    );

  const minutes =
    Number(
      document.getElementById("minutes").value
    );

  const totalHours =
    hours + (minutes / 60);

  const from =
    document
      .getElementById("from")
      .value
      .trim()
      .toUpperCase();

  const to =
    document
      .getElementById("to")
      .value
      .trim()
      .toUpperCase();

  const routeKey =
    `${from}-${to}`;

  const flightTime =
    routes[routeKey];

  if (!flightTime) {

    document.getElementById("funFact").innerHTML =
      "⚠️ Route not found.";

    document.getElementById("oneWay").innerHTML = "";
    document.getElementById("roundTrip").innerHTML = "";
    document.getElementById("flightTime").innerHTML = "";

    return;
  }

  const oneWayTrips =
    Math.floor(
      totalHours / flightTime
    );

  const roundTrips =
    Math.floor(
      totalHours / (flightTime * 2)
    );

  document.getElementById("funFact").innerHTML =
    `🎉 With ${totalHours.toFixed(2)} hours available, you could have flown from <strong>${from}</strong> to <strong>${to}</strong> <strong>${oneWayTrips}</strong> times.`;

  document.getElementById("oneWay").innerHTML =
    `✈️ One-Way Trips Possible: <strong>${oneWayTrips}</strong>`;

  document.getElementById("roundTrip").innerHTML =
    `🔁 Round Trips Possible: <strong>${roundTrips}</strong>`;

  document.getElementById("flightTime").innerHTML =
    `Flight Time: ${flightTime.toFixed(1)} hours`;

  renderComparisons(totalHours);
}

function renderComparisons(totalHours) {

  const randomFive =
    [...comparisonDestinations]
      .sort(() => Math.random() - 0.5)
      .slice(0, 5);

  let html = "<ul>";

  randomFive.forEach(item => {

    const trips =
      Math.floor(
        totalHours / item.hours
      );

    html += `
      <li>
        ${item.destination}
        —
        <strong>${trips}</strong>
        one-way flights
      </li>
    `;
  });

  html += "</ul>";

  document.getElementById("comparisons").innerHTML =
    html;
}

calculateTrips();
