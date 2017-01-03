(function (){
    var scope;
    var pInstance = window.SOSSGRID.getPlugin ("routes");
    var routeData = pInstance.getInputData();
    var bindData = {
        product:{},
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
        validator.map ("product.id",true, "You should enter a itemID");
        validator.map ("product.name",true, "You should enter a name");
        validator.map ("product.id","number", "Price should be a number");
    }

    function submit(){
        scope.submitErrors = validator.validate(); 
        if (!scope.submitErrors){
            var url;
            if (routeData.catid) url = "apis/products/categories/update";
            else url = "apis/products/categories/insert";
            
            $.ajax({
                type: "POST",
                contentType:"application/json",
                dataType:"json",
                url: url, 
                success: function(result){
                    gotoProducts();
                },
                data: JSON.stringify(bindData.product)
            });
        }
    }

    function gotoProducts(){
        location.href = "#/admin-allcategories";
    }

    function loadCategory(scope){
        $.ajax({url: "apis/products/categories/byid/" + routeData.catid, success: function(result){
            if (result.response.length !=0){
                scope.product = result.response[0];
            }
        }});
    }

    return {
        methods: {
            submit: submit,
            gotoProducts: gotoProducts
        },
        data : bindData,
        onReady: function(s){
            scope = s;
            loadValidator();
            if (routeData.catid)
                loadCategory(scope);
        }
    }
})()
