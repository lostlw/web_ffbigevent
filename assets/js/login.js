$(function() {
    $("#link_login").on("click", function() {
        $(".login-box").show();
        $(".reg-box").hide();
    });


    $("#link_reg").on("click", function() {
        $(".reg-box").show();
        $(".login-box").hide();
    });

    var form = layui.form;
    var layer = layui.layer;
    form.verify({

        username: function(value, item) { //value：表单的值、item：表单的DOM对象
            if (!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)) {
                return '用户名不能有特殊字符';
            }
            if (/(^\_)|(\__)|(\_+$)/.test(value)) {
                return '用户名首尾不能出现下划线\'_\'';
            }
            if (/^\d+\d+\d$/.test(value)) {
                return '用户名不能全为数字';
            }

            //如果不想自动弹出默认提示框，可以直接返回 true，这时你可以通过其他任意方式提示（v2.5.7 新增）
            if (value === 'xxx') {
                // alert('用户名不能为敏感词');
                return '用户名不能为敏感词';
            }
        },

        // //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位,且不能出现空格'],
        repwd: function(value) {
            // 通过形参拿到的是确认密码框中的内容
            // 还需要拿到密码框中的内容
            // 然后进行一次等于的判断
            // 如果判断失败,则return一个提示消息即可
            var pwd = $('.reg-box [name=password]').val()
            if (pwd !== value) {
                return '两次密码不一致！'
            }
        }
    });

    $("#form_reg").on('submit', function(e) {
        e.preventDefault();

        $.post('/api/reguser', { username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val() }, function(res) {
            if (res.status != 0) {
                return layer.msg(res.message);
            }

            layer.msg('注册成功,请登录!');

            $("#link_login").click();
        });
    });

    $("#form_login").on('submit', function(e) {
        e.preventDefault();

        $.post('/api/login', { username: $('#form_login [name=username]').val(), password: $('#form_login [name=password]').val() }, function(res) {
            if (res.status != 0) {
                return layer.msg(res.message);
            }
            console.log(res.token);
            localStorage.setItem('token', res.token);
            layer.msg('登录成功');
            location.href = '/index.html';
        });
    });
})