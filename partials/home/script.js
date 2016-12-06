(function (){
    var bindData =  {
            message : "Works!!!",
            items: []
    };

    var pInstance = window.SOSSGRID.getPlugin ("routes");
    var routeData = pInstance.getInputData();
    
    var reqUrl;
    if (routeData) if (routeData.cat) reqUrl = "apis/products/bycat/" + routeData.cat;
    if (!reqUrl) reqUrl = "apis/products/all";
        
    $.ajax({url: reqUrl, success: function(result){
        console.log(result);
        bindData.items = result.result;
    }})

    return {
        data : bindData,
        methods:{
            additem:function(item){
                items=[];
                if(localStorage.items){           
                    items=JSON.parse(localStorage.items);
                }
                x=0;
                for(i in items){
                    console.log(i);
                    if(items[i].itemid===item.itemid){
                        items[i].qty++;
                        //console.log(i.qty);
                        console.log(items[i]);
                       
                        localStorage.items=JSON.stringify(items);
                        mycart.additems(items[i]);
                        return
                    }
                    x++;
                }
                item.qty=1;
                items.push(item);
                localStorage.items=JSON.stringify(items);
                console.log(items);
                mycart.additems(items);
            }
        }
    }
})()
