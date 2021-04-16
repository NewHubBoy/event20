
$(function () {
    getCates();
    initEditor();


    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options);

    // 文件提交
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click()
    })

    // 将选择的图片渲染到页面
    $('#coverFile').on('change', function (e) {

        // 阻止默认事件
        e.preventDefault();

        // 获取文件列表

        const files = e.target.files;

        // 将文件对象转换为 url 地址

        const newImgURL = URL.createObjectURL(files[0]);

        // console.log(fileUrl);
        $image
            .cropper('destroy')
            .attr('src', newImgURL)
            .cropper(options)
    })

    // 草稿按钮

    let save_status = '已发布';
    $('#btnToSave').on('click', function (e) {
        e.preventDefault();
        let save_status = '草稿';
        console.log(123);
    });

    // 发布
    $('#atr-edit').on('submit', function (e) {
        e.preventDefault();

        // 创建 Formdata对象
        const fd = new FormData($(this)[0]);

        fd.append('state', save_status);
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象，存储到 fd 中
                fd.append('cover_img', blob)
                // 6. 发起 ajax 数据请求
                // 发起ajax 请求 
                publishArticle(fd);
            });

    });
});



var { layer } = layui;
var { form } = layui;

function getCates() {
    $.ajax({
        method: 'GET',
        url: '/my/article/cates',
        success: function (res) {
            if (res.status !== 0) {
                return layer.msg(res.message);
            } else {
                const htmlStr = template('temp-cates', res);
                $('[name=cate_id]').html(htmlStr);
                form.render();
            }
        }
    })
}

// 提交
function publishArticle(fd) {
    $.ajax({
        method: 'POST',
        url: '/my/article/add',
        data: fd,
        // 注意：如果向服务器提交的是 FormData 格式的数据，
        // 必须添加以下两个配置项
        contentType: false,
        processData: false,
        success: function (res) {
            if (res.status !== 0) {
                return layer.msg('发布文章失败！')
            }
            layer.msg('发布文章成功！')
            // 发布文章成功后，跳转到文章列表页面
            location.href = '/article/art_list.html'
        }
    })
}