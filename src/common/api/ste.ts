import httpProxy from 'utils/net/httpProxy';

const STE_API = {
    /**
     * @property {string} STE_HOME_LIST_API 杀菌车间首页
     */
    STE_HOME_LIST_API: params => httpProxy('/order/queryListPkg', 'POST', params),
    /**
     * @property {string} STE_SPLIT_LIST_API 杀菌车间-订单拆分
     */
    STE_SPLIT_LIST_API: params => httpProxy('/steOrderSplit/query', 'POST', params),
    /**
     * @property {string} STE_DISSOLUTIONBUCKET_QUERY_API 杀菌车间-溶解罐管理-查询
     */
    STE_DISSOLUTIONBUCKET_QUERY_API: params => httpProxy('/steDissolutionPot/query', 'POST', params),
    /**
     * @property {string} STE_DISSOLUTIONBUCKET_ITEM_QUERY_API 杀菌车间-溶解罐管理-详情查询
     */
    STE_DISSOLUTIONBUCKET_ITEM_QUERY_API: params => httpProxy('/steDissolutionPot/item/query', 'GET', params),
    /**
     * @property {string} STE_DISSOLUTIONBUCKET_ITEM_QUERY_API 杀菌车间-溶解罐管理-满罐、取消满罐
     */
    STE_DISSOLUTIONBUCKET_FULL_API: params => httpProxy('/steDissolutionPot/full', 'POST', params)
};

export default STE_API;
