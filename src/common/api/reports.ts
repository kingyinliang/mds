/*
 * @Description:
 * @Anthor: Telliex
 * @Date: 2021-01-27 15:06:29
 * @LastEditors: Telliex
 * @LastEditTime: 2021-03-03 16:12:15
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
    REPORT_PACKAGING_OEE_MATERIAL_QUERY_API: params => httpProxy('/pkgReportForm/material/query', 'POST', params, 'REPORT'),
    /**
     * @property {string} REPORT_PACKAGING_PRODUCTLINE_OEE_QUERY_API 包装车间/产线 OEE 报表
     */
    REPORT_PACKAGING_PRODUCTLINE_OEE_QUERY_API: params => httpProxy('/pkgReportForm/productLineOee/query', 'POST', params, 'REPORT'),
    /**
     * @property {string} REPORT_PACKAGING_TIMESUM_QUERY_API 包装车间-工时检验及汇总报表
     */
    REPORT_PACKAGING_TIMESUM_QUERY_API: params => httpProxy('/pkgReportForm/timeSum/query', 'POST', params, 'REPORT'),
    /**
     * @property {string} EPORT_PACKAGING_DAYMAN_QUERY_API 包装车间-每日人力报表
     */
    REPORT_PACKAGING_DAYMAN_QUERY_API: params => httpProxy('/pkgReportForm/dayMan/query', 'POST', params, 'REPORT'),
    /**
     * @property {string} REPORT_PACKAGING_LOSS_STATISTICS_QUERY_API 包装车间-损耗统计及分析
     */
    REPORT_PACKAGING_LOSS_STATISTICS_QUERY_API: params => httpProxy('/pkgReportForm/loss/query', 'POST', params, 'REPORT')
};

export default REPORTS_API;
