/*
 * @Description:
 * @Anthor: Telliex
 * @Date: 2020-11-18 14:53:12
 * @LastEditors: Telliex
 * @LastEditTime: 2020-11-18 14:57:30
 */
import httpProxy from 'utils/net/httpProxy';

const FER_API = {
    /**
     * @property {string} FER_HOME_LIST_API 发酵罐
     */
    FER_HOME_LIST_API: params => httpProxy('/xxxxxxx', 'POST', params)
};

export default FER_API;
