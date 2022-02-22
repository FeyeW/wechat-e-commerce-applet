import { request } from '../../request/index.js'
import regeneratorRuntime from '../../lib/runtime/runtime'
import { login } from "../../utils/asyncWx.js"
Page({

    /**
     * 页面的初始数据
     */
    async handleGetUserInfo(e) {
        try {
            //获取用户信息
            const { encryptdData, rawData, iv, signature } = e.detail
                //获取小程序登录成功后的code
            const { code } = await login()
            const loginParams = { encryptdData, rawData, iv, signature, code }
                //发送请求 获取用户的token
            const { token } = await request({ url: "users/wxlogin", data: loginParams })
                //把token存入缓存中 同时跳转回上一页面
            wx.wx.setStorageSync("token", token);
            wx.navigateTo({
                dalta: 1
            });
        } catch (error) {
            console.log(error)
        }

    }


})