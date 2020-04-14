
/**
 * WgContext class
 */
class WgContext {

  /**
   * @constructor
   * @param {string} canvasId
   */
  constructor(canvasId) {
    this._canvas = document.getElementById(canvasId);
    this._gl = this._canvas.getContext("experimental-webgl");
    if (!this._gl) {
      alert("Unable to initialize WebGL. Your browser may not support it.");
    }

    this._setRenderState();
  }

  /**
   * _setRenderState
   * 描画の基本設定
   */
  _setRenderState() {
    this._gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this._gl.clearDepth(1.0);
    this._gl.enable(this._gl.DEPTH_TEST);
    this._gl.depthFunc(this._gl.LEQUAL);
  }

  /**
   * getContext
   * コンテキスト取得
   * @return {any} コンテキスト
   */
  getContext() {
    return this._gl;
  }

  /**
   * createVertexBuffer
   * 頂点バッファ作成
   * @return {any} VBO
   */
  createVertexBuffer(vertexes) {
    var vbo = this._gl.createBuffer();
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, vbo);
    this._gl.bufferData(this._gl.ARRAY_BUFFER, new Float32Array(vertexes), this._gl.STATIC_DRAW);
    return vbo;
  }

  /**
   * clearBuffer
   * バッファクリア
   */
  clearBuffer() {
    this._gl.clear(this._gl.COLOR_BUFFER_BIT | this._gl.DEPTH_BUFFER_BIT);
  }

  /**
   * createShader
   * @param {*} shaderType 
   * @param {string} shaderSource 
   */
  createShader(shaderType, shaderSource) {
    var shader = this._gl.createShader(shaderType);
    this._gl.shaderSource(shader, shaderSource);
    this._gl.compileShader(shader);

    if (!this._gl.getShaderParameter(shader, this._gl.COMPILE_STATUS)) {
      alert("An error occurred compiling the shaders: " + this._gl.getShaderInfoLog(shader));
       return null;
    }

    return shader;
  }

  /**
   * createVertexShader
   * @param {string} shaderSource 
   */
  createVertexShader(shaderSource) {
    return this.createShader(this._gl.VERTEX_SHADER, shaderSource);
  }

  /**
   * createFragmentShader
   * @param {string} shaderSource 
   */
  createFragmentShader(shaderSource) {
    return this.createShader(this._gl.FRAGMENT_SHADER, shaderSource);
  }

}
