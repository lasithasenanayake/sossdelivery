(function (){

    var scope;

    function loadProducts(skip, take){
        var url = "./apis/products/categories/all";

        $.ajax({url: url, success: function(result){
            scope.items = result.response;
        }})
    }

    

    return {
        methods:{
            navigatePage: function(){

            }
        },
        data :{
            items : []
        },
        onReady: function(s){
            scope = s;
            loadProducts(0,100);
        }
    }
})()
