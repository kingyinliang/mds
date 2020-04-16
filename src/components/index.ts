import ScrollToTop from './ScrollToTop/ScrollToTop.vue';
import MdsCard from './MdsCard/MdsCard.vue';
import TableTreeColumn from './TableTreeColumn/index.vue';
import OrgView from './OrgView/index.vue';

export default function(Vue) {
    Vue.component('ScrollTop', ScrollToTop);
    Vue.component('MdsCard', MdsCard);
    Vue.component('TableTreeColumn', TableTreeColumn);
    Vue.component('OrgView', OrgView);
}
