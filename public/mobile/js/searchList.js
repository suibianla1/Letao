$(function(){

    //獲取url上面的key
    function getUrl() {
        return location.search.split("=")[1];
    }

    var key = getUrl();

    //定義獲取產品數據接口的參數
    var objProduct = {
        proName: key,
        brandld:"",
        price:"",
        num:"",
        pageSize: 4,
        page: 1
    }

    //初始化函數
    init();

    function init() {
        //下拉刷新初始化
        mui.init({
            pullRefresh: {
                container: "#refreshContainer",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
                down: {
                    height: 50,//可选,默认50.触发下拉刷新拖动距离,
                    auto: true,//可选,默认false.首次加载自动下拉刷新一次
                    contentdown: "下拉可以刷新",//可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
                    contentover: "释放立即刷新",//可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
                    contentrefresh: "正在刷新...",//可选，正在刷新状态时，下拉刷新控件上显示的标题内容
                    callback: function(){

                        //下拉之前要將當前頁面重置為1
                        objProduct.page = 1;
                        
                        //獲取數據
                        getData(function(res) {
                            // console.log(res);
                            //將獲取到的數據渲染到頁面上
                            var html = template("tmp", res);
                            $(".goods-list").html(html);
                        });

                        mui('#refreshContainer').pullRefresh().endPulldownToRefresh();

                        //每次刷新之後都要重置上拉加載，因爲在每次下拉加載請求完數據后關閉了下拉加載
                        mui('#refreshContainer').pullRefresh().refresh(true);
                    } //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
                },
                //上拉獲取數據初始化
                up: {
                    height: 50,//可选.默认50.触发上拉加载拖动距离
                    auto: true,//可选,默认false.自动上拉加载一次
                    contentrefresh: "正在加载...",//可选，正在加载状态时，上拉加载控件上显示的标题内容
                    contentnomore: '没有更多数据了',//可选，请求完毕若没有更多数据时显示的提醒内容；
                    callback: function(){
                       
                        //下拉加載跟多内容
                        //頁數要加一
                        objProduct.page++;
                        getData(function(res){
                            //求出縂頁數
                            var pageAll = Math.ceil(res.count/objProduct.pageSize);
                            if (objProduct.page > pageAll){
                                //退出加載
                                mui('#refreshContainer').pullRefresh().endPullupToRefresh(true);
                            }else{
                                //將得到數據追加到頁面上
                                var html = template("tmp", res);
                                $(".goods-list").append(html);
                                //關閉下拉加載
                                mui('#refreshContainer').pullRefresh().endPullupToRefresh(true);
                            }
                        });

                    } //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
                }
            }
        });

        //點擊搜索按鈕搜索
        $(".search").on("tap",function(){
            //獲取輸入框裏面的内容
            var txt = $(".txt").val();
            //判斷輸入框是否有值
            if (!txt.trim()){
                return;
            }
            //將輸入框裏面的值放進objProduct.proName裏
            objProduct.proName = txt;

            //啓動下拉刷新
            mui("#refreshContainer").pullRefresh().pulldownLoading();
        });

        //排序
        $(".lt-orderbar").on("tap","a",function (e) {
            if (e.target.className == "sort") {
                // console.log(e.target);
                //根據price來判斷是要升序還是降序
                var sortName = e.target.dataset.sortname; 

                $(e.target).children().toggleClass("mui-icon-arrowdown mui-icon-arrowup");
                
                var sort = 1;
                if ($(e.target).children().hasClass("mui-icon-arrowdown")) {
                    sort = 2;
                }else{
                    sort = 1;
                }

                objProduct.price = "";
                objProduct.num = ""; 
                objProduct[sortName] = sort;

                //啓動下拉刷新
                mui("#refreshContainer").pullRefresh().pulldownLoading();
            }
            
        });

        //點擊購買頁面跳轉
        $(".goods-list").on("tap", ".btn", function(e) {
            location.href = e.target.href;
        });

        //獲取產品數據函數
        function getData(callback) {
            $.get("/product/queryProduct", objProduct, function(res) {
                callback&&callback(res);
            });
        }

       
    }
});