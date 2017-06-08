var gl;
var mvMatrix;
var vMatrix;
var shaderProgram;
var vertexPositionAttribute;
var vertexColorAttribute;
var perspectiveMatrix;
var context;
//
// start
//
function start() {

  context = new WgContext("glcanvas");
  gl = context.getContext();

  if (!gl) {
    return;
  }

  initShaders();

  initSquareBuffers();

  document.addEventListener("keydown", onKeyDownListenr);
  document.addEventListener("keyup", onKeyUpListenr);

  drawScene();
}

function update() {

  if(keyPless[39]) {
    x+=0.01;
  }
  if(keyPless[37]) {
    x-=0.01;
  }
  if(keyPless[38]) {
    y+=0.01;
  }
  if(keyPless[40]) {
    y-=0.01;
  }

  refreshKeycode();
}

var keyTrig = {};
var keyPless = {};
var keyRelease = {};
function onKeyDownListenr(e) {
  keyTrig[e.keyCode] = true;
  keyPless[e.keyCode] = true;
  switch(e.keyCode) {
    case 37:
    case 38:
    case 39:
    case 40:
    e.preventDefault();
    break;
  }
}

function onKeyUpListenr(e) {
  keyPless[e.keyCode] = false;
  keyRelease[e.keyCode] = true;
}

function refreshKeycode() {
  delete keyTrig;
  delete keyRelease;
  keyTrig = {};
  keyRelease = {};
}

var x = 0;
var y = 0;
//
// drawScene
//
function drawScene() {
  requestAnimationFrame(drawScene);

  update();

  context.clearBuffer();

  perspectiveMatrix = makePerspective(45, 640.0/480.0, 0.1, 100.0);
  vMatrix = makeLookAt(0,0,5,0,0,0,0,1,0);

  loadIdentity();
  mvTranslate([x, y, -0.0]);

  gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesBuffer);
  var stride = 4*(3+3);
  gl.vertexAttribPointer(vertexColorAttribute, 3, gl.FLOAT, false, stride, 0);
  gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, stride, 4*3);
  setMatrixUniforms();
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

//
// initShaders
//
function initShaders() {
  var vertexShaderSource = getShaderString(document.getElementById("shader-vs"));
  var fragmentShaderSource = getShaderString(document.getElementById("shader-fs"));

  var vertexShader = context.createVertexShader(vertexShaderSource);
  var fragmentShader = context.createFragmentShader(fragmentShaderSource);

  shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert("Unable to initialize the shader program: " + gl.getProgramInfoLog(shader));
  }

  gl.useProgram(shaderProgram);

  vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
  gl.enableVertexAttribArray(vertexColorAttribute);
  vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
  gl.enableVertexAttribArray(vertexPositionAttribute);
}

function getShaderString(element) {
  var theSource = "";
  var currentChild = element.firstChild;

  while(currentChild) {
    if (currentChild.nodeType == 3) {
      theSource += currentChild.textContent;
    }

    currentChild = currentChild.nextSibling;
  }
  return theSource;
}

//
// Matrix utility functions
//

function loadIdentity() {
  mvMatrix = Matrix.I(4);
}

function multMatrix(m) {
  mvMatrix = mvMatrix.x(m);
}

function mvTranslate(v) {
  multMatrix(Matrix.Translation($V([v[0], v[1], v[2]])).ensure4x4());
}

function setMatrixUniforms() {
  var pUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
  gl.uniformMatrix4fv(pUniform, false, new Float32Array(perspectiveMatrix.flatten()));

  var vUniform = gl.getUniformLocation(shaderProgram, "uVMatrix");
  gl.uniformMatrix4fv(vUniform, false, new Float32Array(vMatrix.flatten()));
  
  var mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
  gl.uniformMatrix4fv(mvUniform, false, new Float32Array(mvMatrix.flatten()));
}

////////////////
// initBuffers
var squareVerticesBuffer;
function initSquareBuffers() {
  var squareBuffer = [
     1.0,  1.0, 0.0,
     1.0,  0.0, 0.0,

    -1.0,  1.0, 0.0,
     0.0,  1.0, 0.0,

     1.0, -1.0, 0.0,
     0.0,  0.0, 1.0,

    -1.0, -1.0, 0.0,
     1.0,  1.0, 1.0,
  ];
  squareVerticesBuffer = context.createVertexBuffer(squareBuffer);
}

