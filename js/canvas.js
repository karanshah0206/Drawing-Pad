var context, contexto, canvas, canvaso, tool, tool_default='chalk', func, tools={};

// Canvas Initialization
if(window.addEventListener) { window.addEventListener('load', function () {
function init () {
    // Getting Canvas Into canvaso Variable
    canvaso = document.getElementById('drawingCanvas');
    if (!canvaso) {
        alert('Error: The Drawing Canvas Was Not Found.');
        return;
    }
    if (!canvaso.getContext) {
        alert('Error: Cannot Get Context For Drawing Canvas.');
        return;
    }

    // Creating A 2D Canvas
    contexto = canvaso.getContext('2d');
    if (!contexto) {
        alert('Error: Cannot Set Context For Drawing Canvas.');
        return;
    }

    // Creating A Temporary Canvas
    var container = canvaso.parentNode;
    canvas = document.createElement('canvas');
    if (!canvas) {
        alert('Error: Cannot Create Temporary Canvas.');
        return;
    }
    canvas.id='tempCanvas';
    canvas.width = canvaso.width;
    canvas.height = canvaso.height;
    container.appendChild(canvas);
    context = canvas.getContext('2d');
    context.strokeStyle = '#ffffff';
    context.lineWidth = 1.0;
    context.fillStyle = '#424242';
    context.fillRect(0, 0, 897, 532);

    // Tool Selector
    var tool_select = document.getElementById('selector');
    if (!tool_select) {
        alert('Error: Cannot Access Tool Selector.');
        return;
    }
    tool_select.addEventListener('change', ev_tool_change, false);
    if (tools[tool_default]) {
        tool = new tools[tool_default]();
        tool_select.value = tool_default;
    }

    // Canvas Listeners
    canvas.addEventListener('mousedown', ev_canvas, false);
    canvas.addEventListener('mousemove', ev_canvas, false);
    canvas.addEventListener('mouseup', ev_canvas, false);

    context.beginPath();
    context.moveTo(1, 1);
    context.lineTo(1, 1);
    context.stroke();
    img_update();

    LoadColorTable();
}

// Getting Mouse Position
function ev_canvas (ev) {
    if (ev.layerX || ev.layerX == 0) {
        ev._x = ev.layerX;
        ev._y = ev.layerY;
    }
    else if (ev.offsetX || ev.offsetX == 0) {
        ev._x = ev.offsetX;
        ev._y = ev.offsetY;
    }
    func = tool[ev.type];
    if (func) {
        func(ev);
    }
}

// Tool Selector Value Changed
function ev_tool_change (ev) {
    if (tools[this.value]) {
        tool = new tools[this.value]();
    }
    originalTool = document.getElementById('selector').value;
}

// Overlap Temporary Canvas On Original
function img_update () {
    contexto.drawImage(canvas, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);
}

// Chalk Tool
tools.chalk = function () {
    var tool = this;
    this.started = false;
    this.mousedown = function (ev) {
        context.beginPath();
        context.moveTo(ev._x, ev._y);
        tool.started = true;
    };
    this.mousemove = function (ev) {
        if (tool.started) {
            context.lineTo(ev._x, ev._y);
            context.stroke();
        }
    };
    this.mouseup = function (ev) {
        if (tool.started) {
            tool.mousemove(ev);
            tool.started = false;
            img_update();
        }
    };
};

// Rectangle Tool
tools.rect = function () {
    var tool = this;
    this.started = false;
    this.mousedown = function (ev) {
        tool.started = true;
        tool.x0 = ev._x;
        tool.y0 = ev._y;
    };
    this.mousemove = function (ev) {
        if (!tool.started) {return;}
        var x = Math.min(ev._x,  tool.x0),
        y = Math.min(ev._y,  tool.y0),
        w = Math.abs(ev._x - tool.x0),
        h = Math.abs(ev._y - tool.y0);
        context.clearRect(0, 0, canvas.width, canvas.height);
        if (!w || !h) {return;}
        context.strokeRect(x, y, w, h);
    };
    this.mouseup = function (ev) {
        if (tool.started) {
            tool.mousemove(ev);
            tool.started = false;
            img_update();
        }
    };
};

// Line Tool
tools.line = function () {
    var tool = this;
    this.started = false;
    this.mousedown = function (ev) {
        tool.started = true;
        tool.x0 = ev._x;
        tool.y0 = ev._y;
    };
    this.mousemove = function (ev) {
        if (!tool.started) {return;}
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.beginPath();
        context.moveTo(tool.x0, tool.y0);
        context.lineTo(ev._x, ev._y);
        context.stroke();
        context.closePath();
    };
    this.mouseup = function (ev) {
        if (tool.started) {
            tool.mousemove(ev);
            tool.started = false;
            img_update();
        }
    };
};

init();}, false);}

// Save Canvas To Image
document.getElementById('canvasSaver').addEventListener('click', () => {
    var imgdCanvas = document.getElementById('drawingCanvas').toDataURL("image/png");
    document.getElementById('downloadImage').href = imgdCanvas;
});

// Chalk Tip Widt
document.getElementById('strokeNumber').addEventListener('change', () => {
    context.lineWidth = document.getElementById('strokeNumber').value;
});

function tipChanger (size) {
    context.lineWidth = size;
    document.getElementById('strokeNumber').value = size;
}

// Eraser
var originalTip = 1;
var originalTool = 'chalk';
var eraseFlag = false;
function erase () {
    eraseFlag = true;
    originalTip = context.lineWidth;
    originalTool = document.getElementById('selector').value;
    context.strokeStyle = '#424242';
    tipChanger(30);
    document.getElementById('selector').value = 'chalk';
    if (tools['chalk']) {
        tool = new tools['chalk']();
    }
    document.getElementById('selector').disabled = true;
}

// Color Swatch
var colorPalette = [
    "#000000","#000000","#000000","#000000","#003300","#006600","#009900","#00CC00","#00FF00","#330000","#333300","#336600","#339900","#33CC00","#33FF00","#660000","#663300","#666600","#669900","#66CC00","#66FF00",
    "#000000","#333333","#000000","#000033","#003333","#006633","#009933","#00CC33","#00FF33","#330033","#333333","#336633","#339933","#33CC33","#33FF33","#660033","#663333","#666633","#669933","#66CC33","#66FF33",
    "#000000","#666666","#000000","#000066","#003366","#006666","#009966","#00CC66","#00FF66","#330066","#333366","#336666","#339966","#33CC66","#33FF66","#660066","#663366","#666666","#669966","#66CC66","#66FF66",
    "#000000","#999999","#000000","#000099","#003399","#006699","#009999","#00CC99","#00FF99","#330099","#333399","#336699","#339999","#33CC99","#33FF99","#660099","#663399","#666699","#669999","#66CC99","#66FF99",
    "#000000","#CCCCCC","#000000","#0000CC","#0033CC","#0066CC","#0099CC","#00CCCC","#00FFCC","#3300CC","#3333CC","#3366CC","#3399CC","#33CCCC","#33FFCC","#6600CC","#6633CC","#6666CC","#6699CC","#66CCCC","#66FFCC",
    "#000000","#FFFFFF","#000000","#0000FF","#0033FF","#0066FF","#0099FF","#00CCFF","#00FFFF","#3300FF","#3333FF","#3366FF","#3399FF","#33CCFF","#33FFFF","#6600FF","#6633FF","#6666FF","#6699FF","#66CCFF","#66FFFF",
    "#000000","#FF0000","#000000","#990000","#993300","#996600","#999900","#99CC00","#99FF00","#CC0000","#CC3300","#CC6600","#CC9900","#CCCC00","#CCFF00","#FF0000","#FF3300","#FF6600","#FF9900","#FFCC00","#FFFF00",
    "#000000","#00FF00","#000000","#990033","#993333","#996633","#999933","#99CC33","#99FF33","#CC0033","#CC3333","#CC6633","#CC9933","#CCCC33","#CCFF33","#FF0033","#FF3333","#FF6633","#FF9933","#FFCC33","#FFFF33",
    "#000000","#0000FF","#000000","#990066","#993366","#996666","#999966","#99CC66","#99FF66","#CC0066","#CC3366","#CC6666","#CC9966","#CCCC66","#CCFF66","#FF0066","#FF3366","#FF6666","#FF9966","#FFCC66","#FFFF66",
    "#000000","#FFFF00","#000000","#990099","#993399","#996699","#999999","#99CC99","#99FF99","#CC0099","#CC3399","#CC6699","#CC9999","#CCCC99","#CCFF99","#FF0099","#FF3399","#FF6699","#FF9999","#FFCC99","#FFFF99",
    "#000000","#00FFFF","#000000","#9900CC","#9933CC","#9966CC","#9999CC","#99CCCC","#99FFCC","#CC00CC","#CC33CC","#CC66CC","#CC99CC","#CCCCCC","#CCFFCC","#FF00CC","#FF33CC","#FF66CC","#FF99CC","#FFCCCC","#FFFFCC",
    "#000000","#FF00FF","#000000","#9900FF","#9933FF","#9966FF","#9999FF","#99CCFF","#99FFFF","#CC00FF","#CC33FF","#CC66FF","#CC99FF","#CCCCFF","#CCFFFF","#FF00FF","#FF33FF","#FF66FF","#FF99FF","#FFCCFF","#FFFFFF"
];

window.addEventListener('load', () => {
    document.getElementById('colorTable').style.display = 'none';

    document.getElementById('color').addEventListener ('click', () => {
        if(document.getElementById('colorTable').style.display != 'none') {
            document.getElementById('colorTable').style.display = 'none';
        }
        else {
            document.getElementById('colorTable').style.display = 'unset';
            canvas.addEventListener('mousedown', () => {
                document.getElementById('colorTable').style.display = 'none';
            });
            document.getElementById('colorTable').addEventListener('click', () => {
                document.getElementById('colorTable').style.display = 'none';
            })
        }
    });
});

function LoadColorTable () {
    for(var i=0; i<colorPalette.length; i++) {
        var colorDiv = document.createElement('div');
        colorDiv.className = 'color';
        colorDiv.id = 'colorSwatch' + i;
        colorDiv.style.backgroundColor = colorPalette[i];
        colorDiv.setAttribute('onclick', 'setColor(id);');
        document.getElementById('colorTable').appendChild(colorDiv);
    };
}

function setColor (id) {
    context.strokeStyle = document.getElementById(id).style.backgroundColor;
    if (eraseFlag==true) {
        tipChanger(originalTip); eraseFlag = false;
    }
    document.getElementById('selector').value = originalTool;
    if (tools[originalTool]) {
        tool = new tools[originalTool]();
    }
    document.getElementById('selector').disabled = false;
}

// Clear Canvas
document.getElementById('clearPad').addEventListener('click', () => {
    location.reload();
});

// Adding Year In Footer
var date = new Date;
window.addEventListener('load', () => {
    document.getElementById('copyYear').innerHTML = date.getFullYear();
})