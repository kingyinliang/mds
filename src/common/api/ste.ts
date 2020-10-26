import httpProxy from 'utils/net/httpProxy';

const STE_API = {
    /**
     * @property {string} STE_HOME_LIST_API 杀菌车间首页
     */
    STE_HOME_LIST_API: params => httpProxy('/ste/query', 'POST', params),
    /**
     * @property {string} STE_HOME_LIST_API 杀菌车间-煮料列表查询
     */
    STE_COOKINGNO_LIST_API: params => httpProxy('/ste/steCookingPot/listBycookingNo', 'POST', params),
    /**
     * @property {string} STE_SEMI_LIST_API 杀菌车间-半成品领用-查询
     */
    STE_SEMI_LIST_API: params => httpProxy('/ste/steSemiMaterial/query', 'POST', params),
    /**
     * @property {string} STE_SEMI_COPY_API 杀菌车间-半成品领用-复制
     */
    STE_SEMI_COPY_API: params => httpProxy('/ste/steSemiMaterial/copy', 'POST', params),
    /**
     * @property {string} STE_SEMI_SAVE_API 杀菌车间-半成品领用-保存
     */
    STE_SEMI_SAVE_API: params => httpProxy('/ste/steSemiMaterial/save', 'POST', params),
    /**
     * @property {string} STE_SEMI_SUBMIT_API 杀菌车间-半成品领用-提交
     */
    STE_SEMI_SUBMIT_API: params => httpProxy('/ste/steSemiMaterial/submit', 'POST', params),
    /**
     * @property {string} STE_SEMI_LIST_API 杀菌车间-辅料添加-查询
     */
    STE_ACCE_LIST_API: params => httpProxy('/ste/accessiruesConsume/query', 'POST', params),
    /**
     * @property {string} STE_SEMI_LIST_API 杀菌车间-辅料添加-保存
     */
    STE_ACCE_SAVE_API: params => httpProxy('/ste/accessiruesConsume/save', 'POST', params),
    /**
     * @property {string} STE_SEMI_LIST_API 杀菌车间-辅料添加-保存
     */
    STE_ACCE_SUBMIT_API: params => httpProxy('/ste/accessiruesConsume/submit', 'POST', params),
    /**
     * @property {string} STE_SPLIT_LIST_API 杀菌车间-订单拆分
     */
    STE_SPLIT_LIST_API: params => httpProxy('/steOrderSplit/query', 'POST', params),
    /**
     * @property {string} STE_HOME_LIST_API 杀菌车间-煮料列表-查询
     */
    STE_COOKING_POT_QUERY_API: params => httpProxy('/ste/steCookingPot/query', 'POST', params),
    /**
     * @property {string} STE_COOKING_MATERIAL_QUERY_API 杀菌车间-煮料列表-生产物料-查询
     */
    STE_COOKING_MATERIAL_QUERY_API: params => httpProxy('/ste/stePreAccessories/listByType', 'POST', params),
    /**
     * @property {string} STE_COOKING_DETAIL_QUERY_API 杀菌车间-煮料详情-查询
     */
    STE_COOKING_DETAIL_QUERY_API: params => httpProxy('/ste/steCookingPot/queryByDetail', 'POST', params),
    /**
     * @property {string} STE_COOKING_DETAIL_SAVE_API 杀菌车间-煮料详情-保存
     */
    STE_COOKING_DETAIL_SAVE_API: params => httpProxy('/ste/steCookingPot/save', 'POST', params),
    /**
     * @property {string} STE_COOKING_DETAIL_SUBMIT_API 杀菌车间-煮料详情-提交
     */
    STE_COOKING_DETAIL_SUBMIT_API: params => httpProxy('/ste/steCookingPot/submit', 'POST', params),
    /**
     * @property {string} STE_COOKING_DETAIL_ROLLBACK_API 杀菌车间-煮料详情-撤回
     */
    STE_COOKING_DETAIL_ROLLBACK_API: params => httpProxy('/ste/steCookingPot/rollback', 'POST', params),
    /**
     * @property {string} STE_COOKING_DETAIL_CLEAR_API 杀菌车间-煮料详情-清罐
     */
    STE_COOKING_DETAIL_CLEAR_API: params => httpProxy('/ste/steCookingPot/clean', 'POST', params),
    /**
     * @property {string} STE_COOKING_DETAIL_ACCMATERIAL_API 杀菌车间-煮料详情-根据生产物料拉取辅料
     */
    STE_COOKING_DETAIL_ACCMATERIAL_API: params => httpProxy('/ste/steCookingPot/getAccMaterial', 'POST', params),
    /**
     * @property {string} STE_DISSOLUTIONBUCKET_QUERY_API 杀菌车间-溶解罐管理-查询
     */
    STE_DISSOLUTIONBUCKET_QUERY_API: params => httpProxy('/steDissolutionPot/query', 'POST', params),
    /**
     * @property {string} STE_DISSOLUTIONBUCKET_ITEM_QUERY_API 杀菌车间-溶解罐管理-详情查询
     */
    STE_DISSOLUTIONBUCKET_ITEM_QUERY_API: params => httpProxy('/steDissolutionPot/item/query', 'POST', params),
    /**
     * @property {string} STE_DISSOLUTIONBUCKET_FULL_API 杀菌车间-溶解罐管理-满罐、取消满罐
     */
    STE_DISSOLUTIONBUCKET_FULL_API: params => httpProxy('/steDissolutionPot/full', 'POST', params),
    /**
     * @property {string} STE_DISSOLUTIONBUCKET_CLEAN_API 杀菌车间-溶解罐管理-清罐
     */
    STE_DISSOLUTIONBUCKET_CLEAN_API: params => httpProxy('/steDissolutionPot/clean', 'POST', params),
    /**
     * @property {string} STE_DISSOLUTIONBUCKET_SAVE_API 杀菌车间-溶解罐管理-入罐
     */
    STE_DISSOLUTIONBUCKET_SAVE_API: params => httpProxy('/steDissolutionPot/save', 'POST', params),
    /**
     * @property {string} STE_DISSOLUTIONBUCKET_ENTER_QUERY_API 杀菌车间-溶解罐管理-查询入罐信息
     */
    STE_DISSOLUTIONBUCKET_ENTER_QUERY_API: params => httpProxy('/steDissolutionPot/enter/query', 'POST', params),
    /**
     * @property {string} STE_SPLIT_DETAIL_LIST_API 杀菌车间-订单拆分弹窗查询
     */
    STE_SPLIT_DETAIL_LIST_API: params => httpProxy('/steOrderSplit/potOrder/query', 'POST', params),
    /**
     * @property {string} STE_SPLIT_DETAIL_SAVE_API 杀菌车间-订单拆分弹窗保存
     */
    STE_SPLIT_SAVE_API: params => httpProxy('/steOrderSplit/save', 'POST', params),
    /**
     * @property {string} STE_SPLIT_DETAIL_SAVE_API 杀菌车间-订单拆分详情弹窗保存
     */
    STE_SPLIT_DETAIL_SAVE_API: params => httpProxy('/steOrderSplit/potOrder/save', 'POST', params),
    /**
     * @property {string} STE_PREACCESSORIES_LIST_API 杀菌车间-辅料前处理-查询不带分页
     */
    STE_PREACCESSORIES_LIST_API: params => httpProxy('/ste/stePreAccessories/listByType', 'POST', params),
    /**
     * @property {string}   STE_DETAIL_CRAFT_INFO_API 杀菌车间-杀菌工艺-查询
     */
    STE_DETAIL_CRAFT_INFO_API: params => httpProxy('/ste/steProcessorControl/query', 'POST', params),
    /**
     * @property {string} STE_DETAIL_CRAFTHEADER_INFO_API 杀菌车间-杀菌工艺-头部查询
     */
    STE_DETAIL_CRAFTHEADER_INFO_API: params => httpProxy('/steOrderSplit/potOrder/queryByPortOrderNo', 'GET', params),
    /**
     * @property {string} STE_DETAIL_CRAFTHEADER_STATUS_API 杀菌车间-杀菌工艺-页签状态查询
     */
    STE_DETAIL_CRAFTHEADER_STATUS_API: params => httpProxy('/steTagPot/queryByPotOrderNo', 'GET', params),
    /**
     * @property {string} STE_DETAIL_CRAFT_SAVED_API 杀菌车间-杀菌工艺-保存
     */
    STE_DETAIL_CRAFT_SAVED_API: params => httpProxy('/ste/steProcessorControl/save', 'POST', params),
    /**
     * @property {string} STE_DETAIL_CRAFT_SUBMIT_API 杀菌车间-杀菌工艺-提交
     */
    STE_DETAIL_CRAFT_SUBMIT_API: params => httpProxy('/ste/steProcessorControl/submit', 'POST', params),
    /**
     * @property {string} STE_DETAIL_CRAFTEXC_LIST_API 杀菌车间-杀菌工艺-异常-查询
     */
    STE_DETAIL_CRAFTEXC_LIST_API: params => httpProxy('/ste/steException/query', 'POST', params),
    /**
     * @property {string} STE_DETAIL_TEXT_API 杀菌车间-杀菌工艺-文本-查询
     */
    STE_DETAIL_TEXT_API: params => httpProxy('/ste/steText/query', 'POST', params),
    /**
     * @property {string} STE_INSTORAGE_QUERY_API 杀菌车间-入库数据-查询
     */
    STE_INSTORAGE_QUERY_API: params => httpProxy('/steInStorage/query', 'POST', params),
    /**
     * @property {string} STE_INSTORAGE_SAVE_API 杀菌车间-入库数据-保存
     */
    STE_INSTORAGE_SAVE_API: params => httpProxy('/steInStorage/save', 'POST', params),
    /**
     * @property {string} STE_INSTORAGE_SUBMIT_API 杀菌车间-入库数据-提交
     */
    STE_INSTORAGE_SUBMIT_API: params => httpProxy('/steInStorage/submit', 'POST', params),
    /**
     * @property {string} STE_TIMESHEET_QUERY_API 杀菌车间-杀菌工时-查询
     */
    STE_TIMESHEET_QUERY_API: params => httpProxy('/ste/steTimeSheet/query', 'POST', params),
    /**
     * @property {string} STE_TIMESHEET_QUERY_API 杀菌车间-杀菌工时-生产订单下拉
     */
    STE_TIMESHEET_ORDERLIST_QUERY_API: params => httpProxy('/steOrderSplit/list/query', 'POST', params),
    /**
     * @property {string} STE_TIMESHEET_SAVE_API 杀菌车间-杀菌工时-保存
     */
    STE_TIMESHEET_SAVE_API: params => httpProxy('/ste/steTimeSheet/save', 'POST', params),
    /**
     * @property {string} STE_TIMESHEET_SUBMIT_API 杀菌车间-杀菌工时-提交
     */
    STE_TIMESHEET_SUBMIT_API: params => httpProxy('/ste/steTimeSheet/submit', 'POST', params),
    /**
     * @property {string} STE_PKGLINE_QUERY_API 杀菌车间-杀菌包装对应关系-查询对应包装产线列表
     */
    STE_PKGLINE_QUERY_API: params => httpProxy('/ste/stePkgRelation/pkgLine/query', 'GET', params),
    /**
     * @property {string} STE_AUDIT_HEADER_INFO_API 杀菌车间-杀菌审核-头部
     */
    STE_AUDIT_HEADER_INFO_API: params => httpProxy('/steOrderSplit/list/query', 'POST', params),
    /**
     * @property {string} STE_AUDIT_YIELD_MANQUERY_API 杀菌车间-杀菌审核-产量与人力
     */
    STE_AUDIT_YIELD_MANQUERY_API: params => httpProxy('/ste/item/yieldAndManQuery', 'POST', params),
    /**
     * @property {string} STE_AUDIT_EXCEPTION_QUERY_API 杀菌车间-杀菌审核-异常情况
     */
    STE_AUDIT_EXCEPTION_QUERY_API: params => httpProxy('/ste/item/exceptionQuery', 'POST', params),
    /**
     * @property {string} STE_AUDIT_MATERIAL_QUERY_API 杀菌车间-杀菌审核-物料领用
     */
    STE_AUDIT_MATERIAL_QUERY_API: params => httpProxy('/ste/item/materialQuery', 'POST', params),
    /**
     * @property {string} STE_AUDIT_CRAFT_TEMPERATURE_API 杀菌车间-杀菌审核-工艺保温温度
     */
    STE_AUDIT_CRAFT_TEMPERATURE_API: params => httpProxy('/ste/item/temperatureQuery', 'POST', params),
    /**
     * @property {string} STE_AUDIT_CRAFT_TIME_API 杀菌车间-杀菌审核-工艺保温时间
     */
    STE_AUDIT_CRAFT_TIME_API: params => httpProxy('/ste/item/keepWarmTimeQuery', 'POST', params),
    /**
     * @property {string} STE_AUDIT_CRAFT_TEMPERATUREANDTIME_API 杀菌车间-杀菌审核-工艺出料时间与温度
     */
    STE_AUDIT_CRAFT_TEMPERATUREANDTIME_API: params => httpProxy('/ste/item/timeAndTemperatureQuery', 'POST', params),
    /**
     * @property {string} STE_AUDIT_CRAFT_TEMPERATUREANDTIME_API 杀菌车间-入库数据-车间主管退回
     */
    STE_INSTORAGE_POT_COUNT_API: params => httpProxy('/steInStorage/instoragePotCount', 'GET', params),
    /**
     * @property {string} STE_AUDIT_CRAFT_TEMPERATUREANDTIME_API 杀菌车间-页签状态-查询定单页签状态
     */
    STE_INSTORAGE_QUERY_TABS_STATUS_API: params => httpProxy('/steTag/queryByOrderNo', 'POST', params)
};

export default STE_API;
