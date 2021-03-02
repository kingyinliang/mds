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
    REPORT_PACKAGING_OEE_MATERIAL_QUERY_API: params => httpProxy('/pkgReportForm/material/query', 'POST', params, 'REPORT'),
    /**
     * @property {string} REPORT_OUTPUT_SUMMARY_QUERY_API 产量汇总 报表 -
     */
    REPORT_OUTPUT_SUMMARY_QUERY_API: params => httpProxy('/pkgReportForm/product/queryProductSummary', 'POST', params, 'REPORT'),
    /**
     * @property {string} REPORT_PRODUCT_LINE_CAPACITY_API 生产线产能利用率 报表 -
     */
    REPORT_PRODUCT_LINE_CAPACITY_API: params => httpProxy('/pkgReportForm/product/queryProductLineCapacity', 'POST', params, 'REPORT'),
    /**
     * @property {string} REPORT_LARGE_CLASS_DROP_DOWN_API 包装车间-产量报表-查询产品大类下拉
     */
    REPORT_LARGE_CLASS_DROP_DOWN_API: params => httpProxy('/pkgReportForm/product/queryLargeClassDropDown', 'GET', params, 'REPORT'),
    /**
     * @property {string} REPORT_MATERIAL_DROP_DOWN_API 包装车间-产量报表-查询产品下拉
     */
    REPORT_MATERIAL_DROP_DOWN_API: params => httpProxy('/pkgReportForm/product/queryMaterialDropDown', 'GET', params, 'REPORT'),
    /**
     * @property {string} REPORT_SUB_OUT_PUT_API 包装车间-产量报表-包装各品项产量
     */
    REPORT_SUB_OUT_PUT_API: params => httpProxy('/pkgReportForm/product/querySubOutput', 'POST', params, 'REPORT'),
    /**
     * @property {string} REPORT_QUERY_YIELD_API 包装车间-产量报表-产品出成率
     */
    REPORT_QUERY_YIELD_API: params => httpProxy('/pkgReportForm/product/queryYield', 'POST', params, 'REPORT')
};

export default REPORTS_API;
