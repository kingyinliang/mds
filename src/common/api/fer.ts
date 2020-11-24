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
    FER_FERMENTOR_LY_SAVE_API: params => httpProxy('/fer/fermentorLy/save', 'POST', params)
};

export default FER_API;
