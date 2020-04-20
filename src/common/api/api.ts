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
    MENUADD_API: params => httpProxy('/sysMenu/insert', 'POST', params),
    /**
     * @property {string} MENUUPDATE_API 菜单管理修改
     */
    MENUUPDATE_API: params => httpProxy('/sysMenu/update', 'POST', params),
    /**
     * @property {string} MENUDEL_API 菜单管理删除
     */
    MENUDEL_API: params => httpProxy('/sysMenu/remove', 'GET', params),
    /**
     * @property {string} USER_BATCH_QUERY_API 系统管理-人员管理-批量查询
     */
    USER_BATCH_QUERY_API: params => httpProxy('/sysUser/batchQueryById', 'POST', params),
    /**
     * @property {string} USER_DELETE_API 系统管理-人员管理-批量删除
     */
    USER_DELETE_API: params => httpProxy('/sysUser/delete', 'POST', params),
    /**
     * @property {string} USER_DROPDOWN_API 系统管理-人员管理-下拉列表
     */
    USER_DROPDOWN_API: params => httpProxy('/sysUser/dropDown', 'POST', params),
    /**
     * @property {string} USER_INSERT_API 系统管理-人员管理-新增
     */
    USER_INSERT_API: params => httpProxy('/sysUser/insert', 'POST', params),
    /**
     * @property {string} USER_LOGIN_API 系统管理-人员管理-登录
     */
    USER_LOGIN_API: params => httpProxy('/sysUser/login', 'POST', params),
    /**
     * @property {string} USER_PASSWORD_RESET_API 系统管理-用户管理-重置密码
     */
    USER_PASSWORD_RESET_API: params => httpProxy('/sysUser/password/reset', 'POST', params),
    /**
     * @property {string} USER_PASSWORD_UPDATE_API 系统管理-用户管理-修改密码
     */
    USER_PASSWORD_UPDATE_API: params => httpProxy('/sysUser/password/update', 'GET', params),
    /**
     * @property {string} USER_QUERY_API 系统管理-人员管理-列表
     */
    USER_QUERY_API: params => httpProxy('/sysUser/query', 'POST', params),
    /**
     * @property {string} USER_QUIT_API 系统管理-人员管理-退出
     */
    USER_QUIT_API: params => httpProxy('/sysUser/quit', 'GET', params),
    /**
     * @property {string} USER_UPDATE_API 系统管理-人员管理-修改
     */
    USER_UPDATE_API: params => httpProxy('/sysUser/update', 'POST', params),
    /**
     * @property {string} USER_MENU_QUERY_API 系统管理-用户管理-查询
     */
    USER_MENU_QUERY_API: params => httpProxy('/sysUser/userRole/menuQuery', 'POST', params),

    /**
     * @property {string} ROLE_REMOVE_API 系统管理-角色管理-删除角色
     */
    ROLE_REMOVE_API: params => httpProxy('/sysRole/remove', 'GET', params),
    /**
     * @property {string} ROLE_INSERT_API 系统管理-角色管理-新增
     */
    ROLE_INSERT_API: params => httpProxy('/sysRole/insert', 'POST', params),
    /**
     * @property {string} ROLE_UPDATE_API 系统管理-角色管理-编辑
     */
    ROLE_UPDATE_API: params => httpProxy('/sysRole/update', 'POST', params),
    /**
     * @property {string} ROLE_QUERY_API 系统管理-角色管理-列表
     */
    ROLE_QUERY_API: params => httpProxy('/sysRole/query', 'POST', params),
    /**
     * @property {string} ROLE_ALLOT_INSERT_API 系统管理-角色管理-部门分配
     */
    ROLE_ALLOT_INSERT_API: params => httpProxy('/sysRoleDept/insert', 'POST', params),
    /**
     * @property {string} ROLE_MENU_INSERT_API 系统管理-角色管理-分配功能
     */
    ROLE_MENU_INSERT_API: params => httpProxy('/sysRoleMenu/insert', 'POST', params),
    /**
     * @property {string} ROLE_USER_INSERT_API 系统管理-角色管理-分配人员
     */
    ROLE_USER_INSERT_API: params => httpProxy('/sysUserRole/insert', 'POST', params),
    /**
     * @property {string} ORGSTRUCTURE_API 组织架构树形列表
     */
    ORGSTRUCTURE_API: params => httpProxy('/sysDept/dropDown', 'GET', params),
    /**
     * @property {string} ADDORG_API 组织架构新增
     */
    ADDORG_API: params => httpProxy('/sysDept/insert', 'POST', params),
    /**
     * @property {string} DELETEORG_API 组织架构删除
     */
    DELETEORG_API: params => httpProxy('/sysDept/remove', 'GET', params),
    /**
     * @property {string} UPDATEORG_API 组织架构修改
     */
    UPDATEORG_API: params => httpProxy('/sysDept/update', 'POST', params),
    /**
     * @property {string} ORGDETAIL_API 组织架构详情
     */
    ORGDETAIL_API: params => httpProxy('/sysDept/query', 'GET', params)
};
