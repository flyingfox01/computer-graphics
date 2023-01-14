import { WebGLUtils, initShaders, MV } from 'utils';

const { flatten } = MV;

class Flow {
  private context: WebGL2RenderingContext;
  private canvas;
  private points;
  private program;
  private render;
  private generator;

  constructor(canvas) {
    this.canvas = canvas;
    this.configWebGL();
    this.initShader();

    return this;
  }

  public init(render) {
    this.render = render;
    return this;
  }

  public updateData(generator) {
    this.points = generator();
    return this;
  }

  public run() {
    if (!this.render) {
      throw Error('未配置渲染方法');
    }

    const { context, points } = this;
    this.loadData();
    this.associateVariables();
    this.render(context, points);
  }

  public configWebGL() {
    const { canvas } = this;
    const context: any = new WebGLUtils().setupWebGL(canvas, {});
    if (!context) {
      throw Error('webgl启动失败');
    }

    this.context = context;

    // 用来设置视口，即指定从标准设备到窗口坐标的 x、y 仿射变换。 https://developer.mozilla.org/zh-CN/docs/Web/API/WebGLRenderingContext/viewport
    context.viewport(0, 0, canvas.width, canvas.height);
    // 设置清空颜色缓冲时的颜色值。 https://developer.mozilla.org/zh-CN/docs/Web/API/WebGLRenderingContext/clearColor
    context.clearColor(1.0, 1.0, 1.0, 1.0);
  }

  public initShader() {
    const { context } = this;
    // 加载着色器并初始化属性缓冲区。
    const program = initShaders(context, 'vertex-shader', 'fragment-shader');
    // 指定的WebGLProgram设置为当前呈现状态的一部分。https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/useProgram
    context.useProgram(program);
    this.program = program;
  }

  /**
   * 将数据加载到GPU
   */
  public loadData() {
    const { context, points } = this;
    // 创建并初始化存储顶点或颜色等数据的WebGLBuffer。 https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/createBuffer
    const bufferId = context.createBuffer();
    // 将给定的WebGLBuffer绑定到目标。https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindBuffer
    context.bindBuffer(context.ARRAY_BUFFER, bufferId);
    // 初始化并创建缓冲区对象的数据存储。https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bufferData
    context.bufferData(context.ARRAY_BUFFER, flatten(points), context.STATIC_DRAW);
  }

  public associateVariables() {
    const { context, program } = this;
    // 返回给定WebGLProgram中属性变量的位置。https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getAttribLocation
    const vPos = context.getAttribLocation(program, 'vPosition');
    // 将当前绑定到gl.ARRAY_buffer的缓冲区绑定到当前顶点缓冲区对象的通用顶点属性，并指定其布局。 https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/vertexAttribPointer
    context.vertexAttribPointer(vPos, 2, context.FLOAT, false, 0, 0);
    // 在属性数组列表中的指定索引处打开通用顶点属性数组。https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/enableVertexAttribArray
    context.enableVertexAttribArray(vPos);
  }
}

export default Flow;
