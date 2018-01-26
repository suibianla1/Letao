$(function(){
    init();
    function init(){
        //獲得的驗證碼
        //獲取驗證碼
        $(".CodeBtn").on("tap",function(){
            //按一次獲取之後不能再按，要過60s
            $(this).addClass("mui-disabled");
            $(this).html("正在發送");
            var code = $(".code").val();
            var that = this;
            $.get("/user/vCode", function(res){
                // console.log(res);
                // vCode = res.vCode;
                var time = 60;
                var timer = setInterval(function () {
                    $(that).html(time+"秒后再獲取");
                    time--;
                    if (time < 0) {
                        $(that).removeClass("mui-disabled");
                        $(that).html("獲取驗證碼");
                        clearInterval(timer);
                    }
                },1000);
            });
        });

        

        //注冊
        $(".regist").on("tap", function () {
            var username = $(".username").val();
            var password = $(".password1").val();
            var password2 = $(".password2").val();
            var code = $(".code").val();

            //判斷手機號碼
            if (!isPoneAvailable(username)){
                mui.toast("請輸入正確的手機號碼");
                return;
            }
            //判斷密碼
            if(password.length>6){
                mui.toast("密碼格式錯誤");
                return;
            }
            //確認密碼
            if(password != password2){
                mui.toast("兩次密碼不一致");
                return;
            }
            //判斷驗證嗎是否為空
            if(!code){
                mui.toast("請輸入驗證碼");
                return;
            }
            //判斷是否勾選了協議
            var checked = $(".agree input").prop("checked");
            // console.log(checked);
            if(!checked){
                mui.toast("一定要同意才能注冊");
                return;
            }

            //定義請求參數
            var registObj = {
                username:username,
                password:password,
                mobile:username,
                vCode:code
            }
            $.post("/user/register", registObj, function (res) {
                // console.log(res);
                if(res.success){
                    location.href = "/mobile/index.html";
                }else{
                   mui.alert(res.message,"提示","確定");
                }
            });

        });

        //判斷手機號碼
        function isPoneAvailable(str) {
            var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
            if (!myreg.test(str)) {
                return false;
            } else {
                return true;
            }
        }  
    }
});