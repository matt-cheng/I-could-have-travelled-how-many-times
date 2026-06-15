let airports={};

fetch('airports.json')
.then(r=>r.json())
.then(data=>{
  airports=data;
  const list=document.getElementById('airportList');
  Object.entries(data).forEach(([code,a])=>{
    const option=document.createElement('option');
    option.value=code;
    option.label=`${a.name} (${code})`;
    list.appendChild(option);
  });
  calculateTrips();
});

function haversine(lat1,lon1,lat2,lon2){
 const R=3959;
 const dLat=(lat2-lat1)*Math.PI/180;
 const dLon=(lon2-lon1)*Math.PI/180;
 const a=Math.sin(dLat/2)**2+Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
 return R*(2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a)));
}

function calculateTrips(){
 const from=document.getElementById('from').value.toUpperCase()||'LAX';
 const to=document.getElementById('to').value.toUpperCase()||'HND';
 if(!airports[from]||!airports[to]) return;

 const totalHours=Number(hours.value)+(Number(minutes.value)/60);

 const dist=haversine(
   airports[from].lat,airports[from].lon,
   airports[to].lat,airports[to].lon
 );

 const flightTime=(dist/550)+1.5;

 const oneWay=Math.floor(totalHours/flightTime);
 const roundTrip=Math.floor(totalHours/(flightTime*2));

 funFact.innerHTML=`🎉 With ${totalHours.toFixed(2)} hours available, you could have flown from <b>${from}</b> to <b>${to}</b> <b>${oneWay}</b> times.`;
 oneWay.innerHTML=`✈️ One-Way Trips Possible: <b>${oneWay}</b>`;
 roundTrip.innerHTML=`🔁 Round Trips Possible: <b>${roundTrip}</b>`;
 flightTime.innerHTML=`Flight Time Estimate: ${flightTime.toFixed(1)} hours`;
 distance.innerHTML=`Distance: ${Math.round(dist).toLocaleString()} miles`;

 const picks=Object.entries(airports).filter(([k])=>k!==from).sort(()=>Math.random()-0.5).slice(0,5);
 comparisons.innerHTML="<ul>"+picks.map(([code,a])=>{
   const d=haversine(airports[from].lat,airports[from].lon,a.lat,a.lon);
   const trips=Math.floor(totalHours/((d/550)+1.5));
   return `<li>${a.name} (${code}) — <b>${trips}</b> one-way flights</li>`;
 }).join("")+"</ul>";
}
