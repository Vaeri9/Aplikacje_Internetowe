const locationButton = document.getElementById("locationButton");
const saveButton = document.getElementById("saveButton");
var currTile;
var otherTile;

locationButton.addEventListener("click", function(){getLocation()});

if (!("Notification" in window)) {
    alert("This browser does not support desktop notification");
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
    let id = 0;
    for(var y = 0; y < numRowsToCut; ++y) {
        for(var x = 0; x < numColsToCut; ++x) {
            var canvas = document.createElement('canvas');
            canvas.setAttribute("id", id.toString());
            canvas.setAttribute("class", "puzzlePiece");
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
            canvas.addEventListener("drop", dragDrop);       //drop an image onto another one
            canvas.addEventListener("dragend", dragEnd);      //after you completed dragDrop

            puzzlePieces.push(canvas);
            id++;
        }
    }

    // randomize
    var indexes = [];
    for (var i = 0; i < 16; i++) { indexes[i] = i;}
    for (var i = indexes.length; i > 1; i--) {
        var r = Math.floor(Math.random() * i);
        var temp = indexes[r];
        indexes[r] = indexes[i-1];
        indexes[i-1] = temp;
    }

    // put the pieces into the 3rd window
    for (var i = 0; i < 16; i++) {
        document.getElementById("shuffledPuzzle").appendChild(puzzlePieces[indexes[i]]);
    }

    // create blank canvas in the 4th window
    for (var i = 0; i < 16; ++i) {
        var canvas = document.createElement('canvas');
        canvas.setAttribute("class", "blank");
        canvas.setAttribute("id", (i + 17).toString());
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
    e.dataTransfer.clearData();
    e.dataTransfer.setData("text", e.target.id);
}

function dragOver(e) {
    e.preventDefault();
}

function dragEnter(e) {
    e.preventDefault();
}

function dragLeave(e) {
    e.preventDefault();
}

function dragDrop(e) {
    e.preventDefault();

    const draggedImageId = e.dataTransfer.getData("text");
    const draggedImage = document.getElementById(draggedImageId);

    let tmp1 = cloneCanvas(e.target);
    let tmp2 = cloneCanvas(draggedImage);
    
    tmp1.setAttribute("draggable", "true");
    tmp1.addEventListener("dragstart", dragStart); //click on image to drag
    tmp1.addEventListener("dragover", dragOver);   //drag an image
    tmp1.addEventListener("dragenter", dragEnter); //dragging an image into another one
    tmp1.addEventListener("dragleave", dragLeave); //dragging an image away from another one
    tmp1.addEventListener("drop", dragDrop);       //drop an image onto another one
    tmp1.addEventListener("dragend", dragEnd);      //after you completed dragDrop

    tmp2.setAttribute("draggable", "true");
    tmp2.addEventListener("dragstart", dragStart); //click on image to drag
    tmp2.addEventListener("dragover", dragOver);   //drag an image
    tmp2.addEventListener("dragenter", dragEnter); //dragging an image into another one
    tmp2.addEventListener("dragleave", dragLeave); //dragging an image away from another one
    tmp2.addEventListener("drop", dragDrop);       //drop an image onto another one
    tmp2.addEventListener("dragend", dragEnd);      //after you completed dragDrop

    e.target.replaceWith(tmp2);
    draggedImage.replaceWith(tmp1);

    checkPuzzle();
}

function dragEnd(e) {
    e.preventDefault();
}

function checkPuzzle() {
    var mistake = 0;
    var i = 0;
    for (const child of finishedPuzzle.children) {
        if (Number(child.id) != i) {
            mistake = 1;
        }
        i++;
    }

    if (mistake) {
        console.log("Puzzle not finished");
    }
    else {console.log("Puzzle finished");
        const notification = new Notification("Puzzle finished!");
    }
}

function cloneCanvas(oldCanvas) {
    //create a new canvas
    var newCanvas = document.createElement('canvas');
    var context = newCanvas.getContext('2d');
    newCanvas.setAttribute("id", oldCanvas.id);
    newCanvas.setAttribute("class", oldCanvas.className);

    //set dimensions
    newCanvas.width = oldCanvas.width;
    newCanvas.height = oldCanvas.height;

    //apply the old canvas to the new one
    context.drawImage(oldCanvas, 0, 0);

    //return the new canvas
    return newCanvas;
}