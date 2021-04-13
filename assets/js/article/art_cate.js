$(function () {
    // console.log(123);

    const { layer } = layui;
    const { form } = layui;
    // 给弹出层设置初始容器，完成添加后关闭
    let addIndex = null;
    let editIndex = null;

    // 渲染页面
    render();

    //绑定点击事件
    $('#addCate').on('click', function () {

        // 配置弹出层
        addIndex = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        })

    })

    // 监听新增功能
    $('body').on('submit', '#form-add', function (e) {

        // 阻止默认事件
        e.preventDefault();

        // 调用新增功能
        addCate.call(this);

        // 关闭弹出层
        layer.close(addIndex);

    });

    // 绑定编辑事件
    $('tbody').on('click', '#btnRender', function () {
        // 配置弹出层
        editIndex = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        })
        console.log($(this).attr('data-id'));
        const id = $(this).attr('data-id');

        $('[name=id]').val(id);
        // 从服务器获取数据填充
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {

                // 渲染表单
                form.val('form-edit', res.data);
            }
        })
    })

    // 监听编辑按钮事件
    $('body').on('submit', '#form-edit', function (e) {

        // 阻止默认事件
        e.preventDefault();

        // 调用编辑功能
        edit.call(this);

        // 关闭弹出层
        layer.close(editIndex);


    });


    // 监听删除按钮
    $('tbody').on('click', '#btnDelte', function () {
        // 获取自定义属性 Id
        const id = $(this).attr('data-id');

        // 弹出提示框 是否删除
        layer.confirm('确认删除?',{icon:3,title:'提示'},function(index){
            // console.log(id);
            delte(id);

            layer.close(index);
        })
    })

})





// 渲染页面功能 =================================
function render() {
    $.ajax({
        method: 'GET',
        url: '/my/article/cates',
        success: function (res) {
            if (res.status !== 0) {
                return layer.msg(res.message)
            }
            // console.log(res);
            const htmlStr = template('tpl-table', res.data);
            // console.log(htmlStr);
            $('#tb').html(htmlStr);
        }
    });
}



// 新增功能 =======================================
function addCate() {
    // console.log($(this).serialize());;
    // 发起ajax 请求
    $.ajax({
        method: 'POST',
        url: '/my/article/addcates',
        data: $(this).serialize(),
        success: function (res) {
            // console.log(res);
            if (res.status !== 0) {
                return layer.msg(res.message);
            }
            layer.msg(res.message);
            // 重新渲染页面
            render();
        }

    })

}




// 删除事件 =======================================
function delte(id) {
    $.ajax({
        method: 'GET',
        url: '/my/article/deletecate/' + id,
        success: function (res) {
            if (res.status !== 0) {
                return layer.msg(res.message);
            }
            layer.msg(res.message);
            // 重新渲染页面
            render();
        }
    })

}




// 编辑事件 ========================================
function edit() {
    console.log($(this).serialize());
    $.ajax({
        method: 'POST',
        url: '/my/article/updatecate',
        data: $(this).serialize(),
        success: function (res) {
            console.log(res);
            if (res.status !== 0) {
                return layer.msg(res.message);
            }
            layer.msg(res.message);
            // 重新渲染页面
            render();
        }
    })

}