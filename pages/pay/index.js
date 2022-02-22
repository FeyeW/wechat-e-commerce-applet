import { getSetting, chooseAddress, openSetting, showModal, showToast, requestPayment } from "../../utils/asyncWx.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
import { request } from '../../request/index.js'
Page({
    data: {
        address: {},
        cart: [],
        totalPrice: 0,
        totalNum: 0
    },
    onShow() {
        // 1 获取缓存中的收货地址信息
        const address = wx.getStorageSync("address");
        // 1 获取缓存中的购物车数据
        let cart = wx.getStorageSync("cart") || [];

        //过滤购物车组
        cart = cart.filter(v => v.checked);
        this.setData({ address });

        let totalPrice = 0;
        let totalNum = 0;
        cart.forEach(v => {
            totalPrice += v.num * v.goods_price;
            totalNum += v.num;
        })
        this.setData({
            cart,
            totalPrice,
            totalNum,
            address
        });
        wx.setStorageSync("cart", cart);

    },
    async handleOrderPay() {
        try {
            const token = wx.getStorageSync("token")
            if (!token) {
                wx.navigateTo({
                    url: '/pages/auth/index'
                });
                return
            }
            //创建订单
            //准备 请求头参数
            //const header = { Authorization: token }
            const order_price = this.this.data.totalPrice
            const consignee_addr = this.data.address.all
            const cart = this.data.cart
            let goods = []
            cart.forEach(v = goods.push({
                goods_id: goods_id,
                goods_number: v.num,
                goods_price: v.goods_price
            }))
            const orderParams = { order_price, consignee_addr, goods }
            const { order_number } = await request({ url: '/my/orders/create', method: 'POST', data: orderParams, })
                //发起预支付接口
            const { pay } = await request({ url: '/my/order/req_unifiedorder', method: 'POST', data: { order_number } })
                //发起微信支付
            await requestPayment(pay)
                //查询后台 订单状态
            const res = await request({ url: '/my/orders/chkOrder', method: 'POST', data: { order_numbers } })
            await showToast({ title: '支付成功' })
                //手动删除缓存中 已经支付了的商品
            let newCart = wx.getStorageSync("cart")
            newCart = newCart.filter(v => !v.checked)
            wx.setStorageSync("cart", newCart)
                //支付成功了 跳转到订单页面
            wx.navigateTo({
                url: '/pages/order/index'
            })
        } catch (error) {
            await showToast({ title: '支付失败' })
            console.log(error)
        }
    }
})