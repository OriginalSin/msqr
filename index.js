import imgUrl from './www/gfx/19772.jpg';
import msqr from './src/msqr.js';
import dashboard from './src/dashboard.js';
// import Utils from './Utils.js';

const canva = document.createElement('canvas');
canva.width = canva.height = 256;
document.body.append(canva);

var options, timer,
    ctx = canva.getContext("2d"),
    render = renderText,
    dash = new dashboard({callback: optionHandler}).add([
        {type: "text", text: "<h2>Marching Squares Demo</h2>", raw: true},
        {type: "textbox", id: "text", bind: "text", label: "Text", text: "Epistemex", live: true},
        {type: "slider", bind: "rotation", label: "Rotation", min:0, max:359, value:0, live: true},
        {type: "slider", id: "rotChar", bind: "rotChar", label: "Letter rotation", min:0, max:359, value: 0, live: true},
        {type: "slider", id: "radius", bind: "radius", label: "Radius", min:50, max:400, value:0, live: true},
        {type: "slider", id: "fontSize", bind: "fontSize", label: "Font size", min: 50, max:450, value:300, live: true},
        {type: "separator"},
        {type: "slider", bind: "maxShapes", label: "Max shapes", min:1, max:20, live: true},
        {type: "slider", bind: "alpha", label: "Alpha", min:0, max:254, value: 80, live: true},
        {type: "slider", bind: "padding", label: "Padding", min:-9, max:9, value: 0, live: true},
        {type: "slider", bind: "bleed", label: "Bleed mask", min:0, max:10, value: 0, live: true},
        {type: "slider", bind: "tolerance", label: "Tolerance", min:0, max:4, step: 0.1, value: 0, live: true},
        {type: "checkbox", bind: "align", id: "cAlign", label: "Align", checked: true},
        {type: "separator"},
        {type: "checkbox", id: "useImage", label: "Use image"},
        {type: "checkbox", bind: "showText", label: "Show graphics", checked: true},
        {type: "checkbox", bind: "showPath", label: "Show path", checked: true},
        {type: "checkbox", bind: "showPoints", label: "Show points", checked: true},
        {type: "separator"},
        {type: "info", id: "lCount", label: "Shapes detected", text: "-"},
        {type: "info", id: "lTime", label: "Time (ms)", text: "-"},
        {type: "info", id: "lAvg", label: "Avg. time / shape", text: "-"},
        {type: "info", id: "lPts", label: "Tot. # of points", text: "-"},
        {type: "separator"},
        {type: "link", text: "Download from GitHub", value: "https://github.com/epistemex/msqr"}
    ]);



    // let rgb = [0,0,0,0];
let rgb;
canva.addEventListener('mousedown', ev => {
    const {clientX:x, clientY:y} = ev;
    const {width, height} = canva;

    const imageData = ctx.getImageData(0, 0, width, height);
    let data = new Uint8Array(imageData.data.buffer);

    const {width:w, height:h} = imageData;

    let pos = w * y + x;
    let p = 4 * pos;
    rgb = [pos, data[p], data[p+1], data[p+2]];
    update();

    console.log(rgb, data[pos+3], x, y)
// debugger
});
function optionHandler(e) {
    switch(e.id) {
        case "sPadding":
            dash.enable("cAlign", e.value === 0);
            break;
        case "useImage":
            render = e.value ? renderImage : renderText;
            dash.enable("text", !e.value);
            dash.enable("rotChar", !e.value);
            dash.enable("radius", !e.value);
            dash.enable("fontSize", !e.value);
            break;
    }

    update();
}

function update() {
    cancelAnimationFrame(timer);
    timer = requestAnimationFrame(function() {
        render();
        trace();
    });
}

function renderText() {
    options = dash.getBound();

    var txt = options.text,
        len = txt.length,
        offset = options.rotation / 180 * Math.PI,
        rotChar = options.rotChar / 180 * Math.PI,
        step = Math.PI * 2 / len;

    ctx.clearRect(0, 0, canva.width, canva.height);
    if (!len) return;

    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.font = options.fontSize + "px serif";
    ctx.fillStyle = "#606060";

    for(var i = 0; i < len; i++) {
        ctx.setTransform(1, 0, 0, 1, canva.width * 0.5, canva.height * 0.5);
        ctx.rotate(i * step + offset);
        ctx.translate(options.radius, 0);
        ctx.rotate(rotChar);
        ctx.fillText(txt[i], 0, 0);
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
}

function renderImage() {
    options = dash.getBound();
    ctx.clearRect(0, 0, canva.width, canva.height);
    ctx.setTransform(1, 0, 0, 1, canva.width * 0.5, canva.height * 0.5);
    ctx.rotate(options.rotation / 180 * Math.PI);
    ctx.scale(1.3, 1.3);
    // ctx.drawImage(img, 0, 0);
    ctx.drawImage(img, -img.width * 0.5, -img.height * 0.5);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
}

function trace() {
    if (!rgb) return;
    options.rgb = rgb;
    var time1 = performance.now(),
        paths = msqr(ctx, options),
        time = performance.now() - time1,
        cnt = 0;

    paths.forEach(function(path) {
        cnt += path.length
    });
    console.log('paths', paths.length, paths);

    dash.value("lCount", paths.length);
    dash.value("lTime", time.toFixed(2));
    dash.value("lAvg", paths.length ? (time / paths.length).toFixed(2) : "-");
    dash.value("lPts", cnt);

    if (!options.showText) {
        ctx.clearRect(0, 0, canva.width, canva.height)
    }

    if (options.showPath) {
        ctx.beginPath();
        ctx.lineWidth = 1;
        paths.forEach(renderPath);
        ctx.strokeStyle = "#fff";
        ctx.stroke();

        ctx.setLineDash([5, 5]);
        ctx.strokeStyle = "#f00";
        ctx.stroke();
        ctx.setLineDash([]);
    }

    if (options.showPoints) {
        ctx.beginPath();
        ctx.fillStyle = "#07f";
        paths.forEach(renderPoints);
        ctx.fill();
    }

    function renderPath(points) {
        if (!points.length) return;
        ctx.moveTo(points[0].x, points[0].y);
        for(var i = 1; i < points.length; i++)
            ctx.lineTo(points[i].x, points[i].y);
        ctx.closePath();
    }

    function renderPoints(points) {
        if (!points.length) return;
        for(var i = 0; i < points.length; i++)
            ctx.rect(points[i].x-1.5, points[i].y-1.5,4,4);
    }
}
var img = new Image();
img.src = imgUrl;
update();

export default {};