$(function () {
    /*
        1.btn點擊事件
        2.獲取input裏面的值
            a 搜索過之後根據localstorage裏面的數據來渲染數據列表 
     */
    init();
    function init() {
        $(".search").on('click',function () {
            //獲取input的值
            var txt = $(".txt").val();
            //判斷txt的值如果為空就退出
            if(!txt.trim()){
                mui.toast("請輸入内容");
                return;
            }

            //獲取localstorage的值
            var ls = localStorage;
            var arr = (ls.getItem("searchData") && JSON.parse(ls.getItem("searchData"))) || [];
            
            //判斷arr裏面的值和用沒有和txt一樣，如果一樣就刪掉
            for (let i = 0; i < arr.length; i++) {
                if (arr[i] == txt) {
                    arr.splice(i,1);
                }
            }
            //將txt裏面的值添加到arr裏
            arr.unshift(txt);
            //將arr添加到localstorage裏
            arr = JSON.stringify(arr);
            ls.setItem("searchData",arr);

            //頁面跳轉到搜索中心
            location.href = "searchList.html?key="+txt;
        });

        //刪除所有
        $(".clearAll").on("click",function(){
            var ls = localStorage;
            ls.clear();
            location.reload();
        });

        //刪除列表上的單個數據
        $(".data-list ul").on("click",".del",function (e) {
          
            var index = e.target.dataset.index;
            var ls = localStorage;
            var arr = (ls.getItem("searchData") && JSON.parse(ls.getItem("searchData"))) || [];
            
            arr.splice(index,1);

            arr = JSON.stringify(arr);
            ls.setItem("searchData", arr);
        });


       
        renderData();

        function renderData() {
            //根據input的值來從localstorage獲取數據,如果有就將數據放進arr裏，沒有就放一個空數組
            var ls = localStorage;
            var arr = (ls.getItem("searchData") && JSON.parse(ls.getItem("searchData"))) || [];
            //先判斷arr是否為kong
            if (arr.length != 0) {
                $(".data-none").hide();
            } else {
                $(".data-list").hide();
            }
            //將獲取到的數據渲染到ul上
            var str = "";
            for (var i = 0; i < arr.length; i++) {
                str += "<li>" + arr[i] + "<a data-index=\"" + i + "\" class=\"del fa fa-close\" href=\"javascript: ;\"></a></li>";
            }
            $(".data-list ul").html(str);
            //判斷arr裏面有沒有跟txt的一樣的
        }

    }
})