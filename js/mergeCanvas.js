var canvasMerge = document.getElementById('merge');

canvasMerge.onclick = function() {
    var newCanvas = new createCanvas('red');
    var length = canvasArray.length;

    for (var i = 0; i < canvasArray.length; i++) {
        newCanvas.context.drawImage(canvasArray[i].canvas, 0, 0);
    }

    for (var i = canvasArray.length; i > 0; i--) {
        lastElement = canvasArray[i - 1];
        lastElement.canvas.remove();
        lastElement.layerDiv.remove();
    }
    canvasArray = [];
    canvasArray.push(newCanvas);
    layerIndex = 1;
    console.log(canvasArray);
}
