$(function () {
   init();
   function init(){
       //初始化下拉刷新
       mui.init({
           pullRefresh: {
                container: "#refreshContainer",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
               down: {
                   height: 50,//可选,默认50.触发下拉刷新拖动距离,
                   auto: true,//可选,默认false.首次加载自动下拉刷新一次
                   contentdown: "下拉可以刷新",//可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
                   contentover: "释放立即刷新",//可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
                   contentrefresh: "正在刷新...",//可选，正在刷新状态时，下拉刷新控件上显示的标题内容
                   callback: function () {
                       queryProductDetail(function(res){
                           //將獲取到的數據渲染到頁面上
                           var html = template("tmp", res);
                           $(".mui-scroll").html(html);

                           //初始化輪播圖
                           var gallery = mui('.mui-slider');
                           gallery.slider({
                               interval: 2000//自动轮播周期，若为0则不自动播放，默认为0；
                           });

                           //初始化數字輸入框
                           mui(".mui-numbox").numbox();
                       });
                       
                      //關閉下拉刷新
                       mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
                   } //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
               },
           }
       });

       //

       //選擇尺碼
       $(".mui-scroll").on("tap",".pro-size",function(){
        //    console.log(123);
            $(this).siblings().removeClass("active");
            $(this).addClass("active");
       });

       //提交到購物車
       $(".cart").on("tap",function(){
            // console.log(123);
            //獲取產品id
            var id = $.getUrl();
            //獲取產品數量
            var num = $(".mui-numbox-input").val();
            //獲取尺碼
           var size = $(".active").html();

            console.log(size);
            //判斷是否有選擇尺碼
           if (size == undefined){
                mui.toast("請選擇尺碼");
                return;
            }

            //先判斷產品數量是否小於1
            if (num<1){
                mui.toast("請選擇數量");
                return;
            }
            
            //發送請求，添加到購物車，如果未登錄則跳轉頁面到登陸頁面，如果已登陸則詢問后跳轉到購物車頁面
            //定義添加購物車參數
            var objCart = {
                productId:id,
                num:num,
                size:size
            }
        //    $.post("/cart/addCart", objCart,function(res){
        //         if(res.error&&res.error==400){
        //             location.href = "http://127.0.0.1:3200/mobile/user/login.html?returnUrl=" + location.href;  
        //         }else{
        //             mui.confirm("添加成功，去看看？","溫馨提示",["是","否"],function(res){
        //                 // console.log(a);
        //                 if (res.index == 0) {
        //                     location.href = "cart.html";
        //                 }
        //             });
        //         }
        //    });   
            $.letaoAjax({
                url:"/cart/addCart",
                type:"post",
                data:objCart,
                success:function (res) {
                    console.log(res);
                    mui.confirm("添加成功，去看看？", "溫馨提示", ["是", "否"], function (a) {
                        console.log(a);
                        if (a.index == 0) {
                            location.href = "cart.html";
                        }
                    });
                }
            });     
       });
   } 

   //獲取數據
    function queryProductDetail(callback){

        //獲取商品的id
        var id = $.getUrl();

        $.get("/product/queryProductDetail", { id: id }, function (res) {
            //獲取商品的碼數範圍
            res.sizeArr = $.getSize(res.size);

            callback&&callback(res);  
        });
    }
    
    
});