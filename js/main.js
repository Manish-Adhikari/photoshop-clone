let addLayer = document.getElementsByClassName('plus-button')[0];
let removeLayer = document.getElementsByClassName('minus-button')[0];
let upArrow = document.getElementsByClassName('up-arrow')[0];
let lowerArrow = document.getElementsByClassName('lower-arrow')[0];
let addImage = document.getElementById('add-image');
let selectTool = document.getElementById('select-tool-image');
let textTool = document.getElementById('text-tool-image');
let eraserTool = document.getElementById('eraser-tool-image');
let brushTool = document.getElementById('brush-tool-image');
let colorPicker = document.getElementById('color-picker');
let slider = document.getElementById('slider');
let newFile = document.getElementById('new-file');

const sunglass = new Image();
sunglass.src = 'images/sunglass.png';


class mainFile {
    constructor() {
        this.layerArray = [];
        this.newFile = newFile;
        this.addLayer = addLayer;
        this.removeLayer = removeLayer;
        this.upArrow = upArrow;
        this.lowerArrow = lowerArrow;
        this.addImage = addImage;
        this.colorPicker = colorPicker;
        this.selectTool = selectTool;
        this.textTool = textTool;
        this.brushTool = brushTool;
        this.eraserTool = eraserTool;
        this.bgFlag = false;
        this.filter = new filters();
        this.merge = new merge();
        this.download = new download();

        this.addLayer.addEventListener("click", (this.createNew = event => {
            if (this.layerArray.length > 0) {
                this.bgFlag = false;
                this.createLayers(this.bgFlag);
            }
        }));

        this.newFile.addEventListener("click", (this.createNew = event => {
            if (this.layerArray.length == 0) {
                this.bgFlag = true;
                //console.log(this.layerArray);
                this.createLayers(this.bgFlag);
            }
        }));

        this.removeLayer.addEventListener("click", event => {
            if (this.layerArray.length > 0) {
                layersWrapper.removeChild(this.currentLayer.layerDiv);
                canvasWrapper.removeChild(this.currentLayer.artBoard.canvas);
                this.layerArray.splice(this.layerArray.indexOf(this.currentLayer), 1);
                if (this.layerArray.length != 0) {
                    this.currentLayer = this.layerArray[this.layerArray.length - 1];
                }
                this.resetLayers();
                this.resetBorders();
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

        this.filter.sunglassF.addEventListener("click", event => {
            this.filter.sunglassFilter(this.currentLayer);

        });

        this.filter.sepia.addEventListener("click", event => {
            this.filter.sepiaFilter(this.currentLayer);

        });

        this.filter.newF.addEventListener("click", event => {
            this.filter.newFilter(this.currentLayer);

        });

        this.merge.layersMerge.addEventListener("click", event => {

            let cnvs = document.createElement('canvas');
            document.body.appendChild(cnvs);
            cnvs.height = 588;
            cnvs.width = 950;
            let cxt = cnvs.getContext('2d');

            for (let i = 0; i < this.layerArray.length; i++) {
                cxt.drawImage(this.layerArray[i].artBoard.canvas, 0, 0);
            }

            for (let i = this.layerArray.length; i > 0; i--) {
                let lastElement = this.layerArray[i - 1];
                lastElement.artBoard.canvas.remove();
                lastElement.layerDiv.remove();
                this.layerArray.splice(this.layerArray.indexOf(i), 1);
            }
            let layers = new layer(0);
            layers.artBoard.canvas.style.background = 'white';
            layers.artBoard.context.drawImage(cnvs, 0, 0);
            this.layerArray.push(layers);
            this.currentLayer = this.layerArray[0];
            document.body.removeChild(cnvs);
            this.resetLayers();

            layers.layerDiv.addEventListener("click", event => {
                this.resetLayerBg();
                this.currentLayer = layers;
                console.log(this.currentLayer.artBoard.cIndex);
                this.currentLayer.layerDiv.style.backgroundColor = "#FFF";
            });
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
            //this.currentLayer.artBoard.imgFlag = true;

            files = event.target.files;
            file = files[0];
            reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                if (event.target.readyState == FileReader.DONE) {
                    this.currentLayer.artBoard.loadImage(event.target.result);
                }
            }
            this.resetLayerBg();
            layers.layerDiv.style.backgroundColor = '#FFF';

            layers.layerDiv.addEventListener("click", event => {
                this.resetLayerBg();
                this.currentLayer = layers;
                console.log(this.currentLayer.artBoard.cIndex);
                this.currentLayer.layerDiv.style.backgroundColor = "#FFF";
            });

        });

        this.colorPicker.addEventListener("input", event => {
            this.currentLayer.artBoard.brushColor = this.colorPicker.value;
        });

        this.brushTool.addEventListener("click", event => {
            this.currentLayer.artBoard.resetSelectionFlag();
            this.resetBorders();
            this.brushTool.style.border = '1px solid grey';
            this.currentLayer.artBoard.brushSelectFlag = true;
            this.currentLayer.artBoard.canvas.style.cursor = 'crosshair';
            this.currentLayer.artBoard.sliderContainer.style.display = 'block';
        });

        this.eraserTool.addEventListener("click", event => {
            this.currentLayer.artBoard.resetSelectionFlag();
            this.resetBorders();
            console.log('eraser');
            this.eraserTool.style.border = '1px solid grey';
            this.currentLayer.artBoard.eraserSelectFlag = true;
            this.currentLayer.artBoard.canvas.style.cursor = 'move';
            this.currentLayer.artBoard.sliderContainer.style.display = 'block';
        });

        this.selectTool.addEventListener("click", event => {
            this.currentLayer.artBoard.resetSelectionFlag();
            this.resetBorders();
            this.selectTool.style.border = '1px solid grey';
            this.currentLayer.artBoard.selectionSelectFlag= true;
        });

        this.textTool.addEventListener("click", event => {
            this.currentLayer.artBoard.resetSelectionFlag();
            this.resetBorders();
            this.textTool.style.border = '1px solid grey';
            this.textFlag = true;
            this.currentLayer.artBoard.sliderContainer.style.display = 'block';

            this.currentLayer.artBoard.canvas.addEventListener("click", e => {
                if (this.textFlag) {
                    let text = prompt('Text:', '');
                    this.currentLayer.artBoard.context.fillStyle = this.colorPicker.value || 'black';

                    if (text) {
                        console.log(this.currentLayer.artBoard.context.fillStyle);
                        let pos = this.relativePos(e, this.currentLayer.artBoard.canvas);
                        this.currentLayer.artBoard.context.font = this.currentLayer.artBoard.context.lineWidth + 'px sans-serif';
                        this.currentLayer.artBoard.context.fillText(text, pos.x, pos.y);
                    }
                }
            });
        });

    }

    createLayers(flag) {
        let layers = new layer(this.layerArray.length);

        this.layerArray.push(layers);
        this.resetLayers();
        this.resetBorders();
        this.currentLayer = layers;
        this.resetLayerBg();
        layers.layerDiv.style.backgroundColor = '#FFF';
        console.log(flag);
        if (flag) {
            this.currentLayer.artBoard.canvas.style.background = 'white';
        }

        layers.layerDiv.addEventListener("click", event => {
            this.resetLayerBg();
            this.currentLayer = layers;
            console.log(this.currentLayer.artBoard.cIndex);
            this.currentLayer.layerDiv.style.backgroundColor = "#FFF";
        });
    }

    resetBorders() {
        this.brushTool.style.border = 'none';
        this.eraserTool.style.border = 'none';
        this.textTool.style.border = 'none';
        this.selectTool.style.border = 'none';
        this.textFlag = false;
        if (this.currentLayer) {
            this.currentLayer.artBoard.sliderContainer.style.display = 'none';
            this.currentLayer.artBoard.canvas.style.cursor = 'default';
        }
    }

    resetLayerBg() {
        this.layerArray.forEach(layer => {
            layer.layerDiv.style.backgroundColor = 'lightgrey';
        });
    }

    resetLayers() {
        this.layerArray.forEach(layer => {
            layer.layerDiv.style.top = this.layerArray.indexOf(layer) * 41 + 38 + "px";
            layer.artBoard.canvas.style.zIndex = this.layerArray.indexOf(layer);
        });
    }

    relativePos(event, element) {
        let rect = element.getBoundingClientRect();
        return {
            x: Math.floor(event.clientX - rect.left),
            y: Math.floor(event.clientY - rect.top)
        };
    }
}

let myFile = new mainFile();