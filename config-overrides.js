const { override, fixBabelImports, addLessLoader } = require('customize-cra');

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
  }),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: {
      '@primary-color': '#2DFC9F',
      '@layout-header-background': '#333333',
      // '@layout-body-background': '#252525',
      '@layout-trigger-background': '#409143',
      '@menu-dark-item-active-bg': '#238C30',
      // '@link-color': '#00ff8f', // link color
      '@success-color': '#52c41a', // success state color
      '@warning-color': '#faad14', // warning state color
      '@error-color': '#f5222d', // error state color
      '@font-size-base': '13px', // major text font size
      // '@heading-color': '#00ff8f', // heading text color
      '@text-color': '#baffe1', // major text color
      '@text-color-secondary': '#baffe1', // secondary text color
      '@disabled-color': 'rgba(0, 0, 0, 0.25)', // disable state color
      '@border-radius-base': '10px', // major border radius
      '@border-color-base': '#d9d9d9', // major border color
      '@box-shadow-base': '0 10px 50px rgba(0, 0, 0, 0.16)', // major shadow for layers
    },
  }),
);
