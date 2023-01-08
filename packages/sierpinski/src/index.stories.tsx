import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import Sierpinski from './index';

const Component = () => {
  return (
    <div>
      谢尔平斯基三角
      <Sierpinski />
    </div>
  );
};

export default {
  title: 'Component',
  component: Component,
} as ComponentMeta<typeof Component>;

//storybook 定义的一种args写法，可以在界面生成配置界面
const Template: ComponentStory<typeof Component> = (args: any) => <Component {...args} />;

// 示例
export const Sierpinski2d = Template.bind({});
Sierpinski2d.args = {
  bgcolor: '#333333',
  color: '#ffffff',
  btnname: '谢尔平斯基三角',
};
