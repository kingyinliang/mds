/*
 * @Description: API 接口汇总
 * @Anthor: Telliex,银亮,雪涵,付鑫
 * @Date: 2020-12-24 09:39:15
 * @LastEditors: Telliex
 * @LastEditTime: 2021-01-22 10:20:07
 */
import commonApi from './common';
import orderApi from './order';
import basicApi from './basic';
import auditApi from './audit';
import pkgApi from './pkg';
import steApi from './ste';
import messageApi from './message';
import rdmApi from './rdm';
import kojiApi from './koji';
import ferApi from './fer';
import reportsApi from './reports'; // 报表

export const COMMON_API = commonApi;
export const ORDER_API = orderApi;
export const BASIC_API = basicApi;
export const MSG_API = messageApi;
export const AUDIT_API = auditApi;
export const PKG_API = pkgApi;
export const STE_API = steApi;
export const RDM_API = rdmApi;
export const KOJI_API = kojiApi;
export const FER_API = ferApi;
export const REPORTS_API = reportsApi;
