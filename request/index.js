let ajaxTimes = 0
export const request = (params) => {
    ajaxTimes++
    //判断url中是否带有 /my/ 请求的是私有的路劲，带上header token
    let header = {...params.header }
    if (params.url.includes("/my/")) {
        header["Authorization"] = wx.getStorageSync("token");
    }
    //显示加载中
    wx.showLoading({
        title: "加载中",
        mask: true,
    });

    //共同url
    const baseUrl = "https://api-hmugo-web.itheima.net/api/public/v1"
    return new Promise((resolve, reject) => {
        wx.request({
            ...params,
            header: header,
            url: baseUrl + params.url,
            success: (result) => {
                resolve(result.data.message)
            },
            fail: (err) => {
                reject(err)
            },
            complete: () => {
                ajaxTimes--;
                if (ajaxTimes === 0) {
                    wx.hideLoading();
                }
            }
        });
    })
}