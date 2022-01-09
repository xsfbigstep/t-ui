import TAntConfigform from './config-form'
import TAntLayoutConditional from './layout-conditional'
import TLayoutPage from './layout-page'
import TLayoutPageItem from './layout-page-item'
import TAntLayoutTable from './layout-table'
import TAntRangePicker from './range-picker'
import TCalendar from './calendar'
import TDatePicker from './date-picker'
import TDialog from './dialog'
import TEditTable from './edit-table'
import TForm from './form'
import TIcon from './icon'
import TInput from './input'
import TInputSearch from './input-search'
import TLayout from './layout'
import TPhone from './phone'
import TProtocol from './protocol'
import TQueryCondition from './query-condition'
import TRemark from './remark'
import TSearch from './search'
import TSimpleForm from './simple-form'
import TStepWizard from './step-wizard'
import TSticky from './sticky'
import TTable from './table'
import TTimerBtn from './timer-btn'
import TTreeTable from './tree-table'
// import TUploadExcel from './upload-excel'
import TUploadFile from './upload-file'
import UploadFile from './UploadFile'
import TAntLayoutForm from './layout-form'
import TModuleForm from './module-form'
import { TAntModal, TAntProtocol } from './modal'

// 存储组件列表
const components = [
  TAntConfigform,
  TAntLayoutConditional,
  TLayoutPage,
  TLayoutPageItem,
  TAntLayoutTable,
  TAntRangePicker,
  TCalendar,
  TDialog,
  TDatePicker,
  TForm,
  TIcon,
  TInput,
  TInputSearch,
  TLayout,
  TPhone,
  TProtocol,
  TQueryCondition,
  TRemark,
  TSearch,
  TSimpleForm,
  TStepWizard,
  TSticky,
  TTable,
  TTimerBtn,
  TTreeTable,
  // TUploadExcel,
  TUploadFile,
  UploadFile,
  TAntLayoutForm,
  TAntModal,
  TAntProtocol,
  TModuleForm,
  TEditTable
]

// 定义 install 方法，接收 Vue 作为参数。如果使用 use 注册插件，则所有的组件都将被注册
const install = function (Vue) {
  // 判断是否安装
  if (install.installed) return
  install.installed = true
  // 遍历注册全局组件
  components.map(component => Vue.component(component.name, component))
}

// 判断是否是直接引入文件
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}
// 按需引入
export {
  install,
  TAntConfigform,
  TAntLayoutConditional,
  TLayoutPage,
  TLayoutPageItem,
  TAntLayoutTable,
  TAntRangePicker,
  TCalendar,
  TDialog,
  TDatePicker,
  TForm,
  TIcon,
  TInput,
  TInputSearch,
  TLayout,
  TPhone,
  TProtocol,
  TQueryCondition,
  TRemark,
  TSearch,
  TSimpleForm,
  TStepWizard,
  TSticky,
  TTable,
  TTimerBtn,
  TTreeTable,
  // TUploadExcel,
  TUploadFile,
  UploadFile,
  TAntLayoutForm,
  TAntModal,
  TAntProtocol,
  TModuleForm,
  TEditTable
}
export default {
  // 导出的对象必须具有 install，才能被 Vue.use() 方法安装
  install,
  ...components
}