var backgroundCanvas = document.getElementById('new-file');
var backgroundFlag = false;

backgroundCanvas.onclick = function() {
		bgToggleFlag = true;
        backgroundCanvas = new createCanvas('blue', layerIndex);
        backgroundCanvas.context.fillStyle = "white";
		backgroundCanvas.context.fillRect(0, 0, backgroundCanvas.canvas.width, backgroundCanvas.canvas.height);
        canvasArray.push(backgroundCanvas);
        layerIndex++;
  		console.log('Default background added');	
  		backgroundFlag = true;	
}
