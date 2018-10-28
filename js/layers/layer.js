let layersWrapper = document.getElementsByClassName('layers-wrapper')[0];

class layer{
    constructor(index) {
    	this.upArrow = upArrow;
    	this.lowerArrow = lowerArrow;
    	this.artBoard = new artBoard(index);
        this.layerDiv = document.createElement('div');
        this.layersWrapper = layersWrapper;
        this.layersWrapper.appendChild(this.layerDiv);
        this.layerDiv.style.height = '30px';
        this.layerDiv.style.width = '170px';
        this.layerDiv.style.background = 'lightgrey';
        this.layerDiv.style.position = 'absolute';
        this.layerDiv.style.top = '1px';
        this.lIndex = index;

        this.textHere = document.createTextNode('Layer ' + index);
        this.layerDiv.style.textAlign = 'center';
        this.layerDiv.style.paddingTop = '10px';
        this.layerDiv.appendChild(this.textHere);
    }

}