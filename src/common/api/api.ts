import httpProxy from 'utils/net/httpProxy';

export const COMMON_API = {
    /**
     * @property {string} LOGIN_API 登录接口
     */
    LOGIN_API: params => httpProxy('/sysUser/login', 'POST', params),
    /**
     * @property {string} UPPASS_API 修改密码
     */
    UPPASS_API: params => httpProxy('/sysUser/password/update', 'POST', params),
    /**
     * @property {string} UPPASS_API 退出登录
     */
    LOGOUT_API: params => httpProxy('/sysUser/quit', 'GET', params),
    /**
     * @property {string} SET_FACTORY_API 默认工厂 factoryCode
     */
    SET_FACTORY_API: params => httpProxy('/sysUser/defaultFactory/update', 'GET', params),
    /**
     * @property {string} SET_FACTORY_API 选择工厂 factoryCode
     */
    UPDATE_FACTORY_API: params => httpProxy('/sysUser/factory/update', 'GET', params),
    /**
     * @property {string} NAV_API 路由获取菜单
     */
    NAV_API: params => httpProxy('/sysUser/userRole/menuQuery', 'GET', params),
    /**
     * @property {string} MENULIST_API 菜单管理全列表
     */
    MENULIST_API: params => httpProxy('/sysMenu/query', 'GET', params),
    /**
     * @property {string} MENUSELECT_API 菜单管理无按钮列表
     */
    MENUSELECT_API: params => httpProxy('/sysMenu/selectMenu', 'GET', params),
    /**
     * @property {string} MENUSELECT_API 根据角色id查功能
     */
    ROLEGETMENU_API: params => httpProxy('/sysMenu/selectByRole', 'GET', params),
    /**
     * @property {string} MENUADD_API 菜单管理新增
     */
    MENUADD_API: params => httpProxy('/sysMenu/insert', 'POST', params),
    /**
     * @property {string} MENUUPDATE_API 菜单管理修改
     */
    MENUUPDATE_API: params => httpProxy('/sysMenu/update', 'POST', params),
    /**
     * @property {string} MENUDEL_API 菜单管理删除
     */
    MENUDEL_API: params => httpProxy('/sysMenu/remove', 'GET', params),
    /**
     * @property {string} USER_BATCH_QUERY_API 系统管理-人员管理-批量查询
     */
    USER_BATCH_QUERY_API: params => httpProxy('/sysUser/batchQueryById', 'POST', params),
    /**
     * @property {string} USER_DELETE_API 系统管理-人员管理-批量删除
     */
    USER_DELETE_API: params => httpProxy('/sysUser/delete', 'POST', params),
    /**
     * @property {string} USER_DROPDOWN_API 系统管理-人员管理-下拉列表
     */
    USER_DROPDOWN_API: params => httpProxy('/sysUser/dropDown', 'POST', params),
    /**
     * @property {string} USER_INSERT_API 系统管理-人员管理-新增
     */
    USER_INSERT_API: params => httpProxy('/sysUser/insert', 'POST', params),
    /**
     * @property {string} USER_LOGIN_API 系统管理-人员管理-登录 repeat
     */
    USER_LOGIN_API: params => httpProxy('/sysUser/login', 'POST', params),
    /**
     * @property {string} USER_PASSWORD_RESET_API 系统管理-用户管理-重置密码
     */
    USER_PASSWORD_RESET_API: params => httpProxy('/sysUser/password/reset', 'GET', params),
    /**
     * @property {string} USER_PASSWORD_UPDATE_API 系统管理-用户管理-修改密码 repeat
     */
    USER_PASSWORD_UPDATE_API: params => httpProxy('/sysUser/password/update', 'GET', params),
    /**
     * @property {string} USER_QUERY_API 系统管理-人员管理-列表
     */
    USER_QUERY_API: params => httpProxy('/sysUser/query', 'POST', params),
    /**
     * @property {string} USER_QUIT_API 系统管理-人员管理-退出 repeat
     */
    USER_QUIT_API: params => httpProxy('/sysUser/quit', 'GET', params),
    /**
     * @property {string} USER_UPDATE_API 系统管理-人员管理-修改
     */
    USER_UPDATE_API: params => httpProxy('/sysUser/update', 'POST', params),
    /**
     * @property {string} USER_ROLE_MENU_QUERY_API 系统管理-用户管理-查询 repeat
     */
    USER_ROLE_MENU_QUERY_API: params => httpProxy('/sysUser/userRole/menuQuery', 'POST', params),
    /**
     * @property {string} USER_ROLE_QUERY_API 系统管理-用户管理-查询
     */
    USER_ROLE_QUERY_API: params => httpProxy('/sysUser/userRole/query', 'POST', params),
    /**
     * @property {string} USER_ROLE_DROPDOWN_API 系统管理-用户管理-角色下拉
     */
    USER_ROLE_DROPDOWN_API: params => httpProxy('/sysRole/dropDown', 'POST', params),
    /**
     * @property {string} USER_ROLE_UPDATA_API 系统管理-用户管理-分配角色
     */
    USER_ROLE_UPDATA_API: params => httpProxy('/sysUserRole/userRole/insert', 'POST', params),
    /**
     * @property {string} ROLE_REMOVE_API 系统管理-角色管理-删除角色
     */
    ROLE_REMOVE_API: params => httpProxy('/sysRole/remove', 'GET', params),
    /**
     * @property {string} ROLE_INSERT_API 系统管理-角色管理-新增
     */
    ROLE_INSERT_API: params => httpProxy('/sysRole/insert', 'POST', params),
    /**
     * @property {string} ROLE_UPDATE_API 系统管理-角色管理-编辑
     */
    ROLE_UPDATE_API: params => httpProxy('/sysRole/update', 'POST', params),
    /**
     * @property {string} ROLE_QUERY_API 系统管理-角色管理-列表
     */
    ROLE_QUERY_API: params => httpProxy('/sysRole/query', 'POST', params),
    /**
     * @property {string} ROLE_ALLOT_INSERT_API 系统管理-角色管理-部门分配
     */
    ROLE_ALLOT_INSERT_API: params => httpProxy('/sysRoleDept/insert', 'POST', params),
    /**
     * @property {string} ROLE_ALLOT_INSERT_API 系统管理-角色管理-查询部门分配
     */
    ROLE_ALLOT_QUERY_API: params => httpProxy('/sysRoleDept/roleDeptList', 'POST', params),
    /**
     * @property {string} ROLE_MENU_INSERT_API 系统管理-角色管理-分配功能
     */
    ROLE_MENU_INSERT_API: params => httpProxy('/sysRoleMenu/insert', 'POST', params),
    /**
     * @property {string} ROLE_MENU_QUERY_API 系统管理-角色管理-查询菜单分配
     */
    ROLE_MENU_QUERY_API: params => httpProxy('/sysRoleMenu/roleMenuList', 'POST', params),
    /**
     * @property {string} ROLE_USER_INSERT_API 系统管理-角色管理-分配人员
     */
    ROLE_USER_INSERT_API: params => httpProxy('/sysUserRole/insert', 'POST', params),
    /**
     * @property {string} ROLE_USER_LIST_API 系统管理-角色管理-获取人员列表
     */
    ROLE_USER_LIST_API: params => httpProxy('/sysUserRole/roleUserList', 'POST', params),
    /**
     * @property {string} ORGSTRUCTURE_API 组织架构树形列表
     */
    ORGSTRUCTURE_API: params => httpProxy('/sysDept/dropDown', 'GET', params),
    /**
     * @property {string} ADDORG_API 组织架构新增
     */
    ADDORG_API: params => httpProxy('/sysDept/insert', 'POST', params),
    /**
     * @property {string} DELETEORG_API 组织架构删除
     */
    DELETEORG_API: params => httpProxy('/sysDept/remove', 'GET', params),
    /**
     * @property {string} UPDATEORG_API 组织架构修改
     */
    UPDATEORG_API: params => httpProxy('/sysDept/update', 'POST', params),
    /**
     * @property {string} ORGDETAIL_API 组织架构详情
     */
    ORGDETAIL_API: params => httpProxy('/sysDept/query', 'GET', params),
    /**
     * @property {string} ORG_QUERY_WORKSHOP_API 基础数据-组织架构-按工厂和类型查询组织机构
     * params deptType: list<string> factory:
     */
    ORG_QUERY_WORKSHOP_API: params => httpProxy('/sysDept/getTypeDept', 'POST', params),
    /**
     * @property {string} ORG_QUERY_WORKSHOP_API 基础数据-组织架构-按id查询下一级
     * param parentId
     */
    ORG_QUERY_CHILDREN_API: params => httpProxy('/sysDept/childList', 'GET', params),
    /**
     * @property {string} DICTQUERY_API 数据字典根据类型获取详情
     */
    DICTQUERY_API: params => httpProxy('/sysDictItem/dropDown', 'GET', params),
    /**
     * @property {string} HOLDER_DROPDOWN_API 基础数据-容器管理-下拉列表查询
     */
    HOLDER_DROPDOWN_API: params => httpProxy('/sysHolder/dropDown', 'POST', params),
    /**
     * @property {string} HOLDER_INSERT_API 基础数据-容器管理-保存容器
     */
    HOLDER_INSERT_API: params => httpProxy('/sysHolder/insert', 'POST', params),
    /**
     * @property {string} HOLDER_QUERY_API 基础数据-容器管理-分页查询
     */
    HOLDER_QUERY_API: params => httpProxy('/sysHolder/query', 'POST', params),
    /**
     * @property {string} HOLDER_ID_QUERY_API 基础数据-容器管理-按ID查询容器
     */
    HOLDER_ID_QUERY_API: params => httpProxy('/sysHolder/queryById', 'GET', params),
    /**
     * @property {string} HOLDER_REMOVE_API 基础数据-容器管理-按ID删除容器信息（可批量）
     */
    HOLDER_REMOVE_API: params => httpProxy('/sysHolder/remove', 'POST', params),
    /**
     * @property {string} HOLDER_UPDATE_API 基础数据-容器管理-修改容器
     */
    HOLDER_UPDATE_API: params => httpProxy('/sysHolder/update', 'POST', params),
    /**
     * @property {string} UPLOADFILE_API 上传文件
     */
    UPLOADFILE_API: params => httpProxy('/sysFile/upload', 'GET', params),
    /**
     * @property {string} DOWNLOADFILE_API 下载文件
     */
    DOWNLOADFILE_API: params => httpProxy('/sysFile/download', 'GET', params),
    /**
     * @property {string} CAPACITYLIST_API 产能管理列表
     */
    CAPACITYLIST_API: params => httpProxy('/sysCapacity/query', 'POST', params),
    /**
     * @property {string} CAPACITYDEL_API 产能管理删除
     */
    CAPACITYDEL_API: params => httpProxy('/sysCapacity/delete', 'POST', params),
    /**
     * @property {string} CAPACITYADD_API 产能管理新增
     */
    CAPACITYADD_API: params => httpProxy('/sysCapacity/insert', 'POST', params),
    /**
     * @property {string} CAPACITYUPDATA_API 产能管理修改
     */
    CAPACITYUPDATA_API: params => httpProxy('/sysCapacity/update', 'POST', params),
    /**
     * @property {string} DEVICELIST_API 设备管理列表
     */
    DEVICELIST_API: params => httpProxy('/sysDevice/query', 'POST', params),
    /**
     * @property {string} DEVICELIST_API 设备管理新增
     */
    DEVICEADD_API: params => httpProxy('/sysDevice/insert', 'POST', params),
    /**
     * @property {string} DEVICECONFIG_API 设备管理配置
     */
    DEVICECONFIG_API: params => httpProxy('/sysDevice/updateStatus', 'POST', params),
    /**
     * @property {string} DEVICELIST_API 设备管理修改
     */
    DEVICEUPDATA_API: params => httpProxy('/sysDevice/update', 'POST', params),
    /**
     * @property {string} DEVICELIST_API 设备管理删除
     */
    DEVICEDEL_API: params => httpProxy('/sysDevice/remove', 'POST', params),
    /**
     * @property {string} ALLMATERIAL_API 物料管理拿全部物料
     */
    ALLMATERIAL_API: params => httpProxy('/sysMaterial/dropDown', 'GET', params, false),
    /**
     * @property {string} 根据编码查物料
     */
    SEARCH_MATERIAL_API: params => httpProxy('/sysMaterial/queryListByType', 'POST', params, false),
    /**
     * @property {string} SPECS_DROPDOWN_API 基础数据--规格管理-下拉列表
     */
    SPECS_DROPDOWN_API: params => httpProxy('/sysSpecs/dropDown', 'POST', params),
    /**
     * @property {string} SPECS_INSERT_API 基础数据--规格管理-新增
     */
    SPECS_INSERT_API: params => httpProxy('/sysSpecs/insert', 'POST', params),
    /**
     * @property {string} SPECS_QUERY_API 基础数据--规格管理-列表
     */
    SPECS_QUERY_API: params => httpProxy('/sysSpecs/query', 'POST', params),
    /**
     * @property {string} SPECS_QUERY_BY_ID_API 基础数据--规格管理-详情
     */
    SPECS_QUERY_BY_ID_API: params => httpProxy('/sysSpecs/queryById', 'GET', params),
    /**
     * @property {string} SPECS_REMOVE_API 基础数据--规格管理-删除
     */
    SPECS_REMOVE_API: params => httpProxy('/sysSpecs/remove', 'POST', params),
    /**
     * @property {string} SPECS_UPDATE_API 基础数据--规格管理-修改
     */
    SPECS_UPDATE_API: params => httpProxy('/sysSpecs/update', 'POST', params),
    /**
     * @property {string} STORAGE_INSERT_API 基础数据--库位管理-新增
     */
    STORAGE_INSERT_API: params => httpProxy('/sysStorage/insert', 'POST', params),
    /**
     * @property {string} STORAGE_UPDATE_API 基础数据--库位管理-编辑
     */
    STORAGE_UPDATE_API: params => httpProxy('/sysStorage/update', 'POST', params),
    /**
     * @property {string} STORAGE_REMOVE_API 基础数据--库位管理-删除
     */
    STORAGE_REMOVE_API: params => httpProxy('/sysStorage/remove', 'POST', params),
    /**
     * @property {string} STORAGE_QUERY_API 基础数据--库位管理-查询
     */
    STORAGE_QUERY_API: params => httpProxy('/sysStorage/query', 'POST', params),
    /**
     * @property {string} METERIAL_DROPDOWN_API 基础数据-物料管理-查询指定工厂的全部物料
     */
    METERIAL_DROPDOWN_API: params => httpProxy('/sysMaterial/dropDown', 'GET', params),
    /**
     * @property {string} METERIAL_QUERY_API 基础数据-物料管理-分页获取物料
     */
    METERIAL_QUERY_API: params => httpProxy('/sysMaterial/query', 'POST', params),
    /**
     * @property {string} METERIAL_SYNC_API 基础数据-物料管理-同步信息
     */
    METERIAL_SYNC_API: params => httpProxy('/sysMaterial/sync', 'POST', params),
    /**
     * @property {string} METERIAL_ITEM_QUERY_API 基础数据-物料管理-根据ID查询物料明细
     */
    METERIAL_ITEM_QUERY_API: params => httpProxy('/sysMaterialItem/query', 'POST', params),
    /**
     * @property {string} ROWMETERIAL_QUERY_API 基础数据-原材料入库记录-查询列表
     */
    ROWMETERIAL_QUERY_API: params => httpProxy('/sysRowMaterial/query', 'POST', params),
    /**
     * @property {string} ROWMETERIAL_SYNC_API 基础数据-原料入库记录-同步信息
     */
    ROWMETERIAL_SYNC_API: params => httpProxy('/sysRowMaterial/sync', 'POST', params),
    /**
     * @property {string} DICTIONARY_DELETE_API 系统管理-数据字典-主表删除
     */
    DICTIONARY_DELETE_API: params => httpProxy('/sysDict/delete', 'POST', params),
    /**
     * @property {string} DICTIONARY_DROPDOWN_API 系统管理-数据字典-主表下拉
     */
    DICTIONARY_DROPDOWN_API: params => httpProxy('/sysDict/dropDown', 'GET', params),
    /**
     * @property {string} DICTIONARY_INSERT_API 系统管理-数据字典-主表新增
     */
    DICTIONARY_INSERT_API: params => httpProxy('/sysDict/insert', 'POST', params),
    /**
     * @property {string} DICTIONARY_QUERY_AP 系统管理-数据字典-主表列表
     */
    DICTIONARY_QUERY_API: params => httpProxy('/sysDict/query', 'POST', params),
    /**
     * @property {string} DICTIONARY_UPDATE_API 系统管理-数据字典-主表修改
     */
    DICTIONARY_UPDATE_API: params => httpProxy('/sysDict/update', 'POST', params),
    /**
     * @property {string} DICTIONARY_ITEM_DELETE_API 系统管理-数据字典-删除
     */
    DICTIONARY_ITEM_DELETE_API: params => httpProxy('/sysDictItem/delete', 'POST', params),
    /**
     * @property {string} DICTIONARY_ITEM_DROPDOWN_API 系统管理-数据字典-下拉
     */
    DICTIONARY_ITEM_DROPDOWN_API: params => httpProxy('/sysDictItem/dropDown', 'GET', params),
    /**
     * @property {string} DICTIONARY_ITEM_INSERT_API 系统管理-数据字典-新增
     */
    DICTIONARY_ITEM_INSERT_API: params => httpProxy('/sysDictItem/insert', 'POST', params),
    /**
     * @property {string} DICTIONARY_ITEM_QUERY_API 系统管理-数据字典-列表
     */
    DICTIONARY_ITEM_QUERY_API: params => httpProxy('/sysDictItem/query', 'POST', params),
    /**
     * @property {string} DICTIONARY_ITEM_UPDATE_API 系统管理-数据字典-修改
     */
    DICTIONARY_ITEM_UPDATE_API: params => httpProxy('/sysDictItem/update', 'POST', params),
    /**
     * @property {string} ORDER_QUERY_API 计划管理--计划订单-查询
     */
    ORDER_QUERY_API: params => httpProxy('/order/query', 'POST', params),
    /**
     * @property {string} OREDER_SYNC_API 计划管理--计划订单-订单同步（增量）
     */
    OREDER_SYNC_API: params => httpProxy('/order/sync', 'POST', params),
    /**
     * @property {string} OREDER_SYNC_API 字典表班次下拉
     */
    DICTQUERY_CLASSLIST_API: params => httpProxy('/sysDictItem/classes/dropDown', 'GET', params),
    /**
     * @property {string} 根据工厂和父级名称模糊查询指定类型的子级
     */
    SYS_CHILDTYPE_API: params => httpProxy('/sysDept/childType', 'POST', params)
};

export const AUDIT_API = {
    /**
     * @property {string} INLIST_API 订单号查询审核日志  orderNo
     */
    AUDIT_LOG_LIST_API: params => httpProxy('/verifyRecord/queryByNo', 'GET', params),
    /**
     * @property {string} INLIST_API 入库审核列表
     */
    INLIST_API: params => httpProxy('/verifyInStorage/query', 'POST', params),
    /**
     * @property {string} INADD_API 入库审核新增
     */
    INADD_API: params => httpProxy('/verifyInStorage/insert', 'POST', params),
    /**
     * @property {string} INUPDATE_API 入库审核修改
     */
    INUPDATE_API: params => httpProxy('/verifyInStorage/upate', 'POST', params),
    /**
     * @property {string} INPASS_API 入库审核过账
     */
    INPASS_API: params => httpProxy('/verifyInStorage/pass', 'POST', params),
    /**
     * @property {string} INREFUSE_API 入库审核退回
     */
    INREFUSE_API: params => httpProxy('/verifyInStorage/refuse', 'POST', params),
    /**
     * @property {string} INWRITEOFFS_API 入库审核反审
     */
    INWRITEOFFS_API: params => httpProxy('/verifyInStorage/writeOffs', 'POST', params),
    /**
     * @property {string} PROISSUEQUERY_API 生产发料列表
     */
    PROISSUEQUERY_API: params => httpProxy('/verifyMaterial/query', 'POST', params),
    /**
     * @property {string} PROISSUEPASS_API 生产发料过账
     */
    PROISSUEPASS_API: params => httpProxy('/verifyMaterial/pass', 'POST', params),
    /**
     * @property {string} PROISSUEREFUSE_API 生产发料退回
     */
    PROISSUEREFUSE_API: params => httpProxy('/verifyMaterial/refuse', 'POST', params),
    /**
     * @property {string} PROISSUEWRITEOFFS_API 生产发料反审
     */
    PROISSUEWRITEOFFS_API: params => httpProxy('/verifyMaterial/writeOffs', 'POST', params),
    /**
     * @property {string} PROISSUEUPDATE_API 生产发料修改
     */
    PROISSUEUPDATE_API: params => httpProxy('/verifyMaterial/update', 'POST', params),
    /**
     * @property {string} PROISSUEDROPDOWN_API 生产发料组件物料下拉
     */
    PROISSUEDROPDOWN_API: params => httpProxy('/verifyMaterial/dropDown', 'POST', params),
    /**
     * @property {string} PROISSUEQUERYBYNO_API 生产发料审核日志
     */
    PROISSUEQUERYBYNO_API: params => httpProxy('/verifyRecord/queryByNo', 'GET', params),
    /**
     * @property {string} HOURS_LIST_API 报工审核列表
     */
    HOURS_LIST_API: params => httpProxy('/verifyTimeSheet/query', 'POST', params),
    /**
     * @property {string} HOURS_ADD_API 报工审核新增
     */
    HOURS_ADD_API: params => httpProxy('/verifyTimeSheet/insert', 'POST', params),
    /**
     * @property {string} HOURS_UPDATE_API 报工审核修改
     */
    HOURS_UPDATE_API: params => httpProxy('/verifyTimeSheet/update', 'POST', params),
    /**
     * @property {string} HOURS_PASS_API 报工审核过账
     */
    HOURS_PASS_API: params => httpProxy('/verifyTimeSheet/pass', 'POST', params),
    /**
     * @property {string} HOURS_REFUSE_API 报工审核退回
     */
    HOURS_REFUSE_API: params => httpProxy('/verifyTimeSheet/refuse', 'POST', params),
    /**
     * @property {string} HOURS_WRITEOFFS_API 报工审核反审
     */
    HOURS_WRITEOFFS_API: params => httpProxy('/verifyTimeSheet/reset', 'POST', params)
};

export const PKG_API = {
    /**
     * @property {string} PKG_HOME_LIST_API 包装车间首页
     */
    PKG_HOME_LIST_API: params => httpProxy('/order/queryListPkg', 'POST', params),
    /**
     * @property {string} PKG_HOME_QUERY_BY_NO_API 包装车间首页
     */
    PKG_HOME_QUERY_BY_NO_API: params => httpProxy('/order/queryByNo', 'GET', params),
    /**
     * @property {string} PKG_INSTORAGE_QUERY_API 生产数据-生产入库-查询
     */
    PKG_INSTORAGE_QUERY_API: params => httpProxy('/pkgInStorage/query', 'POST', params),
    /**
     * @property {string} PKG_TEXT_QUERY_API 包装车间-生产数据-文本记录
     */
    PKG_TEXT_QUERY_API: params => httpProxy('/pkgText/query', 'POST', params),
    /**
     * @property {string} PKG_ALL_SAVE_API 包装车间-生产数据-提交
     */
    PKG_ALL_SAVE_API: params => httpProxy('/pkg/save', 'POST', params),
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
     * @property {string}  PKG_PENDGNUM_QUERY_API 生产数据-待杀菌检测-查询
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
     * @property {string}  PKG_USER_LIST_API 生产数据-生产人员-查询
     */
    PKG_USER_LIST_API: params => httpProxy('/pkg/pkgUser/query', 'POST', params),
    /**
     * @property {string}  PKG_USER_QUERY_API 生包装车间-人员-查询
     */
    PKG_USER_QUERY_API: params => httpProxy('/pkg/pkgUser/query', 'POST', params),
    /**
     * @property {string}  PKG_EXCEPTION_QUERY_API 包装车间-停机情况-查询
     */
    PKG_EXCEPTION_QUERY_API: params => httpProxy('/pkg/pkgException/query', 'POST', params),
    /**
     * @property {string}  PKG_DEVICE_QUERY_API 包装车间-运行情况-查询
     */
    PKG_DEVICE_QUERY_API: params => httpProxy('/pkg/pkgDevice/query', 'POST', params)
};
