import { initBuffers } from "./init-buffers.js";
import { drawScene } from "./draw-scene.js";
import { cards, closeCanvas, mouse, openedCardId } from "./script.js";

const rotationSpeed = 1.2;
let face;
let rotateHandler;
let quitHandler;
let animationId;
const initialFace = 'front';

export function initWebglPostcard() {
    face = initialFace;
    const rotateBtn = document.getElementById('canvas-rotate');
    const quitBtn = document.getElementById('canvas-quit');

    if (rotateHandler) {
        rotateBtn.removeEventListener('click', rotateHandler);
        rotateHandler = null;
    }

    if (quitHandler) {
        quitBtn.removeEventListener('click', quitHandler);
        quitHandler = null;
    }

    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }

    const canvas = document.querySelector("#glcanvas");

    rotateHandler = () => {
        face = face === 'front' ? 'back' : 'front';
    }

    document.getElementById('canvas-rotate').addEventListener('click', rotateHandler)

    quitHandler = () => {
        closeCanvas();
    }
    document.getElementById('canvas-quit').addEventListener('click', quitHandler)

    const gl = canvas.getContext("webgl", { antialias: true });

    if (gl === null) {
        alert(
            "Unable to initialize WebGL. Your browser or machine may not support it."
        );
        return;
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec2 aTextureCoord;
    attribute float aTexIndex;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying highp vec2 vTextureCoord;
    varying lowp float vTexIndex;

    void main(void) {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vTextureCoord = aTextureCoord;
      vTexIndex = aTexIndex;
    }
  `;

    const fsSource = `
    varying highp vec2 vTextureCoord;
    varying lowp float vTexIndex;

    uniform sampler2D uSampler1;
    uniform sampler2D uSampler2;

    void main(void) {
        gl_FragColor = mix(
            texture2D(uSampler1, vTextureCoord),
            texture2D(uSampler2, vTextureCoord),
            vTexIndex
        );
    }
  `;

    // Initialize a shader program; this is where all the lighting
    // for the vertices and so forth is established.
    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

    // Collect all the info needed to use the shader program.
    // Look up which attributes our shader program is using
    // for aVertexPosition, aVertexColor and also
    // look up uniform locations.
    const programInfo = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
            textureCoord: gl.getAttribLocation(shaderProgram, "aTextureCoord"),
            texIndex: gl.getAttribLocation(shaderProgram, 'aTexIndex'),
        },
        uniformLocations: {
            projectionMatrix: gl.getUniformLocation(shaderProgram, "uProjectionMatrix"),
            modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
            uSampler1: gl.getUniformLocation(shaderProgram, 'uSampler1'),
            uSampler2: gl.getUniformLocation(shaderProgram, 'uSampler2'),
        },
    };

    const openedCard = cards.find(c => c.id === openedCardId)
    // Here's where we call the routine that builds all the
    // objects we'll be drawing.
    const buffers = initBuffers(gl, openedCard.width, openedCard.height, openedCard.width > openedCard.height ? 4 : 3);

    // Load texture
    const texture1 = loadTexture(gl, `./assets/images/700/${openedCardId}a.webp`);
    const texture2 = loadTexture(gl, `./assets/images/700/${openedCardId}b.webp`);
    // Flip image pixels into the bottom-to-top order that WebGL expects.
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    // Draw the scene repeatedly
    function render() {
        drawScene(gl, programInfo, buffers, texture1, texture2, (face === 'back' ? Math.PI : 0) + rotationSpeed * (mouse.x - (gl.canvas.clientWidth / 2)) / gl.canvas.clientWidth, rotationSpeed * (mouse.y - (gl.canvas.clientHeight / 2)) / gl.canvas.clientHeight);

        animationId = requestAnimationFrame(render);
    }
    animationId = requestAnimationFrame(render);
}

//
// Initialize a shader program, so WebGL knows how to draw our data
//
function initShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    // Create the shader program

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert(
            `Unable to initialize the shader program: ${gl.getProgramInfoLog(
                shaderProgram
            )}`
        );
        return null;
    }

    return shaderProgram;
}

//
// creates a shader of the given type, uploads the source and
// compiles it.
//
function loadShader(gl, type, source) {
    const shader = gl.createShader(type);

    gl.shaderSource(shader, source);

    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(
            `An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`
        );
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

//
// Initialize a texture and load an image.
// When the image finished loading copy it into the texture.
//
function loadTexture(gl, url) {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Because images have to be downloaded over the internet
    // they might take a moment until they are ready.
    // Until then put a single pixel in the texture so we can
    // use it immediately. When the image has finished downloading
    // we'll update the texture with the contents of the image.
    const level = 0;
    const internalFormat = gl.RGBA;
    const width = 1;
    const height = 1;
    const border = 0;
    const srcFormat = gl.RGBA;
    const srcType = gl.UNSIGNED_BYTE;
    const pixel = new Uint8Array([255, 255, 255, 255]); // opaque blue
    gl.texImage2D(
        gl.TEXTURE_2D,
        level,
        internalFormat,
        width,
        height,
        border,
        srcFormat,
        srcType,
        pixel,
    );

    const image = new Image();
    image.onload = () => {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(
            gl.TEXTURE_2D,
            level,
            internalFormat,
            srcFormat,
            srcType,
            image,
        );

        // WebGL1 has different requirements for power of 2 images
        // vs. non power of 2 images so check if the image is a
        // power of 2 in both dimensions.
        if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
            // Yes, it's a power of 2. Generate mips.
            gl.generateMipmap(gl.TEXTURE_2D);
        } else {
            // No, it's not a power of 2. Turn off mips and set
            // wrapping to clamp to edge
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        }
    };
    image.src = url;

    return texture;
}

function isPowerOf2(value) {
    return (value & (value - 1)) === 0;
}