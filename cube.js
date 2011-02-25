var gl = null;
var pMatrix = Matrix.I(4);;
var mvMatrix = Matrix.I(4);
var shaderProgram;
var mouseDown = false;
var lastMouseX = null;
var lastMouseY = null;
var rotationMatrix = Matrix.I(4);
var canvas = document.getElementById("scene");
var particles = [];





function handleMouseDown(event) {
    mouseDown = true;
    lastMouseX = event.clientX;
    lastMouseY = event.clientY;
}


function handleMouseUp(event) {
    mouseDown = false;
}


function handleMouseMove(event) {
    if (!mouseDown) {
        return;
    }
    var newX = event.clientX;
    var newY = event.clientY;

    var deltaX = newX - lastMouseX
        var newRotationMatrix = createRotationMatrix(deltaX / 2, [0, 1, 0]);

    var deltaY = newY - lastMouseY;
    newRotationMatrix = newRotationMatrix.x(createRotationMatrix(deltaY / 2, [1, 0, 0]));

    rotationMatrix = newRotationMatrix.x(rotationMatrix);

    lastMouseX = newX
        lastMouseY = newY;
    drawScene();
}

function createRotationMatrix(angle, v) {
    var arad = angle * Math.PI / 180.0;
    return Matrix.Rotation(arad, $V([v[0], v[1], v[2]])).ensure4x4();
}



var init = function () {
    try {
        gl = WebGLDebugUtils.makeDebugContext(canvas.getContext("experimental-webgl"));
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
    } catch (e) {}
    if (!gl) {
        alert("Looks like your browser not support webgl."); 
        return false;
    }
    return true;
}

function getShader(gl, id) {
    var shaderScript = document.getElementById(id);
    if (!shaderScript) {
        return null;
    }

    var str = "";
    var k = shaderScript.firstChild;
    while (k) {
        if (k.nodeType == 3) {
            str += k.textContent;
        }
        k = k.nextSibling;
    }

    var shader;
    if (shaderScript.type == "x-shader/x-fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type == "x-shader/x-vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        return null;
    }

    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}


function initShaders() {
    var fragmentShader = getShader(gl, "fragment-shader");
    var vertexShader = getShader(gl, "vertex-shader");

    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }

    gl.useProgram(shaderProgram);

    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");
    gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);

    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
    shaderProgram.nMatrixUniform = gl.getUniformLocation(shaderProgram, "uNMatrix");
    shaderProgram.rotationMatrixUniform = gl.getUniformLocation(shaderProgram, "uRotation");
    shaderProgram.coordinatesMatrixUniform = gl.getUniformLocation(shaderProgram, "uCoordinates");
}


function initBuffers() {
    cube_mesh.init_buffers();
}



function drawScene() {
	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    for (var i in particles){
        particles[i].draw();
    }
	//p1.draw();
	//p2.draw();
}

function initParticles(p_count){
    var i, j, k;
    var cube, shift;
    var cnt = 0
    for (i = 0; i < p_count; i++){
        for (j = 0; j < p_count; j++){
            for (k = 0; k < p_count; k++){
                if (
                        i == 0 || i == p_count - 1 ||
                        j == 0 || j == p_count - 1 ||
                        k == 0 || k == p_count - 1 
                   ) {
                    particles[cnt] = new cube_particle();
                    shift = -p_count/2 + .5;
                    particles[cnt].setCoordinates([shift+i, shift+j, shift+k]);
                    cnt++
                }
            }
        }
    }
}



//var p1 = new cube_particle();
//var p2 = new cube_particle();
//p2.setCoordinates([0, 0.5, 0]);
if (init()){
	gl.clearColor(0.8, 0.8, 0.8, 1.0);
	gl.clearDepth(1.0);

	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LEQUAL);

	initShaders();
	initBuffers();
    initParticles(3);
	pMatrix = makePerspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0);
	pMatrix = pMatrix.x(Matrix.Translation($V([0, 0, -9])).ensure4x4());
	drawScene();

	canvas.onmousedown = handleMouseDown;
	document.onmouseup = handleMouseUp;
	document.onmousemove = handleMouseMove;

}

