//interaksi user spy bisa putar
export const IOState = {
    freeze: false,
    isDragging: false,
    rotationX: 0,
    rotationY: 0,
};

//posisi mouse terakhir
let lastMouseX = 0;
let lastMouseY = 0;

export function initIO(canvas) {
    document.addEventListener('keydown', onKeydown, false);
    document.addEventListener('keyup', onKeyup, false);

    canvas.addEventListener('mousedown', onMouseDown, false);
    document.addEventListener('mouseup', onMouseUp, false);
    document.addEventListener('mousemove', onMouseMove, false);
    
    document.addEventListener('click', onMouseClick, false);
}

function onMouseClick(event) {
    if (event.target.tagName === 'CANVAS') {
        IOState.freeze = !IOState.freeze;
    }
}

function onMouseDown(event) {
    IOState.isDragging = true;
    lastMouseX = event.clientX;
    lastMouseY = event.clientY;
}

function onMouseUp(event) {
    IOState.isDragging = false;
}

function onMouseMove(event) {
    if (!IOState.isDragging) {
        return;
    }

    const deltaX = event.clientX - lastMouseX;
    const deltaY = event.clientY - lastMouseY;

    IOState.rotationY += deltaX * 0.01;
    IOState.rotationX += deltaY * 0.01;

    lastMouseX = event.clientX;
    lastMouseY = event.clientY;
}


function onKeydown(event) {
    if (event.code === 'Space') {
        IOState.freeze = true;
    }
}

function onKeyup(event) {
    if (event.code === 'Space') {
        IOState.freeze = false;
    }
}

