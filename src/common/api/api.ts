import httpProxy from 'utils/net/httpProxy'

export const COMMON_API = {
    /**
     * @property {string} LOGIN_API 登录接口
     */
    LOGIN_API: params => httpProxy('/sysUser/login', 'POST', params),
    /**
     * @property {string} UPPASS_API 修改密码
     */
    UPPASS_API: params => httpProxy('/sysUser/password/update', 'POST', params),
    /**
     * @property {string} UPPASS_API 退出登录
     */
    LOGOUT_API: params => httpProxy('/sysUser/quit', 'GET', params),
    /**
     * @property {string} NAV_API 路由获取菜单
     */
    NAV_API: params => httpProxy('/sysUser/userRole/menuQuery', 'GET', params),
    /**
     * @property {string} MENULIST_API 菜单管理全列表
     */
    MENULIST_API: params => httpProxy('/sysMenu/query', 'GET', params),
    /**
     * @property {string} MENUSELECT_API 菜单管理无按钮列表
     */
    MENUSELECT_API: params => httpProxy('/sysMenu/selectMenu', 'GET', params),
    /**
     * @property {string} MENUDEL_API 菜单管理删除
     */
    MENUDEL_API: params => httpProxy('/sysMenu/remove', 'GET', params)
};
