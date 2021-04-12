$(function () {
    // 点击 '去注册账号' 的切换
    $('#link_reg').on('click', function () {
        $('.login-box').hide();
        $('.reg-box').show();
    });
    // 点击 '去登陆' 的切换
    $('#link_login').on('click', function () {
        $('.reg-box').hide();
        $('.login-box').show();
    });


    // 自定义表单验证

    // 从 layui 获取 form 对象
    // const form = layui.form;
    const { form } = layui; // *解构方式获取对象
    const { layer } = layui;

    // 通过 form.verify() 函数自定义校验规则

    form.verify({

        // 自定义了一个叫 pwd 的校验规则

        pwd: [/^[\S]{6,12}$/, '密码必须为6~12位'],

        // 校验两次输入的密码是否一致
        repwd: function (value) {
            // value 值是引用此校验规则的输入框的值

            // 获取第一次输入密码框的值
            const pwd = $('.reg-box [name=password]').val();
            // 将两次密码进行比较是否一致
            if (pwd !== value) {

                // 如果不一样，return 打印错误信息
                return '两次密码不一样';
            }
        }
    });



    // 监听注册表单的提交事件
    $('#form_reg').on('submit', function (e) {
        // 阻止默认提交事件
        e.preventDefault();

        // 发起 ajax 请求
        $.post('/api/reguser', {
            username: $('.reg-box [name=username]').val(),
            password: $('.reg-box [name=password]').val()
        }, function (res) {
            if (res.status === !0) {
                return layer.msg(res.message);
            } else {
                layer.msg(res.message + '正在跳转登陆~');
                setTimeout(function () {
                    $('#link_login').click();
                }, 1000);
            }
        })
    })

    // 监听登录表单事件

    $('#form_login').on('submit', function (e) {
        // 阻止默认提交事件
        e.preventDefault();

        // 发起 ajax 请求
        $.post('/api/login', {
            username: $('.login-box [name=username]').val(),
            password: $('.login-box [name=password]').val()
        }, function (res) {
            if (res.status === !0) {
                return layer.msg(res.message);
            } else {
                layer.msg(res.message);
                // 将登录成功得到的字符串 token 值存到locaStorage
                // localStorage.setItem('token',res.token)
                MyStorage.setItem('token', res.token,60000);
                console.log(res.token);
                console.log(new Date().getTime());
                location.href='./index.html';
            }
        })
    })

});