// Approximate nonstop flight durations in hours

const routes = {
  "LAX-HND": 11.5,
  "LAX-NRT": 11.0,
  "LAX-KIX": 12.0,

  "SNA-HND": 13.0,
  "JFK-HND": 14.0,

  "LAX-TPE": 14.0,
  "LAX-ICN": 13.0,
  "LAX-CDG": 11.0,
  "LAX-LHR": 10.5
};

function calculateTrips() {

  const hours =
    Number(document.getElementById("hours").value);

  const minutes =
    Number(document.getElementById("minutes").value);

  const totalHours =
    hours + (minutes / 60);

  const from =
    document.getElementById("from")
      .value
      .trim()
      .toUpperCase();

  const to =
    document.getElementById("to")
      .value
      .trim()
      .toUpperCase();

  const routeKey =
    `${from}-${to}`;

  const flightTime =
    routes[routeKey];

  if (!flightTime) {

    alert(
      `Route ${routeKey} not found.
Add it to app.js or connect to an API.`
    );

    return;
  }

  const departDrive =
    Number(document.getElementById("departDrive").value);

  const arrivalDrive =
    Number(document.getElementById("arrivalDrive").value);

  const buffer =
    Number(document.getElementById("buffer").value);

  const oneWayDuration =
      flightTime
    + (departDrive / 60)
    + (arrivalDrive / 60)
    + (buffer / 60);

  const oneWayTrips =
    Math.floor(totalHours / oneWayDuration);

  const roundTrips =
    Math.floor(totalHours / (oneWayDuration * 2));

  document.getElementById("flightTime").innerHTML =
    `Flight Time: ${flightTime.toFixed(1)} hours`;

  document.getElementById("oneWay").innerHTML =
    `✈️ One-Way Trips Possible: <strong>${oneWayTrips}</strong>`;

  document.getElementById("roundTrip").innerHTML =
    `🔁 Round Trips Possible: <strong>${roundTrips}</strong>`;

  document.getElementById("funFact").innerHTML =
    `🎉 You could have flown from ${from} to ${to} ${oneWayTrips} times.`;
}
