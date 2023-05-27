

// create new spot fetch requests 
fetch('/api/users', 
{ method: 'POST', 
headers: { "Content-Type": "application/json","XSRF-TOKEN":  "MWMEA2oH-uGsK83xcHjWFh85vrsePqI-Wzy0"}, 
body: JSON.stringify({
    "address": "123 Disney Lane",
    "city": "San Francisco",
    "state": "California",
    "country": "United States of America",
    "lat": 37.7645358,
    "lng": -122.4730327,
    "name": "App Academy",
    "description": "Place where web developers are created",
    "price": 123
  }) })
.then(res => res.json()).then(data => console.log(data));

// test add image to spot fetch request
fetch('api/spots/:id/images', 
{ method: 'POST', 
headers: { "Content-Type": "application/json","XSRF-TOKEN":  "MWMEA2oH-uGsK83xcHjWFh85vrsePqI-Wzy0"}, 
body: JSON.stringify({
    "url": "image url",
    "preview": true
  }) })
.then(res => res.json()).then(data => console.log(data));



