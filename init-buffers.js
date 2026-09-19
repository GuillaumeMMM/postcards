function initBuffers(gl, postcardWidth, postcardHeight, postcardSize) {
    const positionBuffer = initPositionBuffer(gl, postcardWidth, postcardHeight, postcardSize);

    const textureCoordBuffer = initTextureBuffer(gl);

    const useTextureBuffer = initUseTextureBuffer(gl);

    const texIndexBuffer = initTexIndexBuffer(gl);

    const indexBuffer = initIndexBuffer(gl);

    return {
        position: positionBuffer,
        textureCoord: textureCoordBuffer,
        useTexture: useTextureBuffer,
        texIndex: texIndexBuffer,
        indices: indexBuffer,
    };
}

function initPositionBuffer(gl, postcardWidth, postcardHeight, postcardSize) {
    const positionBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    const positions = createBoxPositions(postcardSize, postcardSize * postcardHeight / postcardWidth, 0.01);

    // Now pass the list of positions into WebGL to build the
    // shape. We do this by creating a Float32Array from the
    // JavaScript array, then use it to fill the current buffer.
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    return positionBuffer;
}

function initIndexBuffer(gl) {
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

    // This array defines each face as two triangles, using the
    // indices into the vertex array to specify each triangle's
    // position.

    const indices = [
        0,
        1,
        2,
        0,
        2,
        3, // front
        4,
        5,
        6,
        4,
        6,
        7, // back
        8,
        9,
        10,
        8,
        10,
        11, // top
        12,
        13,
        14,
        12,
        14,
        15, // bottom
        16,
        17,
        18,
        16,
        18,
        19, // right
        20,
        21,
        22,
        20,
        22,
        23, // left
    ];

    // Now send the element array to GL

    gl.bufferData(
        gl.ELEMENT_ARRAY_BUFFER,
        new Uint16Array(indices),
        gl.STATIC_DRAW
    );

    return indexBuffer;
}

function createBoxPositions(width, height, depth) {
    const x = width / 2;
    const y = height / 2;
    const z = depth / 2;

    return [
        // Front face
        -x, -y, z, x, -y, z, x, y, z, -x, y, z,

        // Back face
        -x, -y, -z, -x, y, -z, x, y, -z, x, -y, -z,

        // Top face
        -x, y, -z, -x, y, z, x, y, z, x, y, -z,

        // Bottom face
        -x, -y, -z, x, -y, -z, x, -y, z, -x, -y, z,

        // Right face
        x, -y, -z, x, y, -z, x, y, z, x, -y, z,

        // Left face
        -x, -y, -z, -x, -y, z, -x, y, z, -x, y, -z,
    ];
}

function initTextureBuffer(gl) {
    const textureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);

    const textureCoordinates = [
        // Front
        0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
        // Back
        1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0,
        // Top
        0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
        // Bottom
        0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
        // Right
        0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
        // Left
        0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
    ];

    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(textureCoordinates),
        gl.STATIC_DRAW,
    );

    return textureCoordBuffer;
}

function initUseTextureBuffer(gl) {
    const useTexturePerFace = [
        1.0, // Front face  -> textured
        1.0, // Back face   -> textured
        0.0, // Top face    -> flat color
        0.0, // Bottom face -> flat color
        0.0, // Right face  -> flat color
        0.0, // Left face   -> flat color
    ];

    let flags = [];
    for (let j = 0; j < useTexturePerFace.length; ++j) {
        const f = useTexturePerFace[j];
        flags = flags.concat(f, f, f, f);
    }

    const useTextureBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, useTextureBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(flags), gl.STATIC_DRAW);

    return useTextureBuffer;
}

function initTexIndexBuffer(gl) {
    const texIndexPerFace = [
        0.0,
        1.0,
        0.0,
        0.0,
        0.0,
        0.0,
    ];

    let indices = [];
    for (let j = 0; j < texIndexPerFace.length; ++j) {
        const v = texIndexPerFace[j];
        indices = indices.concat(v, v, v, v);
    }

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(indices), gl.STATIC_DRAW);

    return buffer;
}

export { initBuffers };