Component({
  properties: {
    postList: {
      type: Array,
      value: [],
    },
    changePostId: {
      type: Function,
      value: void(0)
    }
  },
  data: {
    // 这里是一些组件内部数据
  },
  methods: {
    changePostId(e) {
      this.triggerEvent('changePostId', e.currentTarget.dataset)
    }
  },
})