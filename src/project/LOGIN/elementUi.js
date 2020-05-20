import Vue from 'vue'
import {
    Dialog,
    Menu,
    Submenu,
    MenuItem,
    Form,
    Row,
    Col,
    Card,
    Button,
    Table,
    TableColumn,
    DatePicker,
    Input,
    FormItem,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Tabs,
    TabPane,
    Select,
    Option,
    Pagination,
    Tooltip,
    Popover,
    Progress,
    Radio,
    RadioGroup,
    Transfer,
    Tree,
    Upload,
    Checkbox,
    CheckboxGroup,
    Tag,
    Message,
    MessageBox,
    Loading,
    Notification,
    InputNumber,
    Scrollbar,
    Switch
} from 'element-ui'

export default () => {
    Vue.use(Switch)
    Vue.use(Dialog)
    Vue.use(Menu)
    Vue.use(Submenu)
    Vue.use(MenuItem)
    Vue.use(Form)
    Vue.use(Row)
    Vue.use(Col)
    Vue.use(Card)
    Vue.use(Button)
    Vue.use(Table)
    Vue.use(TableColumn)
    Vue.use(DatePicker)
    Vue.use(Input)
    Vue.use(FormItem)
    Vue.use(Dropdown)
    Vue.use(DropdownMenu)
    Vue.use(DropdownItem)
    Vue.use(Tabs)
    Vue.use(TabPane)
    Vue.use(Select)
    Vue.use(Option)
    Vue.use(Pagination)
    Vue.use(Tooltip)
    Vue.use(Popover)
    Vue.use(Progress)
    Vue.use(Radio)
    Vue.use(RadioGroup)
    Vue.use(Transfer)
    Vue.use(Tree)
    Vue.use(Upload)
    Vue.use(Checkbox)
    Vue.use(CheckboxGroup)
    Vue.use(Tag)
    Vue.use(InputNumber)
    Vue.use(Scrollbar)
    const MB = MessageBox
    Vue.prototype.$loading = Loading.service
    Vue.prototype.$msgbox = MB
    Vue.prototype.$alert = MB.alert
    Vue.prototype.$confirm = MB.confirm
    Vue.prototype.$prompt = MB.prompt
    Vue.prototype.$notify = Notification
    Vue.prototype.$message = Message
}
