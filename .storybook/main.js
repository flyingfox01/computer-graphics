module.exports = {
  "stories": [
    // "../src/**/*.stories.mdx",
    '../packages/**/*.stories.@(js|jsx|ts|tsx)'
  ],
  "addons": [
    "@storybook/preset-scss",
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions"
  ],
  "framework": "@storybook/react",
  "core": {
    "builder": "@storybook/builder-webpack5"
  }
}