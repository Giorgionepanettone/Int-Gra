//Multiplies column-order square matrices of size NxN
function multiplySquareMatrices(matrix1, matrix2, N)
{
	var size = N*N;

	var result = Array(size);

	for(var i = 0; i < N; i++){
		for(var j = 0; j < N; j++){
			result[i + j*N] = 0;
			for(var z = 0; z < N; z++){
				result[i + j*N] += matrix1[i + z*N] * matrix2[j*N + z];
			}
		}
	}
	return result;
}

// Returns a 3x3 transformation matrix as an array of 9 values in column-major order.
// The transformation first applies scale, then rotation, and finally translation.
// The given rotation value is in degrees.
function GetTransform( positionX, positionY, rotation, scale )
{
	var radians = rotation * (Math.PI / 180);
	var scaledCos = scale * Math.cos(radians);
	var scaledSin = scale * Math.sin(radians);

	return Array( scaledCos, scaledSin, 0, -scaledSin, scaledCos, 0,  positionX, positionY, 1 );
}

// Returns a 3x3 transformation matrix as an array of 9 values in column-major order.
// The arguments are transformation matrices in the same format.
// The returned transformation first applies trans1 and then trans2.
function ApplyTransform( trans1, trans2 )
{
	return multiplySquareMatrices(trans2, trans1, 3);
}
