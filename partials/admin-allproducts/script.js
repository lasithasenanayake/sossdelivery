(function (){

    var bindData =  {
        allProducts : []
    }

    function loadProducts(category, skip, take){
        var url;
        if (!category)
            url = "./apis/products/all";
        else
            url = "./apis/products/bycat/" + category;

        $.ajax({url: url, success: function(result){
            console.log(result.response);
            bindData.allProducts = result.response;
        }})
    }

    loadProducts(undefined,0,100);

    return {
        methods:{
            navigatePage: function(){

            }
        },
        data : bindData
    }
})()
