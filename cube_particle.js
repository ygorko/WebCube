var cube_particle = function() {

	this.matrix = Matrix.I(4);
	this.prototype = cube_mesh;
	this.coordinates = [0, 0, 0];
	this.coordMatrix = Matrix.I(4);

	this.setCoordinates = function(coord){
		this.coordinates = coord;
		this.coordMatrix = Matrix.Translation($V([coord[0], coord[1], coord[2]])).ensure4x4();
	}

	this.mvTranslate = function(v){
		var m = Matrix.Translation($V([v[0], v[1], v[2]])).ensure4x4();
		this.matrix = this.matrix.x(m);
	}



	this.setMatrixUniforms = function(){
		gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, new Float32Array(pMatrix.flatten()));
		gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, new Float32Array(mvMatrix.flatten()));

		var normalMatrix = this.matrix.inverse();
		normalMatrix = normalMatrix.transpose();
		gl.uniformMatrix4fv(shaderProgram.nMatrixUniform, false, new Float32Array(normalMatrix.flatten()));
	}
	this.draw = function(){
		mvMatrix = this.matrix.x(rotationMatrix.x(this.coordMatrix));
		this.setMatrixUniforms();
		this.prototype.draw();
	}
}
