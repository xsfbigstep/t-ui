<template>
  <el-form
    :label-width="labelWidth"
    :form="form"
    size="small"
    id="t_query_condition"
    class="t-query-condition"
    @submit.native.prevent
  >
    <el-row>
      <el-col :span="20">
        <el-row>
          <el-col v-for="(opt, i) in cOpts" :key="i" :span="opt.colSpan || 6">
            <el-form-item
              :label="opt.label"
              :class="[opt.className, { render_label: opt.labelRender }]"
            >
              <!-- 自定义label -->
              <template #label v-if="opt.labelRender">
                <render-comp :createElementFunc="opt.labelRender" />
              </template>
              <!-- 自定义输入框插槽 -->
              <template v-if="opt.slotName">
                <slot :name="opt.slotName" :param="form" :scope="form"></slot>
              </template>
              <OptComponent
                v-if="!opt.slotName"
                v-bind="opt"
                :opt="opt"
                :ref="opt.comp === 't-select-table' ? `tselecttableref-${i}` : ''"
                :form="form"
                :value="form[opt.dataIndex]"
                @change="change"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="4">
        <el-form-item
          v-if="Object.keys(cOpts).length > 0"
          label-width="0"
          style="grid-area: submit_btn"
          :class="['btn', { flex_end: cellLength % colLength === 0 }]"
        >
          <el-button
            class="btn_check"
            @click="checkHandle"
            :loading="loading"
            v-bind="queryAttrs"
          >{{ queryAttrs.btnTitle }}</el-button>
          <el-button
            v-if="reset"
            class="btn_reset"
            v-bind="resetAttrs"
            @click="resetHandle"
          >{{ resetAttrs.btnTitle }}</el-button>
          <slot name="querybar"></slot>
          <el-button v-if="originCellLength > colLength && isShowOpen" type="text" @click="openCilck">
            {{ controlText }}
            <i :class="open ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
          </el-button>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import OptComponent from './OptComponent'
import RenderComp from './renderComp.vue'
export default {
  name: 'TQueryCondition',
  components: {
    OptComponent,
    RenderComp
  },
  props: {
    // 配置项
    opts: {
      type: Object,
      default: () => ({})
    },
    labelWidth: {
      type: String,
      default: '120px'
    },
    loading: {
      type: Boolean,
      default: false
    },
    // 查询按钮配置
    btnCheckBind: {
      type: [Object]
    },
    // 重置按钮配置
    btnResetBind: {
      type: [Object]
    },
    reset: {
      type: Boolean,
      default: true
    },
    boolEnter: {
      type: Boolean,
      default: true
    },
    // 是否显示收起和展开
    isShowOpen: {
      type: Boolean,
      default: true
    },
    // 是否默认展开
    isExpansion: {
      type: Boolean,
      default: false
    },
    isExpansionTxt: {
      type: String,
      default: '展开'
    },
    // 收起
    isPackupTxt: {
      type: String,
      default: '收起'
    }
  },
  data() {
    return {
      open: !!this.isExpansion,
      colLength: null,
      form: Object.keys(this.opts).reduce((acc, field) => {
        acc[field] = this.opts[field].defaultVal || null
        return acc
      }, {})
    }
  },
  watch: {
    opts: {
      handler(opts) {
        this.form = this.initForm(opts, true)
      },
      deep: true
    }
  },
  computed: {
    // 是否展开
    controlText() {
      return this.open ? this.isPackupTxt : this.isExpansionTxt
    },
    // 查询按钮配置
    queryAttrs() {
      return { type: 'primary', size: 'small', btnTitle: '查询', ...this.btnCheckBind }
    },
    // 重置按钮配置
    resetAttrs() {
      return { size: 'small', btnTitle: '重置', ...this.btnResetBind }
    },
    cOpts() {
      const { open, opts, colLength, isShowOpen } = this
      let renderSpan = 0
      return Object.keys(opts).reduce((acc, field) => {
        let opt = {
          ...opts[field]
        }
        // 收起、展开操作
        if (isShowOpen) {
          renderSpan += opt.span ?? 1
          if (!open && renderSpan - 1 >= colLength) return acc
        }
        opt.dataIndex = field
        acc[field] = opt
        return acc
      }, {})
    },
    // 占用单元格长度
    span() {
      let span = 1
      Object.keys(this.opts).forEach((key) => {
        span = this.opts[key].span > 4 ? 4 : this.opts[key].span || 1
      })
      return span
    },
    cellLength() {
      // 占用单元格长度
      let length = 0
      Object.keys(this.opts).forEach((key) => {
        let span = this.opts[key].span > 4 ? 4 : this.opts[key].span || 1
        length += span
      })
      return length
    },
    originCellLength() {
      const { colLength } = this
      let length = 0
      Object.keys(this.opts).forEach((key) => {
        let span = this.opts[key].span || 1
        if ((length % colLength) + span > colLength) {
          length += colLength - (length % colLength)
        }
        length += span
      })
      return length
    }
  },
  methods: {
    openCilck() {
      this.open = !this.open
      this.$emit('openCilck')
    },
    getColLength() {
      // 行列数
      const width = window.innerWidth
      let colLength = 4
      if (width > 768 && width < 1280) {
        colLength = 3
      } else if (width <= 768) {
        colLength = 2
      }
      return colLength
    },
    initForm(opts, keepVal = false) {
      return Object.keys(opts).reduce((acc, field) => {
        if (keepVal && this.form) {
          acc[field] = this.form[field]
        } else if (opts[field].defaultVal) {
          acc[field] = opts[field].defaultVal
        } else {
          acc[field] = null
        }
        return acc
      }, {})
    },
    // 更新defaultVal
    updateFields(keepVal = true) {
      this.form = this.initForm(this.opts, keepVal)
    },
    resetHandle() {
      this.form = this.initForm(this.opts)
      // 获取所有的tselecttable
      const refList = Object.keys(this.$refs).filter((item) =>
        item.includes('tselecttableref')
      )
      if (refList.length > 0) {
        refList.map((val) => {
          this.$refs[val][0].clearSelectTable()
        })
      }
      this.checkHandle('reset')
      this.$emit('reset', this.form)
    },
    change(v, dataIndex) {
      this.form[dataIndex] = v
      this.$emit('change', {
        ...this.form
      })
    },
    checkHandle(flagText) {
      const formData = Object.keys(this.form).reduce((acc, field) => {
        if (typeof this.form[field] === 'string') {
          // 去除前后空格
          this.form[field] = this.form[field].trim()
        }
        acc[field] = this.form[field]
        return acc
      }, {})
      this.$emit('submit', formData, flagText)
    },
    // 键盘事件
    keyEvent() {
      if (this.boolEnter) {
        let lett = this
        document.onkeyup = function (e) {
          let key = window.event.keyCode
          let pagination = document.querySelectorAll('.el-pagination')
          let isPaginationInputFocus = false
          if (pagination) {
            pagination.forEach((ele) => {
              let paginationInputList = ele.getElementsByTagName('input')
              let paginationInput =
                paginationInputList[paginationInputList.length - 1]
              // 判断是否有分页器筛选输入框获取焦点
              if (paginationInput === document.activeElement) {
                isPaginationInputFocus = true
              }
            })
          }
          if (isPaginationInputFocus) {
            return
          }
          if (key === 13) {
            lett.checkHandle()
          }
        }
      }
    }
  },
  activated() {
    this.keyEvent()
  },
  mounted() {
    this.colLength = this.getColLength()
    this.keyEvent()
  }
}
</script>

<style lang="scss">
.t-query-condition.el-form {
  position: relative;
  gap: 2px 8px;
  margin-bottom: -7px;
  text-align: left;

  .el-select,
  .el-date-editor,
  .ant-calendar-picker {
    width: 100%;
  }

  .flex_end {
    grid-area: submit_btn;
    margin-top: 2px;

    .el-form-item__content {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      overflow: visible !important;
    }
  }

  .btn {
    text-align: end;
  }

  .render_label {
    .el-form-item__label {
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: flex-end;

      &::before {
        margin-top: 1px;
      }
    }
  }

  .el-form-item {
    display: flex;
    margin-bottom: 6px;

    .el-form-item__label {
      flex-shrink: 0;
      min-width: 60px;
      padding-left: 8px;
    }

    .el-form-item__content {
      flex-grow: 1;
      // overflow: hidden;
      // display: flex;
      // align-items: center;
      // justify-content: flex-end;
      margin-left: 0 !important;
    }
  }

  .btn_check {
    position: relative;
    top: -1px;
  }

  .btn_reset {
    position: relative;
    top: -1px;
    margin-left: 8px;
  }

  [hidden] {
    display: none !important;
  }
}
</style>
