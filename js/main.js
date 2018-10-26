let addLayer = document.getElementsByClassName('plus-button')[0];
let removeLayer = document.getElementsByClassName('minus-button')[0];
let upArrow = document.getElementsByClassName('up-arrow')[0];
let lowerArrow = document.getElementsByClassName('lower-arrow')[0];
let addImage = document.getElementById('add-image');

class mainFile {
    constructor() {
        this.layerArray = [];
        //this.history = [];
        this.addLayer = addLayer;
        this.removeLayer = removeLayer;
        this.upArrow = upArrow;
        this.lowerArrow = lowerArrow;
        this.addImage = addImage;
        this.filter = new filters();
        this.merge = new merge();
        this.download = new download();
        //this.history = new history();

        this.addLayer.addEventListener("click", (this.createNew = event => {
            let layers = new layer(this.layerArray.length);

            this.layerArray.push(layers);
            this.resetLayers();
            this.currentLayer = layers;
            this.currentLayer.artBoard.brushFlag = true;
            this.currentLayer.artBoard.context.lineWidth = 20;
            //this.history = [];
            this.resetLayerBg();
            layers.layerDiv.style.backgroundColor = '#FFF';

            layers.layerDiv.addEventListener("click", event => {
                this.resetLayerBg();
                this.currentLayer = layers;
                //this.history = [];
                console.log(this.currentLayer.artBoard.cIndex);
                this.currentLayer.layerDiv.style.backgroundColor = "#FFF";
            });

            //this.history.push(this.currentLayer.artBoard.canvas.toDataURL());
        }));

        this.removeLayer.addEventListener("click", event => {
            if (this.layerArray.length > 0) {
                layersWrapper.removeChild(this.currentLayer.layerDiv);
                canvasWrapper.removeChild(this.currentLayer.artBoard.canvas);
                this.layerArray.splice(this.layerArray.indexOf(this.currentLayer), 1);
                if (this.layerArray.length != 0) {
                    this.currentLayer = this.layerArray[this.layerArray.length - 1];
                }
                //this.history = [];
                //this.history.push(this.currentLayer.artBoard.canvas.toDataURL());
                this.resetLayers();
            }
        });

        this.upArrow.addEventListener("click", event => {
            if (
                this.layerArray.length > 1 &&
                this.layerArray.indexOf(this.currentLayer) != 0
            ) {
                let position = this.layerArray.indexOf(this.currentLayer);
                let temp = this.layerArray[position];
                this.layerArray[position] = this.layerArray[position - 1];
                this.layerArray[position - 1] = temp;
                this.resetLayers();
            }
        });

        this.lowerArrow.addEventListener("click", event => {
            if (
                this.layerArray.length > 1 &&
                this.layerArray.indexOf(this.currentLayer) != this.layerArray.length - 1
            ) {
                let position = this.layerArray.indexOf(this.currentLayer);
                let temp = this.layerArray[position];
                this.layerArray[position] = this.layerArray[position + 1];
                this.layerArray[position + 1] = temp;
                this.resetLayers();
            }
        });

        this.filter.grayscale.addEventListener("click", event => {
            this.filter.grayscaleFilter(this.currentLayer);

        });

        this.merge.layersMerge.addEventListener("click", event => {
            let newLayer = this.layerArray[0];
            let temp;
            for (let i = 0; i < this.layerArray.length; i++) {
                newLayer.artBoard.context.drawImage(this.layerArray[i].artBoard.canvas, 0, 0);
            }

            for (let i = this.layerArray.length; i > 1; i--) {
                let lastElement = this.layerArray[i - 1];
                lastElement.artBoard.canvas.remove();
                lastElement.layerDiv.remove();
                this.layerArray.splice(this.layerArray.indexOf(i), 1);
            }
            this.resetLayers();
        });

        this.download.downloadCanvas.addEventListener("click", event => {
            this.download.download(this.currentLayer.artBoard.canvas, 'myimage.png');
        });

        document.onkeydown = (e) => {
            let evtobj = window.event ? event : e
            if (evtobj.keyCode == 90 && evtobj.ctrlKey) {
                console.log('pressed');
            }
        }

        this.addImage.addEventListener("change", event => {
            let layers = new layer(this.layerArray.length);
            let files, file, reader, myCtx, f;
            this.layerArray.push(layers);
            this.resetLayers();
            this.currentLayer = layers;
            this.currentLayer.artBoard.imgFlag = true;

            files = event.target.files;
            file = files[0];
            reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                if (event.target.readyState == FileReader.DONE) {
                    this.currentLayer.artBoard.loadImage(event.target.result);
                }
            }
            //this.history = [];
            this.resetLayerBg();
            layers.layerDiv.style.backgroundColor = '#FFF';

            layers.layerDiv.addEventListener("click", event => {
                this.resetLayerBg();
                this.currentLayer = layers;
                //this.history = [];
                console.log(this.currentLayer.artBoard.cIndex);
                this.currentLayer.layerDiv.style.backgroundColor = "#FFF";
            });

        });
    }


    resetLayerBg() {
        this.layerArray.forEach(layer => {
            layer.layerDiv.style.backgroundColor = 'lightgrey';
        });
    }

    resetLayers() {
        this.layerArray.forEach(layer => {
            layer.layerDiv.style.top = this.layerArray.indexOf(layer) * 41 + 30 + "px";
            layer.artBoard.canvas.style.zIndex = this.layerArray.indexOf(layer);
        });
    }
}

let myFile = new mainFile();