import httpProxy from 'utils/net/httpProxy'

const TRACK_API = {
    /**
     * 物料追溯-正向追溯
     */
    TRACK_BACK_FORWARD_TRACE_BACK: params => httpProxy('/traceBack/forwardTraceBack', 'POST', params, 'TRACK'),
    /**
     * 物料追溯-反向追溯
     */
    TRACK_BACK_REVERSE_TRACE_BACK: params => httpProxy('/traceBack/reverseTraceBack', 'POST', params, 'TRACK'),
    /**
     * 物料追溯-通过key获取追溯数据
     */
    TRACK_BACK_TRACE_BACK_BY_KEY: params => httpProxy('/traceBack/traceBackByKey', 'GET', params, 'TRACK'),
    /**
     * 物料追溯-物料追溯-导出追溯数据-正向
     */
    TRACE_BACK_EXCEL_FORWARD: params => httpProxy('/traceBack/forwardTraceBackExport', 'POST', params, 'TRACK'),
    /**
     * 物料追溯-物料追溯-导出追溯数据-反向
     */
    TRACK_BACK_EXCEL_REVERSE: params => httpProxy('/traceBack/reverseTraceBackExport', 'POST', params, 'TRACK'),
    /**
     * 物料追溯-成品简报导出
     */
    TRACK_BACK_QUERY_FINSH_TRACE_BACK_EXCEL: params => httpProxy('/traceBack/queryFinishBriefingTraceBackExcel', 'POST', params, 'TRACK'),
    /**
     * 物料追溯-成品简报查询
     */
    TRACK_BACK_QUERY_FINSH_TRACE_BACK_QUERY: params => httpProxy('/traceBack/queryFinishBriefingTraceBack', 'POST', params, 'TRACK'),
    /**
     * 物料追溯-批次详情
     */
    TRACK_BACK_BATCH_DETAIL: params => httpProxy('/traceBack/queryBatchDetailsTraceBack', 'POST', params, 'TRACK')
}

export default TRACK_API
