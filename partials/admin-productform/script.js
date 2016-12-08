(function (){
    var scope;
    var pInstance = window.SOSSGRID.getPlugin ("routes");
    var routeData = pInstance.getInputData();
    var bindData = {
        product:{},
        image:'',
        categories:["Breakfast","Lunch","Dinner","Snack","Other"]
    };

    function validate(){
        return true;
    }

    function submit(){
        if (validate()){
            var url;
            if (routeData.productid) url = "apis/products/update";
            else url = "apis/products/insert";
            
            $.ajax({
                type: "POST",
                contentType:"application/json",
                dataType:"json",
                url: url, 
                success: function(result){
                    uploadFile(function(){
                        gotoProducts();
                    });
                },
                data: JSON.stringify(bindData.product)
            });
        }
    }

    function gotoProducts(){
        location.href = "#/admin-allproducts";
    }

    function loadProduct(scope){
        $.ajax({url: "apis/products/byid/" + routeData.productid, success: function(result){
            if (result.response.length !=0){
                scope.product = result.response[0];
                scope.image = "apis/fileuploader/get/products/" + scope.product.itemid;
            }
        }});
    }

    var newFile;
    function uploadFile(cb){
        if (!newFile)cb();
        else{
            $.ajax({
                url: "apis/fileuploader/upload/products/" + scope.product.itemid,
                type: "POST",
                data: newFile,
                processData: false,
                success: function(result){
                    cb();
                },
                error: function(result){
                    cb();
                }
            });
        }
    }

    return {
        methods: {
            submit: submit,
            gotoProducts: gotoProducts,
            onFileChange: function(e) {
                var files = e.target.files || e.dataTransfer.files;
                if (!files.length)
                    return;
                this.createImage(files[0]);
            },
            createImage: function(file) {
                newFile = file;
                var image = new Image();
                var reader = new FileReader();

                reader.onload = function (e) {
                    scope.image = e.target.result;
                };

                reader.readAsDataURL(file);
            },
            removeImage: function (e) {
                scope.image = '';
            }
        },
        data : bindData,
        onReady: function(s){
            scope = s;
            if (routeData.productid)
                loadProduct(scope);
        }
    }
})()
