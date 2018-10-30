const LOW_LUMINANCE_THRESHOLD = 64;
const LOW_LUMINANCE_THRESHOLD_COEFFICIENT = 1.4;

const HIGH_LUMINANCE_THRESHOLD = 192;
const HIGH_LUMINANCE_THRESHOLD_COEFFICIENT = 0.6;

const AVERAGE_LUMINANCE_THRESHOLD_COEFFICIENT = 1;

const ADJUSTED_SKIN_BOTTOM_THRESHOLD = 6;
const ADJUSTED_SKIN_TOP_THRESHOLD = 30;

const RED_ADJUSTED_COEFFICIENT = 0.46;
const GREEN_ADJUSTED_COEFFICIENT = 0.419;
const BLUE_ADJUSTED_COEFFICIENT = 0.081;

const BINARY_WHITE = 1; 
const BINARY_BLACK = 0; 


class IMG{
    constructor(canvas){
        this.canvas = canvas;
        this.context = this.canvas.getContext('2d');

        this.width = undefined;
        this.height = undefined;

        this.RGBAdata = undefined;
        this.data = undefined;
    }

    readImage(filename,onload){
        if(filename.length ===0) onload();
        this.image = new Image();
        this.image.src = filename;
        this.image.onload = () => {
            this.width = this.image.width;
            this.height = this.image.height;
            this.canvas.width = this.width;
            this.canvas.height = this.height;
            this.context.drawImage(this.image,0,0);
            onload();
        }
    }

    initImage(){
        this.width = this.canvas.width;
        this.height = this.canvas.height;
    }

    getPixelMatrix(sx,sy,ex,ey,t){
        let c = this.context;
        let w = this.width;
        let h = this.height;
        let d=c.getImageData(sx,sy,w,h).data;
        let pM=[];
        for(let i=0;i<=ex;i++){
            let pMJ=[];
            for(let j=0;j<=ey;j++){
                let cI=(i*4)+j*(w*4);
                pMJ.push(t(d[cI],d[cI+1],d[cI+2],d[cI+3]));
            }
            pM.push(pMJ);
        }
        return Matrix.transpose(pM);
    }

    grey(){
        this.data = this.getPixelMatrix(0,0,this.width-1,this.height-1,(r,g,b,a)=> 0.3*r +0.5*g +0.1*b );
        return this.data;
    }
    rgba(){
        this.RGBAdata = this.getPixelMatrix(0,0,this.width-1,this.height-1,(r,g,b,a)=> { return {r,g,b,a} } );
        return this.RGBAdata;
    }

    doPixelMath(pixelData,mathFunc){
        let matrix = pixelData;
        let pM=[];
        let x = 0 , y = 0;
        matrix.forEach((sM)=>{
            let pMJ=[] ;
            x =0;
            sM.forEach((el)=>{
                let r=0,g=0,b=0;
                if(el.hasOwnProperty("r") && el.hasOwnProperty("g") && el.hasOwnProperty("b")){
                    r=el.r;
                    g=el.g;
                    b=el.b;
                }else{
                    r = el;
                    g = el;
                    b = el;
                }
                pMJ.push(mathFunc(r,g,b,x,y));
                x++;
            });
            pM.push(pMJ);
            y++;
        });
        return pM;
    }

    plotInCanvas(canvas,data,isBinary){
        let newCanvas = canvas;
        let context = newCanvas.getContext('2d');
        let matrix = data;
        let x = 0, y = 0;
        matrix.forEach((sM)=>{
            x = 0;
            sM.forEach((el)=>{
                let r=0,g=0,b=0;
                if(el.hasOwnProperty("r") && el.hasOwnProperty("g") && el.hasOwnProperty("b")){
                    r=el.r;
                    g=el.g;
                    b=el.b;
                }else{
                    if(isBinary){
                        if(el===1){
                          r=255,g=255,b=255;  
                        }else{
                            r=0,g=0,b=0;
                        }
                    }else{
                        r=el;
                        g=el;
                        b=el;
                    }
                }
                
                context.fillStyle = "rgb("+ r +","+ g +","+ b +")";
                context.fillRect(x,y,1,1);
                x++;
            });
            y++;
        });
        document.body.appendChild(newCanvas);
        return newCanvas;
    }

    plotImage(data,isBinary){
        let newCanvas = document.createElement('canvas');
        newCanvas.width = this.width;
        newCanvas.height = this.height;
       return this.plotInCanvas(newCanvas,data,isBinary);
    }

    dimensions(){
        return {w: this.width,h:this.height}
    }

    edges(grey) {
        var height = grey.length;
        var width = grey[0].length;
    
        var vectors = new Array(height);
    
        for (var y = 0; y < height; y++) {
          vectors[y] = new Array(width);
    
          for (var x = 0; x < width; x++) {
            var prevX = x == 0 ? 0 : grey[y][x - 1];
            var nextX = x == width - 1 ? 0 : grey[y][x + 1];
            var prevY = y == 0 ? 0 : grey[y - 1][x];
            var nextY = y == height - 1 ? 0 : grey[y + 1][x];
    
            // kernel [-1, 0, 1]
            var gradX = -prevX + nextX;
            var gradY = -prevY + nextY;
            var magnitude = Math.sqrt(Math.pow(gradX, 2) + Math.pow(gradY, 2))
            vectors[y][x] = magnitude > 100 ? 1 : 0 ;
          }
        }
        return vectors;
      }

      removeNoise(matrix,dark){
        let height = matrix.length;
        let width = matrix[0].length;
        let radius = 8;
        for(let i=0;i<height;i+=radius){
            for(let j=0;j<width;j+=radius){
                let thisP = 0;
                if(j+radius <= height && i+radius<=width){
                    let sum = 0;
                    let total = 0;
                    for(let k = 0; k <radius ; k ++){
                        for(let l = 0; l<radius; l++){
                            sum+=matrix[j+k][i+l];
                            total++;
                        }
                    }
                    let thisBlock =0;
                    if(sum > (total/2)) thisBlock = 1;
                    else thisBlock = 0;

                    for(let k = 0; k <radius ; k ++){
                        for(let l = 0; l<radius; l++){
                            matrix[j+k][i+l] = thisBlock;
                        }
                    }
                }
            }
        }
        return matrix;
    }

    drawRect(x,y,w,h){
        this.context.strokeStyle = "red";
        this.context.lineWidth = "3";
        this.context.fillStyle = "transparent";
        this.context.strokeRect(x,y,w,h);
    }

    crop(x,y,w,h){
        return this.getPixelMatrix(x,y,w,h,(r,g,b,a)=> { return {r,g,b,a} });
    }

    faceMatrix(){
        const rectLeftTop = {x:100000,y:100000}, rectRightBottom = {x:0,y:0};
        var averageOfGrey = Matrix.average(this.grey());
        let t = 1;
        let adjustedMatrix = this.doPixelMath(this.rgba(), (red,green,blue,x,y)=>{
           
            if ( averageOfGrey < LOW_LUMINANCE_THRESHOLD ) t = LOW_LUMINANCE_THRESHOLD_COEFFICIENT;
            else if ( averageOfGrey > HIGH_LUMINANCE_THRESHOLD ) t = HIGH_LUMINANCE_THRESHOLD_COEFFICIENT;
            else t = AVERAGE_LUMINANCE_THRESHOLD_COEFFICIENT;

            let rAdjusted = RED_ADJUSTED_COEFFICIENT * Math.pow(red,t) , 
                gAdjusted = GREEN_ADJUSTED_COEFFICIENT * Math.pow(green,t) , 
                bAdjusted = BLUE_ADJUSTED_COEFFICIENT * blue,
                adjusted =  rAdjusted -  gAdjusted -  bAdjusted;
            

            
            if(adjusted > ADJUSTED_SKIN_BOTTOM_THRESHOLD && adjusted < ADJUSTED_SKIN_TOP_THRESHOLD){
                if(rectLeftTop.x > x) rectLeftTop.x = x;
                if(rectLeftTop.y > y ) rectLeftTop.y = y;

                if(rectRightBottom.x < x) rectRightBottom.x = x;
                if(rectRightBottom.y < y) rectRightBottom.y = y;
                
                return BINARY_WHITE;
            }else{
                return BINARY_BLACK;
            }
            
        });
        return adjustedMatrix;
        // return {
        //     x:rectLeftTop.x,
        //     y:rectLeftTop.y,
        //     width:rectRightBottom.x - rectLeftTop.x,
        //     height:rectRightBottom.y - rectLeftTop.y,
        // };
    }

    smoothFacePixels(facePixels){
        let smoothed = this.removeNoise(facePixels);
        return smoothed;
    }

    findVerticesFromBinary(matrix){
        const rectLeftTop = {x:100000,y:100000}, rectRightBottom = {x:0,y:0};
        let x = 0, y =0;
        matrix.forEach(row => {
            x = 0;
            row.forEach(column => {
                if(column == BINARY_WHITE){
                    if(rectLeftTop.x > x) rectLeftTop.x = x;
                    if(rectLeftTop.y > y ) rectLeftTop.y = y;

                    if(rectRightBottom.x < x) rectRightBottom.x = x;
                    if(rectRightBottom.y < y) rectRightBottom.y = y;
                }
                x++;
            });
            y++;
        });
        return {
            x:rectLeftTop.x,
            y:rectLeftTop.y,
            width:rectRightBottom.x - rectLeftTop.x,
            height:rectRightBottom.y - rectLeftTop.y,
        };
    }


    probableEyeCoordinates(skinCoordinates){
        return {
            x:skinCoordinates.x ,
            y: skinCoordinates.y + (skinCoordinates.height - skinCoordinates.y - 30) /2 ,
            width: skinCoordinates.width,
            height:((skinCoordinates.width-20) * 69) / 200,
        }; 
    }

    probableForHeadCoordinates(skinCoordinates){
        return {
            x:skinCoordinates.x ,
            y: skinCoordinates.y+0,
            width: skinCoordinates.width,
            height:((skinCoordinates.width-20) * 235) / 250,
        }; 
    }
}