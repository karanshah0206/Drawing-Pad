var context, contexto, canvas, canvaso, tool, tool_default='chalk', func, tools={};

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
})