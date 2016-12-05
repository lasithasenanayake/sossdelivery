(function (){
    var bindData =  {
            message : "Works!!!",
            items: []
            
    };
    if(localStorage.items){
        bindData.items=JSON.parse(localStorage.items);
        //bindData.totalPrice=0;
    }
    console.log("itemsx");
    
    return {
       data : bindData,
        method:{
            getItems:function () {
                items=[];
                if(localStorage.items){
                    items=JSON.parse(localStorage.items);
                }
                return items;
            }

        },
        computed: {
        total: function() {
            tot=0;
            for(i in this.items){
                tot+=(this.items[i].qty*this.items[i].price);
            }
            return tot;
        },
        watch:{
            items: function (val, oldVal) {
                consol.log(val);
                localStorage.items=JSON.stringify(val);
            }
            
        }
    }
    }
})()
