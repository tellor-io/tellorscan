const { override, fixBabelImports, addLessLoader } = require('customize-cra')

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
  }),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: {
      '@primary-color': '#4caf50',
      '@layout-header-background': '#333333',
      '@layout-body-background': '#252525',
      '@layout-trigger-background': '#409143',
      '@menu-dark-item-active-bg': '#238C30',
    },
  })
)
