var addLayer = document.getElementsByClassName('plus-button')[0];
var removeLayer = document.getElementsByClassName('minus-button')[0];
var myCanvas;
var layerIndex = 0;
var canvasArray = [];
var lastElement;
var brushColor;
var colorArray = ['red',
    'blue',
    'green',
    'pink',
    'brown',
    'yellow',
    'purple',
    'grey'
]

addLayer.onclick = function() {
    checkFlag();
    if (backgroundFlag) {
        addL();
    }
}

function removeSelectedLayer(index) {
    checkFlag();
    if (backgroundFlag) {
        console.log('layer removed: ' + index);
        removeL();
        //layersReset();
    }
}

function checkFlag() {
    if (layerIndex <= 0) {
        backgroundFlag = false;
        layerIndex = 0;
    }
}

function addL() {
    console.log('layer added: ' + layerIndex);
    brushColor = colorArray[Math.floor(Math.random() * colorArray.length)];
    myCanvas = new createCanvas(brushColor, layerIndex);
    canvasArray.push(myCanvas);
    layerIndex++;
}

function removeL() {
    lastElement = canvasArray[canvasArray.length - 1];
    lastElement.canvas.remove();
    lastElement.layerDiv.remove();
    canvasArray.splice(-1, 1);
    layerIndex--;
}

// function layersReset() {
// console.log(layerIndex);
// for(var i = 0; i < layerIndex; i++) {
//     canvasArray[i].layerIndex = i;
// canvasArray[i].textHere = document.createTextNode('Layer ' + i);
// console.log('real index' + canvasArray[i].layerIndex);
//     }
// }