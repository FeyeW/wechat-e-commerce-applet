import { request } from '../../request/index.js'
import regeneratorRuntime, { async } from '../../lib/runtime/runtime'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        goods: [],
        isShow: false,
        inpValue: ""
    },
    TimeId: -1,
    handleInput(e) {
        //获取输入框得值
        const { value } = e.detail
            //检测合法性
        if (!value.trim()) {
            this.setData({
                goods: [],
                isShow: false
            })
        }
        clearTimeout(this.TimeId)
        this.TimeId = setTimeout(() => {
            this.qsearch(value)
        }, 1000)

    },
    async qsearch(query) {
        const res = await request({ url: '/goods/qsearch', data: { query } })
        this.setData({
            goods: res
        })
    },
    handleCancel() {
        this.setData({
            inpValue: '',
            isShow: false,
            goods: []
        })
    }


})