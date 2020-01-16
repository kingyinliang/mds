import ScrollToTop from './ScrollToTop/ScrollToTop'
import QueryTable from './QueryTable/QueryTable'
import DataEntry from './DataEntry/DataEntry'
import MdsCard from './MdsCard/MdsCard'

export default function (Vue) {
  Vue.component('ScrollTop', ScrollToTop)
  Vue.component('QueryTable', QueryTable)
  Vue.component('DataEntry', DataEntry)
  Vue.component('MdsCard', MdsCard)
}
