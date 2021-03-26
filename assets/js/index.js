$(function() {
    getUserInfo();


    $("#btnLogout").on("click", function() {
        // alert("弹出");
        var layer = layui.layer;
        layer.confirm('确定退出登录吗?', { icon: 3, title: '提示' }, function(index) {
            //do something

            localStorage.removeItem("token");
            location.href = "/login.html";
            layer.close(index);
        });
    });
})

function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        success: function(res) {
            console.log(res);
            if (res.status !== 0) {
                layui.layer.msg('获取用户信息失败!')
            } else {
                renderAvatar(res.data)
            }
        },


    })
}

function renderAvatar(user) {
    var name = user.nickname || user.username;
    $("#welcome").html("欢迎" + name);

    if (user.user_pic == null || user.user_pic == '') {

        $(".text-avatar").html(name[0].toUpperCase()).show();

        $(".layui-nav-img").hide();
    } else {
        $(".layui-nav-img").attr("src", user.user_pic).show();
        $(".text-avatar").hide();
    }
}