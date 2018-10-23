var grayscaleFilter = document.getElementById('grayscale');
var imageArray;

function drawImg() {
    for (i = 0; i < imageArray.length; i++) {
        for (j = 0; j < imageArray[i].length; j++) {
            canvasArray[0].context.fillStyle = "rgb(" + imageArray[i][j].r + "," + imageArray[i][j].g + "," + imageArray[i][j].b + ")";
            canvasArray[0].context.fillRect(i, j, 1, 1);
        }
    }
}

function getPixelMatrix(c, sx, sy, ex, ey, w, h, t) {
    var d;
    d = c.getImageData(sx, sy, w, h).data;
    var pM = [];
    for (var i = 0; i <= ex; i++) {
        var pMJ = [];
        for (var j = 0; j <= ey; j++) {
            var cI = (i * 4) + j * (w * 4);
            pMJ.push(t(d[cI], d[cI + 1], d[cI + 2], d[cI + 3]));
        }
        pM.push(pMJ);
    }
    return pM;
}

function rgba(context, width, height) {
    RGBAdata = getPixelMatrix(context, 0, 0, width - 1, height - 1, width, height, (r, g, b, a) => { return { r:0.3*r, g:0.5*g, b:0.1*b, a } }); 
    return RGBAdata;
}

grayscaleFilter.onclick = function() {
    imageArray = rgba(canvasArray[0].context, canvasArray[0].canvas.width, canvasArray[0].canvas.height);
    removeL();
    addL();
    drawImg();
}