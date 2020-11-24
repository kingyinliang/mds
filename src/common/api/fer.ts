/*
 * @Description:
 * @Anthor: Telliex
 * @Date: 2020-11-18 14:53:12
 * @LastEditors: Telliex
 * @LastEditTime: 2020-11-24 09:45:46
 */
import httpProxy from 'utils/net/httpProxy';

const FER_API = {
    /**
     * @property {string} FER_FERMENTOR_BATCH_QUERY_API 发酵车间-发酵罐管理-查询发酵罐信息(分页)
     */
    FER_FERMENTOR_BATCH_QUERY_API: params => httpProxy('/fer/fermentor/batchQuery', 'POST', params),
    /**
     * @property {string} FER_FERMENTOR_CLEAN_API 发酵车间-发酵罐管理-清洗
     */
    FER_FERMENTOR_CLEAN_API: params => httpProxy('/fer/fermentor/clean', 'POST', params),
    /**
     * @property {string} FER_FERMENTOR_CLEAR_API 发酵车间-发酵罐管理-清罐
     */
    FER_FERMENTOR_CLEAR_API: params => httpProxy('/fer/fermentor/clear', 'POST', params),
    /**
     * @property {string} FER_FERMENTOR_ID_QUERY_API 发酵车间-发酵罐管理-根据容器id查询发酵罐信息
     */
    FER_FERMENTOR_ID_QUERY_API: params => httpProxy('/fer/fermentor/queryById', 'GET', params),
    /**
     * @property {string} FER_FERMENTOR_CY_BATCH_QUERY_API 发酵车间-发酵罐管理-根据容器id查询CY记录列表
     */
    FER_FERMENTOR_CY_BATCH_QUERY_API: params => httpProxy('/fer/fermentorCy/batchQuery', 'GET', params),
    /**
     * @property {string} FER_FERMENTOR_CY_SAVE_API 发酵车间-发酵罐管理-保存CY记录
     */
    FER_FERMENTOR_CY_SAVE_API: params => httpProxy('/fer/fermentorCy/save', 'POST', params),
    /**
     * @property {string} FER_FERMENTOR_FLATION_BATCH_QUERY_API 发酵车间-发酵罐管理-根据容器id查询鼓罐记录列表
     */
    FER_FERMENTOR_FLATION_BATCH_QUERY_API: params => httpProxy('/fer/fermentorInflation/batchQuery', 'GET', params),
    /**
     * @property {string} FER_FERMENTOR_FLATION_SAVE_API 发酵车间-发酵罐管理-保存鼓罐记录
     */
    FER_FERMENTOR_FLATION_SAVE_API: params => httpProxy('/fer/fermentorInflation/save', 'POST', params),
    /**
     * @property {string} FER_FERMENTOR_LY_BATCH_QUERY_API 发酵车间-发酵罐管理-根据容器id查询LY记录列表
     */
    FER_FERMENTOR_LY_BATCH_QUERY_API: params => httpProxy('/fer/fermentorLy/batchQuery', 'GET', params),
    /**
     * @property {string} FER_FERMENTOR_LY_SAVE_API 发酵车间-发酵罐管理-保存LY记录
     */
    FER_FERMENTOR_LY_SAVE_API: params => httpProxy('/fer/fermentorLy/save', 'POST', params),
    // ==================== 盐水发料 ==================
    /**
     * @property {string} FER_BRINE_POT_LIST_API 发酵车间-盐水发料-分页查询-罐
     */
    FER_BRINE_POT_LIST_API: params => httpProxy('/fer/brineIssue/pagingOfQueryByFermentor', 'POST', params),
    /**
     * @property {string} FER_BRINE_MATERIAL_API 发酵车间-盐水发料-查询盐水物料
     */
    FER_BRINE_MATERIAL_API: params => httpProxy('/fer/brineIssue/queryOfBrine', 'POST', params),
    /**
     * @property {string} FER_BRINE_OTHER_BOM_API 发酵车间-盐水发料-查询其他(Bom)物料
     */
    FER_BRINE_OTHER_BOM_API: params => httpProxy('/fer/brineIssue/queryOfBom', 'GET', params),
    /**
     * @property {string} FER_BRINE_SAVE_API 发酵车间-盐水发料-保存
     */
    FER_BRINE_SAVE_API: params => httpProxy('/fer/brineIssue/save', 'POST', params),
    /**
     * @property {string} FER_BRINE_SUBMIT_API 发酵车间-盐水发料-提交
     */
    FER_BRINE_SUBMIT_API: params => httpProxy('/fer/brineIssue/submit', 'POST', params),
    // ==================== 订单申请 ==================
    /**
     * @property {string} FER_ORDER_LIST_API 发酵车间-订单申请-分页列表查询
     */
    FER_ORDER_LIST_API: params => httpProxy('/fer/order/query/page', 'POST', params),
    /**
     * @property {string} FER_ORDER_SEND_API 发酵车间-订单申请-发送申请
     */
    FER_ORDER_SEND_API: params => httpProxy('/fer/order/send', 'POST', params)
};

export default FER_API;
