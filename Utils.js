const Utils = {
    dec2rgb: (i) =>	{	// convert decimal to rgb
        var r = (i >> 16) & 255,
            g = (i >> 8) & 255,
            b = i & 255;
		return [r, g, b];
	},
    grayscale: (data) => {
        for (var i = 0; i < data.length; i += 4) {
          var avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
          data[i] = avg; // red
          data[i + 1] = avg; // green
          data[i + 2] = avg; // blue
        }
    },
    chkRgb: (data, rgb, delta) => {
        for (let i = 0; i < data.length; i += 4) {
            const raz = Math.max(
                Math.abs(rgb[0] - data[i]),
                Math.abs(rgb[1] - data[i + 1]),
                Math.abs(rgb[2] - data[i + 2]),
            );
            if (raz > delta) {
                data[i + 3] = 0;
            } else {
                data[i + 3] = 255;

                // const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
                // data[i] = avg; // red
                // data[i + 1] = avg; // green
                // data[i + 2] = avg; // blue
      
            }
        }
    },
    relMouseCoords: (event) => {
        var totalOffsetX = 0;
        var totalOffsetY = 0;
        var canvasX = 0;
        var canvasY = 0;
        var currentElement = this;
    
        do{
            totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
            totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
        }
        while(currentElement = currentElement.offsetParent)
    
        canvasX = event.pageX - totalOffsetX;
        canvasY = event.pageY - totalOffsetY;
    
        return {x:canvasX, y:canvasY}
    }
}

export default Utils;