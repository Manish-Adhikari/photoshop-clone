let canvasWrapper = document.getElementsByClassName('canvas-wrapper')[0];
let colorArray = ['red',
    'blue',
    'green',
    'pink',
    'brown',
    'yellow',
    'purple',
    'grey'
];

class artBoard {

    constructor(index) {
        this.cIndex = index || 0;
        this.canvas = document.createElement('canvas');
        this.canvasWrapper = canvasWrapper;
        this.canvasWrapper.appendChild(this.canvas);
        this.canvas.height = this.canvasWrapper.offsetHeight;
        this.canvas.width = this.canvasWrapper.offsetWidth;
        this.canvas.style.position = 'absolute';
        //this.canvas.style.backgroundColor = "#FFF";
        this.context = this.canvas.getContext('2d');
        this.flag = false;
        this.brushColor = colorArray[Math.floor(Math.random() * colorArray.length)];;
        this.context.lineWidth = 20;

        this.canvas.addEventListener('mousemove', (e) => this.plotPoints(e, this));
        this.canvas.addEventListener('mousedown', (e) => this.enableFlag(e, this));
        this.canvas.addEventListener('mouseup', (e) => this.disableFlag(this));
    }

    plotPoints(event, that) {
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

    enableFlag(event, that) {
        that.flag = true;
        that.plotPoints(event, that);
    }

    disableFlag(that) {
        that.flag = false;
        that.context.beginPath();
    }
}