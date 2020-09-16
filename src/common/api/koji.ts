/*
 * @Description:
 * @Anthor: Telliex
 * @Date: 2020-08-27 14:28:27
 * @LastEditors: Telliex
 * @LastEditTime: 2020-09-14 16:53:39
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
     * @property CRAFTSTANDARD_UPDATE_API 制曲车间-制曲工艺-编辑
     */
    CRAFTSTANDARD_UPDATE_API: params => httpProxy('/koji/kojiCraftStandard/update', 'POST', params),
    /**
     * @property CRAFTSTANDARD_QUERY_API 制曲车间-制曲工艺-查询-分页
     */
    CRAFTSTANDARD_QUERY_API: params => httpProxy('/koji/kojiCraftStandard/queryPage', 'POST', params),
    /**
     * @property CRAFTSTANDARD_DELETE_API 制曲车间-制曲工艺-批量删除
     */
    CRAFTSTANDARD_DELETE_API: params => httpProxy('/koji/kojiCraftStandard/delete', 'POST', params),
    /**
     * @property WORKPROCEDURE_INSERT_API 制曲车间-报工工序-新增
     */
    WORKPROCEDURE_INSERT_API: params => httpProxy('/koji/kojiWorkProcedure/insert', 'POST', params),
    /**
     * @property WORKPROCEDURE_UPDATE_API 制曲车间-报工工序-编辑
     */
    WORKPROCEDURE_UPDATE_API: params => httpProxy('/koji/kojiWorkProcedure/update', 'POST', params),
    /**
     * @property WORKPROCEDURE_DELETE_API 制曲车间-报工工序-批量删除
     */
    WORKPROCEDURE_DELETE_API: params => httpProxy('/koji/kojiWorkProcedure/batchRemoveByIds', 'POST', params),
    /**
     * @property WORKPROCEDURE_QUERY_BY_WORKSHOPID_API 制曲车间-报工工序-查询报工中间表数据列表
     */
    WORKPROCEDURE_QUERY_BY_WORKSHOPID_API: params => httpProxy('/koji/kojiWorkProcedure/queryByWorkShopId', 'GET', params),
    /**
     * @property WORKPROCEDURE_QUERY_API 制曲车间-报工工序-根据高级查询条件查询报工中间表数据列表
     */
    WORKPROCEDURE_QUERY_API: params => httpProxy('/koji/kojiWorkProcedure/query', 'POST', params)
};

export default KOJI_API;
