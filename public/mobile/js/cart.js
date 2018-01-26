$(function () {
    init();
    function init() {
        mui.init({
            pullRefresh: {
                container: "#refreshContainer",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
                down: {
                    height: 50,//可选,默认50.触发下拉刷新拖动距离,
                    auto: true,//可选,默认false.首次加载自动下拉刷新一次
                    contentdown: "下拉可以刷新",//可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
                    contentover: "释放立即刷新",//可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
                    contentrefresh: "正在刷新...",//可选，正在刷新状态时，下拉刷新控件上显示的标题内容
                    indicators: false, //是否顯示滾動條
                    callback: function(){

                        queryCart();

                        //結束下拉刷新
                        mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
                    } //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
                }
            }
        });

        //初始化滑動刪除按鈕
        $('#OA_task_1').on('tap', '.mui-btn', function (event) {
            var elem = this;
            var li = elem.parentNode.parentNode;
            mui.confirm('确认删除该条记录？', 'Hello MUI', btnArray, function (e) {
                if (e.index == 0) {
                    li.parentNode.removeChild(li);
                } else {
                    setTimeout(function () {
                        $.swipeoutClose(li);
                    }, 0);
                }
            });
        });


        //刪除
        $("#OA_task_2").on("tap", ".delBtn", function(){
            //獲取id
            var jsonObj = $(this).parents(".mui-table-view-cell")[0].dataset.obj;
            //將jsonObj轉換成對象
            var obj = JSON.parse(jsonObj);
            var id = obj.id;
            // console.log(id);
            //刪除數據的參數
            var arr = [id];
            mui.confirm("", "刪除",["是", "否"], function (a) {
                if (a.index == 0) {
                    deleteCart(arr);
                }
            });
        });
        
        //計算價格總和
        $("#OA_task_2").on("change", ".check input", function(){
            var checkedList = $(".check input:checked");
            // console.log(checkedList.length);
            var priceAll = 0;
            for (var i = 0; i < checkedList.length; i++){
                var jsonObj = $(checkedList[i]).parents(".mui-table-view-cell")[0].dataset.obj;
                //將jsonObj轉換成對象
                var obj = JSON.parse(jsonObj);
                var price = obj.price;
                priceAll += price;
            }
            //保留2位小數
            priceAll = priceAll.toFixed(2);
            $(".price-all span").html("訂單總額：￥"+priceAll);
        });


        //編輯數據
        $("#OA_task_2").on("tap", ".editBtn", function () {
            // console.log(123);
            var jsonObj = $(this).parents(".mui-table-view-cell")[0].dataset.obj;
            //將jsonObj轉換成對象
            var obj = JSON.parse(jsonObj);
            //將productSize->[40-50]分割成數組，以便生尺碼列表
            obj.sizeArr = $.getSize(obj.productSize);

            //編輯選擇尺碼
            $("body").on("tap", ".pro-size", function () {
                $(this).siblings().removeClass("active");
                $(this).addClass("active");
            });

            //渲染編輯框的内容
            var html = template("tmpSize",obj);
            //去除html中的換行
            html = html.replace(/[\r\n]/g, ""); 

            mui.confirm(html,"編輯",["確定","取消"],function(a){
                //跟新數據的參數
                var objUpdate = {
                    id: obj.id,
                    size: $("body span.active").html(),
                    num: $("body .number input").val()
                }

                if (a.index == 0) {
                    $.post("/cart/updateCart", objUpdate, function (res) {
                        if(res.success){
                            //成功，手動觸發下拉刷新
                            mui("#refreshContainer").pullRefresh().pulldownLoading();
                        }
                    });
                }
            });
           
            //初始化數字輸入框
            mui(".mui-numbox").numbox();
        });


        //點擊刷新按鈕刷新
        $(".refresh").on("tap",function(){
            // console.log(123);
            mui("#refreshContainer").pullRefresh().pulldownLoading();
        });


        //請求數據
        function queryCart(){
            $.letaoAjax({
                url:"/cart/queryCart",
                success:function (res) {
                   
                    var html = template("tmp", {data:res});
                    // console.log(html); 
                    $("#OA_task_2").html(html);
                }
            });
        }

        //刪除數據
        function deleteCart(id){
            // console.log(123);
           
            $.letaoAjax({
                url:"/cart/deleteCart",
                data:{id:id},
                success:function(res){
                    if (res.success) {
                        //成功，手動刷新
                        mui("#refreshContainer").pullRefresh().pulldownLoading();
                    }
                }
            });
        }

    }

    //在template裏自定義函數
    template.helper("toJason",function(val){
        return JSON.stringify(val);                             
    });
})