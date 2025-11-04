const locationButton = document.getElementById("locationButton");
const saveButton = document.getElementById("saveButton");

locationButton.addEventListener("click", function(){getLocation()});

if (!("Notification" in window)) {
    alert("This browser does not support desktop notification");
} else if (Notification.permission === "granted") {
    const notification = new Notification("Hi there!");
} else if (Notification.permission !== "denied") {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        const notification = new Notification("Hi there!");
      }
    });
}

function saveMap(map, canvas) {
    leafletImage(map, function (err, canvas){
    // here we have the canvas
    let rasterMap = document.getElementById("liveMap");
    let rasterContext = rasterMap.getContext("2d");

    rasterContext.drawImage(canvas, 0, 0, 400, 400);
});
}


function getLocation() {
    if (! navigator.geolocation) {
        alert("Sorry, no geolocation available for you!");
    }

    navigator.geolocation.getCurrentPosition((position) => {
      let latitude = position.coords.latitude;
      let longitude = position.coords.longitude;
      document.getElementById("latitude").innerText = latitude;
      document.getElementById("longitude").innerText = longitude;

      let map = L.map('liveMap').setView([latitude, longitude], 13);
      L.tileLayer.provider('Esri.WorldImagery').addTo(map);
      let marker = L.marker([latitude, longitude]).addTo(map);
      marker.bindPopup("<strong>Hello!</strong><br>This is a popup.");
      map.setView([latitude, longitude]);

      saveButton.addEventListener("click", function() {saveMap(map, document.getElementById("savedMapImage"))});
    }, (positionError) => {
        console.error(positionError);
    }, {
        enableHighAccuracy: false
    });
}