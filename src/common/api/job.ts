
import httpProxy from 'utils/net/httpProxy';

const JOB_API = {
    /**
     * @property {string} OREDER_SYNC_API 计划管理--计划订单-订单同步（增量）
     */
    OREDER_SYNC_API: params => httpProxy('/order/sync', 'POST', params, 'JOB'),
    /**
     * @property {string} METERIAL_SYNC_API 基础数据-物料管理-同步信息
     */
    METERIAL_SYNC_API: params => httpProxy('/sysMaterial/sync', 'POST', params, 'JOB')
};

export default JOB_API;
