import React, { useEffect, useRef } from 'react';
// @ts-ignore
import shader_vertex from './shaders/vshader21.glsl';
// @ts-ignore
import shader_fragment from './shaders/fshader21.glsl';
import randomPoints from './randomPoints';
import Flow from './flow';

const render3d = (canvas?: any) => {
  const flow = new Flow(canvas)
    .init((ctx, data) => {
      // 将缓冲区清除为预设值。 https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/clear
      ctx.clear(ctx.COLOR_BUFFER_BIT);
      // 从数组数据渲染图元。 https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/drawArrays
      ctx.drawArrays(ctx.POINTS, 0, data.length);
    })
    .updateData(randomPoints)
    .run();
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
