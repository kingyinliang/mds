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
    CRAFT_UPDATE_API: params => httpProxy('/steProcess/update', 'POST', params)
};

export default BASIC_API;
