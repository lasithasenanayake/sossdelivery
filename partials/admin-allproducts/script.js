(function (){

    var scope;

    function loadProducts(category, skip, take){
        var url;
        if (!category)
            url = "./apis/products/all";
        else
            url = "./apis/products/bycat/" + category;

        $.ajax({url: url, success: function(result){
            scope.allProducts = result.response;
        }})
    }

    

    return {
        methods:{
            navigatePage: function(){

            }
        },
        data :{
            allProducts : []
        },
        onReady: function(s){
            scope = s;
            loadProducts(undefined,0,100);
        }
    }
})()
