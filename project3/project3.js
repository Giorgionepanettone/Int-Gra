// This function takes the translation and two rotation angles (in radians) as input arguments.
// The two rotations are applied around x and y axes.
// It returns the combined 4x4 transformation matrix as an array in column-major order.
// You can use the MatrixMult function defined in project5.html to multiply two 4x4 matrices in the same format.
function GetModelViewMatrix( translationX, translationY, translationZ, rotationX, rotationY )
{
	// [TO-DO] Modify the code below to form the transformation matrix.
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

	var mv = MatrixMult(trans, matrixRot);
	return mv;
}

// Vertex shader source code
var meshVS = `
	attribute vec2 txc;
	attribute vec3 pos;
	attribute vec3 norm;

	varying vec2 textCoord;
	varying vec3 camera_norm;
	varying vec3 camera_vertPos;

	uniform mat3 normalMatrix;
	uniform mat4 mvp;
	uniform mat4 mv;
	uniform bool swapYZ;
	uniform bool showText;

	void main()
	{
		if(swapYZ){
			gl_Position = mvp * vec4(pos.xzy, 1);
			camera_vertPos = vec3(mv * vec4(pos.xzy, 1));	
			camera_norm = normalMatrix * norm.xzy;
		}
		else{
			gl_Position = mvp * vec4(pos, 1);
			camera_vertPos = vec3(mv * vec4(pos, 1));	
			camera_norm = normalMatrix * norm;
		}
		
		textCoord = txc;
	}
`;

// Fragment shader source code
var meshFS = `
	precision mediump float;

	varying vec2 textCoord;
	varying vec3 camera_norm;
	varying vec3 camera_vertPos;
	
	uniform bool showText;
	uniform bool texture_loaded;
	uniform sampler2D text;
	uniform vec3 camera_lightDirection;
	uniform float alpha;

	void main()
	{
		vec4 Kd;
		if (showText && texture_loaded){
			Kd = texture2D(text, textCoord);
		}
		else{
			Kd = vec4(1,1,1,1);
		}
		
		vec4 Ks = vec4(1,1,1,1);
		vec4 I = vec4(1,1,1,1);
		
		vec3 v = normalize(-camera_vertPos);
		vec3 w = normalize(camera_lightDirection);
		vec3 n = normalize(camera_norm);
		vec3 h = normalize(w + v);

		float cosphi = dot(n, h);
		float costheta = dot(n, w);

		gl_FragColor = I * (costheta * Kd + Ks * pow(cosphi, alpha)); //blinn
	}
`;

// [TO-DO] Complete the implementation of the following class.

class MeshDrawer
{
	// The constructor is a good place for taking care of the necessary initializations.
	constructor()
	{
		// [TO-DO] initializations
		this.prog = InitShaderProgram(meshVS, meshFS);

		this.vertPos = gl.getAttribLocation(this.prog, "pos");
		this.txc = gl.getAttribLocation(this.prog, "txc");
		this.norm = gl.getAttribLocation(this.prog, "norm");

		this.swapAxes = gl.getUniformLocation(this.prog, "swapYZ");
		this.showText = gl.getUniformLocation(this.prog, "showText");
		this.textureLoaded = gl.getUniformLocation(this.prog, "texture_loaded");
		this.sampler = gl.getUniformLocation(this.prog, "text");
		this.mvp = gl.getUniformLocation(this.prog, "mvp");
		this.mv = gl.getUniformLocation(this.prog, "mv");
		this.normalMatrix = gl.getUniformLocation(this.prog, "normalMatrix");
		this.shininess = gl.getUniformLocation(this.prog, "alpha");
		this.lightDirection = gl.getUniformLocation(this.prog, "camera_lightDirection");

		this.vertBuffer = gl.createBuffer();
		this.textCoordBuffer = gl.createBuffer();
		this.normBuffer = gl.createBuffer();
		
		this.texture = gl.createTexture();
		this.useTexture = true;

		gl.useProgram(this.prog);
		gl.uniform1i(this.swapAxes, 0);
		gl.uniform1i(this.showText, 1);
		gl.uniform1i(this.textureLoaded, 0);
	}
	
	// This method is called every time the user opens an OBJ file.
	// The arguments of this function is an array of 3D vertex positions,
	// an array of 2D texture coordinates, and an array of vertex normals.
	// Every item in these arrays is a floating point value, representing one
	// coordinate of the vertex position or texture coordinate.
	// Every three consecutive elements in the vertPos array forms one vertex
	// position and every three consecutive vertex positions form a triangle.
	// Similarly, every two consecutive elements in the texCoords array
	// form the texture coordinate of a vertex and every three consecutive 
	// elements in the normals array form a vertex normal.
	// Note that this method can be called multiple times.
	setMesh( vertPos, textCoords, normals )
	{
		// [TO-DO] Update the contents of the vertex buffer objects.
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertPos), gl.STATIC_DRAW);

		gl.bindBuffer(gl.ARRAY_BUFFER, this.textCoordBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textCoords), gl.STATIC_DRAW);

		gl.bindBuffer(gl.ARRAY_BUFFER, this.normBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);

		this.numTriangles = vertPos.length / 3;
	}
	
	// This method is called when the user changes the state of the
	// "Swap Y-Z Axes" checkbox. 
	// The argument is a boolean that indicates if the checkbox is checked.
	swapYZ( swap )
	{
		// [TO-DO] Set the uniform parameter(s) of the vertex shader
		gl.useProgram(this.prog);
		gl.uniform1i(this.swapAxes, swap);
	}
	
	// This method is called to draw the triangular mesh.
	// The arguments are the model-view-projection transformation matrixMVP,
	// the model-view transformation matrixMV, the same matrix returned
	// by the GetModelViewProjection function above, and the normal
	// transformation matrix, which is the inverse-transpose of matrixMV.
	draw( matrixMVP, matrixMV, matrixNormal )
	{
		// [TO-DO] Complete the WebGL initializations before drawing
		gl.useProgram(this.prog);	
		gl.uniformMatrix4fv(this.mvp, false, matrixMVP);
		gl.uniformMatrix4fv(this.mv, false, matrixMV);
		gl.uniformMatrix3fv(this.normalMatrix, false,  matrixNormal);

		
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertBuffer);
		gl.enableVertexAttribArray(this.vertPos);
		gl.vertexAttribPointer(this.vertPos, 3, gl.FLOAT, false, 0, 0);
		
		gl.bindBuffer(gl.ARRAY_BUFFER, this.normBuffer);
		gl.enableVertexAttribArray(this.norm);
		gl.vertexAttribPointer(this.norm, 3, gl.FLOAT, false, 0, 0);	

		if(this.useTexture){
			gl.bindBuffer(gl.ARRAY_BUFFER, this.textCoordBuffer);
			gl.enableVertexAttribArray(this.txc);
			gl.vertexAttribPointer(this.txc, 2, gl.FLOAT, false, 0, 0);
		}
		else {
    		gl.disableVertexAttribArray(this.txc); 
		}
		
		gl.drawArrays(gl.TRIANGLES, 0, this.numTriangles);
	}
	
	// This method is called to set the texture of the mesh.
	// The argument is an HTML IMG element containing the texture data.
	setTexture( img )
	{
		// [TO-DO] Bind the texture
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, this.texture);

		// You can set the texture image data using the following command.
		gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img );
		gl.generateMipmap(gl.TEXTURE_2D);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

		// [TO-DO] Now that we have a texture, it might be a good idea to set
		// some uniform parameter(s) of the fragment shader, so that it uses the texture.
		gl.useProgram(this.prog);
		gl.uniform1i(this.sampler, 0);
		gl.uniform1i(this.textureLoaded, 1);
	}
	
	// This method is called when the user changes the state of the
	// "Show Texture" checkbox. 
	// The argument is a boolean that indicates if the checkbox is checked.
	showTexture( show )
	{
		// [TO-DO] set the uniform parameter(s) of the fragment shader to specify if it should use the texture.
		gl.useProgram(this.prog);
		gl.uniform1i(this.showText, show);
		this.useTexture = show;
	}
	
	// This method is called to set the incoming light direction
	setLightDir( x, y, z )
	{
		// [TO-DO] set the uniform parameter(s) of the fragment shader to specify the light direction.
		gl.useProgram(this.prog);
		gl.uniform3f(this.lightDirection, x, y, z)
	}
	
	// This method is called to set the shininess of the material
	setShininess( shininess )
	{
		// [TO-DO] set the uniform parameter(s) of the fragment shader to specify the shininess.
		gl.useProgram(this.prog);
		gl.uniform1f(this.shininess, shininess);
	}
}
