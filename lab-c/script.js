const locationButton = document.getElementById("locationButton");
const saveButton = document.getElementById("saveButton");
var currTile;
var otherTile;

locationButton.addEventListener("click", function(){getLocation()});

if (!("Notification" in window)) {
    alert("This browser does not support desktop notification");
} else if (Notification.permission === "granted") {
    const notification = new Notification("Puzzle finished!");
} else if (Notification.permission !== "denied") {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        const notification = new Notification("Puzzle finished!");
      }
    });
}

function createPuzzle() {
    // clear whatever is in the 3rd and 4th canvas
    document.getElementById('shuffledPuzzle').innerHTML = "";
    document.getElementById('finishedPuzzle').innerHTML = "";

    // cut the image
    let numColsToCut = 4;
    let numRowsToCut = 4;
    let widthOfOnePiece = 100;
    let heightOfOnePiece = 100;
    var puzzlePieces = [];
    for(var x = 0; x < numColsToCut; ++x) {
        for(var y = 0; y < numRowsToCut; ++y) {
            var canvas = document.createElement('canvas');
            canvas.setAttribute("id", "puzzlePiece");
            canvas.setAttribute("draggable", "true");
            canvas.width = widthOfOnePiece;
            canvas.height = heightOfOnePiece;
            var context = canvas.getContext('2d');
            context.drawImage(document.getElementById("savedMapImage"), x * widthOfOnePiece, y * heightOfOnePiece, widthOfOnePiece, heightOfOnePiece, 0, 0, canvas.width, canvas.height);

            //DRAG FUNCTIONALITY
            canvas.addEventListener("dragstart", dragStart); //click on image to drag
            canvas.addEventListener("dragover", dragOver);   //drag an image
            canvas.addEventListener("dragenter", dragEnter); //dragging an image into another one
            canvas.addEventListener("dragleave", dragLeave); //dragging an image away from another one
            //canvas.addEventListener("drop", dragDrop);       //drop an image onto another one
            canvas.addEventListener("dragend", dragEnd);      //after you completed dragDrop

            puzzlePieces.push(canvas);
        }
    }

    // randomize

    // put the pieces into the 3rd window
    for (var i = 0; i < 16; i++) {
        document.getElementById("shuffledPuzzle").appendChild(puzzlePieces[i]);
    }

    // create blank canvas in the 4th window
    for (var i = 0; i < 16; ++i) {
        var canvas = document.createElement('canvas');
        canvas.setAttribute("id", "blank");
        //canvas.setAttribute("draggable", "true");

        canvas.width = widthOfOnePiece;
        canvas.height = heightOfOnePiece;
        var context = canvas.getContext('2d');

        //DRAG FUNCTIONALITY
        canvas.addEventListener("dragstart", dragStart); //click on image to drag
        canvas.addEventListener("dragover", dragOver);   //drag an image
        canvas.addEventListener("dragenter", dragEnter); //dragging an image into another one
        canvas.addEventListener("dragleave", dragLeave); //dragging an image away from another one
        canvas.addEventListener("drop", dragDrop);       //drop an image onto another one
        canvas.addEventListener("dragend", dragEnd);      //after you completed dragDrop

        document.getElementById("finishedPuzzle").appendChild(canvas);
    }
}

function saveMap(this_map, canvas) {
    leafletImage(this_map, function (err, canvas){
    // here we have the canvas
    let rasterMap = document.getElementById("savedMapImage");
    let rasterContext = rasterMap.getContext("2d");
    rasterMap.width = 400;
    rasterMap.height = 400;

    rasterContext.drawImage(canvas, 0, 0, 400, 400);
    createPuzzle();
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


//DRAG TILES
function dragStart(e) {
    e.dataTransfer.setData("draggedImageId", e.target.id);
}

function dragOver(e) {
    e.preventDefault();
}

function dragEnter(e) {
    e.preventDefault();
}

function dragLeave() {

}

function dragDrop(e) {
    e.preventDefault();


    const draggedImageId = e.dataTransfer.getData("draggedImageId");
    const draggedImage = document.getElementById(draggedImageId);
    const toContainer = e.currentTarget.firstElementChild;

    let tmp = e.currentTargetfirstElementChild;
    e.currentTarget.replaceWith(draggedImage);
    draggedImage.replaceWith(tmp);
}

function dragEnd(e) {
    /*
    const draggedImageId = e.dataTransfer.getData("draggedImageId");
    const draggedImage = document.getElementById(draggedImageId);
    const toContainer = e.currentTarget;

    let tmp = e.currentTarget;
    e.currentTarget.replaceWith(draggedImage);
    draggedImage.replaceWith(tmp); */


}