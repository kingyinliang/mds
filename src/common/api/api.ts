import httpProxy from 'utils/net/httpProxy'

export const COMMON_API = {
    /**
     * @property {string} LOGIN_API 登录接口
     * @param {string}
     */
    LOGIN_API: params => httpProxy('/sysUser/login', 'POST', params),
    /**
     * @property {string} UPPASS_API 登录接口
     * @param {string}
     */
    UPPASS_API: params => httpProxy('/sysUser/password/update', 'POST', params),
    /**
     * @property {string} NAV_API 路由获取菜单
     * @param {string}
     */
    NAV_API: params => httpProxy('/sysUser/userRole/menuQuery', 'GET', params)
}
