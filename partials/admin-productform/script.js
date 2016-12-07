(function (){

    var pInstance = window.SOSSGRID.getPlugin ("routes");
    var routeData = pInstance.getInputData();
    var bindData = {
        product:{},
        categories:["Breakfast","Lunch","Dinner","Snack","Other"]
    };

    function validate(){
        return true;
    }

    function submit(){
        if (validate())
        $.ajax({
            type: "POST",
            contentType:"application/json",
            dataType:"json",
            url: "apis/products/save", 
            success: function(result){
                if (result.response.length !=0)
                scope.product = result.response[0];
            },
            data: JSON.stringify(bindData.product)
        });
    }

    return {
        methods: {
            submit: submit
        },
        data : bindData,
        onReady: function(scope){
            if (routeData.productid)
                loadProduct();

            function loadProduct(){
                $.ajax({url: "apis/products/byid/" + routeData.productid, success: function(result){
                    if (result.response.length !=0)
                        scope.product = result.response[0];
                }});
            }
        }
    }
})()
