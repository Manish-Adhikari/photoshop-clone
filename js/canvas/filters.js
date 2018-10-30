let grayscale = document.getElementById('grayscale');
let sepia = document.getElementById('sepia');
let newF = document.getElementById('new-filter');
let sunglassF = document.getElementById('sunglass');

class filters {
    constructor() {
        this.grayscale = grayscale;
        this.sepia = sepia;
        this.newF = newF;
        this.sunglassF = sunglassF;
    }

    grayscaleFilter(currentLayer) {
        this.currentLayer = currentLayer;
        this.imgDatas(this.currentLayer);
        this.RGBAdata = this.getPixelMatrix(this.context, 0, 0, this.width - 1, this.height - 1, this.width, this.height, (r, g, b, a) => { var grey = 0.21 * r + 0.72 * g + 0.07 * b; return { r: grey, g: grey, b: grey, a } });
        this.drawImg(this.RGBAdata, this.currentLayer);
    }
    
    sunglassFilter(currentLayer) {
        console.log(currentLayer);
        let videoImage = new IMG(currentLayer.artBoard.canvas);
        videoImage.initImage();
        let faceMatrix = videoImage.faceMatrix();
        let smoothedFace = videoImage.smoothFacePixels(faceMatrix);
    ///    videoImage.plotInCanvas(faceMatrixCanvas,smoothedFace,true);
        let faceCoordinates = videoImage.findVerticesFromBinary(smoothedFace);

        let probableEyeCoordinate = videoImage.probableEyeCoordinates(faceCoordinates);
        videoImage.context.drawImage(sunglass,probableEyeCoordinate.x,probableEyeCoordinate.y,probableEyeCoordinate.width,probableEyeCoordinate.height);

    }

    sepiaFilter(currentLayer) {
        this.currentLayer = currentLayer;
        this.imgDatas(this.currentLayer);
        this.RGBAdata = this.getPixelMatrix(this.context, 0, 0, this.width - 1, this.height - 1, this.width, this.height,
            (r, g, b, a) => {
                let tr = 0.393*r + 0.769*g + 0.189*b;
                let tg = 0.349*r + 0.686*g + 0.168*b;
                let tb = 0.272*r + 0.534*g + 0.131*b;
                return { r: tr, g: tg, b: tb, a }
            });
        this.drawImg(this.RGBAdata, this.currentLayer);
    }

    newFilter(currentLayer) {
        this.currentLayer = currentLayer;
        this.imgDatas(this.currentLayer);
        this.RGBAdata = this.getPixelMatrix(this.context, 0, 0, this.width - 1, this.height - 1, this.width, this.height,
            (r, g, b, a) => {
                let tr = 0.349*r + 0.686*g + 0.168*b;
                let tg = 0.272*r + 0.534*g + 0.131*b;
                let tb = 0.393*r + 0.769*g + 0.189*b;
                return { r: tr, g: tg, b: tb, a }
            });
        this.drawImg(this.RGBAdata, this.currentLayer);
    }

    getPixelMatrix(c, sx, sy, ex, ey, w, h, t) {
        let d;
        d = c.getImageData(sx, sy, w, h).data;
        let pM = [];
        for (let i = 0; i <= ex; i++) {
            let pMJ = [];
            for (let j = 0; j <= ey; j++) {
                let cI = (i * 4) + j * (w * 4);
                pMJ.push(t(d[cI], d[cI + 1], d[cI + 2], d[cI + 3]));
            }
            pM.push(pMJ);
        }
        return pM;
    }

    imgDatas(currentLayer) {
        this.context = currentLayer.artBoard.context;
        this.width = currentLayer.artBoard.canvas.width;
        this.height = currentLayer.artBoard.canvas.height;
        console.log(this.width);
    }

    drawImg(RGBAdata, currentLayer) {
        this.imageArray = RGBAdata;
        for (let i = 0; i < this.imageArray.length; i++) {
            for (let j = 0; j < this.imageArray[i].length; j++) {
                currentLayer.artBoard.context.fillStyle = "rgba(" + this.imageArray[i][j].r + "," + this.imageArray[i][j].g + "," + this.imageArray[i][j].b + "," + this.imageArray[i][j].a + ")";
                currentLayer.artBoard.context.fillRect(i, j, 1, 1);
            }
        }
    }
}