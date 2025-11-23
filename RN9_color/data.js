function generateFaceColoredData(vertices, indices, faceDiffuseColors) {

    const expandedVertices = [];
    const expandedNormals = [];
    const expandedDiffuseColors = [];

    for (let i = 0; i < indices.length; i += 6) {
        const i1 = indices[i] * 3;
        const i2 = indices[i + 1] * 3;
        const i3 = indices[i + 2] * 3;

        const v1 = [vertices[i1], vertices[i1+1], vertices[i1+2]];
        const v2 = [vertices[i2], vertices[i2+1], vertices[i2+2]];
        const v3 = [vertices[i3], vertices[i3+1], vertices[i3+2]];

        const u = [v2[0] - v1[0], v2[1] - v1[1], v2[2] - v1[2]];
        const v = [v3[0] - v1[0], v3[1] - v1[1], v3[2] - v1[2]];

        const normal = [
            u[1] * v[2] - u[2] * v[1],
            u[2] * v[0] - u[0] * v[2],
            u[0] * v[1] - u[1] * v[0]
        ];

        const length = Math.sqrt(normal[0]**2 + normal[1]**2 + normal[2]**2);
        normal[0] /= length; normal[1] /= length; normal[2] /= length;

        const faceIndex = i / 6;
        const diffuseColor = faceDiffuseColors[faceIndex % faceDiffuseColors.length];
        //setiap 1 sisi terdapat 6 titik
        for (let j = 0; j < 6; j++) {
            const vertexIndex = indices[i + j];
            const vx = vertices[vertexIndex * 3];
            const vy = vertices[vertexIndex * 3 + 1];
            const vz = vertices[vertexIndex * 3 + 2];
            expandedVertices.push(vx, vy, vz);
            expandedNormals.push(normal[0], normal[1], normal[2]);
            expandedDiffuseColors.push(diffuseColor[0], diffuseColor[1], diffuseColor[2]);
        }
    }
    return { vertices: expandedVertices, normals: expandedNormals, diffuseColors: expandedDiffuseColors };
}

export function getRLetterData() {
    const pinkColor = [ [0.9, 0.25, 0.6] ]; 

    const stemDef = { //batang R bagian |
        vertices: [ -0.5,-0.5, .2, -0.2,-0.5, .2, -0.2,1, .2, -0.5,1, .2, -0.5,-0.5,-.2, -0.2,-0.5,-.2, -0.2,1,-.2, -0.5,1,-.2 ],
        indices: [ 0,1,2, 0,2,3, 1,5,6, 1,6,2, 5,4,7, 5,7,6, 4,0,3, 4,3,7, 3,2,6, 3,6,7, 4,5,1, 4,1,0 ]};
    const rCurveTopDef = { //lengkungan R bagian -
        vertices: [ -0.2,0.9,.2, 0.3,0.9,.2, 0.3,1.0,.2, -0.2,1.0,.2, -0.2,0.9,-.2, 0.3,0.9,-.2, 0.3,1.0,-.2, -0.2,1.0,-.2 ],
        indices: [ 0,1,2, 0,2,3, 1,5,6, 1,6,2, 5,4,7, 5,7,6, 4,0,3, 4,3,7, 3,2,6, 3,6,7, 4,5,1, 4,1,0 ]};
    const rCurveBottomDef = { //lengkungan R bagian _
        vertices: [ -0.2,0.3,.2, 0.3,0.3,.2, 0.3,0.4,.2, -0.2,0.4,.2, -0.2,0.3,-.2, 0.3,0.3,-.2, 0.3,0.4,-.2, -0.2,0.4,-.2 ],
        indices: [ 0,1,2, 0,2,3, 1,5,6, 1,6,2, 5,4,7, 5,7,6, 4,0,3, 4,3,7, 3,2,6, 3,6,7, 4,5,1, 4,1,0 ]};
    const rCurveRightDef = { //lengkungan R bagian |
        vertices: [ 0.2,0.4,.2, 0.3,0.4,.2, 0.3,0.9,.2, 0.2,0.9,.2, 0.2,0.4,-.2, 0.3,0.4,-.2, 0.3,0.9,-.2, 0.2,0.9,-.2 ],
        indices: [ 0,1,2, 0,2,3, 1,5,6, 1,6,2, 5,4,7, 5,7,6, 4,0,3, 4,3,7, 3,2,6, 3,6,7, 4,5,1, 4,1,0 ]};

    const legDef = { //kaki R bagian \
        vertices: [ -0.2,.3,.2, 0,.3,.2, 0.5,-0.5,.2, 0.3,-0.5,.2, -0.2,.3,-.2, 0,.3,-.2, 0.5,-0.5,-.2, 0.3,-0.5,-.2 ],
        indices: [ 
            0,2,1, 0,3,2, //depan (dibalik)
            1,6,5, 1,2,6, //kanan
            5,7,4, 5,6,7, //belakang
            4,3,0, 4,7,3, //kiri (dibalik)
            1,4,0, 1,5,4, //atas (dibalik)
            3,6,2, 3,7,6  //bawah
        ]
    };

    return {
        stem: generateFaceColoredData(stemDef.vertices, stemDef.indices, pinkColor),
        curveTop: generateFaceColoredData(rCurveTopDef.vertices, rCurveTopDef.indices, pinkColor),
        curveBottom: generateFaceColoredData(rCurveBottomDef.vertices, rCurveBottomDef.indices, pinkColor),
        curveRight: generateFaceColoredData(rCurveRightDef.vertices, rCurveRightDef.indices, pinkColor),
        leg: generateFaceColoredData(legDef.vertices, legDef.indices, pinkColor),
    };

}

export function getNLetterData() {
    const purpleColor = [ [0.6, 0.3, 0.9] ];

    const leftBarDef = { //batang N bagian | kiri
        vertices: [ -0.4,-0.5, .2, -0.2,-0.5, .2, -0.2,1.0, .2, -0.4,1.0, .2, -0.4,-0.5,-.2, -0.2,-0.5,-.2, -0.2,1.0,-.2, -0.4,1.0,-.2 ],
        indices: [ 0,1,2, 0,2,3, 1,5,6, 1,6,2, 5,4,7, 5,7,6, 4,0,3, 4,3,7, 3,2,6, 3,6,7, 4,5,1, 4,1,0 ]
    };
    const rightBarDef = {  //batang N bagian | kanan
        vertices: [ 0.2,-0.5, .2,  0.4,-0.5, .2,  0.4,1.0, .2,  0.2,1.0, .2, 0.2,-0.5,-.2,  0.4,-0.5,-.2,  0.4,1.0,-.2,  0.2,1.0,-.2 ],
        indices: [ 0,1,2, 0,2,3, 1,5,6, 1,6,2, 5,4,7, 5,7,6, 4,0,3, 4,3,7, 3,2,6, 3,6,7, 4,5,1, 4,1,0 ]
    };
    const diagDef = { //diagonal N bagian \
        vertices: [
            -0.2,  0.65,  0.19, 0.2, -0.5,   0.19, 0.2, -0.15,  0.19, -0.2,  1.0,   0.19,
            -0.2,  0.65, -0.19, 0.2, -0.5,  -0.19, 0.2, -0.15, -0.19, -0.2,  1.0,  -0.19
        ],
        indices: [ 0,1,2, 0,2,3, 1,5,6, 1,6,2, 5,4,7, 5,7,6, 4,0,3, 4,3,7, 3,2,6, 3,6,7, 4,5,1, 4,1,0 ]
    };

    return {
        leftBar: generateFaceColoredData(leftBarDef.vertices, leftBarDef.indices, purpleColor),
        diagonal: generateFaceColoredData(diagDef.vertices, diagDef.indices, purpleColor),
        rightBar: generateFaceColoredData(rightBarDef.vertices, rightBarDef.indices, purpleColor)
    };
}

export function get9NumberData() {
    const blueColor = [ [0.2, 0.6, 1.0] ]; 

    const nineTopBarDef = { //batang 9 bagian -
        vertices: [ -0.4,0.8,.2, 0.4,0.8,.2, 0.4,1.0,.2, -0.4,1.0,.2, -0.4,0.8,-.2, 0.4,0.8,-.2, 0.4,1.0,-.2, -0.4,1.0,-.2 ],
        indices: [ 0,1,2, 0,2,3, 1,5,6, 1,6,2, 5,4,7, 5,7,6, 4,0,3, 4,3,7, 3,2,6, 3,6,7, 4,5,1, 4,1,0 ]
    };
    const nineBottomBarDef = { //batang 9 bagian _
        vertices: [ -0.4,0.2,.2, 0.4,0.2,.2, 0.4,0.4,.2, -0.4,0.4,.2, -0.4,0.2,-.2, 0.4,0.2,-.2, 0.4,0.4,-.2, -0.4,0.4,-.2 ],
        indices: [ 0,1,2, 0,2,3, 1,5,6, 1,6,2, 5,4,7, 5,7,6, 4,0,3, 4,3,7, 3,2,6, 3,6,7, 4,5,1, 4,1,0 ]
    };
    const nineLeftBarDef = { //batang 9 bagian | kiri
        vertices: [ -0.4,0.4,.2, -0.2,0.4,.2, -0.2,0.8,.2, -0.4,0.8,.2, -0.4,0.4,-.2, -0.2,0.4,-.2, -0.2,0.8,-.2, -0.4,0.8,-.2 ],
        indices: [ 0,1,2, 0,2,3, 1,5,6, 1,6,2, 5,4,7, 5,7,6, 4,0,3, 4,3,7, 3,2,6, 3,6,7, 4,5,1, 4,1,0 ]
    };
    const nineRightBarDef = { //batang 9 bagian | kanan
        vertices: [ 0.2,0.4,.2, 0.4,0.4,.2, 0.4,0.8,.2, 0.2,0.8,.2, 0.2,0.4,-.2, 0.4,0.4,-.2, 0.4,0.8,-.2, 0.2,0.8,-.2 ],
        indices: [ 0,1,2, 0,2,3, 1,5,6, 1,6,2, 5,4,7, 5,7,6, 4,0,3, 4,3,7, 3,2,6, 3,6,7, 4,5,1, 4,1,0 ]
    };
    const nineLegDef = { //kaki 9 bagian |
        vertices: [ 0.1,-0.5,.2, 0.4,-0.5,.2, 0.4,0.2,.2, 0.1,0.2,.2, 0.1,-0.5,-.2, 0.4,-0.5,-.2, 0.4,0.2,-.2, 0.1,0.2,-.2 ],
        indices: [ 0,1,2, 0,2,3, 1,5,6, 1,6,2, 5,4,7, 5,7,6, 4,0,3, 4,3,7, 3,2,6, 3,6,7, 4,5,1, 4,1,0 ]
    };

    return {
        topBar: generateFaceColoredData(nineTopBarDef.vertices, nineTopBarDef.indices, blueColor),
        bottomBar: generateFaceColoredData(nineBottomBarDef.vertices, nineBottomBarDef.indices, blueColor),
        leftBar: generateFaceColoredData(nineLeftBarDef.vertices, nineLeftBarDef.indices, blueColor),
        rightBar: generateFaceColoredData(nineRightBarDef.vertices, nineRightBarDef.indices, blueColor),
        leg: generateFaceColoredData(nineLegDef.vertices, nineLegDef.indices, blueColor),
    };
}