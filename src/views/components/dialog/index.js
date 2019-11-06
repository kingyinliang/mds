import Dialog from './sh-dialog'

// dialog是一个单例，不需要重复创建
let dialog
export default function createDialog (Vue, { store = {}, router = {} }, options) {
  if (dialog) {
    dialog.options = {
      ...options
    }

    dialog.$children[0].visible = true
  } else {
    dialog = new Vue({
      name: 'Sh-Dialog',
      router,
      store,
      data () {
        return {
          options: { ...options }
        }
      },
      render (h) {
        return h(Dialog, {
          props: this.options
        })
      }
    })
    // 渲染出DOM并手动插入到body
    dialog.$mount()
    document.body.appendChild(dialog.$el)
  }

  // 暴露close方法
  return {
    close: () => dialog.$children[0].close()
  }
}
