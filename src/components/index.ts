import ScrollToTop from './ScrollToTop/ScrollToTop.vue';
import MdsCard from './MdsCard/MdsCard.vue';
import TableTreeColumn from './TableTreeColumn/index.vue';
import OrgView from './OrgView/index.vue';
import QueryTable from './QueryTable/QueryTable.vue';
import DataEntry from './DataEntry/DataEntry.vue';
import Audit from './Audit/Audit.vue';
import AuditLog from './AuditLog/AuditLog.vue';
import QueryEntry from './QueryEntry/QueryEntry.vue';
import RedactBox from './RedactBox/RedactBox.vue';

export default function(Vue) {
    Vue.component('ScrollTop', ScrollToTop);
    Vue.component('MdsCard', MdsCard);
    Vue.component('TableTreeColumn', TableTreeColumn);
    Vue.component('OrgView', OrgView);
    Vue.component('QueryTable', QueryTable);
    Vue.component('DataEntry', DataEntry);
    Vue.component('Audit', Audit);
    Vue.component('AuditLog', AuditLog);
    Vue.component('QueryEntry', QueryEntry);
    Vue.component('RedactBox', RedactBox);
}
