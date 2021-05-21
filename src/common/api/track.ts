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
     * 物料追溯-物料追溯-导出追溯数据-层级样式
     */
    TRACK_BACK_QUERY_LEVEL_TRACE_BACK_EXCEL: params => httpProxy('/traceBack/queryLevelTraceBackExcel', 'POST', params, 'TRACK'),
    /**
     * 物料追溯-导出追溯数据-平铺样式
     */
    TRACK_BACK_QUERY_TRACE_BACK_EXCEL: params => httpProxy('/traceBack/queryTraceBackExcel', 'POST', params, 'TRACK')
}

export default TRACK_API
