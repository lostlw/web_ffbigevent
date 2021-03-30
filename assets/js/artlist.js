$(function() {
    var params = {
        pagenum: 1,
        pagesize: 5,
        cate_id: "",
        state: ""
    }

    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage

    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function(date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    function initTab() {
        $.ajax({
            method: "GET",
            url: "/my/article/list",
            data: params,
            success: function(res) {
                console.log(res.data);
                if (res.status !== 0) {
                    return layer.msg("获取文章列表数据失败")
                }

                var str = template("artlist-table", res);
                // console.log(str);
                $("tbody").html(str)
                    // 调用渲染分页的方法
                renderPage(res.total)
            }
        })
    }

    initTab();

    function initCate() {
        ///my/article/cates

        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function(res) {
                console.log(res.data);
                if (res.status !== 0) {
                    return layer.msg("获取文章分数据失败")
                }

                var str = template("tpl-cate", res);
                // console.log(str);
                $("[name=cate_id]").html(str)
                form.render()
            }
        })
    }

    initCate();

    $("#form-search").on("submit", function(e) {
        e.preventDefault()


        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
            // 为查询参数对象 q 中对应的属性赋值
        params.cate_id = cate_id
        params.state = state

        // 根据最新的筛选条件，重新渲染表格的数据
        initTab()
    })

    function renderPage(total) {
        laypage.render({
            elem: "pageBox", // 分页容器的 Id
            count: total, // 总数据条数
            limit: params.pagesize, // 每页显示几条数据
            curr: params.pagenum, // 设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            jump: function(obj, first) {
                // 可以通过 first 的值，来判断是通过哪种方式，触发的 jump 回调
                // 如果 first 的值为 true，证明是方式2触发的
                // 否则就是方式1触发的
                console.log(first)
                console.log(obj.curr)
                    // 把最新的页码值，赋值到 q 这个查询参数对象中
                params.pagenum = obj.curr
                    // 把最新的条目数，赋值到 q 这个查询参数对象的 pagesize 属性中
                params.pagesize = obj.limit
                    // 根据最新的 q 获取对应的数据列表，并渲染表格
                    // initTable()
                if (!first) {
                    initTab()
                }
            }
        })
    }

    //删除事件的绑定
    $("tbody").on("click", "#btn-del", function() {
        var id = $(this).attr("data-id");
        // layer.msg(" del " + id);
        var len = $('.btn-delete').length
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: "GET",
                url: "/my/article/delete/" + id,
                success: function(res) {
                    console.log(res);
                    if (res.status !== 0) return layer.msg(res.message || "删除文章失败!")
                    layer.msg('删除文章成功')

                    if (len == 1) {
                        params.pagenum = (params.pagenum == 1 ? 1 : params.pagenum - 1);
                    }


                    initTab();
                }
            })

            layer.close(index)
        })
    })

    //删除事件的绑定
    $("tbody").on("click", "#btn-edit", function() {
        var id = $(this).attr("data-id");
        // layer.msg(" edit " + id);



    })

    $("#form-search").on("submit", function(e) {
        e.preventDefault();

        var cate_id = $("[name=cate_id]").val();
        var state = $("[name=state]").val();
        params.cate_id = cate_id;
        params.state = state;

        initTab();
    })
})