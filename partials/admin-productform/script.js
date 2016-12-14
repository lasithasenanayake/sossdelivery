(function (){
    var scope;
    var pInstance = window.SOSSGRID.getPlugin ("routes");
    var routeData = pInstance.getInputData();
    var bindData = {
        product:{},
        image:'',
        categories:["Breakfast","Lunch","Dinner","Snack","Other"],
        submitErrors: undefined
    };


    function Validator(sc){
        var mapping = {};
        return {
            map : function(k,t,m){
                if (!mapping[k])
                    mapping[k] = {required:{val:false, msg:undefined}, type:{}};
                
                if (typeof t === "boolean"){
                    mapping[k].required.val = t;
                    mapping[k].required.msg = m;
                }else {
                    mapping[k].type.val = t;
                    mapping[k].type.msg = m;
                }
            },
            validate: function(){
                var msgStack = [];
                for (mk in mapping){
                    var key;
                    var obj;
                    if (mk.indexOf(".") == -1){
                      key = mk;
                      obj = sc;
                    }else{
                      var splitData = mk.split(".");
                      key = splitData[1];
                      obj = sc[splitData[0]];
                    }

                    if (mapping[mk].required.val==true && !obj[key])
                          msgStack.push(mapping[mk].required.msg);

                    if (obj[key]){
                      if (mapping[mk].type.val)
                        if (mapping[mk].type.val !== typeof obj[key])
                          msgStack.push(mapping[mk].type.msg);
                    }

                }

                var outData = msgStack.length ==0 ? undefined : msgStack; 
                return outData;
            }
        }
    };

    var validator;

    function loadValidator(){
        validator = new Validator (scope);
        validator.map ("product.itemid",true, "You should enter a itemID");
        validator.map ("product.itemid","number", "ItemID should be a number");
        validator.map ("product.name",true, "You should enter a name");
        validator.map ("product.caption",true, "You should enter a caption");
        validator.map ("product.price",true, "You should endter a price");
        validator.map ("product.price","number", "Price should be a number");
        validator.map ("product.catogory",true, "You should select a product category");
        validator.map ("image",true, "You should upload an image");
    }

    function submit(){
        scope.submitErrors = validator.validate(); 
        if (!scope.submitErrors){
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
            loadValidator();
            if (routeData.productid)
                loadProduct(scope);
        }
    }
})()
