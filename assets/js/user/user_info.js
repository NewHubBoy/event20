$(function () {

    // 指定表单验证规则

    const { form } = layui;
    const { layer } = layui;

    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return "长度必须在1~6位之间";
            }
        }
    })

    initUserInfo();

})

// 获取用户信息
function initUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        success: function (res) {
            if (res.status !== 0) {
                return layer.msg('获取用户信息失败！')
            } else {
                console.log(res);
                const { form } = layui;
                // 匹配表单内的数据并赋值
                form.val('userInfo', res.data)
            }


        }
    })
}


// 重置表单数据
$('#reset_btn').on('click',function(e){

    // 阻止默认事件
    e.preventDefault();

    // 重新获取用户信息，并填充
    initUserInfo();
})

// 表单提交
$('.layui-form').on('submit',function(e){
    // 阻止默认提交行为
    e.preventDefault();

    // 发起ajax 请求
    $.ajax({
        method:'POST',
        url:'/my/userinfo',
        data:$(this).serialize(),
        success:function(res){
            if(res.status !== 0){
                return layer.msg(res.message);
            }else{
                layer.msg('更新成功')
                console.log(res);
                window.parent.getUserInfo();
            }
        }
    })
})