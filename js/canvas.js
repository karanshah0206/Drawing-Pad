var context, contexto, canvas, canvaso, container, tool, tool_default='chalk';

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
}