import { getRLetterData, get9NumberData, getNLetterData } from './data.js'; 
import * as matrix from './helper.js';
import { IOState, initIO } from './IOHandler.js';

const CAMERA_POSITION = [0, 0, 5];

function main() {
    const canvas = document.getElementById('gl-canvas');
    initIO(canvas);

    const gl = canvas.getContext('webgl');
    if (!gl) {
        console.error("WebGL is not supported by your browser.");
        return;
    }

    const vsSource = document.getElementById('vertex-shader').text;
    const fsSource = document.getElementById('fragment-shader').text;
    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

    const programInfo = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, 'a_position'),
            vertexNormal: gl.getAttribLocation(shaderProgram, 'a_normal'),
            vertexColor: gl.getAttribLocation(shaderProgram, 'a_color'),
        },
        uniformLocations: {
            projectionMatrix: gl.getUniformLocation(shaderProgram, 'u_projectionMatrix'),
            viewMatrix: gl.getUniformLocation(shaderProgram, 'u_viewMatrix'),
            modelMatrix: gl.getUniformLocation(shaderProgram, 'u_modelMatrix'),
            normalMatrix: gl.getUniformLocation(shaderProgram, 'u_normalMatrix'),
            
            lightPosition: gl.getUniformLocation(shaderProgram, 'u_lightPosition'),
            lightColor: gl.getUniformLocation(shaderProgram, 'u_lightColor'),
            ambientLight: gl.getUniformLocation(shaderProgram, 'u_ambientLight'),
            
            materialAmbient: gl.getUniformLocation(shaderProgram, 'u_materialAmbient'),

            materialSpecular: gl.getUniformLocation(shaderProgram, 'u_materialSpecular'),
            materialShininess: gl.getUniformLocation(shaderProgram, 'u_materialShininess'),

            viewPosition: gl.getUniformLocation(shaderProgram, 'u_viewPosition'),
        },
    };
    
    const rLetterData = getRLetterData();
    const nLetterData = getNLetterData();
    const nineNumberData = get9NumberData();
    const rBuffers = {};
    for (const partName in rLetterData) {
        rBuffers[partName] = initBuffers(gl, rLetterData[partName]);
    }
    const nBuffers = {};
    for (const partName in nLetterData) {
        nBuffers[partName] = initBuffers(gl, nLetterData[partName]);
    }
    const nineBuffers = {};
    for (const partName in nineNumberData) {
        nineBuffers[partName] = initBuffers(gl, nineNumberData[partName]);
    }
    let lastTime = 0;
    function render(now) {
        now *= 0.001;
        const deltaTime = now - lastTime;
        lastTime = now;
        if (!IOState.freeze && !IOState.isDragging) {
            IOState.rotationX += deltaTime * 0.3;
            IOState.rotationY += deltaTime * 0.5;
        }
        drawScene(gl, programInfo, rBuffers, nineBuffers, nBuffers, IOState.rotationX, IOState.rotationY);
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}

function initBuffers(gl, partData) {
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(partData.vertices), gl.STATIC_DRAW);

    const normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(partData.normals), gl.STATIC_DRAW);

    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(partData.diffuseColors), gl.STATIC_DRAW);

    return {
        position: positionBuffer,
        normal: normalBuffer,
        color: colorBuffer,
        vertexCount: partData.vertices.length / 3,
    };
}


function drawObject(gl, programInfo, buffers, modelMatrix) {
    const normalMatrix = matrix.createNormalMatrix(modelMatrix);
    gl.uniformMatrix4fv(programInfo.uniformLocations.normalMatrix, false, normalMatrix);
    gl.uniformMatrix4fv(programInfo.uniformLocations.modelMatrix, false, modelMatrix);

    gl.uniform3fv(programInfo.uniformLocations.materialAmbient, [1.0, 1.0, 1.0]);
    gl.uniform3fv(programInfo.uniformLocations.materialSpecular, [0.9, 0.9, 0.9]); 
    gl.uniform1f(programInfo.uniformLocations.materialShininess, 32.0); 

    for (const partName in buffers) {
        const buffer = buffers[partName];
        
        //atur pointer untuk posisi
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer.position);
        gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
        
        //atur pointer untuk normal
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer.normal);
        gl.vertexAttribPointer(programInfo.attribLocations.vertexNormal, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(programInfo.attribLocations.vertexNormal);
        
        //atur pointer untuk warna (diffuse)
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer.color);
        gl.vertexAttribPointer(programInfo.attribLocations.vertexColor, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);
        
        gl.drawArrays(gl.TRIANGLES, 0, buffer.vertexCount);
    }
}

function drawScene(gl, programInfo, rBuffers, nineBuffers, nBuffers, rotX, rotY) {
    const displayWidth  = gl.canvas.clientWidth;
    const displayHeight = gl.canvas.clientHeight;
    if (gl.canvas.width  !== displayWidth || gl.canvas.height !== displayHeight) {
        gl.canvas.width  = displayWidth;
        gl.canvas.height = displayHeight;
    }
    
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0.1, 0.1, 0.15, 1.0); 
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const fov = 45 * Math.PI / 180;
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const projectionMatrix = matrix.createPerspectiveMatrix(fov, aspect, 0.1, 100.0);
    const viewMatrix = matrix.createLookAtMatrix(CAMERA_POSITION, [0, 0, 0], [0, 1, 0]);

    gl.useProgram(programInfo.program);

    gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
    gl.uniformMatrix4fv(programInfo.uniformLocations.viewMatrix, false, viewMatrix);
    gl.uniform3fv(programInfo.uniformLocations.viewPosition, CAMERA_POSITION);

    //atur cahaya
    const lightPosition = [2.0, 3.0, 4.0]; 
    gl.uniform3fv(programInfo.uniformLocations.lightPosition, lightPosition);
    gl.uniform3fv(programInfo.uniformLocations.lightColor, [1.0, 1.0, 1.0]);
    gl.uniform3fv(programInfo.uniformLocations.ambientLight, [0.1, 0.1, 0.1]); 

    const baseRotation = matrix.multiply(matrix.rotateY(rotY), matrix.rotateX(rotX));
    
    const rTranslation = matrix.translation(-1.2, 0, 0); 
    const rModelMatrix = matrix.multiply(rTranslation, baseRotation);
    drawObject(gl, programInfo, rBuffers, rModelMatrix);

    const nTranslation = matrix.translation(0.0, 0, 0); 
    const nModelMatrix = matrix.multiply(nTranslation, baseRotation);
    drawObject(gl, programInfo, nBuffers, nModelMatrix);

    const nineTranslation = matrix.translation(1.2, 0, 0);
    const nineModelMatrix = matrix.multiply(nineTranslation, baseRotation);
    drawObject(gl, programInfo, nineBuffers, nineModelMatrix);
}


function initShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.error('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
        return null;
    }
    return shaderProgram;
}

function loadShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;}
    return shader;
}

main();