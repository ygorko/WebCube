var mesh_3d = function(){}

mesh_3d.positions = [];
mesh_3d.indexes = [];
mesh_3d.normals = [];

mesh_3d.init_buffers = function () {
	this.positionsBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.positionsBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.positions), gl.STATIC_DRAW);
	this.positionsBuffer.itemSize = 3;
	this.positionsBuffer.numItems = this.positions.length / 3;

	this.normalsBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.normalsBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normals), gl.STATIC_DRAW);
	this.normalsBuffer.itemSize = 3;
	this.normalsBuffer.numItems = this.normals.length / 3;

	this.indexesBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexesBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indexes), gl.STREAM_DRAW);
	this.indexesBuffer.itemSize = 1;
	this.indexesBuffer.numItems = this.indexes.length;
}

mesh_3d.draw = function(){
	gl.bindBuffer(gl.ARRAY_BUFFER, this.positionsBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.positionsBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, this.normalsBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, this.normalsBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexesBuffer);
	gl.drawElements(gl.TRIANGLES, this.indexesBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}

