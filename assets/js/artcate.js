$(function() {
    var layer = layui.layer

    var form = layui.form


    function getCates() {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("获取分类列表失败");
                }
                // console.log(res.data);
                var str = template("tpl-table", res);
                // console.log(str);
                $("tbody").html(str)
            }



        })
    }
    getCates();


    var indexAdd = null
    $('#btnAddCate').on('click', function() {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#add-dialog').html()
        })
    })

    $("body").on("submit", "#add-dialog-form", function(e) {
        e.preventDefault();
        var params = $(this).serialize();
        console.log(params);
        $.ajax({
            method: "POST",
            url: "/my/article/addcates",
            data: params,
            success: function(res) {
                if (res.status !== 0) return layer.msg("新增分类失败!")
                getCates();

                layer.msg('新增分类成功！')
                layer.close(indexAdd)
            }
        })
    })

    var indexEdit = null
    $("tbody").on("click", "#btn-edit", function(e) {
            var id = $(this).attr("data-id");

            indexEdit = layer.open({
                type: 1,
                area: ['500px', '250px'],
                title: '修改文章分类',
                content: $('#dialog-edit').html()
            })



            $.ajax({
                method: 'GET',
                url: '/my/article/cates/' + id,
                success: function(res) {
                    console.log(res.data);
                    //通过添加 lay-filter 属性能实现快速填充
                    form.val('edit-dialog-form', res.data)
                }
            })
        })
        //edit-dialog-form
    $("body").on("submit", "#edit-dialog-form", function(e) {
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: "/my/article/updatecate",
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) return layer.msg("更新分类失败!")
                layer.msg('更新分类成功！')
                layer.close(indexEdit)
                getCates();
            }
        })
    })


    $("tbody").on("click", "#btn-del", function() {
        var id = $(this).attr("data-id");
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: "GET",
                url: "/my/article/deletecate/" + id,
                success: function(res) {
                    console.log(res);
                    if (res.status !== 0) return layer.msg(res.message || "删除分类失败!")
                    layer.msg('删除分类成功！')
                    layer.close(index)
                    getCates();
                }
            })
        })
    })
})