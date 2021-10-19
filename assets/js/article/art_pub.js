$(function () {
    var layer = layui.layer;
    var form = layui.form;



    // 初始化富文本编辑器
    initEditor()

    initCate()
    // 定义下拉菜单的文章分类
    function initCate() {
        // 需要发起请求获取文章分类
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类失败')
                }
                // 调用模板引擎，渲染分类的下拉菜单
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                //    下拉菜单渲染必须调用这个方法
                form.render();
            }
        })
    }

    // 实现基本的裁剪效果
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)


    // 选择封面按钮绑定点击事件，模拟点击选择文件
    $('.btnChooseImage').on('click', function () {
        $('#file').click();
    })

    // 只要选择了文件，文件选择框就会变化，绑定change事件
    $('#file').on('change', function (e) {
        console.log(e);
        // 获取文件的列表数组
        var files = e.target.files;
        // 判断用户是否选择了文件
        if(files.length === 0) {
            return
        }
        // 把选择的图片指定到裁剪区域 
        // files属性是原生js的，用jQuery获取的需要转化成dom元素files[0]
        // 根据选择的文件创建一个URL地址
        var newImgURL = URL.createObjectURL(files[0]);
        // 为裁剪区域重新设置图片
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域   
            .attr('src', newImgURL)  // 重新设置图片路径  
            .cropper(options)        // 重新初始化裁剪区域
    })


    // 实现发布文章
    // 发布文章需要提交几个参数
    // 默认提交表单的时候状态为已发布
    var art_state = '已发布';
    // 点击存为草稿按钮就修改他的状态
    $('#btnState').on('click',function() {
        art_state = '草稿';
    })


    // 表单提交事件
    $('#form').on('submit',function(e) {
        e.preventDefault();

        // 基于表单创建formDaTa对象 把数据给fd

        // 获取表单原生dom元素 formdata的参数必须是dom对象
        var form = $(this)[0]
        var fd = new FormData(form)

        fd.append('state',art_state);

        // 将裁减后的封面追加到formdata
        // 4. 将封面裁剪过后的图片，输出为一个文件对象
    $image
    .cropper('getCroppedCanvas', {
      // 创建一个 Canvas 画布
      width: 400,
      height: 280
    })
    .toBlob(function(blob) {
      // 将 Canvas 画布上的内容，转化为文件对象
      // 得到文件对象后，进行后续的操作
      // 5. 将文件对象，存储到 fd 中
      fd.append('cover_img', blob)
      // 6. 发起 ajax 数据请求
      publishArticle(fd);//把formdata数据传进去
    })

        // index,value指的是键值对,index指name属性的名字,value指的是表单元素的值
        // fd.forEach(function(value,index) {
        //     console.log(value,index);
        // })
        
    })

    // 发布文章的请求
    function publishArticle(fd) {
        $.ajax({
            method:'POST',
            url:'/my/article/add',
            data:fd,
            contentType:false,
            processData:false,
            success:function(res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败！')
                  }
                  layer.msg('发布文章成功！')
                  // 发布文章成功后，跳转到文章列表页面
                  location.href = '/article/art_list.html'
                }
              })
          }
        
})