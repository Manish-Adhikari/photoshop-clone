var video = document.querySelector("#videoElement");
 
if (navigator.mediaDevices.getUserMedia) {       
    navigator.mediaDevices.getUserMedia({video: true})
  .then(function(stream) {
    video.srcObject = stream;
  })
  .catch(function(err0r) {
    console.log("Something went wrong!");
  });
}



const sunglass = new Image();
sunglass.src = 'sunglass.png';

const crown = new Image();
crown.src = 'crown.png';



let videoCnv = document.createElement('canvas');
document.body.appendChild(videoCnv);
videoCnv.width = 640;
videoCnv.height = 480;
let videoImage = new IMG(videoCnv);



let faceMatrixCanvas = document.createElement('canvas');
document.body.appendChild(faceMatrixCanvas);
faceMatrixCanvas.height = 480;
faceMatrixCanvas.width = 640;


console.log(video);
setInterval(()=>{

    videoCnv.getContext("2d").drawImage(video,0,0);

    videoImage.initImage();
        let faceMatrix = videoImage.faceMatrix();
        let smoothedFace = videoImage.smoothFacePixels(faceMatrix);
    ///    videoImage.plotInCanvas(faceMatrixCanvas,smoothedFace,true);
        let faceCoordinates = videoImage.findVerticesFromBinary(smoothedFace);

        let probableEyeCoordinate = videoImage.probableEyeCoordinates(faceCoordinates);
        videoImage.context.drawImage(sunglass,probableEyeCoordinate.x,probableEyeCoordinate.y,probableEyeCoordinate.width,probableEyeCoordinate.height);

        // let probableForHeadCoordinate = videoImage.probableForHeadCoordinates(faceCoordinates);
        // videoImage.context.drawImage(crown,probableForHeadCoordinate.x,probableForHeadCoordinate.y,probableForHeadCoordinate.width,probableForHeadCoordinate.height);

        console.log({faceCoordinates,probableEyeCoordinate});
},250);

   /*
const faceImages1 = [
    'img7.jpg',
    'img8.jpg',
    'img9.jpg',
];


const faceImages = [
    'img6.jpg',
];

faceImages1.forEach((faceImage)=>{
    let cnv = document.createElement('canvas');
    document.body.appendChild(cnv);
    let image = new IMG(cnv);
    image.readImage(faceImage,()=>{
        let faceMatrix = image.faceMatrix();
        let smoothedFace = image.smoothFacePixels(faceMatrix);
        image.plotImage(smoothedFace,true);
        let faceCoordinates = image.findVerticesFromBinary(smoothedFace);
        let probableEyeCoordinate = image.probableEyeCoordinates(faceCoordinates);
        console.log({faceImage,faceCoordinates,probableEyeCoordinate});
        image.context.drawImage(sunglass,probableEyeCoordinate.x,probableEyeCoordinate.y,probableEyeCoordinate.width,probableEyeCoordinate.height);
    });
    
});
*/





// adjustedMatrix = image.removeNoise(adjustedMatrix);
    // let adjustedImageCanvas = image.plotImage(adjustedMatrix,true);
    // let newImage = new IMG(adjustedImageCanvas);
    // newImage.initImage();
    // edges = newImage.edges(newImage.grey());

    // let edgeImageCanvas = image.plotImage(edges,true);


    // let rectX = rectLeftTop.x;
    // let rectY = rectLeftTop.y;
    // let rectWidth = rectRightBottom.x - rectLeftTop.x;
    // let rectHeight = rectRightBottom.y - rectLeftTop.y;

    // image.drawRect(rectX,rectY,rectWidth,rectHeight);
    // newImage.drawRect(rectX,rectY,rectWidth,rectHeight);


    // let edgeImage = new IMG(edgeImageCanvas);
    // edgeImage.initImage();
    // let croppedEdges =edgeImage.crop(rectX+20,rectY+30,rectWidth-40,rectHeight-60);
    // image.plotImage(croppedEdges);

    // let edgeImage = new IMG(edgeImageCanvas);
    // edgeImage.initImage();


     //let croppedEdges =edgeImage.crop(probableEyeCoordinate.x,probableEyeCoordinate.y,rectWidth-40,40);
   // image.plotImage(croppedEdges);
   

/*
const img = new Image();
img.src = 'img1.png';



img.onload = () => {

    console.time('start');
    
    let width = img.width;
    let height = img.height;

    cnv.height = height;
    cnv.width = width;

    ctx.drawImage(img,0,0);

    let pixMatrix = getPixelMatrix(ctx,0,0,width-1,height-1,width,height, (data,index) => Math.round(0.3*data[index] + 0.6*data[index+1] + 0.1*data[index+2]) );
    avg = matrixAverage(pixMatrix);

   
console.log({avg})

    let compensateMatrix = getPixelMatrix(ctx,0,0,width-1,height-1,width,height, 
        (data,index) =>{ 
            if(avg<64) t = 1.4;
            else if(avg>192) t = 0.6;
            else t = 1;
            let r = Math.pow(data[index],t) , g = Math.pow(data[index+1],t) , c =0.5*r - 0.419 * g - 0.081 * data[index+2] ;
            return c;
         });
    console.log({compensateMatrix});
    let skin = findSkin(compensateMatrix);
    console.log({skin});
    ctx.strokeStyle = "red";
    ctx.lineWidth = "3";

    let rectX = skin.lT.x;
    let rectY = skin.lT.y;
    let rectWidth = skin.rB.x - skin.lT.x;
    let rectHeight = skin.rB.y - skin.lT.y;

    let faceMatrix = getPixelMatrix(ctx, rectX, rectY, rectX+rectWidth, rectY+rectHeight,width,height,(data,index)=> { return {r:data[index],g:data[index+1],b:data[index+2],}  });
    plotRGBIntoCanvas(faceMatrix,1);
    

    
   // ctx.fillStyle = "red";
  //  ctx.fillRect(rectY,rectX,rectHeight,rectWidth);
    
    plotIntoCanvas(skin.pixels,0);
         
    let from = {x:skin.lT.x,y:skin.lT.y};
    let to = {x:skin.rB.x ,y:skin.rB.y};

    let lipMatrix = getPixelMatrix(ctx,0,0,width-1,height-1,width,height, (data,index) => ((data[index] - data[index+1]) + (data[index+2]  - data[index+1])) > 60 ? 255 : 0 );
    plotColorIntoCanvas(lipMatrix,1);

    let smoothImage = removeNoise(skin.pixels,from,to,1);
    plotIntoCanvas(smoothImage,1);
    
    ratio = rectHeight/rectWidth;    
    if(ratio > 1.5 ) {
        rectHeight = 1.5 * rectWidth;
        ratio = rectHeight/rectWidth;
    }

    if(ratio <= 1.5 && ratio > 0.8){
        let mouthMatrix = getPixelMatrix(ctx,0,0,width-1,height-1,width,height, (data,index) => {
            if(avg<64) t = 1.4;
            else if(avg>192) t = 0.6;
            else t = 1;
            let r = Math.pow(data[index],t);
            let g = Math.pow(data[index+1],t);
            let b = data[index+2];
            let f = 1;
            let denomenator = Math.sqrt( Math.pow(r-g,2) + (r-b)*(g-b));
            
            f = ((0.5*(2*r-g-b))/ denomenator) ;
            if(denomenator==0) f = 0;
            theta = Math.acos(f) * 180 / Math.PI;
           // console.log({f,theta});
            //console.log(f);
            if(theta<90 ) return 0;
            else return 1;
        } );
    
        console.log(mouthMatrix);
        plotIntoCanvas(mouthMatrix,0);

        console.log("Face"); 
        ctx.strokeRect(rectX,rectY,rectWidth,rectHeight);

        console.timeEnd("start");
    }
}

*/