import httpProxy from 'utils/net/httpProxy';

const BASIC_API = {
    /**
     * @property {string} CRAFT_LIST_API 工艺标准-查询
     */
    CRAFT_LIST_API: params => httpProxy('/steProcess/query', 'POST', params),
    /**
     * @property {string} CRAFT_DEL_API 工艺标准-删除
     */
    CRAFT_DEL_API: params => httpProxy('/steProcess/delete', 'POST', params),
    /**
     * @property {string} CRAFT_ADD_API 工艺标准-新增
     */
    CRAFT_ADD_API: params => httpProxy('/steProcess/insert', 'POST', params),
    /**
     * @property {string} CRAFT_UPDATE_API 工艺标准-修改
     */
    CRAFT_UPDATE_API: params => httpProxy('/steProcess/update', 'POST', params),
    /**
     * @property {string} STEPKG_LIST_API 杀菌包装对应-查询
     */
    STEPKG_LIST_API: params => httpProxy('/ste/stePkgRelation/query', 'POST', params),
    /**
     * @property {string} STEPKG_DEL_API 杀菌包装对应-删除
     */
    STEPKG_DEL_API: params => httpProxy('/ste/stePkgRelation/delete', 'POST', params),
    /**
     * @property {string} STEPKG_ADD_API 杀菌包装对应-新增
     */
    STEPKG_ADD_API: params => httpProxy('/ste/stePkgRelation/insert', 'POST', params),
    /**
     * @property {string} STEPKG_UPDATE_API 杀菌包装对应-修改
     */
    STEPKG_UPDATE_API: params => httpProxy('/ste/stePkgRelation/update', 'POST', params)
};

export default BASIC_API;
