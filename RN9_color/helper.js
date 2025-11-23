//bantu manipulasi matriks utk transformasi, tampilan kamera, proyeksi

export function multiply(a, b) {
    const out = new Float32Array(16);
    for (let i = 0; i < 4; i++) {           //iterasi baris matriks a
        for (let j = 0; j < 4; j++) {       //iterasi kolom matriks b
            out[i * 4 + j] = 0;
            for (let k = 0; k < 4; k++) {   //menjumlahkan hasil kali elemen baris dan kolom
                out[i * 4 + j] += a[i * 4 + k] * b[k * 4 + j];
            }
        }

    }
    return out;

}

export function translation(dx, dy, dz) {
    return new Float32Array([
        1.0, 0.0, 0.0, 0.0,
        0.0, 1.0, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
         dx,  dy,  dz, 1.0
    ]);
}

//perubahan ukuran objek
export function scale(sx, sy, sz) {
    return new Float32Array([
         sx, 0.0, 0.0, 0.0,
        0.0,  sy, 0.0, 0.0,
        0.0, 0.0,  sz, 0.0,
        0.0, 0.0, 0.0, 1.0
    ]);
}

export function rotateX(angle) {
    const s = Math.sin(angle);
    const c = Math.cos(angle);
    return new Float32Array([
        1.0, 0.0, 0.0, 0.0,
        0.0,   c,  -s, 0.0,
        0.0,   s,   c, 0.0,
        0.0, 0.0, 0.0, 1.0
    ]);
}


export function rotateY(angle) {
    const s = Math.sin(angle);
    const c = Math.cos(angle);
    return new Float32Array([
          c, 0.0,   s, 0.0,
        0.0, 1.0, 0.0, 0.0,
         -s, 0.0,   c, 0.0,
        0.0, 0.0, 0.0, 1.0
    ]);
}


export function rotateZ(angle) {
    const s = Math.sin(angle);
    const c = Math.cos(angle);
    return new Float32Array([
          c,  -s, 0.0, 0.0,
          s,   c, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        0.0, 0.0, 0.0, 1.0
    ]);
}

//matriks perspektif 
export function createPerspectiveMatrix(fov, aspect, near, far) {
    const f = 1.0 / Math.tan(fov / 2);
    const nf = 1 / (near - far);
    return new Float32Array([
        f / aspect, 0, 0, 0,
        0, f, 0, 0,
        0, 0, (far + near) * nf, -1,
        0, 0, 2 * far * near * nf, 0
    ]);
}

//tentuin arah pandang kamera
export function createLookAtMatrix(cameraPosition, targetPosition, upDirection) {
    //hitung vektor sumbu Z (arah pandang kamera)
    const zAxis = [
        cameraPosition[0] - targetPosition[0],
        cameraPosition[1] - targetPosition[1],
        cameraPosition[2] - targetPosition[2],
    ];
    let len = Math.hypot(zAxis[0], zAxis[1], zAxis[2]);
    if (len > 0) { zAxis[0] /= len; zAxis[1] /= len; zAxis[2] /= len; }

    //hitung sumbu X antara up dan Z
    const xAxis = [
        upDirection[1] * zAxis[2] - upDirection[2] * zAxis[1],
        upDirection[2] * zAxis[0] - upDirection[0] * zAxis[2],
        upDirection[0] * zAxis[1] - upDirection[1] * zAxis[0],
    ];
    len = Math.hypot(xAxis[0], xAxis[1], xAxis[2]);
    if (len > 0) { xAxis[0] /= len; xAxis[1] /= len; xAxis[2] /= len; }

    //hitung sumbu Y antara Z dan X
    const yAxis = [
        zAxis[1] * xAxis[2] - zAxis[2] * xAxis[1],
        zAxis[2] * xAxis[0] - zAxis[0] * xAxis[2],
        zAxis[0] * xAxis[1] - zAxis[1] * xAxis[0],
    ];

    //bentuk matriks view (kamera)
    return new Float32Array([
        xAxis[0], yAxis[0], zAxis[0], 0,
        xAxis[1], yAxis[1], zAxis[1], 0,
        xAxis[2], yAxis[2], zAxis[2], 0,
        -(xAxis[0] * cameraPosition[0] + xAxis[1] * cameraPosition[1] + xAxis[2] * cameraPosition[2]),
        -(yAxis[0] * cameraPosition[0] + yAxis[1] * cameraPosition[1] + yAxis[2] * cameraPosition[2]),
        -(zAxis[0] * cameraPosition[0] + zAxis[1] * cameraPosition[1] + zAxis[2] * cameraPosition[2]),
        1,
    ]);
}

//untuk cahaya dan permukaan
export function createNormalMatrix(m) {
    const out = new Float32Array(16);
    const inv = new Float32Array(16);

    //itung matriks invers manual (rumus determinan minor)
    inv[0]  =  m[5] * m[10] * m[15] - m[5] * m[11] * m[14] - m[9] * m[6] * m[15] + m[9] * m[7] * m[14] + m[13] * m[6] * m[11] - m[13] * m[7] * m[10];
    inv[4]  = -m[4] * m[10] * m[15] + m[4] * m[11] * m[14] + m[8] * m[6] * m[15] - m[8] * m[7] * m[14] - m[12] * m[6] * m[11] + m[12] * m[7] * m[10];
    inv[8]  =  m[4] * m[9] * m[15] - m[4] * m[11] * m[13] - m[8] * m[5] * m[15] + m[8] * m[7] * m[13] + m[12] * m[5] * m[11] - m[12] * m[7] * m[9];
    inv[12] = -m[4] * m[9] * m[14] + m[4] * m[10] * m[13] + m[8] * m[5] * m[14] - m[8] * m[6] * m[13] - m[12] * m[5] * m[10] + m[12] * m[6] * m[9];
    inv[1]  = -m[1] * m[10] * m[15] + m[1] * m[11] * m[14] + m[9] * m[2] * m[15] - m[9] * m[3] * m[14] - m[13] * m[2] * m[11] + m[13] * m[3] * m[10];
    inv[5]  =  m[0] * m[10] * m[15] - m[0] * m[11] * m[14] - m[8] * m[2] * m[15] + m[8] * m[3] * m[14] + m[12] * m[2] * m[11] - m[12] * m[3] * m[10];
    inv[9]  = -m[0] * m[9] * m[15] + m[0] * m[11] * m[13] + m[8] * m[1] * m[15] - m[8] * m[3] * m[13] - m[12] * m[1] * m[11] + m[12] * m[3] * m[9];
    inv[13] =  m[0] * m[9] * m[14] - m[0] * m[10] * m[13] - m[8] * m[1] * m[14] + m[8] * m[2] * m[13] + m[12] * m[1] * m[10] - m[12] * m[2] * m[9];
    inv[2]  =  m[1] * m[6] * m[15] - m[1] * m[7] * m[14] - m[5] * m[2] * m[15] + m[5] * m[3] * m[14] + m[13] * m[2] * m[7] - m[13] * m[3] * m[6];
    inv[6]  = -m[0] * m[6] * m[15] + m[0] * m[7] * m[14] + m[4] * m[2] * m[15] - m[4] * m[3] * m[14] - m[12] * m[2] * m[7] + m[12] * m[3] * m[6];
    inv[10] =  m[0] * m[5] * m[15] - m[0] * m[7] * m[13] - m[4] * m[1] * m[15] + m[4] * m[3] * m[13] + m[12] * m[1] * m[7] - m[12] * m[3] * m[5];
    inv[14] = -m[0] * m[5] * m[14] + m[0] * m[6] * m[13] + m[4] * m[1] * m[14] - m[4] * m[2] * m[13] - m[12] * m[1] * m[6] + m[12] * m[2] * m[5];
    inv[3]  = -m[1] * m[6] * m[11] + m[1] * m[7] * m[10] + m[5] * m[2] * m[11] - m[5] * m[3] * m[10] - m[9] * m[2] * m[7] + m[9] * m[3] * m[6];
    inv[7]  =  m[0] * m[6] * m[11] - m[0] * m[7] * m[10] - m[4] * m[2] * m[11] + m[4] * m[3] * m[10] + m[8] * m[2] * m[7] - m[8] * m[3] * m[6];
    inv[11] = -m[0] * m[5] * m[11] + m[0] * m[7] * m[9] + m[4] * m[1] * m[11] - m[4] * m[3] * m[9] - m[8] * m[1] * m[7] + m[8] * m[3] * m[5];
    inv[15] =  m[0] * m[5] * m[10] - m[0] * m[6] * m[9] - m[4] * m[1] * m[10] + m[4] * m[2] * m[9] + m[8] * m[1] * m[6] - m[8] * m[2] * m[5];

    //hitung determinan utk mastikan matriks bisa diinvers
    let det = m[0] * inv[0] + m[1] * inv[4] + m[2] * inv[8] + m[3] * inv[12];
    if (det === 0) { // kl ga bisa diinverse
        return m;
    }

    det = 1.0 / det;

    for (let i = 0; i < 16; i++) {
        out[i] = inv[i] * det;
    }
    
    //transposisi hasil invers agar jadi matriks normal (inverse transpose)
    const t = new Float32Array(16);
    t[0] = out[0]; t[1] = out[4]; t[2] = out[8]; t[3] = out[12];
    t[4] = out[1]; t[5] = out[5]; t[6] = out[9]; t[7] = out[13];
    t[8] = out[2]; t[9] = out[6]; t[10] = out[10]; t[11] = out[14];
    t[12] = out[3]; t[13] = out[7]; t[14] = out[11]; t[15] = out[15];

    return t;
}
