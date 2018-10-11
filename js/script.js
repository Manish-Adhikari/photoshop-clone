var canvasWrapper = document.getElementsByClassName('canvas-wrapper')[0];
var canvas = document.createElement('canvas');
canvasWrapper.appendChild(canvas);
canvas.height = canvasWrapper.offsetHeight;
canvas.width = canvasWrapper.offsetWidth;
canvas.style.border = '1px solid black';
canvas.style.background = 'white';

var flag = false;

var context = canvas.getContext('2d');
context.lineWidth = 20;

var plotPoints = function(event) {
    if (flag) {
        context.lineTo(event.offsetX, event.offsetY)
        context.stroke();
        context.beginPath();
        context.arc(event.offsetX, event.offsetY, 10, 0, 2 * Math.PI);
        context.fill();
        context.beginPath();
        context.moveTo(event.offsetX, event.offsetY)
    }    
}

function enableFlag(event) {
    flag = true;
    plotPoints(event);
}

function disableFlag() {
    flag = false;
    context.beginPath();
    console.log(flag);
}

canvas.addEventListener('mousemove', plotPoints);
canvas.addEventListener('mousedown', enableFlag);
canvas.addEventListener('mouseup', disableFlag);