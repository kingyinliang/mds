// let HOST = 'http://localhost:8080/'
// let HOST = 'http://10.8.4.153:50080/api'
// let HOST = 'http://10.1.1.96:8080'
let HOST = 'http://10.1.1.74:8080'
// let HOST = 'http://10.1.1.148:8080'
/*
*首页api
 */

export const MAIN_API = {
  /**
   * @property {string} LOGIN_API 登录接口
   * @param {string}
   */
  LOGIN_API: HOST + '/sys/login',
  /**
   * @property {string} USERINFO_API 管理员信息
   */
  USERINFO_API: HOST + '/sys/user/info',
  /**
   * @property {string} LOGOUT_API 退出登录
   */
  LOGOUT_API: HOST + '/sys/logout',
  /**
   * @property {string} NAV_API 列表
   */
  NAV_API: HOST + '/sys/menu/nav',
  /**
   * @property {string} MENULIST_API 功能列表
   */
  MENULIST_API: HOST + '/sys/menu/list'
}
/*
*基础数据api
 */
export const BASICDATA_API = {
  /**
   * @property {string} ORGSTRUCTURE_API 组织结构列表
   */
  ORGSTRUCTURE_API: HOST + '/sys/dept/list',
  /**
   * @property {string} ORGSTRUCTURE_API 组织结构详情
   */
  ORGDETAIL_API: HOST + '/sys/dept/info',
  /**
   * @property {string} SAVEORG_API 组织结构 修改
   */
  SAVEORG_API: HOST + '/sys/dept/update',
  /**
   * @property {string} DELETEORG_API 组织结构 删除
   */
  DELETEORG_API: HOST + '/sys/dept/delete',
  /**
   * @property {string} ADDORG_API 组织结构 新增
   */
  ADDORG_API: HOST + '/sys/dept/save',
  /**
   * @property {string} ADDORG_API 组织结构 按部门类型查询
   */
  FINDORG_API: HOST + '/sys/dept/findInfoByType',
  /**
 * @property {string} ADDORG_API 组织结构 按部门id查询车间
 */
  FINDORGBYID_API: HOST + '/sys/dept/findCCById',
  /**
   * @property {string} ADDORG_API 组织结构 按部门id查询子类
   */
  FINDORGBYPARENTID_API: HOST + '/sys/dept/findListByParent',
  /**
   * @property {string} FINDTEAM_API 组织结构 获取班组
   */
  FINDTEAM_API: HOST + '/sys/dept/findProductTeam',
  /**
   * @property {string} SAPLIST_API 物料列表
   */
  SAPLIST_API: HOST + '/sys/sapmaterial/list',
  /**
   * @property {string} SAPLIST_API 物料同步
   */
  SAPUPDATE_API: HOST + '/sys/sapmaterial/syncMaterialManual',
  /**
   * @property {string} SAPDETAIL_API 物料详情
   */
  SAPDETAIL_API: HOST + '/sys/sapmaterialitem/info',
  // 容器管理
  /**
   * @property {string} CONTAINERLIST_API 容器列表
   */
  CONTAINERLIST_API: HOST + '/sys/holder/list',
  /**
   * @property {string} CONTAINERLIST_API 容器详情
   */
  CONTAINERDETAIL_API: HOST + '/sys/holder/findById',
  /**
   * @property {string} CONTAINERADD_API 容器新增
   */
  CONTAINERADD_API: HOST + '/sys/holder/save',
  /**
   * @property {string} CONTAINERUPDATE_API 容器修改
   */
  CONTAINERUPDATE_API: HOST + '/sys/holder/update',
  /**
   * @property {string} CONTAINERDEL_API 容器删除
   */
  CONTAINERDEL_API: HOST + '/sys/holder/delete',
  // 设备管理
  /**
   * @property {string} CONTAINERDEL_API 设备列表
   */
  DEVICELIST_API: HOST + '/sys/device/list',
  /**
   * @property {string} DEVICEDEL_API 设备删除
   */
  DEVICEDEL_API: HOST + '/sys/device/delete',
  /**
   * @property {string} DEVICEADD_API 设备新增
   */
  DEVICEADD_API: HOST + '/sys/device/save',
  /**
   * @property {string} DEVICEADD_API 设备新增
   */
  DEVICEUPDATE_API: HOST + '/sys/device/update',
  // 订单管理
  /**
   * @property {string} ORDERLIST_API 订单列表
   */
  ORDERLIST_API: HOST + '/sys/saporder/list',
  /**
   * @property {string} LOCATIONLIST_API 库位列表
   */
  LOCATIONLIST_API: HOST + '/sys/sto/list',
  /**
   * @property {string} LOCATIONADD_API 库位新增
   */
  LOCATIONADD_API: HOST + '/sys/sto/save',
  /**
   * @property {string} LOCATIONDEL_API 库位删除
   */
  LOCATIONDEL_API: HOST + '/sys/sto/delete',
  /**
   * @property {string} LOCATIONDEL_API 库位删除
   */
  SERCHSAPLIST_API: HOST + '/sys/sapmaterial/findAllList',
  /**
   * @property {string} SAPORDERUPDATE_API 库位删除
   */
  SAPORDERUPDATE_API: HOST + '/sys/saporder/syncOrderManual'
}
/*
*系统设置api
 */
export const SYSTEMSETUP_API = {
  /**
   * @property {string} PARAMETERLIST_API 参数类型列表
   */
  PARAMETERLIST_API: HOST + '/sys/dict/findListByType',
  /**
   * @property {string} PARAMETERTYPE_API 参数类型
   */
  PARAMETERTYPE_API: HOST + '/sys/dict/list',
  /**
   * @property {string} PARAMETERADD_API 参数新增
   */
  PARAMETERADD_API: HOST + '/sys/dict/save',
  /**
   * @property {string} PARAMETERADD_API 参数删除
   */
  PARAMETERDEL_API: HOST + '/sys/dict/delete',
  /**
   * @property {string} PARAMETERADD_API 参数修改
   */
  PARAMETERUPDATE_API: HOST + '/sys/dict/update',
  /**
   * @property {string} PARAMETERDETAIL_API 参数详情
   */
  PARAMETERDETAIL_API: HOST + '/sys/dict/info',
  /**
   * @property {string} USERLIST_API 用户列表
   */
  USERLIST_API: HOST + '/sys/user/list',
  /**
   * @property {string} USERDETAIL_API 用户详情
   */
  USERDETAIL_API: HOST + '/sys/user/info',
  /**
   * @property {string} USERUPDATE_API 修改用户
   */
  USERUPDATE_API: HOST + '/sys/user/update',
  /**
   * @property {string} USERADD_API 新增用户
   */
  USERADD_API: HOST + '/sys/user/save',
  /**
   * @property {string} USERDEL_API 删除用户
   */
  USERDEL_API: HOST + '/sys/user/delete',
  /**
   * @property {string} USERFORTEAM_API 获取所有人员
   */
  USERALL_API: HOST + '/sys/user/listAllOrTeamUser',
  /**
   * @property {string} ROLELIST_API 角色列表
   */
  ROLELIST_API: HOST + '/sys/role/list',
  /**
   * @property {string} ROLEDETAIL_API 角色详情
   */
  ROLEDETAIL_API: HOST + '/sys/role/info',
  /**
   * @property {string} ROLEUPDATE_API 修改角色
   */
  ROLEUPDATE_API: HOST + '/sys/role/update',
  /**
   * @property {string} ROLEADD_API 新增角色
   */
  ROLEADD_API: HOST + '/sys/role/save',
  /**
   * @property {string} USERDEL_API 删除角色
   */
  ROLEDEL_API: HOST + '/sys/role/delete',
  /**
   * @property {string} USERDEL_API 人员分配修改
   */
  ROLEUSERUPDATE_API: HOST + '/sys/role/updateUser',
  /**
   * @property {string} USERDEL_API 功能分配修改
   */
  ROLEMENUUPDATE_API: HOST + '/sys/role/updateMenu',
  /**
   * @property {string} USERDEL_API 组织架构分配修改
   */
  ROLEDEPTUPDATE_API: HOST + '/sys/role/updateDept',
  /**
   * @property {string} ROLEUSER_API 人员分配
   */
  ROLEUSER_API: HOST + '/sys/role/listUser',
  /**
   * @property {string} LISTMENU_API 功能分配
   */
  LISTMENU_API: HOST + '/sys/role/listMenu',
  /**
   * @property {string} LISTMENU_API 部门分配
   */
  LISTDEPT_API: HOST + '/sys/role/listDept',
  /**
   * @property {string} MENUSELECT 菜单
   */
  MENUSELECT_API: HOST + '/sys/menu/select',
  /**
   * @property {string} MENUINFO 菜单详情
   */
  MENUINFO_API: HOST + '/sys/menu/info',
  /**
   * @property {string} MENUINFO 菜单新增
   */
  MENUADD_API: HOST + '/sys/menu/save',
  /**
   * @property {string} MENUINFO 菜单新增
   */
  MENUDEL_API: HOST + '/sys/menu/delete',
  /**
   * @property {string} MENUINFO 菜单修改
   */
  MENUUPDATE_API: HOST + '/sys/menu/update',
  /**
   * @property {string} SCHEDULELIST_API 定时任务
   */
  SCHEDULELIST_API: HOST + '/sys/schedule/list',
  /**
   * @property {string} SCHEDULELIST_API 定时任务删除
   */
  SCHEDULEDEL_API: HOST + '/sys/schedule/delete',
  /**
   * @property {string} SCHEDULELIST_API 定时任务暂停
   */
  SCHEDULEPAUSE_API: HOST + '/sys/schedule/pause',
  /**
   * @property {string} SCHEDULELIST_API 定时任务恢复
   */
  SCHEDULERESUME_API: HOST + '/sys/schedule/resume',
  /**
   * @property {string} SCHEDULELIST_API 定时任务立即执行
   */
  SCHEDULERUN_API: HOST + '/sys/schedule/run',
  /**
   * @property {string} SCHEDULELIST_API 定时任务详情
   */
  SCHEDULEINFO_API: HOST + '/sys/schedule/info',
  /**
   * @property {string} SCHEDULELIST_API 定时任务
   */
  SCHEDULE_API: HOST + '/sys/schedule',
  /**
   * @property {string} SCHEDULELIST_API 日志列表
   */
  LOGLIST_API: HOST + '/sys/scheduleLog/list',
  /**
   * @property {string} SCHEDULELIST_API 失败信息
   */
  LOGINFO_API: HOST + '/sys/scheduleLog/info'
}
/*
*包装车间api
 */
export const PACKAGING_API = {
  /**
   * @property {string} PKGORDELIST_API 包装车间物料换算比例
   */
  PKGBILI_API: HOST + '/sys/sapmaterial/findInfoByCode',
  /**
   * @property {string} PKGORDELIST_API 包装车间订单列表
   */
  PKGORDELIST_API: HOST + '/pkg/order/list',
  /**
   * @property {string} PKGORDERID_API 包装车间orderid
   */
  PKGORDERID_API: HOST + '/pkg/order/selectId',
  /**
   * @property {string} PKGORDERID_API 包装车间order保存
   */
  PKGORDERSAVE_API: HOST + '/pkg/order/save',
  /**
   * @property {string} PKGORDERID_API 包装车间order修改
   */
  PKGORDERUPDATE_API: HOST + '/pkg/order/update',
  /**
   * @property {string} PKGUSERLIST_API 包装车间人员列表
   */
  PKGUSERLIST_API: HOST + '/pkg/user/list',
  /**
   * @property {string} PKGUSERLIST_API 包装车间人员修改
   */
  PKGUSERUPDATE_API: HOST + '/pkg/user/update',
  /**
   * @property {string} PKGUSERSAVE_API 包装车间人员保存
   */
  PKGUSERSAVE_API: HOST + '/pkg/user/save',
  /**
   * @property {string} PKGREADYLIST_API 包装车间准备时间列表
   */
  PKGREADYLIST_API: HOST + '/pkg/ready/list',
  /**
   * @property {string} PKGREADYSAVE_API 包装车间准备时间保存
   */
  PKGREADYSAVE_API: HOST + '/pkg/ready/save',
  /**
   * @property {string} PKGREADYUPDATE_API 包装车间准备时间修改
   */
  PKGREADYUPDATE_API: HOST + '/pkg/ready/update',
  /**
   * @property {string} PKGINLIST_API 包装车间生产入库列表
   */
  PKGINLIST_API: HOST + '/sys/pkgInStorage/list',
  /**
   * @property {string} PKGINSAVE_API 包装车间生产入库保存
   */
  PKGINSAVE_API: HOST + '/sys/pkgInStorage/save',
  /**
   * @property {string} PKGINUPDATE_API 包装车间生产入库修改
   */
  PKGINUPDATE_API: HOST + '/sys/pkgInStorage/update',
  /**
   * @property {string} PKGEXCLIST_API 包装车间异常列表
   */
  PKGEXCLIST_API: HOST + '/pkg/exc/list',
  /**
   * @property {string} PKGEXCSAVE_API 包装车间异常保存
   */
  PKGEXCSAVE_API: HOST + '/pkg/exc/save',
  /**
   * @property {string} PKGEXCUPDATE_API 包装车间异常修改
   */
  PKGEXCUPDATE_API: HOST + '/pkg/exc/update',
  /**
   * @property {string} PKGEXCUPDATE_API 包装车间物料领用列表
   */
  PKGSPALIST_API: HOST + '/pkg/material/list',
  /**
   * @property {string} PKGEXCUPDATE_API 包装车间物料领用保存
   */
  PKGSPASAVE_API: HOST + '/pkg/material/save',
  /**
   * @property {string} PKGEXCUPDATE_API 包装车间物料领用修改 半成品
   */
  PKGSPAUPDATES_API: HOST + '/pkg/material/update/semi',
  /**
   * @property {string} PKGEXCUPDATE_API 包装车间物料领用修改 包材
   */
  PKGSPAUPDATEP_API: HOST + '/pkg/material/update/packing',
  /**
   * @property {string} PKGGERMSLIST_API 包装车间待杀菌数量列表
   */
  PKGGERMSLIST_API: HOST + '/pkg/germs/list',
  /**
   * @property {string} PKGGERMSSAVE_API 包装车间待杀菌数量保存
   */
  PKGGERMSSAVE_API: HOST + '/pkg/germs/save',
  /**
   * @property {string} PKGGERMSUPDATE_API 包装车间待杀菌数量修改
   */
  PKGGERMSUPDATE_API: HOST + '/pkg/germs/update',
  /**
   * @property {string} PKGTEXTLIST_API 包装车间文本记录列表
   */
  PKGTEXTLIST_API: HOST + '/pkg/text/list',
  /**
   * @property {string} PKGTEXTSAVE_API 包装车间文本记录保存
   */
  PKGTEXTSAVE_API: HOST + '/pkg/text/save',
  /**
   * @property {string} PKGTEXTUPDATE_API 包装车间文本记录修改
   */
  PKGTEXTUPDATE_API: HOST + '/pkg/text/update',
  /**
   * @property {string} PKGSAVEFORM_API 包装车间提交 报工
   */
  PKGSAVEFORM_API: HOST + '/verify/time/save',
  /**
   * @property {string} PKGSAVEFORMIN_API 包装车间提交 入库
   */
  PKGSAVEFORMIN_API: HOST + '/sys/pkgInStorage/updatePkgInSto',
  /**
   * @property {string} PKGSAVEFORMIN_API 包装车间提交物料 包材
   */
  PKGSAVEFORMP_API: HOST + '/verify/material/save/packing',
  /**
   * @property {string} PKGSAVEFORMIN_API 包装车间提交物料 半成品
   */
  PKGSAVEFORMS_API: HOST + '/verify/material/save/semi'
}
/*
*机维组api
 */
export const MAINTAIN_API = {
  /**
   * @property {string} MAINTAINLIST_API 机维组列表
   */
  MAINTAINLIST_API: HOST + '/sys/verifyJWZ/findListByParams',
  /**
   * @property {string} MAINTAINSAVE_API 机维组保存
   */
  MAINTAINSAVE_API: HOST + '/sys/verifyJWZ/update',
  /**
   * @property {string} MAINTAINSAVE_API 机维组提交
   */
  MAINTAINSUB_API: HOST + '/sys/verifyJWZ/finished'
}
/*
*立体库api
 */
export const LTK_API = {
  /**
   * @property {string} MAINTAINLIST_API 立体库列表
   */
  LTKLIST_API: HOST + '/sys/verifyLTK/list',
  /**
   * @property {string} MAINTAINSAVE_API 立体库审核
   */
  LTKAUDIT_API: HOST + '/sys/verifyLTK/auditing'
}
/*
*生管审核api
 */
export const AUDIT_API = {
  /**
   * @property {string} AUDITLIST_API 生产入库审核列表
   */
  AUDITLIST_API: HOST + '/sys/verifyInStorage/list',
  /**
   * @property {string} GOAUDIT_API 生产入库审核
   */
  GOAUDIT_API: HOST + '/sys/verifyInStorage/auditing',
  /**
   * @property {string} AUDITHOURSLIST_API 生产报工列表
   */
  AUDITHOURSLIST_API: HOST + '/verify/time/list',
  /**
   * @property {string} AUDITHOURSUPDATE_API 生产报工审核
   */
  AUDITHOURSUPDATE_API: HOST + '/verify/time/update',
  /**
   * @property {string} AUDITISSUELIST_API 生产发料列表
   */
  AUDITISSUELIST_API: HOST + '/verify/material/list',
  /**
   * @property {string} AUDITLIST_API 生产发料审核
   */
  AUDITISSUEUPDATE_API: HOST + '/verify/time/update'
}