/*
 * @Description:
 * @Anthor: Telliex
 * @Date: 2021-01-27 15:06:29
 * @LastEditors: Telliex
 * @LastEditTime: 2021-03-04 17:38:37
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
    REPORT_QUERY_YIELD_API: params => httpProxy('/pkgReportForm/product/queryYield', 'POST', params, 'REPORT'),
    /**
     * @property {string} REPORT_PACKAGING_PRODUCTLINE_OEE_QUERY_API 包装车间/产线 OEE 报表
     */
    REPORT_PACKAGING_PRODUCTLINE_OEE_QUERY_API: params => httpProxy('/pkgReportForm/productLineOee/query', 'POST', params, 'REPORT'),
    /**
     * @property {string} REPORT_PACKAGING_TIMESUM_QUERY_API 包装车间-工时检验及汇总报表
     */
    REPORT_PACKAGING_TIMESUM_QUERY_API: params => httpProxy('/pkgReportForm/timeSum/query', 'POST', params, 'REPORT'),
    /**
     * @property {string} REPORT_PACKAGING_DAYMAN_QUERY_API 包装车间-每日人力报表
     */
    REPORT_PACKAGING_DAYMAN_QUERY_API: params => httpProxy('/pkgReportForm/dayMan/query', 'POST', params, 'REPORT'),
    /**
     * @property {string} REPORT_PACKAGING_LOSS_STATISTICS_QUERY_API 包装车间-损耗统计及分析
     */
    REPORT_PACKAGING_LOSS_STATISTICS_QUERY_API: params => httpProxy('/pkgReportForm/loss/query', 'POST', params, 'REPORT'),
    /**
     * @property {string} REPORT_PACKAGING_DEFECTIVE_PRODUCT_QUERY_API 包装车间-包材不良品明细
     */
    REPORT_PACKAGING_DEFECTIVE_PRODUCT_QUERY_API: params => httpProxy('/pkgReportForm/pkgMaterialBad/query', 'POST', params, 'REPORT'),
    /**
     * @property {string} REPORT_PACKAGING_PRODUCT_DAY_QUERY_API 包装车间-包装生产日报
     */
    REPORT_PACKAGING_PRODUCT_DAY_QUERY_API: params => httpProxy('/pkgReportForm/pkgProduction/query', 'POST', params, 'REPORT'),
    /**
     * @property {string} REPORT_SUB_OUTPUT_SUMMARY_QUERY_API 包装车间-产量报表-分品项产量汇总
     */
    REPORT_SUB_OUTPUT_SUMMARY_QUERY_API: params => httpProxy('/pkgReportForm/product/querySubOutputSummary', 'POST', params, 'REPORT')
};

export default REPORTS_API;
