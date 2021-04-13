$(function () {

    // console.log(123);
    const { form } = layui;

    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须为6~12位，且不能出现空格'],
        samePwd: function (value) {
            if (value === $('[name=oldPwd]').val()) {
                return '新旧密码不能相同！'
            }
        },
        rePwd: function (value) {
            if (value !== $('[name=newPwd]').val()) {
                return '两次密码不一致！'
            }
        }
    })
    $('.layui-form').on('submit',function(e){
        // 阻止默认事件
        e.preventDefault();
        // 调用修改密码函数
        resetPwd.call(this);
    })
});


function resetPwd(){
    // console.log($(this).serialize());
    $.ajax({
        method:'POST',
        url:"/my/updatepwd",
        data:$(this).serialize(),
        success:function(res){
            console.log(res);
            if(res.message !== 0){
                layer.msg(res.message);
                // 重置表单
                $('.layui-form')[0].reset();
            }else{
                layer.msg(res.message);
                // 重置表单
                $('.layui-form')[0].reset();
            }
        }
    })
}