/*
 * @Description:
 * @Anthor: Telliex
 * @Date: 2020-08-27 14:28:27
 * @LastEditors: Telliex
 * @LastEditTime: 2020-09-08 20:14:49
 */
import httpProxy from 'utils/net/httpProxy';
const KOJI_API = {
    /**
     * @property {string} KOJI_STOCK_FLOUR_INDEX_LIST_ALL_API 麦粉库存-明细列表-所有
     */
    KOJI_STOCK_FLOUR_INDEX_LIST_ALL_API: params => httpProxy('/koji/kojiWheatStorage/queryAllDetailList', 'GET', params),
    /**
     * @property {string} KOJI_STOCK_FLOUR_INDEX_LIST_API 麦粉库存-明细列表
     */
    KOJI_STOCK_FLOUR_INDEX_LIST_API: params => httpProxy('/koji/kojiWheatStorage/queryDetailList', 'GET', params),
    /**
    * @property {string} KOJI_STOCK_FLOUR_DETAIL_CUR_LIST_API 麦粉库存-当前详情-分页
    */
    KOJI_STOCK_FLOUR_DETAIL_CUR_LIST_API: params => httpProxy('/koji/kojiWheatStorage/queryPage/currentDetails', 'POST', params),
    /**
    * @property {string} KOJI_STOCK_FLOUR_DETAIL_HISTORY_LIST_API 麦粉库存-历史详情-分页
    */
    KOJI_STOCK_FLOUR_DETAIL_HISTORY_LIST_API: params => httpProxy('/koji/kojiWheatStorage/queryPage/historyDetails', 'POST', params),

    /**
     * @property {string} KOJI_STOCK_BEAN_INDEX_LIST_ALL_API 大豆库存-明细列表-所有
     */
    KOJI_STOCK_BEAN_INDEX_LIST_ALL_API: params => httpProxy('/koji/kojiBeanStorage/queryAllDetailList', 'GET', params),
    /**
     * @property {string} KOJI_STOCK_BEAN_INDEX_LIST_API 大豆库存-明细列表
     */
    KOJI_STOCK_BEAN_INDEX_LIST_API: params => httpProxy('/koji/kojiBeanStorage/queryDetailList', 'GET', params),
    /**
    * @property {string} KOJI_STOCK_BEAN_DETAIL_CUR_LIST_API 大豆库存-当前详情-分页
    */
    KOJI_STOCK_BEAN_DETAIL_CUR_LIST_API: params => httpProxy('/koji/kojiBeanStorage/queryPage/currentDetails', 'POST', params),
    /**
    * @property {string} KOJI_STOCK_BEAN_DETAIL_HISTORY_LIST_API 大豆库存-历史详情-分页
    */
    KOJI_STOCK_BEAN_DETAIL_HISTORY_LIST_API: params => httpProxy('/koji/kojiBeanStorage/queryPage/historyDetails', 'POST', params),

    /**
     * @property {string} KOJI_STOCK_Y158_INDEX_LIST_ALL_API Y158菌库存-明细列表-所有
     */
    KOJI_STOCK_Y158_INDEX_LIST_ALL_API: params => httpProxy('/koji/kojiStrainStorage/queryAllDetailList', 'GET', params),
    /**
     * @property {string} KOJI_STOCK_Y158_INDEX_LIST_API Y158菌库存-明细列表
     */
    KOJI_STOCK_Y158_INDEX_LIST_API: params => httpProxy('/koji/kojiStrainStorage/queryDetailList', 'GET', params),
    /**
    * @property {string} KOJI_STOCK_Y158_DETAIL_CUR_LIST_API Y158菌库存-当前详情-分页
    */
    KOJI_STOCK_Y158_DETAIL_CUR_LIST_API: params => httpProxy('/koji/kojiStrainStorage/queryPage/currentDetails', 'POST', params),
    /**
    * @property {string} KOJI_STOCK_Y158_DETAIL_HISTORY_LIST_API Y158菌库存-历史详情-分页
    */
    KOJI_STOCK_Y158_DETAIL_HISTORY_LIST_API: params => httpProxy('/koji/kojiStrainStorage/queryPage/historyDetails', 'POST', params),

    /**
    * @property {string} KOJI_STOCK_Y158_DETAIL_ADJUST_API 执行调整
    */
    KOJI_STOCK_Y158_DETAIL_ADJUST_API: params => httpProxy('/koji/kojiStorageAdjust/adjust', 'POST', params),
    /**
    * @property {string} KOJI_STOCK_Y158_DETAIL_ADJUST_LIST_API 库存调整-分页查询
    */
    KOJI_STOCK_Y158_DETAIL_ADJUST_LIST_API: params => httpProxy('/koji/kojiStorageAdjust/queryPage', 'POST', params),

    /**
     * @property CRAFTSTANDARD_INSERT_API 制曲车间-制曲工艺-新增
     */
    CRAFTSTANDARD_INSERT_API: params => httpProxy('/koji/kojiCraftStandard/insert', 'POST', params),
    /**
     * @property CRAFTSTANDARD_UPDATE_API 制曲车间-制曲工艺-修改
     */
    CRAFTSTANDARD_UPDATE_API: params => httpProxy('/koji/kojiCraftStandard/update', 'POST', params),
    /**
     * @property CRAFTSTANDARD_QUERY_API 制曲车间-制曲工艺-查询-分页
     */
    CRAFTSTANDARD_QUERY_API: params => httpProxy('/koji/kojiCraftStandard/queryPage', 'POST', params),
    /**
     * @property CRAFTSTANDARD_DELETE_API 制曲车间-制曲工艺-删除-批量
     */
    CRAFTSTANDARD_DELETE_API: params => httpProxy('/koji/kojiCraftStandard/delete', 'POST', params)
};

export default KOJI_API;
