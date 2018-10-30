let downloadCanvas = document.getElementById('download');

class download {
    constructor() {
        this.downloadCanvas = downloadCanvas;

    }

    download(canvas, filename) {
        var lnk = document.createElement('a'),
            e;
        lnk.download = filename;

        let cnvs = document.createElement('canvas');
        document.body.appendChild(cnvs);
        cnvs.height = 588;
        cnvs.width = 950;
        let cxt = cnvs.getContext('2d');

        cxt.fillStyle="#FFF";
        cxt.fillRect(0,0,cnvs.width,cnvs.height);

        cxt.drawImage(canvas,0,0);

        lnk.href = cnvs.toDataURL("image/png;base64");

        if (document.createEvent) {
            e = document.createEvent("MouseEvents");
            e.initMouseEvent("click", true, true, window,
                0, 0, 0, 0, 0, false, false, false,
                false, 0, null);

            lnk.dispatchEvent(e);
        } else if (lnk.fireEvent) {
            lnk.fireEvent("onclick");
        }
        document.body.removeChild(cnvs);
    }
}