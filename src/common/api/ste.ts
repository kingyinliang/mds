import httpProxy from 'utils/net/httpProxy';

const STE_API = {
    /**
     * @property {string} STE_HOME_LIST_API 杀菌车间首页
     */
    STE_HOME_LIST_API: params => httpProxy('/ste/query', 'POST', params),
    /**
     * @property {string} STE_HOME_LIST_API 杀菌车间-订单拆分
     */
    STE_SPLIT_LIST_API: params => httpProxy('/steOrderSplit/query', 'POST', params),
    /**
     * @property {string} STE_SPLIT_DETAIL_LIST_API 杀菌车间-订单拆分弹窗查询
     */
    STE_SPLIT_DETAIL_LIST_API: params => httpProxy('/steOrderSplit/potOrder/query', 'POST', params),
    /**
     * @property {string} STE_SPLIT_DETAIL_SAVE_API 杀菌车间-订单拆分弹窗保存
     */
    STE_SPLIT_SAVE_API: params => httpProxy('/steOrderSplit/save', 'POST', params),
    /**
     * @property {string} STE_SPLIT_DETAIL_SAVE_API 杀菌车间-订单拆分详情弹窗保存
     */
    STE_SPLIT_DETAIL_SAVE_API: params => httpProxy('/steOrderSplit/potOrder/save', 'POST', params)
};

export default STE_API;
