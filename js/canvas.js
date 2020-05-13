var context, contexto, canvas, canvaso, container, tool, tool_default='chalk', tool_select, func, tools={};

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
    container = canvaso.parentNode;
    canvas = document.createElement('canvas');
    if (!canvas) {
        alert('Error: Cannot Create Temporary Canvas.');
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
    tool_select = document.getElementById('selector');
    if (!tool_select) {
        alert('Error: Cannot Access Tool Selector.');
        return;
    }
    tool_select.addEventListener('change', ev_tool_change, false);
    if (toools[tool_default]) {
        tool = new tools[tool_default]();
        tool_select.value = tool_default;
    }
    
    // Canvas Listeners
    canvas.addEventListener('mousedown', ev_canvas, false);
    canvas.addEventListener('mousemove', ev_canvas, false);
    canvas.addEventListener('mouseup', ev_canvas, false);

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

    // Tool Selectro Value Changed
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
            tools.started = true;
            tool.x0 = ev._x;
            tool.y0 = ev._y;
        };
        this.mousemove = function (ev) {
            if (!tool.started) {return;}
            var x = Math.min(ev._x, tool.x0);
            var y = Math.min(ev._y, tool.y0);
            var w = Math.abs(ev._x, tool.x0);
            var h = Math.abs(ev._h, tool.h0);
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
}