import httpProxy from 'utils/net/httpProxy';

const AUDIT_API = {
    /**
     * @property {string} INLIST_API 订单号查询审核日志  orderNo
     */
    AUDIT_LOG_LIST_API: params => httpProxy('/verifyRecord/queryByNo', 'GET', params),
    /**
     * @property {string} INLIST_API 生管审核审核日志  orderNo
     */
    AUDIT_DIALOG_LOG_LIST_API: params => httpProxy('/verifyRecord/queryByVerifyId', 'GET', params),
    /**
     * @property {string} INLIST_API 入库审核列表
     */
    INLIST_API: params => httpProxy('/verifyInStorage/query', 'POST', params),
    /**
     * @property {string} INADD_API 入库审核新增
     */
    INADD_API: params => httpProxy('/verifyInStorage/insert', 'POST', params),
    /**
     * @property {string} INUPDATE_API 入库审核修改
     */
    INUPDATE_API: params => httpProxy('/verifyInStorage/upate', 'POST', params),
    /**
     * @property {string} INPASS_API 入库审核过账
     */
    INPASS_API: params => httpProxy('/verifyInStorage/pass', 'POST', params),
    /**
     * @property {string} INREFUSE_API 入库审核退回
     */
    INREFUSE_API: params => httpProxy('/verifyInStorage/refuse', 'POST', params),
    /**
     * @property {string} INWRITEOFFS_API 入库审核反审
     */
    INWRITEOFFS_API: params => httpProxy('/verifyInStorage/writeOffs', 'POST', params),
    /**
     * @property {string} PROISSUEQUERY_API 生产发料列表
     */
    PROISSUEQUERY_API: params => httpProxy('/verifyMaterial/query', 'POST', params),
    /**
     * @property {string} PROISSUEPASS_API 生产发料过账
     */
    PROISSUEPASS_API: params => httpProxy('/verifyMaterial/pass', 'POST', params),
    /**
     * @property {string} PROISSUEREFUSE_API 生产发料退回
     */
    PROISSUEREFUSE_API: params => httpProxy('/verifyMaterial/refuse', 'POST', params),
    /**
     * @property {string} PROISSUEWRITEOFFS_API 生产发料反审
     */
    PROISSUEWRITEOFFS_API: params => httpProxy('/verifyMaterial/writeOffs', 'POST', params),
    /**
     * @property {string} PROISSUEUPDATE_API 生产发料修改
     */
    PROISSUEUPDATE_API: params => httpProxy('/verifyMaterial/update', 'POST', params),
    /**
     * @property {string} PROISSUEDROPDOWN_API 生产发料组件物料下拉
     */
    PROISSUEDROPDOWN_API: params => httpProxy('/verifyMaterial/dropDown', 'POST', params),
    /**
     * @property {string} PROISSUEQUERYBYNO_API 生产发料审核日志
     */
    PROISSUEQUERYBYNO_API: params => httpProxy('/verifyRecord/queryByNo', 'GET', params),
    /**
     * @property {string} HOURS_LIST_API 报工审核列表
     */
    HOURS_LIST_API: params => httpProxy('/verifyTimeSheet/query', 'POST', params),
    /**
     * @property {string} HOURS_ADD_API 报工审核新增
     */
    HOURS_ADD_API: params => httpProxy('/verifyTimeSheet/insert', 'POST', params),
    /**
     * @property {string} HOURS_UPDATE_API 报工审核修改
     */
    HOURS_UPDATE_API: params => httpProxy('/verifyTimeSheet/update', 'POST', params),
    /**
     * @property {string} HOURS_PASS_API 报工审核过账
     */
    HOURS_PASS_API: params => httpProxy('/verifyTimeSheet/pass', 'POST', params),
    /**
     * @property {string} HOURS_REFUSE_API 报工审核退回
     */
    HOURS_REFUSE_API: params => httpProxy('/verifyTimeSheet/refuse', 'POST', params),
    /**
     * @property {string} HOURS_WRITEOFFS_API 报工审核反审
     */
    HOURS_WRITEOFFS_API: params => httpProxy('/verifyTimeSheet/reset', 'POST', params),
    /**
     * @property {string} HOURS_WRITEOFFS_API 辅料调整
     */
    ACCESSORIES_LIST_API: params => httpProxy('/verifyAccessoriesAdjust/query', 'POST', params),
    /**
     * @property {string} STE_AUDIT_LOG_API 杀菌、制曲车间 - 审核日志
     */
    STE_AUDIT_LOG_API: params => httpProxy('/verifyRecord/queryByNoAndType', 'POST', params),
    /**
     * @property {string} STE_AUDIT_QUERY_BY_ID 制曲车间 - 工时录入 - 审核日志
     */
    STE_AUDIT_QUERY_BY_ID: params => httpProxy('/verifyRecord/koji/queryById', 'GET', params)
};

export default AUDIT_API;
