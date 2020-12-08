import httpProxy from 'utils/net/httpProxy';

const PKG_API = {
    /**
     * @property {string} PKG_HOME_LIST_API 包装车间首页
     */
    PKG_HOME_LIST_API: params => httpProxy('/order/queryListPkg', 'POST', params),
    /**
     * @property {string} PKG_HOME_QUERY_BY_NO_API 包装车间首页
     */
    PKG_HOME_QUERY_BY_NO_API: params => httpProxy('/order/queryByNo', 'GET', params),
    /**
     * @property {string} PKG_HOME_QUERY_BY_NO_API 包装车间页签状态
     */
    PKG_TAG_QUERY_API: params => httpProxy('/pkgTag/query', 'POST', params),
    /**
     * @property {string} PKG_ALL_SAVE_API 包装车间-生产数据-保存
     */
    PKG_ALL_SAVE_API: params => httpProxy('/pkg/save', 'POST', params),
    /**
     * @property {string} PKG_ALL_SUBMIT_API 包装车间-生产数据-提交
     */
    PKG_ALL_SUBMIT_API: params => httpProxy('/pkg/submit', 'POST', params),
    /**
     * @property {string} PKG_INSTORAGE_QUERY_API 生产数据-生产入库-查询
     */
    PKG_INSTORAGE_QUERY_API: params => httpProxy('/pkgInStorage/query', 'POST', params),
    /**
     * @property {string} PKG_TEXT_QUERY_API 包装车间-生产数据-文本记录
     */
    PKG_TEXT_QUERY_API: params => httpProxy('/pkgText/query', 'POST', params),
    /**
     * @property {string} PKG_TIMESHEET_QUERY_API 包装车间-生产准备-查询
     */
    PKG_TIMESHEET_QUERY_API: params => httpProxy('/pkg/pkgTimeSheet/query', 'POST', params),
    /**
     * @property {string} PKG_PACKAGEMATERIAL_QUERY_API 包装车间-物料领用-包材领用查询
     */
    PKG_PACKAGEMATERIAL_QUERY_API: params => httpProxy('/pkg/packageMaterial/query', 'POST', params),
    /**
     * @property {string} PKG_CHECKDATA_SEAL_QUERY_API 检查数据-密封度检测-查询
     */
    PKG_CHECKDATA_SEAL_QUERY_API: params => httpProxy('/pkgSealData/query', 'POST', params),
    /**
     * @property {string} PKG_CHECKDATA_WEIGHT_QUERY_API 检查数据-称重记录-查询
     */
    PKG_CHECKDATA_WEIGHT_QUERY_API: params => httpProxy('/pkgWeight/query', 'POST', params),
    /**
     * @property {string} PKG_CHECKDATA_NR_QUERY_API 检查数据-NR检测-查询
     */
    PKG_CHECKDATA_NR_QUERY_API: params => httpProxy('/pkgNr/query', 'POST', params),
    /**
     * @property {string} PKG_CHECKDATA_TORQUE_QUERY_API 检查数据-扭力矩检测-查询
     */
    PKG_CHECKDATA_TORQUE_QUERY_API: params => httpProxy('/pkgTorque/query', 'POST', params),
    /**
     * @property {string} PKG_CHECKDATA_SAVE_API 检查数据-保存
     */
    PKG_CHECKDATA_SAVE_API: params => httpProxy('/pkg/checkData/save', 'POST', params),
    /**
     * @property {string}  PKG_READYTIME_QUERY_API 生产数据-生产准备-查询
     */
    PKG_READYTIME_QUERY_API: params => httpProxy('/pkg/pkgTimeSheet/query', 'POST', params),
    /**
     * @property {string}  PKG_PENDGNUM_QUERY_API 生产数据-待处理-查询
     */
    PKG_PENDGNUM_QUERY_API: params => httpProxy('/pkgGerms/query', 'POST', params),
    /**
     * @property {string}  PKG_MATERIALSTOCK_QUERY_API 包材库存-查询
     */
    PKG_MATERIALSTOCK_QUERY_API: params => httpProxy('/pkg/packageStorage/query', 'POST', params),
    /**
     * @property {string}  包材库存-明细
     */
    PKG_MATERIALSTOCK_STORAGEITEM_API: params => httpProxy('/pkg/pkgPackageStorageItem/query', 'POST', params),
    /**
     * @property {string}  包材库存-转线保存
     */
    PKG_MATERIALSTOCK_TRANSFER_API: params => httpProxy('/pkg/packageStorage/transfer', 'POST', params),
    /**
     * @property {string}  PKG_MATERIALSTOCK_TRANSFERDEPTNAME_API 包材库存-产线拉取
     */
    PKG_MATERIALSTOCK_TRANSFERDEPTNAME_API: params => httpProxy('/sysDept/childrenListByParentDeptName', 'POST', params),
    /**
     * @property {string}  包材库存-调整保存
     */
    PKG_MATERIALSTOCK_ADJUST_API: params => httpProxy('/pkg/packageStorage/adjust', 'POST', params),
    /**
     * @property {string}  PKG_MATERIAL_S_QUERY_API 生产数据-物料领用-半成品-查询
     */
    PKG_MATERIAL_S_QUERY_API: params => httpProxy('/pkg/semiMaterial/query', 'POST', params),
    /**
     * @property {string}  PKG_MATERIAL_P_QUERY_API 生产数据-物料领用-包材-查询
     */
    PKG_MATERIAL_P_QUERY_API: params => httpProxy('/pkg/packageMaterial/query', 'POST', params),
    /**
     * @property {string}  PKG_URGENT_SUBMIT_API 生产数据-生产入库-紧急提交
     */
    PKG_URGENT_SUBMIT_API: params => httpProxy('/pkgInStorage/urgentSubmit', 'POST', params),
    /**
     * @property {string}  PKG_USER_QUERY_API 生包装车间-生产人员-查询
     */
    PKG_USER_QUERY_API: params => httpProxy('/pkg/pkgUser/query', 'POST', params),
    /**
     * @property {string}  PKG_EXCEPTION_QUERY_API 包装车间-停机情况-查询
     */
    PKG_EXCEPTION_QUERY_API: params => httpProxy('/pkg/pkgException/query', 'POST', params),
    /**
     * @property {string}  PKG_DEVICE_QUERY_API 包装车间-运行情况-查询
     */
    PKG_DEVICE_QUERY_API: params => httpProxy('/pkg/pkgDevice/query', 'POST', params),
    /**
     * @property {string}  PKG_AUDIT_DETAIL_PASS_API 审核详情-审核拒绝
     */
    PKG_AUDIT_DETAIL_PASS_API: params => httpProxy('/pkg/check', 'POST', params),
    /**
     * @property {string}  PKG_AUDIT_DETAIL_PASS_API 审核详情-审核拒绝
     */
    PKG_AUDIT_DETAIL_REFUSE_API: params => httpProxy('/pkg/refuse', 'POST', params),
    /**
     * @property {string}  PKG_AUDIT_DETAIL_PROMATERIALDIFF_API 审核详情-生产领料差异
     */
    PKG_AUDIT_DETAIL_PROMATERIALDIFF_API: params => httpProxy('/pkg/packageMaterial/pickingDiff/query', 'POST', params),
    /**
     * @property {string}  PKG_AUDIT_DETAIL_PROMATERIALDIFF_API 审核详情-产量与人力
     */
    PKG_AUDIT_DETAIL_PROMANPOWER_API: params => httpProxy('/pkg/pkgTimeSheet/productionAndManpower', 'POST', params),
    /**
     * @property {string}  PKG_AUDIT_DETAIL_PROMATERIALDIFF_API 审核详情-设备运行情况
     */
    PKG_AUDIT_DETAIL_DEVICERUN_API: params => httpProxy('/pkg/pkgTimeSheet/deviceRun', 'POST', params),
    /**
     * @property {string}  PKG_AUDIT_DETAIL_PROMATERIALDIFF_API 审核详情-生产效率
     */
    PKG_AUDIT_DETAIL_OEE_API: params => httpProxy('/pkgOeeOrOpe/query', 'GET', params),
    /**
     * @property {string}  PKG_PICKING_MATERIAL_LIST_API 包材领料-查询
     */
    PKG_PICKING_MATERIAL_LIST_API: params => httpProxy('/pkgMaterialUse/query', 'POST', params),
    /**
     * @property {string}  PKG_PICKING_MATERIAL_DETAIL_API 包材领料-详情
     */
    PKG_PICKING_MATERIAL_DETAIL_API: params => httpProxy('/pkgMaterialUse/queryItem', 'POST', params)
};

export default PKG_API;
