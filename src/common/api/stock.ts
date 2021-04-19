import httpProxy from 'utils/net/httpProxy';

const STOCK_API = {
    /**
     * @property {string} STOCK_MATERIAL_GROUP_QUERY_API 库存物料组分页查询
     */
    STOCK_MATERIAL_GROUP_QUERY_API: params => httpProxy('/storage/materialGroup/pageQuery', 'POST', params),
    /**
     * @property {string} STOCK_MATERIAL_GROUP_SAVE_API 库存物料组新增
     */
    STOCK_MATERIAL_GROUP_SAVE_API: params => httpProxy('/storage/materialGroup/save', 'POST', params),
    /**
     * @property {string} STOCK_MATERIAL_GROUP_DELETE_API 库存物料组删除
     */
    STOCK_MATERIAL_GROUP_DELETE_API: params => httpProxy('/storage/materialGroup/delete', 'POST', params),
    /**
     * @property {string} STOCK_MATERIAL_GROUP_UPDATE_API 库存物料组修改
     */
    STOCK_MATERIAL_GROUP_UPDATE_API: params => httpProxy('/storage/materialGroup/update', 'POST', params),
    /**
     * @property {string} STOCK_MATERIAL_GROUP_STORAGE_API 查询库存服务所需的物料组信息
     */
    STOCK_MATERIAL_GROUP_STORAGE_API: params => httpProxy('/sysMaterial/queryStorageMaterialGroup', 'POST', params),
    /**
     * @property {string} STOCK_PACKAGE_STORAGE_API 包装车间-包材库存-调整
     */
    STOCK_PACKAGE_STORAGE_API: params => httpProxy('/pkg/packageStorage/adjust', 'POST', params),
    /**
     * @property {string} STOCK_PACKAGE_STORAGE_GET_BATCH_API 包装车间-包材库存-按物料和产线获取批次及合计
     */
    STOCK_PACKAGE_STORAGE_GET_BATCH_API: params => httpProxy('/pkg/packageStorage/getBatch', 'POST', params),
    /**
     * @property {string} STOCK_PACKAGE_STORAGE_QUERY_API 包装车间-包材库存-主数据列表
     */
    STOCK_PACKAGE_STORAGE_QUERY_API: params => httpProxy('/pkg/packageStorage/query', 'POST', params),
    /**
     * @property {string} STOCK_PACKAGE_STORAGE_TRANSFER_API 包装车间-包材库存-转线
     */
    STOCK_PACKAGE_STORAGE_TRANSFER_API: params => httpProxy('/pkg/packageStorage/transfer', 'POST', params),
    /**
     * @property {string} STOCK_PACKAGE_STORAGE_SUMMARY_QUERY_API 包材库存汇总查询
     */
    STOCK_PACKAGE_STORAGE_SUMMARY_QUERY_API: params => httpProxy('/storage/packageMaterialStorage/summaryQuery', 'POST', params),
    /**
     * @property {string} STOCK_PACKAGE_STORAGE_PAGE_QUERY_API 包材库存分页查询
     */
    STOCK_PACKAGE_STORAGE_PAGE_QUERY_API: params => httpProxy('/storage/packageMaterialStorage/pageQuery', 'POST', params),
    /**
     * @property {string} STOCK_PACKAGE_STORAGE_ADJUST_API 包材库存调整
     */
    STOCK_PACKAGE_STORAGE_ADJUST_API: params => httpProxy('/storage/packageMaterialStorage/adjust', 'POST', params),
    /**
     * @property {string} STOCK_PACKAGE_STORAGE_ITEM_PAGE_QUERY_API 包材库存明细分页查询
     */
    STOCK_PACKAGE_STORAGE_ITEM_PAGE_QUERY_API: params => httpProxy('/storage/packageMaterialStorageItem/pageQuery', 'POST', params),
    /**
     * @property {string} STOCK_SYS_STORAGE_LIST_API 库位下拉
     */
    STOCK_SYS_STORAGE_LIST_API: params => httpProxy('/sysStorage/listStorage', 'POST', params),
    /**
     * @property {string} STOCK_SYS_STORAGE_LIST_API 查询包材库存所有物料组
     */
    STOCK_STORAGE_LIST_ALL_API: params => httpProxy('/storage/materialGroup/listAll', 'POST', params)
};

export default STOCK_API;
