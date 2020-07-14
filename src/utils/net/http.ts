/** @module constants/http  */
/**
 * HTTP响应状态枚举
 * @author Nixon
 * @enum {number}
 * @readonly
 */
const HTTP_RESPONSE_STATE = {
    /**
     * 成功
     */
    SUCCESS: 200,
    /**
     * token过期
     */
    EXPIRED_TOKEN: 401,
    /**
     * 系统异常
     */
    SYSTEM_ERROR: 500,
    /**
     * 警告
     */
    WARNING: 110,
    /**
     * 成功
     */
    SAP_ERROR: 201
    // Others failure state
};

/**
 * 请求方法
 * @author Nixon
 * @enum {string}
 * @readonly
 */
const HTTP_METHOD = {
    /** GET */
    GET: 'GET',
    /** POST */
    POST: 'POST',
    /** PUT */
    PUT: 'PUT',
    /** PATCH */
    PATCH: 'PATCH',
    /** DELETE */
    DELETE: 'DELETE'
};

export { HTTP_RESPONSE_STATE, HTTP_METHOD };
