/*
 * @Description:
 * @Anthor: Telliex
 * @Date: 2020-07-22 20:15:16
 * @LastEditors: Telliex
 * @LastEditTime: 2020-07-23 15:27:43
 */
import httpProxy from 'utils/net/httpProxy';

const RDM_API = {
    /**
     * @property {string} PERMISSION_GROUP_QUERY_API  RDM 数据集分页列表
     */
    PERMISSION_GROUP_QUERY_API: params => httpProxy('/permissionGroup/queryPage', 'GET', params, 'RDM'),
    /**
     * @property {string} PERMISSION_LIST_PERMISSIONCODE_API RDM 列出所有权限属性字典
     */
    PERMISSION_LIST_PERMISSIONCODE_API: params => httpProxy('/permission/listPermissionCode', 'GET', params, 'RDM'),
    /**
     * @property {string} PERMISSION_QUERY_ITEMLIST_API RDM 查询数据集下的权限列表
     */
    PERMISSION_QUERY_ITEMLIST_API: params => httpProxy('/permissionGroup/queryItemList', 'GET', params, 'RDM'),
    /**
     * @property {string} PERMISSION_DATASET_SAVE_API RDM 数据集保存
     */
    PERMISSION_DATASET_SAVE_API: params => httpProxy('/permissionGroup/save', 'POST', params, 'RDM'),
    /**
     * @property {string} EPERMISSION_REMOVE_API RDM 数据集删除
     */
    PERMISSION_REMOVE_API: params => httpProxy('/permissionGroup/remove', 'GET', params, 'RDM'),
    /**
     * @property {string} PERMISSION_QUERY_API RDM 属性字典 分页查询
     */
    PERMISSION_QUERY_API: params => httpProxy('/permission/queryPage', 'GET', params, 'RDM'),
    /**
     * @property {string} PERMISSION_SAVE_API RDM 属性字典 保存
     */
    PERMISSION_SAVE_API: params => httpProxy('/permission/save', 'GET', params, 'RDM')
};

export default RDM_API;
