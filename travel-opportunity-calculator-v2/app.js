const airportData={
LAX:{name:'Los Angeles International',lat:33.9425,lon:-118.4081},
HND:{name:'Tokyo Haneda',lat:35.5494,lon:139.7798},
NRT:{name:'Tokyo Narita',lat:35.772,lon:140.3929},
LHR:{name:'London Heathrow',lat:51.47,lon:-0.4543},
CDG:{name:'Paris Charles de Gaulle',lat:49.0097,lon:2.5479},
ICN:{name:'Seoul Incheon',lat:37.4602,lon:126.4407},
TPE:{name:'Taipei Taoyuan',lat:25.0797,lon:121.2342},
JFK:{name:'New York JFK',lat:40.6413,lon:-73.7781}
};

function hav(a,b,c,d){const R=3959;const dLat=(c-a)*Math.PI/180;const dLon=(d-b)*Math.PI/180;const x=Math.sin(dLat/2)**2+Math.cos(a*Math.PI/180)*Math.cos(c*Math.PI/180)*Math.sin(dLon/2)**2;return R*2*Math.atan2(Math.sqrt(x),Math.sqrt(1-x));}

Object.entries(airportData).forEach(([c,a])=>{
from.add(new Option(`${a.name} (${c})`,c));
to.add(new Option(`${a.name} (${c})`,c));
});
new TomSelect('#from'); new TomSelect('#to');
from.value='LAX'; to.value='HND';

function calculateTrips(){
const total=+hours.value + (+minutes.value/60);
const f=airportData[from.value], t=airportData[to.value];
const dist=hav(f.lat,f.lon,t.lat,t.lon);
const flight=(dist/550)+1.5;
const ow=Math.floor(total/flight);
const rt=Math.floor(total/(flight*2));
funFact.innerHTML=`With ${total.toFixed(2)} hours, you could have flown from <b>${from.value}</b> to <b>${to.value}</b> <b>${ow}</b> times.`;
oneWay.textContent=ow; roundTrip.textContent=rt;
flightTime.textContent=flight.toFixed(1); distance.textContent=Math.round(dist).toLocaleString();
comparisons.innerHTML='<ul>'+Object.entries(airportData).filter(([k])=>k!==from.value).slice(0,5).map(([k,a])=>{
const d=hav(f.lat,f.lon,a.lat,a.lon);
const trips=Math.floor(total/((d/550)+1.5));
return `<li>${a.name} (${k}) — <b>${trips}</b> one-way flights</li>`;
}).join('')+'</ul>';
}
calculateTrips();
