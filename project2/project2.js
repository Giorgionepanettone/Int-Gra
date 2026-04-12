// This function takes the projection matrix, the translation, and two rotation angles (in radians) as input arguments.
// The two rotations are applied around x and y axes.
// It returns the combined 4x4 transformation matrix as an array in column-major order.
// The given projection matrix is also a 4x4 matrix stored as an array in column-major order.
// You can use the MatrixMult function defined in project4.html to multiply two 4x4 matrices in the same format.
function GetModelViewProjection( projectionMatrix, translationX, translationY, translationZ, rotationX, rotationY )
{
	var cosX = Math.cos(rotationX);
	var sinX = Math.sin(rotationX);

	var cosY = Math.cos(rotationY);
	var sinY = Math.sin(rotationY);

	var matrixRotX = [
		1, 0, 0, 0,
		0, cosX, sinX, 0,
		0, -sinX, cosX, 0,
		0, 0, 0, 1
	];
	var matrixRotY = [
		cosY, 0, -sinY, 0,
		0, 1, 0, 0,
		sinY, 0 , cosY, 0,
		0, 0, 0, 1
	];

	var matrixRot = MatrixMult(matrixRotX, matrixRotY);

	var trans = [
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		translationX, translationY, translationZ, 1
	];

	var matrixTransRot = MatrixMult(trans, matrixRot);
	var mvp = MatrixMult( projectionMatrix, matrixTransRot);
	return mvp;
}

// Vertex shader source code
var meshVS = `
	attribute vec3 pos;
	attribute vec2 txc;

	varying vec2 textCoord;

	uniform mat4 mvp;
	uniform bool swapYZ;
	uniform bool showText;

	void main()
	{
		if(swapYZ){
			gl_Position = mvp * vec4(pos[0], pos[2], pos[1], 1);
		}
		else{
			gl_Position = mvp * vec4(pos, 1);
		}
		
		textCoord = txc;

	}
`;

// Fragment shader source code
var meshFS = `
	precision mediump float;

	varying vec2 textCoord;
	
	uniform bool showText;
	uniform sampler2D text;

	void main()
	{
		if (showText){
			gl_FragColor = texture2D(text, textCoord);
		}
		else{
			gl_FragColor = vec4(1,gl_FragCoord.z*gl_FragCoord.z,0,1);
			}
	}
`;


class MeshDrawer
{
	// The constructor is a good place for taking care of the necessary initializations.
	constructor()
	{
		this.prog = InitShaderProgram(meshVS, meshFS);

		this.vertPos = gl.getAttribLocation(this.prog, "pos");
		this.txc = gl.getAttribLocation(this.prog, "txc");

		this.swapAxes = gl.getUniformLocation(this.prog, "swapYZ");
		this.showText = gl.getUniformLocation(this.prog, "showText");
		this.sampler = gl.getUniformLocation(this.prog, "text");
		this.mvp = gl.getUniformLocation(this.prog, "mvp");

		this.vertBuffer = gl.createBuffer();
		this.textCoordBuffer = gl.createBuffer();
		
		this.texture = gl.createTexture();
		this.useTexture = true;

		gl.useProgram(this.prog);
		gl.uniform1i(this.swapAxes, 0);
		gl.uniform1i(this.showText, 1);
	}
	
	// This method is called every time the user opens an OBJ file.
	// The arguments of this function is an array of 3D vertex positions
	// and an array of 2D texture coordinates.
	// Every item in these arrays is a floating point value, representing one
	// coordinate of the vertex position or texture coordinate.
	// Every three consecutive elements in the vertPos array forms one vertex
	// position and every three consecutive vertex positions form a triangle.
	// Similarly, every two consecutive elements in the texCoords array
	// form the texture coordinate of a vertex.
	// Note that this method can be called multiple times.
	setMesh( vertPos, textCoords )
	{
		// [TO-DO] Update the contents of the vertex buffer objects.
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertPos), gl.STATIC_DRAW);

		gl.bindBuffer(gl.ARRAY_BUFFER, this.textCoordBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textCoords), gl.STATIC_DRAW);

		this.numTriangles = vertPos.length / 3;
	}
	
	// This method is called when the user changes the state of the
	// "Swap Y-Z Axes" checkbox. 
	// The argument is a boolean that indicates if the checkbox is checked.
	swapYZ( swap )
	{
		gl.useProgram(this.prog);
		gl.uniform1i(this.swapAxes, swap);
	}
	
	// This method is called to draw the triangular mesh.
	// The argument is the transformation matrix, the same matrix returned
	// by the GetModelViewProjection function above.
	draw( trans )
	{
		gl.useProgram(this.prog);	
		gl.uniformMatrix4fv(this.mvp, false, trans);
		
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertBuffer);
		gl.enableVertexAttribArray(this.vertPos);
		gl.vertexAttribPointer(this.vertPos, 3, gl.FLOAT, false, 0, 0);
		
		if(this.useTexture){
			gl.bindBuffer(gl.ARRAY_BUFFER, this.textCoordBuffer);
			gl.enableVertexAttribArray(this.txc);
			gl.vertexAttribPointer(this.txc, 2, gl.FLOAT, false, 0, 0);
		}
		gl.drawArrays(gl.TRIANGLES, 0, this.numTriangles);
	}
	
	// This method is called to set the texture of the mesh.
	// The argument is an HTML IMG element containing the texture data.
	setTexture( img )
	{
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, this.texture);
		
		// You can set the texture image data using the following command.
		gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img );
		gl.generateMipmap(gl.TEXTURE_2D);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

		// some uniform parameter(s) of the fragment shader, so that it uses the texture.
		gl.useProgram(this.prog);
		gl.uniform1i(this.sampler, 0);
	}
	
	// This method is called when the user changes the state of the
	// "Show Texture" checkbox. 
	// The argument is a boolean that indicates if the checkbox is checked.
	showTexture( show )
	{
		gl.useProgram(this.prog);
		gl.uniform1i(this.showText, show);
		this.useTexture = show;
	}
	
}
