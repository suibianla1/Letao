$(function(){
    init();
    function init() {
        

        $(".mui-btn-primary").on("tap",function(){
            var username = $(".username").val();
            var password = $(".password").val();

            //判斷用戶名是否為空
            if(!username){
                mui.toast("請輸入用戶名");
                return;
            }
            //判斷密碼長度 >6
            if(password.length>6){
                mui.toast("密碼格式錯誤");
                return;
            }

            //發送請求
            //定義請求參數
            var loginObj = {
                username:username,
                password:password
            }
            $.post("/user/login", loginObj, function(res){
                console.log(res);
                if(res.success){
                    location.href = $.getQueryString("returnUrl");
                }else{
                    mui.toast(res.message);
                }
            });
        });
    }
});