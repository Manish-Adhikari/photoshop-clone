var addLayer = document.getElementsByClassName('plus-button')[0];
var removeLayer = document.getElementsByClassName('minus-button')[0];
var myCanvas;
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
    console.log('layer added');
    brushColor = colorArray[Math.floor(Math.random()*colorArray.length)];
    console.log(brushColor);
    myCanvas = new createCanvas(brushColor);
    canvasArray.push(myCanvas);
    console.log(canvasArray);
}

removeLayer.onclick = function() {
    console.log('layer removed');
    lastElement = canvasArray[canvasArray.length - 1];
    lastElement.canvas.remove();
    canvasArray.splice(-1, 1);
    console.log(canvasArray);
}