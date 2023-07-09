const setting: DefaultSettings = {
  theme: '#409EFF',

  /**
   * 是否显示 tagsView
   */
  tagsView: true,

  /**
   * 是否显示logo
   */
  sidebarLogo: true,

  /**
   * 菜单布局
   */
  menuLayout: 'vertical',

  /**
   * 布局大小
   */
  layoutSize: 'default',

  /**
   * 菜单是否独占一行
   */
  menuLone: false,

  /**
   * 菜单内容
   */
  menuContent: 'left',

  /**
   * 语言
   */
  language: 'zh_CN',

  /**
   * 是否显示动态标题
   */
  dynamicTitle: false,

  /**
   * 主色
   * 辅助色
   */
  color: {
    primary: '#409EFF',
    success: '#67C23A',
    warning: '#E6A23C',
    danger: '#F56C6C',
    info: '#909399',
  },

  /**
   * 是否启用暗黑模式
   */
  dark: false,

  /**
   * @type {string | array} 'production' | ['production', 'development']
   * @description Need show err logs component.
   * The default is only used in the production env
   * If you want to also use it in dev, you can pass ['production', 'development']
   */
  errorLog: 'production',
}
export default setting
