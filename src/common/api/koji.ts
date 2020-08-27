/*
 * @Description:
 * @Anthor: Telliex
 * @Date: 2020-08-27 11:50:48
 * @LastEditors: Telliex
 * @LastEditTime: 2020-08-27 13:56:09
 */
import httpProxy from 'utils/net/httpProxy';

const KOJI_API = {
    /**
     * @property {string} KOJI_HOME_LIST_API XXXXX-XXXXXXX
     */
    KOJI_HOME_LIST_API: params => httpProxy('/ste/steTimeSheet/query', 'POST', params)
};

export default KOJI_API;
