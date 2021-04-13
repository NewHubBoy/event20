$(function () {

    var { layer } = layui;

    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)



    // 点击上传按钮
    $('#btnChooseImage').on('click', function () {
        // 触发文件上传input
        $('#file').click();
    })

    $('#file').on('change', function (e) {

        // 获取文件对象
        const [file] = e.target.files;

        if (!file) {
            // 如果文件不存在
            return layer.msg('文件不存在');
        }

        // 如果文件存在
        // 获取文件地址
        const imgUrl = URL.createObjectURL(file);

        // 初始化裁剪框
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', imgUrl) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域

    });

    // 为确定按钮绑定点击事件
    $('#btnUpload').on('click', function () {
        // console.log(123);
        // 1.拿到用户裁剪后的头像
        // 上传的时base64 的图片
        // 用字符串表示图片
        // 减少网络请求
        // 但是体积大
        const dataURL = $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png');

        // 2.调用接口上传头像
        $.ajax({
            method:'POST',
            url:'/my/update/avatar',
            data:{
                avatar:dataURL
            },
            success:function(res){
                // console.log(res);
                if(res.status !== 0 ){
                    return layer.msg(res.message)
                }

                layer.msg(res.message);
                window.parent.getUserInfo();
            }
        })
    })
})