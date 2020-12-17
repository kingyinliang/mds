/*
 * @Description:
 * @Anthor: Telliex
 * @Date: 2020-08-27 14:28:27
 * @LastEditors: Telliex
 * @LastEditTime: 2020-12-17 14:20:21
 */
import httpProxy from 'utils/net/httpProxy';
const KOJI_API = {
    /**
     * @property {string} KOJI_STORAGE_WHEAT_CURRENT_PARTICULARS_API 麦粉库存-明细列表-所有 !!/koji/storage/reduceCurrentOfWheat
     */
    KOJI_STORAGE_WHEAT_CURRENT_PARTICULARS_API: params => httpProxy('/koji/storage/reduceCurrentOfWheat', 'GET', params),
    /**
     * @property {string} KOJI_STOCK_FLOUR_DETAIL_CUR_LIST_API 麦粉库存-当前详情-分页 !!/koji/storage/currentPageOfWheat
     */
    KOJI_STOCK_FLOUR_DETAIL_CUR_LIST_API: params => httpProxy('/koji/storage/currentPageOfWheat', 'POST', params),
    /**
     * @property {string} KOJI_STOCK_FLOUR_DETAIL_HISTORY_LIST_API 麦粉库存-历史详情-分页 !!/koji/storage/historyPageOfWheat
     */
    KOJI_STOCK_FLOUR_DETAIL_HISTORY_LIST_API: params => httpProxy('/koji/storage/historyPageOfWheat', 'POST', params),

    /**
     * @property {string} KOJI_STORAGE_BEAN_CURRENT_PARTICULARS_API 大豆库存-明细列表-所有 !!/koji/storage/reduceCurrentOfBean
     */
    KOJI_STORAGE_BEAN_CURRENT_PARTICULARS_API: params => httpProxy('/koji/storage/reduceCurrentOfBean', 'GET', params),
    /**
     * @property {string} KOJI_STOCK_BEAN_DETAIL_CUR_LIST_API 大豆库存-当前详情-分页 !!koji/storage/currentPageOfBean
     */
    KOJI_STOCK_BEAN_DETAIL_CUR_LIST_API: params => httpProxy('/koji/storage/currentPageOfBean', 'POST', params),
    /**
     * @property {string} KOJI_STOCK_BEAN_DETAIL_HISTORY_LIST_API 大豆库存-历史详情-分页  !!/koji/storage/historyPageOfBean
     */
    KOJI_STOCK_BEAN_DETAIL_HISTORY_LIST_API: params => httpProxy('/koji/storage/historyPageOfBean', 'POST', params),

    /**
     * @property {string} KOJI_STORAGE_Y158_STRAIN_CURRENT_PARTICULARS_API Y158菌库存-明细列表-所有 !!/koji/storage/reduceCurrentOfStrain
     */
    KOJI_STORAGE_Y158_STRAIN_CURRENT_PARTICULARS_API: params => httpProxy('/koji/storage/reduceCurrentOfStrain', 'GET', params),
    /**
     * @property {string} KOJI_STOCK_Y158_DETAIL_CUR_LIST_API Y158菌库存-当前详情-分页 !!/koji/storage/currentPageOfStrain
     */
    KOJI_STOCK_Y158_DETAIL_CUR_LIST_API: params => httpProxy('/koji/storage/currentPageOfStrain', 'POST', params),
    /**
     * @property {string} KOJI_STOCK_Y158_DETAIL_HISTORY_LIST_API Y158菌库存-历史详情-分页 !! /koji/storage/historyPageOfStrain
     */
    KOJI_STOCK_Y158_DETAIL_HISTORY_LIST_API: params => httpProxy('/koji/storage/historyPageOfStrain', 'POST', params),

    /**
     * @property {string} KOJI_STOCK_Y158_DETAIL_ADJUST_API 执行调整 !!/koji/storage/saveAdjust
     */
    KOJI_STOCK_Y158_DETAIL_ADJUST_API: params => httpProxy('/koji/storage/saveAdjust', 'POST', params),
    /**
     * @property {string} KOJI_STOCK_Y158_DETAIL_ADJUST_LIST_API 库存调整-分页查询 !!/koji/storage/pageOfAdjust
     */
    KOJI_STOCK_Y158_DETAIL_ADJUST_LIST_API: params => httpProxy('/koji/storage/pageOfAdjust', 'POST', params),

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
     * @property WORKPROCEDURE_QUERY_NOPAGE_API 制曲车间-报工工序-根据高级查询条件查询报工中间表数据列表
     */
    WORKPROCEDURE_QUERY_NOPAGE_API: params => httpProxy('/koji/kojiWorkProcedure/list/query', 'POST', params),
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
    KOJI_DISC_QUERY_SAVE_API: params => httpProxy('/kojiDisc/saveKojiDisc', 'POST', params),
    /**
     * @KOJI_DISC_QUERY_SUBMIT_API 制曲车间-圆盘-提交圆盘记录
     */
    KOJI_DISC_QUERY_SUBMIT_API: params => httpProxy('/kojiDisc/submitKojiDisc', 'POST', params),
    /**
     * @KOJI_DISC_QUERY_INSTORAGE_AMOUNT_API 制曲车间-圆盘-溶解罐统计
     */
    KOJI_DISC_QUERY_INSTORAGE_AMOUNT_API: params => httpProxy('/kojiDisc/calcInStorageAmount', 'GET', params),
    /**
     * @property KOJI_STORAGE_STRAIN_DROPDOWN_API 制曲车间-蒸面工序-物料领用-Y158领用下拉（库位+批次联动）!!/koji/storage/dropDownOfStrain
     */
    KOJI_STORAGE_STRAIN_DROPDOWN_API: params => httpProxy('/koji/storage/dropDownOfStrain', 'GET', params),
    /**
     * @property KOJI_STORAGE_BEAN_DROPDOWN_API 制曲车间-洗豆工序-物料领用-大豆领用批次下拉（库位+批次联动） !!/koji/storage/dropDownOfBean
     */
    KOJI_STORAGE_BEAN_DROPDOWN_API: params => httpProxy('/koji/storage/dropDownOfBean', 'GET', params),
    /**
     * @property KOJI_STORAGE_WHEAT_DROPDOWN_API 制曲车间-蒸面工序-物料领用-面粉领用下拉（库位+批次联动）!!/koji/storage/dropDownOfWheat
     */
    KOJI_STORAGE_WHEAT_DROPDOWN_API: params => httpProxy('/koji/storage/dropDownOfWheat', 'GET', params),
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
    KOJI_CRAFT_STEAM_SUBMIT_API: params => httpProxy('/kojiSteamFlourOrder/submit', 'POST', params),
    /**
     * @property KOJI_STEAM_INSTORAGE_LIST_API 制曲车间-制曲首页-蒸豆-生产入库
     */
    KOJI_STEAM_INSTORAGE_LIST_API: params => httpProxy('/kojiInStorage/queryList', 'GET', params),
    /**
     * @property KOJI_STEAM_BEAN_HARD_LIST_API 制曲车间-制曲首页-蒸豆-硬度
     */
    KOJI_STEAM_BEAN_HARD_LIST_API: params => httpProxy('/kojiSteamBeanHardness/queryList', 'GET', params),
    /**
     * @property KOJI_STEAM_BEAN_SAVE_API 制曲车间-制曲首页-蒸豆订单-保存
     */
    KOJI_STEAM_BEAN_SAVE_API: params => httpProxy('/kojiSteamBeanOrder/batchSave', 'POST', params),
    /**
     * @property KOJI_STEAM_BEAN_SUBMIT_API 制曲车间-制曲首页-蒸豆订单-提交
     */
    KOJI_STEAM_BEAN_SUBMIT_API: params => httpProxy('/kojiSteamBeanOrder/batchSubmit', 'POST', params),
    /**
     * @property KOJI_AUDIT_BEANSTEEP_API 制曲车间-制曲审核-泡豆时长
     */
    KOJI_AUDIT_BEANSTEEP_API: params => httpProxy('/kojiVerify/queryBeanSteepChart', 'GET', params),
    /**
     * @property KOJI_AUDIT_BEANIMPURITY_API 制曲车间-制曲审核-大豆杂质情况
     */
    KOJI_AUDIT_BEANIMPURITY_API: params => httpProxy('/kojiVerify/queryBeanImpurityChart', 'GET', params),
    /**
     * @property KOJI_AUDIT_MIXEDINTOMATERIAL_API 制曲车间-制曲审核-混合入料工艺
     */
    KOJI_AUDIT_MIXEDINTOMATERIAL_API: params => httpProxy('/kojiVerify/querySteamControlChart', 'GET', params),
    /**
     * @property KOJI_AUDIT_MIXEDINTOMATERIAL_TABLE_API 制曲车间-制曲审核-混合入料工艺表格
     */
    KOJI_AUDIT_MIXEDINTOMATERIAL_TABLE_API: params => httpProxy('/kojiVerify/querySteamControlSheet', 'GET', params),
    /**
     * @property KOJI_AUDIT_LOOKCRAFTONE_API 制曲车间-制曲审核-看曲工艺
     */
    KOJI_AUDIT_LOOKCRAFTONE_API: params => httpProxy('/kojiVerify/queryDiscGuardChartList', 'GET', params),
    /**
     * @property KOJI_AUDIT_INOUTCRAFT_API 制曲车间-制曲审核-入曲及出曲工艺
     */
    KOJI_AUDIT_INOUTCRAFT_API: params => httpProxy('/kojiVerify/queryDiscInOutSheet', 'GET', params),
    /**
     * @property KOJI_AUDIT_TURN_API 制曲车间-制曲审核-翻曲情况
     */
    KOJI_AUDIT_TURN_API: params => httpProxy('/kojiVerify/queryDiscTurnSheet', 'GET', params),
    /**
     * @property KOJI_AUDIT_EXCEPTION_API 制曲车间-制曲审核-异常情况
     */
    KOJI_AUDIT_EXCEPTION_API: params => httpProxy('/kojiVerify/queryKojiExceptionSheet', 'GET', params),
    /**
     * @property KOJI_AUDIT_BEANUSAGE_API 制曲车间-制曲审核-原豆量情况
     */
    KOJI_AUDIT_BEANUSAGE_API: params => httpProxy('/kojiVerify/queryBeanUsage', 'GET', params),
    /**
     * @property KOJI_AUDIT_MATERIAL_API 制曲车间-制曲审核-物料领用
     */
    KOJI_AUDIT_MATERIAL_API: params => httpProxy('/kojiVerify/queryMaterialDetail', 'GET', params),
    /**
     * @property {string} STE_AUDIT_CRAFT_TEMPERATUREANDTIME_API 制曲车间-制曲审核-泡豆&物料
     */
    KOJI_AUDIT_BEANANDMATERIAL_API: params => httpProxy('/kojiVerify/queryBeanSteepAndMaterialSheet', 'GET', params),
    /**
     * @property KOJI_IMPURITY_FOREIGNMATTER_API 制曲车间-杂质-异物-保存
     */
    KOJI_IMPURITY_FOREIGNMATTER_API: params => httpProxy('/kojiImpurityOther/queryList', 'GET', params),
    /**
     * @property KOJI_IMPURITY_MAGNET_API 制曲车间-杂质记录-磁铁-查询
     */
    KOJI_IMPURITY_MAGNET_API: params => httpProxy('/kojiImpurityMagnet/queryList', 'GET', params),
    /**
     * @property KOJI_IMPURITY_SAVE_API 制曲车间-杂质-保存
     */
    KOJI_IMPURITY_SAVE_API: params => httpProxy('/kojiImpurity/batchSave', 'POST', params),
    /**
     * @property KOJI_IMPURITY_SAVE_API 制曲车间-查询准备工时
     */
    KOJI_TIMESHEET_QUERY_API: params => httpProxy('/koji/kojiTimeSheet/query', 'POST', params),
    /**
     * @property KOJI_IMPURITY_SAVE_API 制曲车间-保存准备工时
     */
    KOJI_TIMESHEET_SAVE_API: params => httpProxy('/koji/kojiTimeSheet/save', 'POST', params),
    /**
     * @property KOJI_IMPURITY_SAVE_API 制曲车间-提交准备工时
     */
    KOJI_TIMESHEET_SUBMIT_API: params => httpProxy('/koji/kojiTimeSheet/submit', 'POST', params),
    /**
     * @property KOJI_QUERY_STEAMBEAN_API 查询SC泡豆罐
     */
    KOJI_QUERY_STEAMBEAN_API: params => httpProxy('/kojiSteamBean/getScPot', 'GET', params),
    /**
     * @property KOJI_AUDIT_QUERY_CRAFT_API 审核(SC)详情-查询工艺列表
     */
    KOJI_AUDIT_QUERY_CRAFT_API: params => httpProxy('/kojiVerify/detail/queryCraft', 'GET', params),
    /**
     * @property KOJI__AUDIT_QUERY_INSTORAGE_API 审核(SC)详情-查询生产入库
     */
    KOJI__AUDIT_QUERY_INSTORAGE_API: params => httpProxy('/kojiVerify/detail/queryInStorage', 'GET', params),
    /**
     * @property KOJI_ADDIT_QUERY_MACHINEHOUR_API 审核(SC)详情-查询机器工时
     */
    KOJI_ADDIT_QUERY_MACHINEHOUR_API: params => httpProxy('/kojiVerify/detail/queryMachineHour', 'GET', params),
    /**
     * @property KOJI_ADDIT_QUERY_MANHOUR_API 审核(SC)详情-查询人工工时
     */
    KOJI_ADDIT_QUERY_MANHOUR_API: params => httpProxy('/kojiVerify/detail/queryManHour', 'GET', params),
    /**
     * @property KOJI_AUDIT_QUERY_MARTERIAL_API 审核(SC)详情-查询物料领用
     */
    KOJI_AUDIT_QUERY_MARTERIAL_API: params => httpProxy('/kojiVerify/detail/queryMaterial', 'GET', params),
    /**
     * @property KOJI_AUDIT_QUERY_CHECKED_API 制曲车间-制曲审核-审核通过
     */
    KOJI_AUDIT_QUERY_CHECKED_API: params => httpProxy('/kojiVerify/checked', 'GET', params),
    /**
     * @property KOJI_REFUSE_READY_API 制曲车间-制曲审核-准备工时退回
     */
    KOJI_REFUSE_READY_API: params => httpProxy('/kojiVerify/ready/refuse', 'POST', params),
    /**
     * @property KOJI_REFUSE_DEVICE_API 制曲车间-制曲审核-机器工时退回
     */
    KOJI_REFUSE_DEVICE_API: params => httpProxy('/kojiVerify/device/refuse', 'POST', params),
    /**
     * @property KOJI_REFUSE_INSTORAGE_API 制曲车间-制曲审核-入库退回
     */
    KOJI_REFUSE_INSTORAGE_API: params => httpProxy('/kojiVerify/inStorage/refuse', 'POST', params),
    /**
     * @property KOJI_REFUSE_MATERIAL_API 制曲车间-制曲审核-物料领用退回
     */
    KOJI_REFUSE_MATERIAL_API: params => httpProxy('/kojiVerify/material/refuse', 'POST', params),
    /**
     * @property KOJI_VERIFY_TAB_STATUS_API 制曲车间-制曲审核-审核详情页签查询
     */
    KOJI_VERIFY_TAB_STATUS_API: params => httpProxy('/koji/houseTag/queryVerifyDetail', 'GET', params)
};

export default KOJI_API;
