var backgroundCanvas = document.getElementById('new-file');
var backgroundFlag = false;

backgroundCanvas.onclick = function() {
		bgToggleFlag = true;
        backgroundCanvas = new createCanvas();
        backgroundCanvas.context.fillStyle = "white";
		backgroundCanvas.context.fillRect(0, 0, backgroundCanvas.canvas.width, backgroundCanvas.canvas.height);
       // backgroundCanvas.canvas.style.zIndex = '0';
        canvasArray.push(backgroundCanvas);
  		console.log('adfasdfas');	
  		backgroundFlag = true;	
}
