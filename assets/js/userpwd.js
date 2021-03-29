$(function() {

    var form = layui.form;
    var layer = layui.layer;

    form.verify({

        pwd: [/^[\S]{6,12}$/, '密码必须6到12位,且不能出现空格'],
        samePwd: function(value) {
            console.log(value);
            if (!new RegExp("^[\\S]{6,12}$").test(value)) {
                return '密码必须6到12位,且不能出现空格';
            } else if (value === $('[name=oldPwd]').val()) {
                return '新旧密码不能相同！'
            }
        },
        repwd: function(value) {
            // 通过形参拿到的是确认密码框中的内容
            // 还需要拿到密码框中的内容
            // 然后进行一次等于的判断
            // 如果判断失败,则return一个提示消息即可
            var pwd = $('[name=newPwd]').val()
            if (pwd !== value) {
                return '两次密码不一致！'
            }
        }
    });

    $(".layui-form").on('submit', function(e) {
        e.preventDefault()
        console.log($(this).serialize());
        $.ajax({
            method: "POST",
            url: "/my/updatepwd",
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("密码重置失败 ");
                }
                layer.msg("密码重置成功 ");
                $('.layui-form')[0].reset()
            }
        })

    });
})