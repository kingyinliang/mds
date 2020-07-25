/*
 * @Description:
 * @Anthor: Telliex
 * @Date: 2020-07-20 10:11:29
 * @LastEditors: Telliex
 * @LastEditTime: 2020-07-24 00:20:54
 */
import httpProxy from 'utils/net/httpProxy';

const STE_API = {
    /**
     * @property {string} STE_HOME_LIST_API 杀菌车间首页
     */
    STE_HOME_LIST_API: params => httpProxy('/ste/query', 'POST', params),
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
     * @property {string} STE_DISSOLUTIONBUCKET_ITEM_QUERY_API 杀菌车间-溶解罐管理-满罐、取消满罐
     */
    STE_DISSOLUTIONBUCKET_FULL_API: params => httpProxy('/steDissolutionPot/full', 'POST', params),
    /**
     * @property {string} STE_DISSOLUTIONBUCKET_CLEAN_API 杀菌车间-溶解罐管理-清罐
     */
    STE_DISSOLUTIONBUCKET_CLEAN_API: params => httpProxy('/steDissolutionPot/clean', 'POST', params),
    /**
     * @property {string} STE_DISSOLUTIONBUCKET_ITEM_QUERY_API 杀菌车间-溶解罐管理-入罐
     */
    STE_DISSOLUTIONBUCKET_SAVE_API: params => httpProxy('/steDissolutionPot/save', 'POST', params),
    /**
     * @property {string} STE_DISSOLUTIONBUCKET_ITEM_QUERY_API 杀菌车间-溶解罐管理-查询入罐信息
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
     * @property {string} STE_PREACCESSORIES_LIST_API 杀菌车间-杀菌工艺-查询
     */
    STE_DETAIL_CRAFT_INFO_API: params => httpProxy('/ste/steProcessorControl/query', 'POST', params),
    /**
     * @property {string} STE_DETAIL_CRAFTHEADER_INFO_API 杀菌车间-杀菌工艺-头部查询
     */
    STE_DETAIL_CRAFTHEADER_INFO_API: params => httpProxy('/steOrderSplit/potOrder/queryByPortOrderNo', 'GET', params),
    /**
     * @property {string} STE_PREACCESSORIES_LIST_API 杀菌车间-杀菌工艺-保存
     */
    STE_DETAIL_CRAFT_SAVED_API: params => httpProxy('/ste/steProcessorControl/save', 'POST', params),
    /**
     * @property {string} STE_PREACCESSORIES_LIST_API 杀菌车间-杀菌工艺-提交
     */
    STE_DETAIL_CRAFT_SUBMIT_API: params => httpProxy('/ste/steProcessorControl/submit', 'POST', params),
    /**
     * @property {string} STE_DETAIL_CRAFTEXC_LIST_API 杀菌车间-杀菌工艺-异常-查询
     */
    STE_DETAIL_CRAFTEXC_LIST_API: params => httpProxy('/ste/steException/query', 'POST', params),
    /**
     * @property {string} STE_DETAIL_CRAFTEXC_LIST_API 杀菌车间-杀菌工艺-文本-查询
     */
    STE_DETAIL_TEXT_API: params => httpProxy('/ste/steText/query', 'POST', params)
};

export default STE_API;
