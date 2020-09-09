/*
 * @Description:
 * @Anthor: Telliex
 * @Date: 2020-08-27 14:28:27
 * @LastEditors: Telliex
 * @LastEditTime: 2020-09-08 20:14:49
 */
/*
 * @Description:
 * @Anthor: Telliex
 * @Date: 2020-08-27 11:50:48
 * @LastEditors: Telliex
 * @LastEditTime: 2020-09-08 19:37:44
 */
import httpProxy from 'utils/net/httpProxy';

const KOJI_API = {
    /**
     * @property CRAFTSTANDARD_INSERT_API 制曲车间-制曲工艺-新增
     */
    CRAFTSTANDARD_INSERT_API: params => httpProxy('/koji/kojiCraftStandard/insert', 'POST', params),
    /**
     * @property CRAFTSTANDARD_UPDATE_API 制曲车间-制曲工艺-修改
     */
    CRAFTSTANDARD_UPDATE_API: params => httpProxy('/koji/kojiCraftStandard/update', 'POST', params),
    /**
     * @property CRAFTSTANDARD_QUERY_API 制曲车间-制曲工艺-查询-分页
     */
    CRAFTSTANDARD_QUERY_API: params => httpProxy('/koji/kojiCraftStandard/queryPage', 'POST', params),
    /**
     * @property CRAFTSTANDARD_DELETE_API 制曲车间-制曲工艺-删除-批量
     */
    CRAFTSTANDARD_DELETE_API: params => httpProxy('/koji/kojiCraftStandard/delete', 'POST', params)
};

export default KOJI_API;
