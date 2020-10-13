/*
 * @Description:
 * @Anthor: Telliex
 * @Date: 2020-08-27 14:28:27
 * @LastEditors: Telliex
 * @LastEditTime: 2020-10-13 17:43:04
 */
import httpProxy from 'utils/net/httpProxy';
const KOJI_API = {
    /**
     * @property {string} KOJI_STOCK_FLOUR_INDEX_LIST_ALL_API 麦粉库存-明细列表-所有
     */
    KOJI_STOCK_FLOUR_INDEX_LIST_ALL_API: params => httpProxy('/koji/kojiWheatStorage/queryAllDetailList', 'GET', params),
    /**
     * @property {string} KOJI_STOCK_FLOUR_INDEX_LIST_API 麦粉库存-明细列表
     */
    KOJI_STOCK_FLOUR_INDEX_LIST_API: params => httpProxy('/koji/kojiWheatStorage/queryDetailList', 'GET', params),
    /**
     * @property {string} KOJI_STOCK_FLOUR_DETAIL_CUR_LIST_API 麦粉库存-当前详情-分页
     */
    KOJI_STOCK_FLOUR_DETAIL_CUR_LIST_API: params => httpProxy('/koji/kojiWheatStorage/queryPage/currentDetails', 'POST', params),
    /**
     * @property {string} KOJI_STOCK_FLOUR_DETAIL_HISTORY_LIST_API 麦粉库存-历史详情-分页
     */
    KOJI_STOCK_FLOUR_DETAIL_HISTORY_LIST_API: params => httpProxy('/koji/kojiWheatStorage/queryPage/historyDetails', 'POST', params),

    /**
     * @property {string} KOJI_STOCK_BEAN_INDEX_LIST_ALL_API 大豆库存-明细列表-所有
     */
    KOJI_STOCK_BEAN_INDEX_LIST_ALL_API: params => httpProxy('/koji/kojiBeanStorage/queryAllDetailList', 'GET', params),
    /**
     * @property {string} KOJI_STOCK_BEAN_INDEX_LIST_API 大豆库存-明细列表
     */
    KOJI_STOCK_BEAN_INDEX_LIST_API: params => httpProxy('/koji/kojiBeanStorage/queryDetailList', 'GET', params),
    /**
     * @property {string} KOJI_STOCK_BEAN_DETAIL_CUR_LIST_API 大豆库存-当前详情-分页
     */
    KOJI_STOCK_BEAN_DETAIL_CUR_LIST_API: params => httpProxy('/koji/kojiBeanStorage/queryPage/currentDetails', 'POST', params),
    /**
     * @property {string} KOJI_STOCK_BEAN_DETAIL_HISTORY_LIST_API 大豆库存-历史详情-分页
     */
    KOJI_STOCK_BEAN_DETAIL_HISTORY_LIST_API: params => httpProxy('/koji/kojiBeanStorage/queryPage/historyDetails', 'POST', params),

    /**
     * @property {string} KOJI_STOCK_Y158_INDEX_LIST_ALL_API Y158菌库存-明细列表-所有
     */
    KOJI_STOCK_Y158_INDEX_LIST_ALL_API: params => httpProxy('/koji/kojiStrainStorage/queryAllDetailList', 'GET', params),
    /**
     * @property {string} KOJI_STOCK_Y158_INDEX_LIST_API Y158菌库存-明细列表
     */
    KOJI_STOCK_Y158_INDEX_LIST_API: params => httpProxy('/koji/kojiStrainStorage/queryDetailList', 'GET', params),
    /**
     * @property {string} KOJI_STOCK_Y158_DETAIL_CUR_LIST_API Y158菌库存-当前详情-分页
     */
    KOJI_STOCK_Y158_DETAIL_CUR_LIST_API: params => httpProxy('/koji/kojiStrainStorage/queryPage/currentDetails', 'POST', params),
    /**
     * @property {string} KOJI_STOCK_Y158_DETAIL_HISTORY_LIST_API Y158菌库存-历史详情-分页
     */
    KOJI_STOCK_Y158_DETAIL_HISTORY_LIST_API: params => httpProxy('/koji/kojiStrainStorage/queryPage/historyDetails', 'POST', params),

    /**
     * @property {string} KOJI_STOCK_Y158_DETAIL_ADJUST_API 执行调整
     */
    KOJI_STOCK_Y158_DETAIL_ADJUST_API: params => httpProxy('/koji/kojiStorageAdjust/adjust', 'POST', params),
    /**
     * @property {string} KOJI_STOCK_Y158_DETAIL_ADJUST_LIST_API 库存调整-分页查询
     */
    KOJI_STOCK_Y158_DETAIL_ADJUST_LIST_API: params => httpProxy('/koji/kojiStorageAdjust/queryPage', 'POST', params),

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
    WORKPROCEDURE_QUERY_API: params => httpProxy('/koji/kojiWorkProcedure/query', 'POST', params),

    /**
     * @property {string} KOJI_CRAFT_HEAD_INFO_QUERY_API 制曲车间-制曲头部信息查询(洗豆 蒸面 圆盘 头部信息)
     */
    KOJI_CRAFT_HEAD_INFO_QUERY_API: params => httpProxy('/koji/kojiHouseSplit/getHouseSplite', 'GET', params),
    /**
     * @property {string} KOJI_SBEAN_SIEVE_QUERY_API 制曲车间-筛豆查询
     */
    KOJI_SBEAN_SIEVE_QUERY_API: params => httpProxy('/koji/kojiBeanSieve/query', 'POST', params),
    /**
     * @property {string} KOJI_SBEAN_WASH_QUERY_API 制曲车间-洗豆记录查询
     */
    KOJI_SBEAN_WASH_QUERY_API: params => httpProxy('/koji/kojiBeanWash/query', 'POST', params),
    /**
     * @property {string} KOJI_EXCEPTION_QUERY_API 制曲车间-查询异常记录
     */
    KOJI_EXCEPTION_QUERY_API: params => httpProxy('/koji/kojiException/query', 'POST', params),
    /**
     * @property {string} KOJI_TEXT_QUERY_API 制曲车间-文本记录查询
     */
    KOJI_TEXT_QUERY_API: params => httpProxy('/koji/kojiText/query', 'POST', params),
    /**
     * @property {string} KOJI_XD_SAVE_API 制曲车间-洗豆保存
     */
    KOJI_XD_SAVE_API: params => httpProxy('/koji/kojiBeanWash/info/save', 'POST', params),
    /**
     * @property {string} KOJI_XD_SUBMIT_API 制曲车间-洗豆提交
     */
    KOJI_XD_SUBMIT_API: params => httpProxy('/koji/kojiBeanWash/info/submit', 'POST', params),
    /**
     * @property {string} KOJI_MATERIAL_GET_QUERY_API 制曲车间-物料领用记录查询
     */
    KOJI_MATERIAL_GET_QUERY_API: params => httpProxy('/kojiMaterial/query', 'POST', params),
    /**
     * @property {string} KOJI_MATERIAL_DELETE_QUERY_API 制曲车间-物料领用删除
     */
    KOJI_MATERIAL_DELETE_QUERY_API: params => httpProxy('/kojiMaterial/delete', 'POST', params),
    /**
     * @property {string} KOJI_MATERIAL_GET_ADD_QUERY_API 制曲车间-新增物料领用
     */
    KOJI_MATERIAL_GET_ADD_QUERY_API: params => httpProxy('/kojiMaterial/insert', 'POST', params),
    /**
     * @property {string} KOJI_MATERIAL_GET_EDIT_QUERY_API 制曲车间-修改编辑物料领用
     */
    KOJI_MATERIAL_GET_EDIT_QUERY_API: params => httpProxy('/kojiMaterial/update', 'POST', params),

    /**
     * @property ORDER_SPLITE_QUERY_BY_ID_API 制曲车间-订单拆分-根据车间订单Id查询曲房订单明细
     */
    ORDER_SPLITE_QUERY_BY_ID_API: params => httpProxy('/koji/kojiHouseSplit/batchQueryByOrderNo', 'POST', params),
    /**
     * @property ORDER_SPLITE_REMOVE_API 制曲车间-订单拆分-曲房订单批量删除
     */
    ORDER_SPLITE_REMOVE_API: params => httpProxy('/koji/kojiHouseSplit/batchRemove', 'POST', params),
    /**
     * @property ORDER_SPLITE_DELETE_VALIDATEDATE_API 制曲车间-订单拆分-根据日期判断是否可以修改日期或删除记录
     */
    ORDER_SPLITE_DELETE_VALIDATEDATE_API: params => httpProxy('/koji/kojiHouseSplit/validateDate', 'POST', params),
    /**
     * @property ORDER_SPLITE_REMOVE_VALIDATEDATE_API 制曲车间-订单拆分-根据曲房订单号查询是否满足删除条件
     */
    ORDER_SPLITE_REMOVE_VALIDATEDATE_API: params => httpProxy('/koji/kojiHouseSplit/validateDelete', 'GET', params),
    /**
     * @property ORDER_SPLITE_SAVE_API 制曲车间-订单拆分-保存订单拆分明细
     */
    ORDER_SPLITE_SAVE_API: params => httpProxy('/koji/kojiHouseSplit/save', 'POST', params),
    /**
     * @property KOJI_INDEX_QUERY_ORDER_API 制曲车间-制曲首页-查询制曲订单列表
     */
    KOJI_INDEX_QUERY_ORDER_API: params => httpProxy('/kojiIndex/batchQueryHouseSplit', 'POST', params),
    /**
     * @property KOJI_INDEX_QUERY_SC_ORDER_API 制曲车间-制曲首页-查询Sc蒸豆订单列表
     */
    KOJI_INDEX_QUERY_SC_ORDER_API: params => httpProxy('/kojiIndex/batchQueryScOrder', 'POST', params),
    /**
     * @property KOJI_ORDER_QUERY_API 基础数据-订单管理-根据车间Id查询车间订单列表
     */
    KOJI_ORDER_QUERY_API: params => httpProxy('/order/queryListKoji', 'POST', params),
    /**
     * @KOJI_DISC_QUERY_IN_API 制曲车间-圆盘-查询入曲情况
     */
    KOJI_DISC_QUERY_IN_API: params => httpProxy('/kojiDisc/queryDiscIn', 'GET', params),
    /**
     * @KOJI_DISC_QUERY_EVALUATE_API 制曲车间-圆盘-查询曲料生长评价记录
     */
    KOJI_DISC_QUERY_EVALUATE_API: params => httpProxy('/kojiDisc/queryDiscEvaluate', 'GET', params),
    /**
     * @KOJI_DISC_QUERY_EXCEPTION_API 制曲车间-圆盘-查询圆盘异常情况
     */
    KOJI_DISC_QUERY_EXCEPTION_API: params => httpProxy('/kojiDisc/queryDiscException', 'GET', params),
    /**
     * @KOJI_DISC_QUERY_GUARD_API 制曲车间-圆盘-查询看曲记录
     */
    KOJI_DISC_QUERY_GUARD_API: params => httpProxy('/kojiDisc/queryDiscGuard', 'GET', params),
    /**
     * @KOJI_DISC_QUERY_KOJIOUT_API 制曲车间-圆盘-查询圆盘出曲情况
     */
    KOJI_DISC_QUERY_KOJIOUT_API: params => httpProxy('/kojiDisc/queryDiscOut', 'GET', params),
    /**
     * @KOJI_DISC_QUERY_TURN_API 制曲车间-圆盘-查询翻曲记录
     */
    KOJI_DISC_QUERY_TURN_API: params => httpProxy('/kojiDisc/queryDiscTurn', 'GET', params),
    /**
     * @KOJI_DISC_QUERY_INSTORAGE_API 制曲车间-圆盘-查询圆盘生产入库记录
     */
    KOJI_DISC_QUERY_INSTORAGE_API: params => httpProxy('/kojiDisc/queryInStorage', 'GET', params),
    /**
     * @KOJI_DISC_QUERY_SAVE_API 制曲车间-圆盘-保存圆盘记录
     */
    KOJI_DISC_QUERY_SAVE_API: params => httpProxy('/kojiDisc/saveKojiDisc', 'GET', params),
    /**
     * @KOJI_DISC_QUERY_SUBMIT_API 制曲车间-圆盘-提交圆盘记录
     */
    KOJI_DISC_QUERY_SUBMIT_API: params => httpProxy('/kojiDisc/submitKojiDisc', 'GET', params),
    /**
     * @property KOJI_KOJISTRAIN_DETAILS_QUERY_API 制曲车间-蒸面工序-物料领用-Y158领用下拉（库位+批次联动）
     */
    KOJI_KOJISTRAIN_DETAILS_QUERY_API: params => httpProxy('/koji/kojiStrainStorage/queryCurrentDetailsList', 'GET', params),
    /**
     * @property KOJI_KOJIBEAN_DETAILS_QUERY_API 制曲车间-洗豆工序-物料领用-大豆领用批次下拉（库位+批次联动）
     */
    KOJI_KOJIBEAN_DETAILS_QUERY_API: params => httpProxy('/koji/kojiBeanStorage/queryCurrentDetailsList', 'GET', params),
    /**
     * @property KOJI_KOJIFLOUR_DETAILS_QUERY_API 制曲车间-蒸面工序-物料领用-面粉领用下拉（库位+批次联动）
     */
    KOJI_KOJIFLOUR_DETAILS_QUERY_API: params => httpProxy('/koji/kojiWheatStorage/queryCurrentDetailsList', 'GET', params),
    /**
     * @property KOJI_PAGE_TAG_STATUS_QUERY_API 制曲车间-页签查询
     */
    KOJI_PAGE_TAG_STATUS_QUERY_API: params => httpProxy('/koji/houseTag/query', 'POST', params),
    /**
     * @property KOJI_CRAFT_STEAM_FLOUR_LOG_API 制曲车间-制曲首页-工艺控制-蒸面记录
     */
    KOJI_CRAFT_STEAM_FLOUR_LOG_API: params => httpProxy('/kojiSteamFlour/queryList', 'GET', params),
    /**
     * @property KOJI_CRAFT_STEAM_BEAN_LOG_API 制曲车间-制曲首页-工艺控制-蒸豆记录
     */
    KOJI_CRAFT_STEAM_BEAN_LOG_API: params => httpProxy('/kojiSteamBean/queryList', 'GET', params),
    /**
     * @property KOJI_CRAFT_STEAM_CONTROL_LOG_API 制曲车间-制曲首页-工艺控制-蒸面混合控制记录
     */
    KOJI_CRAFT_STEAM_CONTROL_LOG_API: params => httpProxy('/kojiSteamControl/queryList', 'GET', params),
    /**
     * @property KOJI_CRAFT_STEAM_SAVE_API 制曲车间-制曲首页-蒸面-保存
     */
    KOJI_CRAFT_STEAM_SAVE_API: params => httpProxy('/kojiSteamFlourOrder/save', 'POST', params),
    /**
     * @property KOJI_CRAFT_STEAM_SUBMIT_API 制曲车间-制曲首页-蒸面-提交
     */
    KOJI_CRAFT_STEAM_SUBMIT_API: params => httpProxy('/kojiSteamFlourOrder/submit', 'POST', params)
};

export default KOJI_API;
