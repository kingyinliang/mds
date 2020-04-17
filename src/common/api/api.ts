import httpProxy from 'utils/net/httpProxy';

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
     * @property {string} MENUADD_API 菜单管理新增
     */
    MENUADD_API: params => httpProxy('/sysMenu/insert', 'GET', params),
    /**
     * @property {string} MENUUPDATE_API 菜单管理修改
     */
    MENUUPDATE_API: params => httpProxy('/sysMenu/update', 'GET', params),
    /**
     * @property {string} MENUDEL_API 菜单管理删除
     */
    MENUDEL_API: params => httpProxy('/sysMenu/remove', 'GET', params),
    /**
     * @property {string} ROLE_REMOVE_API 系统管理-角色管理-删除角色
     */
    ROLE_REMOVE_API: params => httpProxy('/sysMenu/sysRole/remove', 'GET', params),
    /**
     * @property {string} ROLE_INSERT_API 系统管理-角色管理-新增
     */
    ROLE_INSERT_API: params => httpProxy('/sysMenu/sysRole/insert', 'POST', params),
    /**
     * @property {string} ROLE_UPDATE_API 系统管理-角色管理-编辑
     */
    ROLE_UPDATE_API: params => httpProxy('/sysMenu/sysRole/update', 'POST', params),
    /**
     * @property {string} ROLE_QUERY_API 系统管理-角色管理-列表
     */
    ROLE_QUERY_API: params => httpProxy('/sysMenu/sysRole/query', 'POST', params),
    /**
     * @property {string} ROLE_ALLOT_INSERT_API 系统管理-角色管理-部门分配
     */
    ROLE_ALLOT_INSERT_API: params => httpProxy('/sysMenu/sysRoleDept/insert', 'POST', params),
    /**
     * @property {string} ROLE_MENU_INSERT_API 系统管理-角色管理-分配功能
     */
    ROLE_MENU_INSERT_API: params => httpProxy('/sysMenu/sysRoleMenu/insert', 'POST', params),
    /**
     * @property {string} ROLE_USER_INSERT_API 系统管理-角色管理-分配人员
     */
    ROLE_USER_INSERT_API: params => httpProxy('/sysMenu/sysUserRole/insert', 'POST', params)
};
