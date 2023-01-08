/**
 * 初始化着色器
 * @param {WebGLRenderingContext} gl WebGL上下文
 * @param {string} vertexShaderId 顶点着色器id
 * @param {string} fragmentShaderId 片元着色器id
 * @returns
 */
const initShaders = (
  gl: WebGLRenderingContext,
  vertexShaderId: string,
  fragmentShaderId: string
) => {
  let vertShdr: WebGLShader | null;
  var fragShdr: WebGLShader | null;

  var vertElem = document.getElementById(vertexShaderId);
  if (!vertElem) {
    console.error(`顶点着色器${vertexShaderId}加载失败`);
    return -1;
  } else {
    // 创建一个着色器对象。 https://developer.mozilla.org/zh-CN/docs/Web/API/WebGLRenderingContext/createShader
    vertShdr = gl.createShader(gl.VERTEX_SHADER) as WebGLShader;
    // 设置 WebGLShader 着色器（顶点着色器及片元着色器）。 https://developer.mozilla.org/zh-CN/docs/Web/API/WebGLRenderingContext/shaderSource
    gl.shaderSource(vertShdr, vertElem.innerText);
    // 用于编译一个 GLSL 着色器，使其成为为二进制数据。https://developer.mozilla.org/zh-CN/docs/Web/API/WebGLRenderingContext/compileShader
    gl.compileShader(vertShdr);
    // 返回给定的着色器信息。https://developer.mozilla.org/zh-CN/docs/Web/API/WebGLRenderingContext/getShaderParameter
    if (!gl.getShaderParameter(vertShdr, gl.COMPILE_STATUS)) {
      // 返回指定着色器的编译日志信息。 https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getShaderInfoLog
      console.error(`着色器编译失败：${gl.getShaderInfoLog(vertShdr)}`);
      return -1;
    }
  }

  var fragElem = document.getElementById(fragmentShaderId);
  if (!fragElem) {
    console.error(`片元着色器${vertexShaderId}加载失败`);
    return -1;
  } else {
    fragShdr = gl.createShader(gl.FRAGMENT_SHADER) as WebGLShader;
    gl.shaderSource(fragShdr, fragElem.innerText);
    gl.compileShader(fragShdr);
    if (!gl.getShaderParameter(fragShdr, gl.COMPILE_STATUS)) {
      console.error(`着色器编译失败：${gl.getShaderInfoLog(vertShdr)}`);
      return -1;
    }
  }

  // 用于创建和初始化一个 WebGLProgram 对象。 https://developer.mozilla.org/zh-CN/docs/Web/API/WebGLRenderingContext/createProgram
  var program = gl.createProgram() as WebGLProgram;
  // 往 WebGLProgram 添加一个片段或者顶点着色器。
  gl.attachShader(program, vertShdr);
  gl.attachShader(program, fragShdr);
  // 完成为程序的片元和顶点着色器准备 GPU 代码的过程。 https://developer.mozilla.org/zh-CN/docs/Web/API/WebGLRenderingContext/linkProgram
  gl.linkProgram(program);

  // 返回 WebGLProgram 的信息。 https://developer.mozilla.org/zh-CN/docs/Web/API/WebGLRenderingContext/getProgramParameter
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    // 返回参数中指定的WebGLProgram object 的信息。这些信息包括在 linking 过程中的错误以及 WebGLProgram objects 合法性检查的错误。 https://developer.mozilla.org/zh-CN/docs/Web/API/WebGLRenderingContext/getProgramInfoLog
    console.error(`链接着色器程序失败：${gl.getProgramInfoLog(program)}`);
    return -1;
  }

  return program;
};

export default initShaders;
