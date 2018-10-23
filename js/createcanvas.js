var canvasWrapper = document.getElementsByClassName('canvas-wrapper')[0];
var layersWrapper = document.getElementsByClassName('layers-wrapper')[0];

function createCanvas(brushColor, layerIndex) {
    this.canvas = document.createElement('canvas');
    this.canvasWrapper = canvasWrapper;
    this.canvasWrapper.appendChild(this.canvas);
    this.canvas.height = this.canvasWrapper.offsetHeight;
    this.canvas.width = this.canvasWrapper.offsetWidth;
    this.canvas.style.position = 'absolute';
    this.canvas.style.zIndex = '1';
    this.brushColor = brushColor || 'blue';
    this.flag = false;
    this.context = this.canvas.getContext('2d');
    this.context.lineWidth = 20;
    this.layerIndex = layerIndex || 0;

    this.layerDiv = document.createElement('div');
    this.layersWrapper = layersWrapper;
    this.layersWrapper.appendChild(this.layerDiv);
    this.layerDiv.style.height = '30px';
    this.layerDiv.style.width = '100%';
    this.layerDiv.style.background = 'lightgrey';
    if (bgToggleFlag) {
        this.textHere = document.createTextNode('Background');
        bgToggleFlag = false;
    } else {
        this.textHere = document.createTextNode('Layer ' + this.layerIndex);
    }
    this.layerDiv.style.marginBottom = '3px';
    this.layerDiv.style.textAlign = 'center';
    this.layerDiv.style.paddingTop = '10px';
    this.layerDiv.appendChild(this.textHere);

    that = this;

    (function(myLayer, myCanvas, index, brushColor) {
        myLayer.onclick = function() {
            that.resetZindex();
            myLayer.style.border = '1px solid black';
            myLayer.style.background = 'white';
            myCanvas.style.zIndex = '1';
            myCanvas.style.position = 'absolute';
            console.log('Layer selected: ' + index);
            that.brushColor = brushColor;
            that.context = myCanvas.getContext('2d');
            removeLayer.onclick = function() {
                removeSelectedLayer(index);
            }
        }
    })(this.layerDiv, this.canvas, this.layerIndex, this.brushColor);

    this.plotPoints = function(event) {
        if (that.flag) {
            that.context.fill();
            that.context.fillStyle = that.brushColor;
            that.context.lineTo(event.offsetX, event.offsetY)
            that.context.stroke();
            that.context.strokeStyle = that.brushColor;
            that.context.beginPath();
            that.context.arc(event.offsetX, event.offsetY, 10, 0, 2 * Math.PI);
            that.context.fill();
            that.context.fillStyle = that.brushColor;
            that.context.beginPath();
            that.context.moveTo(event.offsetX, event.offsetY)
        }
    }

    this.enableFlag = function(event) {
        that.flag = true;
        that.plotPoints(event);
    }

    this.disableFlag = function() {
        that.flag = false;
        that.context.beginPath();
    }

    this.resetZindex = function() {
        for (var i = 0; i < canvasArray.length; i++) {
            canvasArray[i].canvas.style.zIndex = '0';
            canvasArray[i].layerDiv.style.border = 'none';
            canvasArray[i].layerDiv.style.background = 'lightgrey';
        }
    }

    this.canvas.addEventListener('mousemove', this.plotPoints);
    this.canvas.addEventListener('mousedown', this.enableFlag);
    this.canvas.addEventListener('mouseup', this.disableFlag);
}