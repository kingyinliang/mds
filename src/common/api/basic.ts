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
    STEPKG_UPDATE_API: params => httpProxy('/ste/stePkgRelation/update', 'POST', params),
    /**
     * @property {string} STEPKG_UPDATE_API 发酵信息-查询
     */
    FERINFO_LIST_API: params => httpProxy('/fer/information/pagingQuery', 'POST', params),
    /**
     * @property {string} FERINFO_DROPDOWN_API 发酵信息-查询
     */
    FERINFO_DROPDOWN_API: params => httpProxy('/fer/information/queryList', 'POST', params),
    /**
     * @property {string} STEPKG_UPDATE_API 发酵信息-保存
     */
    FERINFO_SAVE_API: params => httpProxy('/fer/information/save', 'POST', params),
    /**
     * @property {string} STEPKG_UPDATE_API 发酵信息-删除
     */
    FERINFO_DEL_API: params => httpProxy('/fer/information/delete', 'POST', params),
    /**
     * @property {string} STEPKG_UPDATE_API 盐水管理-查询
     */
    BRINE_LIST_API: params => httpProxy('/fer/brineManage/pagingQuery', 'POST', params),
    /**
     * @property {string} STEPKG_UPDATE_API 盐水管理-保存
     */
    BRINE_SAVE_API: params => httpProxy('/fer/brineManage/save', 'POST', params),
    /**
     * @property {string} STEPKG_UPDATE_API 盐水管理-删除
     */
    BRINE_DEL_API: params => httpProxy('/fer/brineManage/delete', 'POST', params),
    /**
     * @property {string} FER_CRAFT_PAGE_QUERY_API 工艺路线-查询
     */
    FER_CRAFT_PAGE_QUERY_API: params => httpProxy('/fer/craft/pageQuery', 'POST', params),
    /**
     * @property {string} FER_CRAFT_SAVE_API 工艺路线-保存
     */
    FER_CRAFT_SAVE_API: params => httpProxy('/fer/craft/save', 'POST', params),
    /**
     * @property {string} FER_CRAFT_UPDATE_API 工艺路线-修改
     */
    FER_CRAFT_UPDATE_API: params => httpProxy('/fer/craft/update', 'POST', params),
    /**
     * @property {string} FER_CRAFT_DELETE_API 工艺路线-批量删除
     */
    FER_CRAFT_DELETE_API: params => httpProxy('/fer/craft/batchDelete', 'POST', params)
};

export default BASIC_API;
