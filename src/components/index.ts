import ScrollToTop from './ScrollToTop/ScrollToTop.vue';
import MdsCard from './MdsCard/MdsCard.vue';
import TableTreeColumn from './TableTreeColumn/index.vue';
import OrgView from './OrgView/index.vue';
import QueryTable from './QueryTable/QueryTable.vue';
import DataEntry from './DataEntry/DataEntry.vue';
import Audit from './Audit/Audit.vue';
import AuditLog from './AuditLog/AuditLog.vue';
import QueryEntry from './QueryEntry/QueryEntry.vue'
import TextRecord from './TextRecord/index.vue'
import ExcRecord from './ExcRecord/index.vue'
import RedactBox from './RedactBox/RedactBox.vue';
import WorkHour from './WorkHour/WorkHour.vue';
import FormDialog from './FormDialog/index.vue';

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
    Vue.component('TextRecord', TextRecord);
    Vue.component('ExcRecord', ExcRecord);
    Vue.component('RedactBox', RedactBox);
    Vue.component('WorkHour', WorkHour);
    Vue.component('FormDialog', FormDialog);
}
