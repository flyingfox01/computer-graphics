import React, { useEffect, useRef } from 'react';
import { WebGLUtils, initShaders, MV } from 'utils';
// @ts-ignore
import shader_vertex from './shaders/vshader21.glsl';
// @ts-ignore
import shader_fragment from './shaders/fshader21.glsl';

const { vec2, add, scale, flatten } = MV;

const render3d = (canvas?: any) => {
  const NumPoints = 5000;
  const context: any = new WebGLUtils().setupWebGL(canvas, {});
  if (!context) return;

  // 初始三角形位置
  const vertices = [vec2(-1, -1), vec2(0, 1), vec2(1, -1)];

  // (1) 随机找一个点p
  let p = vec2(Math.random(), Math.random());
  const points = [p];

  for (var i = 0; i < NumPoints; ++i) {
    // (2) 随机三个顶点之一q
    const q = vertices[Math.floor(Math.random() * 3)];
    // (3) 得到p和q的中点，并替换掉p
    p = scale(0.5, add(points[i], q));
    points.push(p);
    // 转至(2)
  }

  // 加上原始的三个点
  points.push(...vertices);

  // 配置 WebGL
  // 用来设置视口，即指定从标准设备到窗口坐标的 x、y 仿射变换。 https://developer.mozilla.org/zh-CN/docs/Web/API/WebGLRenderingContext/viewport
  context.viewport(0, 0, canvas.width, canvas.height);
  // 设置清空颜色缓冲时的颜色值。 https://developer.mozilla.org/zh-CN/docs/Web/API/WebGLRenderingContext/clearColor
  context.clearColor(1.0, 1.0, 1.0, 1.0);

  // 加载着色器并初始化属性缓冲区。
  var program = initShaders(context, 'vertex-shader', 'fragment-shader');
  // 指定的WebGLProgram设置为当前呈现状态的一部分。https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/useProgram
  context.useProgram(program);

  // 将数据加载到GPU
  // 创建并初始化存储顶点或颜色等数据的WebGLBuffer。 https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/createBuffer
  var bufferId = context.createBuffer();
  // 将给定的WebGLBuffer绑定到目标。https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindBuffer
  context.bindBuffer(context.ARRAY_BUFFER, bufferId);
  // 初始化并创建缓冲区对象的数据存储。https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bufferData
  context.bufferData(context.ARRAY_BUFFER, flatten(points), context.STATIC_DRAW);

  // 返回给定WebGLProgram中属性变量的位置。https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getAttribLocation
  var vPos = context.getAttribLocation(program, 'vPosition');
  // 将当前绑定到gl.ARRAY_buffer的缓冲区绑定到当前顶点缓冲区对象的通用顶点属性，并指定其布局。 https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/vertexAttribPointer
  context.vertexAttribPointer(vPos, 2, context.FLOAT, false, 0, 0);
  // 在属性数组列表中的指定索引处打开通用顶点属性数组。https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/enableVertexAttribArray
  context.enableVertexAttribArray(vPos);

  // 将缓冲区清除为预设值。 https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/clear
  context.clear(context.COLOR_BUFFER_BIT);
  // 从数组数据渲染图元。 https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/drawArrays
  context.drawArrays(context.POINTS, 0, points.length);
};

const sierpinski = () => {
  const ele: any = useRef();
  useEffect(() => {
    if (!ele.current) {
      throw Error('元素未创建');
    }
    render3d(ele.current);
  }, []);

  return (
    <div>
      <script id='vertex-shader' type='x-shader/x-vertex'>
        {shader_vertex}
      </script>
      <script id='fragment-shader' type='x-shader/x-fragment'>
        {shader_fragment}
      </script>
      <canvas ref={ele} id='gl-canvas' width='512' height='512' />
    </div>
  );
};

export default sierpinski;
