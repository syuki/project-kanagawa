
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
    this._context = this._canvas.getContext("experimental-webgl");
    if (!this._context) {
      alert("Unable to initialize WebGL. Your browser may not support it.");
    }

    this._setRenderState();
  }

  /**
   * _setRenderState
   * 描画の基本設定
   */
  _setRenderState() {
    this._context.clearColor(0.0, 0.0, 0.0, 1.0);
    this._context.clearDepth(1.0);
    this._context.enable(this._context.DEPTH_TEST);
    this._context.depthFunc(this._context.LEQUAL);
  }

  /**
   * getContext
   * コンテキスト取得
   * @return {any} コンテキスト
   */
  getContext() {
    return this._context;
  }
}

