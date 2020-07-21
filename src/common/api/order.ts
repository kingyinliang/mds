import httpProxy from 'utils/net/httpProxy';

const ORDER_API = {
    /**
     * @property {string} ORDER_BOOM_LIST_API 订单boom
     */
    ORDER_BOOM_LIST_API: params => httpProxy('/order/orderBom/queryList', 'POST', params)
};

export default ORDER_API;
