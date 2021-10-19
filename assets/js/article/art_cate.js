$(function () {

    var layer = layui.layer;
    var form = layui.form;
    initArtCateList()


    // 获取文章分类的列表
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                   
                    return layer.msg('更新文章分类列表失败')
                }
                // console.log(res);
                // 更新成功的话就通过模板引擎渲染到页面上
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }

// 关闭是依赖触发了layer.open ,此时他的索引是layer.open
var indexAdd = null
    // 为添加类别按钮绑定点击事件
    $('#btnAddCate').on('click',function() {
       indexAdd = layer.open({
            // 修改基本层类型，去掉确定按钮
            type:1,
            area: ['500px', '250px'],
            title: '添加文章类别',
            content: $('#dialog-add').html()
          });  
    })

    // 通过代理的形式，为 form-add 表单绑定 submit 事件  表单提交事件,发起请求提交给服务器 委派给body，当前存在的元素
    $('body').on('submit','#form-add',function(e) {
        e.preventDefault();
        $.ajax({
            method:'POST',
            url:'/my/article/addcates',
            data:$(this).serialize(),
            success:function(res) {
                // console.log(res);
                if(res.status !== 0){
                    return layer.msg('新增分类失败')
                }
                initArtCateList();
                layer.msg('新增分类成功')
                // 根据索引，关闭对应的弹出层
                layer.close(indexAdd);
            }
        })
    })


    // 点击修改按钮弹出一个弹出层，修改按钮是动态创建的
    // 需要通过代理的方式
     // 通过代理的形式，为 btn-edit 按钮绑定点击事件
   // 通过代理的形式，为 btn-edit 按钮绑定点击事件
   var indexEdit = null
   $('tbody').on('click', '.btn-edit', function() {
     // 弹出一个修改文章分类信息的层
     indexEdit = layer.open({
       type: 1,
       area: ['500px', '250px'],
       title: '修改文章分类',
       content: $('#dialog-edit').html()
     })
 
     var id = $(this).attr('data-id')
    //  console.log(id);
     // 发起请求获取对应分类的数据
     $.ajax({
       method: 'GET',
       url: '/my/article/cates/?' + id , 
       success: function(res) {
         form.val('form-edit', res.data)
         console.log(res);
       }
     })
   })

//    把修改后的文章分类提交到服务器，渲染到页面
// 通过代理的形式，为表单进行绑定提交事件
// 更新文章分类数据
$('body').on('submit','#form-edit',function(e) {
    e.preventDefault();
    $.ajax({
        method:'POST',
        url:'/my/article/updatecate',
        // 因为提交数据的时候有id这个参数，所以一必须加个隐藏域保存
        data:$(this).serialize(),
        success:function(res) {
            if(res.status !== 0) {
                return layer.msg('更新信息分类失败')
            }
            layer.msg('更新信息分类成功')
            layer.close(indexEdit);
            initArtCateList()
        }
    })
})

 // 通过代理的形式，为删除按钮绑定点击事件
 $('tbody').on('click','#btn-delete',function() {
     var id = $(this).attr('data-id')
    //  提示用户是否要删除
     layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
        $.ajax({
          method: 'GET',
          url: '/my/article/deletecate/' + id ,
          success: function(res) {
            if (res.status !== 0) {
              return layer.msg('删除分类失败！')
            }
            console.log(res);
            layer.msg('删除分类成功！')
            layer.close(index)
            initArtCateList()
          }
        })
      })
    })
 })

