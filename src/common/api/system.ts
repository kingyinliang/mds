/*
 * @Description:
 * @Anthor: Telliex
 * @Date: 2021-03-05 10:40:21
 * @LastEditors: Telliex
 * @LastEditTime: 2021-03-05 16:50:34
 */
import httpProxy from 'utils/net/httpProxy';

const SYSTEM_API = {
    /**
     * @property {string} SYS_PERMISSION_ATTRIBUTE_ASSIGNMENT_QUERY_API 系统管理-权限属性分配-列表
     */
    SYS_PERMISSION_ATTRIBUTE_ASSIGNMENT_QUERY_API: params => httpProxy('/sysProperty/privilegeList/query', 'GET', params, 'SYS'),
    /**
     * @property {string} SYS_PERMISSION_ATTRIBUTE_ROLE_QUERY_BY_ID_API 系统管理-权限属性-查询角色分配的属性节点(选中的末端节点)
     */
    SYS_PERMISSION_ATTRIBUTE_ROLE_ASSIGNMENT_QUERY_BY_ID_API: params => httpProxy('/sysRoleProperty/queryByRoleId', 'GET', params, 'SYS'),
    /**
     * @property {string} SYS_PERMISSION_ATTRIBUTE_SAVE_API 系统管理-权限属性-分配保存
     */
    SYS_PERMISSION_ATTRIBUTE_SAVE_API: params => httpProxy('/sysRoleProperty/save', 'POST', params, 'SYS'),
    /**
     * @property {string} SYS_PERMISSION_ATTRIBUTE_DELETE_API 系统管理-权限属性-批量删除
     */
    SYS_PERMISSION_ATTRIBUTE_DELETE_API: params => httpProxy('/sysProperty/delete', 'POST', params, 'SYS'),
    /**
     * @property {string} SYS_PERMISSION_ATTRIBUTE_INSERT_API 系统管理-权限属性-新增
     */
    SYS_PERMISSION_ATTRIBUTE_INSERT_API: params => httpProxy('/sysProperty/insert', 'POST', params, 'SYS'),
    /**
     * @property {string} SYS_PERMISSION_ATTRIBUTE_QUERY_API 系统管理-权限属性-列表
     */
    SYS_PERMISSION_ATTRIBUTE_QUERY_API: params => httpProxy('/sysProperty/query', 'GET', params, 'SYS'),
    /**
     * @property {string} SYS_PERMISSION_ATTRIBUTE_UPDATE_API 系统管理-权限属性-修改
     */
    SYS_PERMISSION_ATTRIBUTE_UPDATE_API: params => httpProxy('/sysProperty/update', 'POST', params, 'SYS'),
    /**
     * @property {string} SYS_PERMISSION_ATTRIBUTE_ROLE_BY_ID_API 系统管理-权限属性-查询用户有权限访问的属性节点
     */
    SYS_PERMISSION_ATTRIBUTE_ROLE_BY_ID_API: params => httpProxy('/sysRoleProperty/queryByUserId', 'GET', params, 'SYS')
};

export default SYSTEM_API;
