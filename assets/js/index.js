$(function () {
    // 调用 getUserInfo 获取用户信息
    getUserInfo();


    // const { layer } = layui;
    // console.log(layer);
    $('#exit').on('click', function () {
        layer.confirm('确定退出？', { icon: 3, title: '提示' }, function (index) {
            localStorage.removeItem('expireTime');
            localStorage.removeItem('token');


            // 跳转到登录页面
            location.href = '/login.html';


            // 关闭弹出框
            layer.close(index)

        })
    });



    $('#layui-nav-item').on('click',function(){
        console.log($(this));
    })
});


// 封装函数获取用户信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers 就是请求头配置对象
        // headers:{
        //     Authorization: MyStorage.getItem('token') || ''
        // },
        success: function (res) {
            // 每次刷新页面的时候重置身份信息保存时间
            // console.log(res);
            if (res.status !== 1) {
                MyStorage.setItem('token', MyStorage.getItem('token'), 1200000);
                // MyStorage.setItem('user_info',JSON.stringify(res.data),1200000);
                renderAvatar(res.data);
            } else {
                console.log(res.message);
            }
        }
        // complete: function (res) {
        //     const { responseJSON: { status, message } } = res;
        //     if (status === 1 || message === "身份认证失败！") {

        //         console.log(res.responseJSON);

        //         // 强制清除本地 token 
        //         localStorage.removeItem('token');

        //         // 跳转到登录页面
        //         location.href = '/login.html';
        //     }
        // }
    })
}

function renderAvatar(user) {
    // 获取用户名
    const name = user.nickname || user.username;
    $('#welcome').html(`欢迎 ${name}`);

    // 处理文字头像和图片头像

    if (user.user_pic !== null) {
        $('.text-avatar').hide();
        $('.layui-nav-img').attr('src', user.user_pic).show();
    } else {
        $('.layui-nav-img').hide();
        const textAvatar = name[0].toUpperCase();
        $('.text-avatar').html(textAvatar).show();
    }
}
