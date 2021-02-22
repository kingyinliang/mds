/*
 * @Description:
 * @Anthor: Telliex
 * @Date: 2021-01-27 15:06:29
 * @LastEditors: Telliex
 * @LastEditTime: 2021-02-03 12:06:07
 */
import httpProxy from 'utils/net/httpProxy';

const REPORTS_API = {
    /**
     * @property {string} REPORT_PACKAGING_OEE_API 包装车间/OEE 报表
     */
    REPORT_PACKAGING_OEE_API: params => httpProxy('/pkgReportForm/oee/query', 'POST', params, 'REPORT'),
    /**
     * @property {string} REPORT_PACKAGING_OEE_MATERIAL_QUERY_API 包装车间/OEE 报表 - get material
     */
    REPORT_PACKAGING_OEE_MATERIAL_QUERY_API: params => httpProxy('/pkgReportForm/material/query', 'POST', params, 'REPORT')
};

export default REPORTS_API;
