const locationButton = document.getElementById("locationButton");
const saveButton = document.getElementById("saveButton");

locationButton.addEventListener("click", function(){getLocation()});
saveButton.addEventListener("click", function() {
  leafletImage(map, function (err, canvas) {
    // here we have the canvas
    let rasterMap = document.getElementById("liveMap");
    let rasterContext = rasterMap.getContext("2d");

    rasterContext.drawImage(canvas, 0, 0, 300, 150);
});
})

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


function getLocation() {
    if (! navigator.geolocation) {
        alert("Sorry, no geolocation available for you!");
    }

    navigator.geolocation.getCurrentPosition((position) => {
        document.getElementById("latitude").innerText = position.coords.latitude;
        document.getElementById("longitude").innerText = position.coords.longitude;

        let map = L.map('liveMap').setView([position.coords.latitude, position.coords.longitude], 13);
        L.tileLayer.provider('Esri.WorldImagery').addTo(map);
        let marker = L.marker([position.coords.latitude, position.coords.longitude]).addTo(map);
        marker.bindPopup("<strong>Hello!</strong><br>This is a popup.");
        map.setView([position.coords.latitude, position.coords.longitude]);
    }, (positionError) => {
        console.error(positionError);
    }, {
        enableHighAccuracy: false
    });
}