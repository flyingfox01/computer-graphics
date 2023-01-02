// Rollup plugins
// babel插件用于处理es6代码的转换，使转换出来的代码可以用于不支持es6的环境使用
import babel from 'rollup-plugin-babel';
// resolve将我们编写的源码与依赖的第三方库进行合并
import resolve from 'rollup-plugin-node-resolve';
// 解决rollup.js无法识别CommonJS模块
import commonjs from 'rollup-plugin-commonjs';
// 全局替换变量比如process.env
import replace from 'rollup-plugin-replace';
// 使rollup可以使用postCss处理样式文件scss、css等
import postcss from 'rollup-plugin-postcss';
import autoprefixer from 'autoprefixer';
// 可以处理组件中import图片的方式，将图片转换成base64格式，但会增加打包体积，适用于小图标
import image from '@rollup/plugin-image';
// 压缩打包代码（这里弃用因为该插件不能识别es的语法，所以采用terser替代）
// import { uglify } from 'rollup-plugin-uglify';
// 压缩打包代码
import { terser } from 'rollup-plugin-terser';
// PostCSS plugins 处理css定义的变量
import simplevars from 'postcss-simple-vars';
// 处理scss嵌套样式写法
import nested from 'postcss-nested';
// 替代cssnext
import postcssPresetEnv from 'postcss-preset-env';
// css代码压缩
import cssnano from 'cssnano';
// 支持typescript
import typescript from 'rollup-plugin-typescript2';
// 支持rollup.js导入json模块
import json from '@rollup/plugin-json';
// 用于打包生成*.d.ts文件
import dts from 'rollup-plugin-dts';
// 引入package
// import pkg from "./package.json";
// 对glsl的支持
import glslify from 'rollup-plugin-glslify';

const env = process.env.NODE_ENV;
const PACKAGE_ROOT_PATH = process.cwd();

const config = [
  {
    // 入口文件我这里在components下统一导出所有自定义的组件
    input: `${PACKAGE_ROOT_PATH}/lib/index.tsx`,
    // 输出文件夹，可以是个数组输出不同格式（umd,cjs,esm...）通过env是否是生产环境打包来决定文件命名是否是.min
    output: [
      {
        file: `${PACKAGE_ROOT_PATH}/dist/index.esm.js`,
        format: 'esm',
      },
      {
        file: `${PACKAGE_ROOT_PATH}/dist/index.js`,
        format: 'cjs',
      },
    ],
    // 注入全局变量比如jQuery的$这里只是尝试 并未启用
    // globals: {
    //   react: 'React',// 这跟external 是配套使用的，指明global.React即是外部依赖react
    //   antd: 'antd'
    // },
    // 自定义警告事件，这里由于会报THIS_IS_UNDEFINED警告，这里手动过滤掉
    onwarn: function (warning) {
      if (warning.code === 'THIS_IS_UNDEFINED') {
        return;
      }
    },
    // 将模块视为外部模块，不会打包在库中
    external: ['react', 'react-dom'],
    // 插件
    plugins: [
      typescript(),
      image(),
      postcss({
        plugins: [simplevars(), nested(), postcssPresetEnv(), autoprefixer(), cssnano()],
        // 处理.css和.scss文件
        extensions: ['.css', '.scss'],
      }),
      // 告诉 Rollup 如何查找外部模块并安装它
      resolve(),
      // babel处理不包含node_modules文件的所有js,ts,tsx
      babel({
        exclude: 'node_modules/**',
        runtimeHelpers: true,
        plugins: ['@babel/plugin-external-helpers'],
        extensions: ['.js', '.ts', 'tsx'],
      }),
      // 将 CommonJS 转换成 ES2015 模块
      // 这里有些引入使用某个库的api但报未导出该api通过namedExports来手动导出
      commonjs({
        namedExports: {
          'node_modules/react-is/index.js': ['isFragment'],
          'node_modules/react/index.js': [
            'Fragment',
            'cloneElement',
            'isValidElement',
            'Children',
            'createContext',
            'Component',
            'useRef',
            'useImperativeHandle',
            'forwardRef',
            'useState',
            'useEffect',
            'useMemo',
          ],
          'node_modules/react-dom/index.js': ['render', 'unmountComponentAtNode', 'findDOMNode'],
          'node_modules/gojs/release/go.js': ['Diagram', 'GraphLinksModel', 'Overview', 'Spot'],
        },
      }),
      json(),
      // 全局替换NODE_ENV，exclude表示不包含某些文件夹下的文件
      replace({
        // exclude: 'node_modules/**',
        'process.env.NODE_ENV': JSON.stringify(env || 'development'),
      }),
      // glsl支持
      glslify(),
      // 生产环境执行terser压缩代码
      env === 'production' && terser(),
    ],
  },
  {
    // 打包*.d.ts配置，用于支持typescript项目
    input: `${PACKAGE_ROOT_PATH}/lib/index.tsx`,
    output: [
      {
        file: `${PACKAGE_ROOT_PATH}/dist/index.d.ts`,
        format: 'esm',
      },
    ],
    external: [/\.scss$/, /\.css$/],
    plugins: [dts()],
  },
];

export default config;
