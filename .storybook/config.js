/* eslint-disable */
const {
  configure,
} = require('@sandvikcode/web-tooling/config/storybook-react');

configure(require.context('../src', true, /\.stories\.tsx$/), module);
