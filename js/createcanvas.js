var canvasWrapper = document.getElementsByClassName('canvas-wrapper')[0];

function createCanvas(brushColor) {
    this.canvas = document.createElement('canvas');
    this.canvasWrapper = canvasWrapper;
    this.canvasWrapper.appendChild(this.canvas);
    this.canvas.height = this.canvasWrapper.offsetHeight;
    this.canvas.width = this.canvasWrapper.offsetWidth;
    this.canvas.style.position = 'absolute';
    this.canvas.style.border = '1px solid black';
    this.brushColor = brushColor;
    this.flag = false;
    this.context = this.canvas.getContext('2d');
    this.context.lineWidth = 20;
    this.event;

    that = this;

    this.plotPoints = function(event) {
        if (this.flag) {
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
        this.flag = true;
        that.plotPoints(event);
    }

    this.disableFlag = function() {
        this.flag = false;
        that.context.beginPath();
    }

    this.canvas.addEventListener('mousemove', this.plotPoints);
    this.canvas.addEventListener('mousedown', this.enableFlag);
    this.canvas.addEventListener('mouseup', this.disableFlag);
}