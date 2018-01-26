
$.extend($,{
    getUrl: function() {
        return location.search.split("=")[1];
    },
    getQueryString: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURI(r[2]); return null;
    },
    letaoAjax:function(obj){
        $.ajax({
            url:obj.url,
            type:obj.type || "get",
            data:obj.data,
            success:function(res){
                if(res.error&&res.error == 400){
                    location.href = "http://127.0.0.1:3200/mobile/user/login.html?returnUrl=" + location.href;
                }else{
                    obj.success && obj.success(res);
                }
            }
        });
    },
    getSize: function (str) {
        var sizeStart = str.split("-")[0];
        var sizeEnd = str.split("-")[1];
        //將該範圍作爲res的一個元素存進res裏，然後在渲染到頁面上
        var sizeArr = [];
        for (var i = sizeStart; i <= sizeEnd; i++) {
            sizeArr.push(i);
        }
        return sizeArr;
    }
})

