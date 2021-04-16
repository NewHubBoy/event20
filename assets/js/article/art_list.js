// 定义一个查询的参数对象，将来请求数据的时候，
// 需要将请求参数对象提交到服务器
var q = {
    pagenum: 1, // 页码值，默认请求第一页的数据
    pagesize: 2, // 每页显示几条数据，默认每页显示2条
    cate_id: '', // 文章分类的 Id
    state: '' // 文章的发布状态
}

const { layer } = layui;
const { form } = layui;

initTable();

// 获取文章表单数据的方法
function initTable() {

    $.ajax({
        method: 'GET',
        url: '/my/article/list',
        data: q,
        success: function (res) {
            if (res.status !== 0) {
                layer.msg(res.message);
            } else {
                // console.log(res.data[0]);
                // 使用模板引擎渲染页面数据
                // const data = res.data[0];
                console.log(res);
                const htmlStr = template('tpl-table', res);
                $('#tb').html(htmlStr);
                renderPage(res.total);
            }
        }
    })
}


// 定义美化时间的过滤器
template.defaults.imports.dataFormat = function (date) {
    const dt = new Date(date);

    var y = dt.getFullYear();
    var m = padZero(dt.getMonth() + 1);
    var d = padZero(dt.getDate());

    var hh = padZero(dt.getHours());
    var mm = padZero(dt.getMinutes());
    var ss = padZero(dt.getSeconds());

    return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
}

// 定义补零的函数
function padZero(n) {
    return n > 9 ? n : '0' + n
}


//  获取分类列表数据
initCates();
function initCates() {
    $.ajax({
        method: 'GET',
        url: '/my/article/cates',
        success: function (res) {
            if (res.status !== 0) {
                return layer.msg(res.message)
            }
            const htmlStr = template('tpl-cate', res);
            $('select[name=cate_id]').html(htmlStr);
            form.render();
        }
    });
}

// 筛选功能
screenArt();
function screenArt() {
    $('#form-search').on('submit', function (e) {
        e.preventDefault();
        // console.log(123);
        // 获取表单中选中项的值
        const cate_id = $('[name=cate_id]').val()
        const state = $('[name=state]').val()
        // 为查询参数对象 q 中对应的属性赋值
        q.cate_id = cate_id
        q.state = state
        // 根据最新的筛选条件，重新渲染表格的数据
        initTable()

    })

}


// 分页功能
function renderPage(total) {
    // console.log(total);
    layui.use('laypage', function () {
        var laypage = layui.laypage;

        //执行一个laypage实例
        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize, // 每页显示几条数据
            curr: q.pagenum, // 设置默认被选中的分页
            limits: [2, 3, 5, 10],
            // layout:['count','limit','prev','page','next','skip'],
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip', 'refresh'],
            // 页码切换时的列表变换功能
            jump: function (obj, first) {
                //obj包含了当前分页的所有参数，比如：
                console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                console.log(obj.limit); //得到每页显示的条数
                q.pagenum = obj.curr;
                q.pagesize = obj.limit;
                //首次不执行
                if (!first) {
                    initTable();
                    //do something
                }
            }
        });
    });
};




// 删除功能
deletArt();
function deletArt() {
    // 绑定点击事件
    $('#tb').on('click', '.btn-delet', function () {
        // 获取该文字 id
        const id = $(this).attr('data-Id');
        const deletLen = $('#tb .btn-delet').length;
        layer.confirm('确定要删除这篇文章吗？', { icon: 5, title: '提示' }, function (index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    console.log(res);
                    if (res.status !== 0) {
                        return layer.msg(res.message);
                    } else {
                        layer.msg(res.message);
                        if (deletLen === 1 && q.pagenum !== 1) {
                            q.pagenum--;
                        }
                        initTable();
                    }

                }
            })
            layer.close(index);
        });

    })
}
