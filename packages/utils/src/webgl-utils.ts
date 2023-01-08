class WebGLUtils {
  private renderException(canvas: HTMLCanvasElement) {
    const parentNode = canvas.parentNode as HTMLElement | null;
    if (parentNode) {
      parentNode.innerHTML = `<div>当前浏览器不支持WebGL</div>`;
    }
  }

  /**
   * 创建WebGL上下文，并做兼容处理
   * @param {Element} canvas canvas元素
   * @param {WebGLContextCreationAttirbutes} opt_attribs 其他参数
   * @return {RenderingContext} 创建好的WebGL上下文
   */
  public setupWebGL(canvas: HTMLCanvasElement, opt_attribs?: any) {
    if (!window.WebGLRenderingContext) {
      this.renderException(canvas);
      return null;
    }

    let context: RenderingContext | null = null;
    ['webgl', 'experimental-webgl', 'webkit-3d', 'moz-webgl'].some(name => {
      context = canvas?.getContext(name, opt_attribs);
      return !!context;
    });

    if (!context) {
      this.renderException(canvas);
      return null;
    }

    return context;
  }
}

/**
 * 兼容requestAnimationFrame
 */
window.requestAnimationFrame = (function () {
  return (
    window.requestAnimationFrame ||
    // @ts-ignore
    window.webkitRequestAnimationFrame ||
    // @ts-ignore
    window.mozRequestAnimationFrame ||
    // @ts-ignore
    window.oRequestAnimationFrame ||
    // @ts-ignore
    window.msRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60);
    }
  );
})();

export default WebGLUtils;
