declare type DefaultSettings = {
  /**
   * 网页标题
   */
  title?: string

  /**
   * 是否显示多标签导航
   */
  tagsView?: boolean

  /**
   * 是否显示侧边栏Logo
   */
  sidebarLogo?: boolean

  /**
   * 菜单布局
   */
  menuLayout?: string

  /**
   * 导航栏布局
   */
  layout?: string

  /**
   * 主题模式
   */
  theme?: string

  /**
   * 布局大小
   */
  layoutSize?: string

  /**
   * 菜单是否独占一行
   */
  menuLone?: boolean

  /**
   * 菜单内容
   */
  menuContent?: string

  /**
   * 语言
   */
  language?: string

  /**
   * 是否显示动态标题
   */
  dynamicTitle?: boolean

  /**
   *  是否启用暗黑模式
   *
   * true:暗黑模式
   * false: 明亮模式
   */
  dark?: boolean

  errorLog?: string
}
