$(function(){
    init();
    function init(){
        //初始化區域滾動
        mui('.mui-scroll-wrapper').scroll({
            deceleration: 0.0005, //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
            indicators: false //是否顯示滾動條
        });

        //獲取數據
        $.get("/category/queryTopCategory", function(res){
            // console.log(res);
            var html = "";
            for(var i=0; i<res.total; i++){
                html += "<li><a href=\"javascript:;\" data-id=" + res.rows[i].id +" >" + res.rows[i].categoryName +"</a></li>"
            }
            $(".list").html(html);

            //剛開始獲取第一個數據
            querySecondCategory(1);
            //給第一個菜單加類名，變色
            $(".list a").eq(0).addClass("active");
        });


       
        
        //點擊菜單爛獲取數據
        $(".list").on("tap", "a", function () {
            //背景變白色
            $(".list a").removeClass("active");
            $(this).addClass("active");
            var id = $(this)[0].dataset.id;
            // console.log(id);
            querySecondCategory(id);
        });
    }    

    function querySecondCategory(id) {
        $.get("/category/querySecondCategory", { id: id }, function (res) {
            if(res.rows.length == 0){
                $(".mui-scroll").html("<p>沒有更多數據了</p>");
            }else{
                var html = "";
                for (var i = 0; i < res.rows.length; i++) {
                    html += " <a href=\"javascript:;\"><img src=\"" + res.rows[i].brandLogo + "\" alt=\"\"><p>" + res.rows[i].brandName +"</p></a>";
                }
                $(".mui-scroll").html(html);
            }   
        });
    }
});