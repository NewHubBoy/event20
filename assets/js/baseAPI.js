

$.ajaxPrefilter(function (options) {
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url;


    // 设置请求头
    if (options.url.includes('/my/')) {
        options.headers = {
            Authorization: MyStorage.getItem('token') || ''
        }
    };


    options.complete = function (res) {
        const { responseJSON: { status, message } } = res;
        if (status === 1 && message === "身份认证失败！") {

            console.log(res.responseJSON);

            // 强制清除本地 token 
            localStorage.removeItem('token');
            localStorage.removeItem('expireTime');


            // 跳转到登录页面
            location.href = '/login.html';
        }
    }
})