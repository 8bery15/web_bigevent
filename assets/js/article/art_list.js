$(function () {

    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;
    // 定义一个补零函数 如果大于9就为这个数，如果小于0就加个数
    // 三元表达式进行判断
    function padZero(n) {
        return n > 9 ? n : '0' + n;
    }

    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (date) {
        // 定义一个新的时间
        const dt = new Date(date);


        var y = padZero(dt.getFullYear());
        var m = padZero(dt.getMonth() + 1);//月份都是从0开始的所以要加1
        var d = padZero(dt.getDate());

        var yy = padZero(dt.getHours());
        var mm = padZero(dt.getHours());
        var ss = padZero(dt.getSeconds());

        // 返回一个值传入时间过滤器中，过滤好的时间传到页面
        return y + '-' + m + '-' + d + '  ' + yy + ':' + mm + ':' + ss
    }

    // 定义一个查询参数的对象，将来请求数据的时候，需要将参数对象提交到服务器
    var q = {
        pagenum: 1, //页码值，默认页码为1
        pagesize: 2,//每页显示多少条，默认每页显示两条
        cate_id: '',//文章分类的id
        state: ''//文章的状态，有三个状态 ：所有状态，已发布，草稿

    }
    // 这是异步
    initTable()
    initCate();
    // 定义获取文章列表数据的请求
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败')
                }
                layer.msg('获取文章列表成功')
                // 成功，使用模板引擎渲染文章列表数据
                console.log(res);
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr)
                // 调用渲染分页的方法
                renderPage(res.total)

            }

        })
    }

    // 定义文章分类方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取文章分类列表失败')
                }
                // 成功  渲染到文本
                // 首先加载出layui.js去渲染select下拉菜单，没有检测到异步请求获取到的数据，使用模板引擎获取不到，所以需要使用render方法才可以完全渲染
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })
    }


    // 实现筛选功能 相当于表单提交事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault();
        // 获取表单中选项的值
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();
        // 为查询参数q对应的属性赋值
        q.cate_id = cate_id;
        q.state = state;
        // 根据最新的筛选条件重新渲染表格的数据
        initTable();

    })
    // 定义渲染分页的方法
    function renderPage(total) {
        // console.log(total);
        // 配置对象和Ajax请求一样，在括号内
        // 调用 laypage.render() 方法来渲染分页的结构

        laypage.render({
            elem: 'pageBox',//分页容器的id
            count: total,//总数居条数,有limit和count会自动计算出页数
            limit: q.pagesize,//每页显示几条数据
            curr: q.pagenum,//设置默认选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],//设置其他样式
            limits: [2, 3, 5, 10],//每页显示多少条
            // 分页发生切换时，触发jump回调
            // 触发 jump 回调的方式有两种：
            // 1. 点击页码的时候，会触发 jump 回调
            // 2. 只要调用了 laypage.render() 方法，就会触发 jump 回调
            jump: function (obj, first) {
                // 可以通过 first 的值，来判断是通过哪种方式，触发的 jump 回调
                // 如果 first 的值为 true，证明是方式2触发的
                // 否则就是方式1触发的
                console.log(first)
                console.log(obj.curr);
                // 把最新的页码值，赋值到 q 这个查询参数对象中
                q.pagenum = obj.curr;
                // 把最新的条目数，赋值到 q 这个查询参数对象的 pagesize 属性中
                q.pagesize = obj.limit;
                // 根据最新的 q 获取对应的数据列表，并渲染表格
                if (!first) {
                    initTable()
                }
            }
        })

    }


    // 通过代理的方式为删除按钮绑定点击事件
    $('tbody').on('click','.btn-delete',function() {
        // 获取删除按钮的个数
        // var len = $('this').length
        var len = $('.btn-delete').length;
        // 获取文章的id
        var  id = $(this).attr('data-id');
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
              method: 'GET',
              url: '/my/article/delete/' + id,
              success: function(res) {
                if (res.status !== 0) {
                  return layer.msg('删除文章失败！')
                }
                layer.msg('删除文章成功！')
                // 当数据删除完成后，需要判断当前这一页中，是否还有剩余的数据
          // 如果没有剩余的数据了,则让页码值 -1 之后,
          // 再重新调用 initTable 方法
                // 当点击页面中最后一个删除按钮的时候，页码值减1
                if(len === 1) {
                    // 页码值最小为1
                    q.pagenum = q.pagenum === 1?1:q.pagenum -1;
                    
                }
                // 删除按钮不为1的时候刷新页码，为1，页码值-1，刷新页面
                initTable()
              }
            })
      
            layer.close(index)
          })
      })

   
        
    })


         