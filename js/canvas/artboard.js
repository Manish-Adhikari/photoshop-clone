let canvasWrapper = document.getElementsByClassName('canvas-wrapper')[0];
let sliderContainer = document.getElementsByClassName('slidecontainer')[0];

class artBoard {

    constructor(index) {
        this.cIndex = index || 0;
        this.canvas = document.createElement('canvas');
        this.canvasWrapper = canvasWrapper;
        this.canvasWrapper.appendChild(this.canvas);
        this.canvas.height = this.canvasWrapper.offsetHeight;
        this.canvas.width = this.canvasWrapper.offsetWidth;
        this.canvas.style.position = 'absolute';
        this.context = this.canvas.getContext('2d');
        this.sliderContainer = sliderContainer;
        this.sliderContainer.style.display = 'none';
        this.slider = slider;

        this.brushSelectFlag = false;
        this.selectSelectFlag = false;
        this.textSelectFlag = false;
        this.eraserSelectFlag = false;

        this.offsetX = this.canvas.offsetLeft;
        this.offsetY = this.canvas.offsetTop;

        this.startX;
        this.startY;
        this.isDown = false;


        this.pi2 = Math.PI * 2;
        this.resizerRadius = 4;
        this.rr = this.resizerRadius * this.resizerRadius;
        this.draggingResizer = {
            x: 0,
            y: 0
        };
        this.imageX = 0;
        this.imageY = 0;
        this.imageWidth;
        this.imageHeight;
        this.imageRight;
        this.imageBottom;
        this.draggingImage = false;
        this.startX;
        this.startY;

        this.flag = false;
        this.brushColor;
        this.brushSize;
        this.context.lineWidth = this.slider.value;
        this.brushSize = this.slider.value / 2;

        this.slider.addEventListener("input", event => {
            this.context.lineWidth = this.slider.value;
            this.brushSize = this.slider.value / 2;
            console.log(this.slider.value);
        });

        this.canvas.addEventListener("mousedown", (e) => {
            if (this.brushSelectFlag || this.eraserSelectFlag) {
                this.enableFlag(e, this);
                console.log(this.brushSelectFlag);
            }
            // if (this.imgFlag) {
            //     this.handleMouseDown(e);
            //     console.log('mousedown');
            // }
        });

        this.canvas.addEventListener("mousemove", (e) => {
            if (this.brushSelectFlag || this.eraserSelectFlag) {
                this.plotPoints(e, this);
            }
            //     if (this.imgFlag) {
            //     this.handleMouseMove(e);
            //     console.log('mousemove');
            // }
        });

        this.canvas.addEventListener("mouseup", (e) => {
            if (this.brushSelectFlag || this.eraserSelectFlag) {
                this.disableFlag(this);
            }
            //     if (this.imgFlag) {
            //     this.handleMouseUp(e);
            //     console.log('mouseup');
            // }
        });

        // this.canvas.addEventListener("mouseout", (e) => {
        //     if (this.imgFlag) {
        //     this.handleMouseOut(e);;
        //     console.log('mouseout');
        //     }
        // });
    }

    resetSelectionFlag() {
        this.brushSelectFlag = false;
        this.selectSelectFlag = false;
        this.textSelectFlag = false;
        this.eraserSelectFlag = false;
    }

    plotPoints(event, that) {
        if (that.flag && that.brushSelectFlag) {
            that.context.globalCompositeOperation = "source-over";
            that.context.fill();
            that.context.fillStyle = that.brushColor;
            that.context.lineTo(event.offsetX, event.offsetY)
            that.context.stroke();
            that.context.strokeStyle = that.brushColor;
            that.context.beginPath();
            that.context.arc(event.offsetX, event.offsetY, that.brushSize, 0, 2 * Math.PI);
            that.context.fill();
            that.context.fillStyle = that.brushColor;
            that.context.beginPath();
            that.context.moveTo(event.offsetX, event.offsetY)
        }
        if (that.flag && that.eraserSelectFlag) {
            that.context.globalCompositeOperation = "destination-out";
            that.context.arc(event.offsetX, event.offsetY, that.brushSize, 0, Math.PI * 2, false);
            that.context.fill();
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

    loadImage(source) {
        this.img = new Image();
        this.img.onload = () => {
            console.log(this.img);
            this.imageWidth = this.img.width;
            this.imageHeight = this.img.height;
            this.imageRight = this.imageX + this.imageWidth;
            this.imageBottom = this.imageY + this.imageHeight;
            this.draw(true, false);
        }

        this.img.src = source;
        // console.log(this.img.src);
    }

    draw(withAnchors, withBorders) {

        // clear the canvas
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // draw the image
        this.context.drawImage(this.img, 0, 0, this.img.width, this.img.height, this.imageX, this.imageY, this.imageWidth, this.imageHeight);

        // optionally draw the draggable anchors
        if (withAnchors) {
            this.drawDragAnchor(this.imageX, this.imageY);
            this.drawDragAnchor(this.imageRight, this.imageY);
            this.drawDragAnchor(this.imageRight, this.imageBottom);
            this.drawDragAnchor(this.imageX, this.imageBottom);
        }

        // optionally draw the connecting anchor lines
        // if (withBorders) {
        this.context.beginPath();
        this.context.moveTo(this.imageX, this.imageY);
        this.context.lineTo(this.imageRight, this.imageY);
        this.context.lineTo(this.imageRight, this.imageBottom);
        this.context.lineTo(this.imageX, this.imageBottom);
        this.context.closePath();
        this.context.stroke();
        // }

    }

    drawDragAnchor(x, y) {
        this.context.beginPath();
        this.context.arc(x, y, this.resizerRadius, 0, this.pi2, false);
        this.context.closePath();
        this.context.fill();
    }

    anchorHitTest(x, y) {

        let dx, dy;

        // top-left
        dx = x - this.imageX;
        dy = y - this.imageY;
        if (dx * dx + dy * dy <= this.rr) {
            return (0);
        }
        // top-right
        dx = x - this.imageRight;
        dy = y - this.imageY;
        if (dx * dx + dy * dy <= this.rr) {
            return (1);
        }
        // bottom-right
        dx = x - this.imageRight;
        dy = y - this.imageBottom;
        if (dx * dx + dy * dy <= this.rr) {
            return (2);
        }
        // bottom-left
        dx = x - this.imageX;
        dy = y - this.imageBottom;
        if (dx * dx + dy * dy <= this.rr) {
            return (3);
        }
        return (-1);

    }

    hitImage(x, y) {
        return (x > this.imageX && x < this.imageX + this.imageWidth && y > this.imageY && y < this.imageY + this.imageHeight);
    }


    handleMouseDown(e) {
        this.startX = parseInt(e.clientX - this.offsetX);
        this.startY = parseInt(e.clientY - this.offsetY);
        this.draggingResizer = this.anchorHitTest(this.startX, this.startY);
        this.draggingImage = this.draggingResizer < 0 && this.hitImage(this.startX, this.startY);
    }

    handleMouseUp(e) {
        this.draggingResizer = -1;
        this.draggingImage = false;
        this.draw(true, false);
    }

    handleMouseOut(e) {
        this.handleMouseUp(e);
    }

    handleMouseMove(e) {

        if (this.draggingResizer > -1) {

            this.mouseX = parseInt(e.clientX - this.offsetX);
            this.mouseY = parseInt(e.clientY - this.offsetY);

            // resize the image
            switch (this.draggingResizer) {
                case 0:
                    //top-left
                    this.imageX = this.mouseX;
                    this.imageWidth = this.imageRight - this.mouseX;
                    this.imageY = this.mouseY;
                    this.imageHeight = this.imageBottom - this.mouseY;
                    break;
                case 1:
                    //top-right
                    this.imageY = this.mouseY;
                    this.imageWidth = this.mouseX - this.imageX;
                    this.imageHeight = this.imageBottom - this.mouseY;
                    break;
                case 2:
                    //bottom-right
                    this.imageWidth = this.mouseX - this.imageX;
                    this.imageHeight = this.mouseY - this.imageY;
                    break;
                case 3:
                    //bottom-left
                    this.imageX = this.mouseX;
                    this.imageWidth = this.imageRight - this.mouseX;
                    this.imageHeight = this.mouseY - this.imageY;
                    break;
            }

            if (this.imageWidth < 25) { this.imageWidth = 25; }
            if (this.imageHeight < 25) { this.imageHeight = 25; }

            // set the image right and bottom
            this.imageRight = this.imageX + this.imageWidth;
            this.imageBottom = this.imageY + this.imageHeight;

            // redraw the image with resizing anchors
            this.draw(true, true);

        } else if (this.draggingImage) {

            this.imageClick = false;

            this.mouseX = parseInt(e.clientX - this.offsetX);
            this.mouseY = parseInt(e.clientY - this.offsetY);

            // move the image by the amount of the latest drag
            let dx = this.mouseX - this.startX;
            let dy = this.mouseY - this.startY;
            this.imageX += dx;
            this.imageY += dy;
            this.imageRight += dx;
            this.imageBottom += dy;
            // reset the startXY for next time
            this.startX = this.mouseX;
            this.startY = this.mouseY;

            // redraw the image with border
            this.draw(false, true);

        }
    }
}