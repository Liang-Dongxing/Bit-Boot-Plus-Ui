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
   * 语言
   */
  language: 'zh_CN',

  /**
   * 是否显示动态标题
   */
  dynamicTitle: false,

  /**
   * @type {string | array} 'production' | ['production', 'development']
   * @description Need show err logs component.
   * The default is only used in the production env
   * If you want to also use it in dev, you can pass ['production', 'development']
   */
  errorLog: 'production',

  /**
   * 是否启用暗黑模式
   */
  dark: false,
}
export default setting
