import httpProxy from 'utils/net/httpProxy';

const REPORTS_API = {
    /**
     * @property {string} REPORT_PACKAGING_OEE_API 包装车间/OEE 报表
     */
    REPORT_PACKAGING_OEE_API: params => httpProxy('/ste/query', 'POST', params),
    /**
     * @property {string} REPORT_PACKAGING_PROCESSLINE_OEE_API 包装车间/产线 OEE 报表
     */
    REPORT_PACKAGING_PRODUCTLINE_OEE_API: params => httpProxy('/ste/query', 'POST', params)
};

export default REPORTS_API;
