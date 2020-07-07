import httpProxy from 'utils/net/httpProxy';

const MSG_API = {
    /**
     * @property {string}  MSG_QUERY_API 消息管理-消息查询
     */
    MSG_QUERY_API: params => httpProxy('/msg/query', 'POST', params),
    /**
     * @property {string}  MSG_READ_API 消息管理-标记已读
     */
    MSG_READ_API: params => httpProxy('/msg/read', 'POST', params)
};

export default MSG_API;
