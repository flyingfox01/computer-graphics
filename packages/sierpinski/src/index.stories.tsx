import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import Sierpinski from './index';

const Component = () => {
  return (
    <div>
      sierpinski test
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

//示例一
export const defaultButton = Template.bind({});
defaultButton.args = {
  bgcolor: '#f0f0f0',
  color: '#000000',
  btnname: '按钮',
};

//示例二
export const BlackButton = Template.bind({});
BlackButton.args = {
  bgcolor: '#333333',
  color: '#ffffff',
  btnname: '按钮',
};
