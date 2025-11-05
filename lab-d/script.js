let addressInput = document.getElementById("addressInput");
const APIKey = "cc3226c76c8a31144a7ca830094bc5ba";
//let currentAPIKey = 
//let weather5APIKey =
let lattitude = 0;
let longitude = 0;
// http://api.openweathermap.org/geo/1.0/direct?q=London&limit=5&appid=APIKey

function SearchWeather(){
    // search for city lattitude and longitude
    if (addressInput.value != null) {
        let req = new XMLHttpRequest();
        let URL = "http://api.openweathermap.org/geo/1.0/direct?q=" + addressInput.value + "&limit=1&appid=" + APIKey;
        let response = [];

        req.open("GET", URL, true);
        req.addEventListener("load", function(event) {
            response = req.responseText;
        });
        req.send(null);

        if (response.length == 0) {
            console.log("heh");
        }
        else {
            
        }
    }
}

function AddressInputKeyDown(text) {
    if(event.key === 'Enter') {
        SearchWeather();   
    }
}