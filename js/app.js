var url="http://"+window.location.hostname+":9000/";
var domain=window.location.hostname;
var routes = {
    renderDiv: "idRenderDiv",
    home : "/home",
    notFound: "/notFound",
    partials : {
        "/home" : "home",
        "/notFound" : "404",
        "/default" : "home",
        "/about" : "about",
        "/cart" : "cart",
        "/services":"services",
        "/user":"user",
        "/item":"item",
        "/products" : "products",
        "/admin" : "admin",
        "/admin-allproducts" : "admin-allproducts",
        "/admin-productform" : "admin-productform",
        "/admin-allcategories" : "admin-allcategories",
        "/admin-categoryform" : "admin-categoryform"
    }
};

SOSSGRID.routes.set (routes);

function GetItemCount(){
  var itemsCount=0;
  if(localStorage.items){
    items=JSON.parse(localStorage.items);
    this.itemcount=0;
    for(i in items){
          itemsCount+=items[i].qty
    }
  }
  return itemsCount;
}

mycart=new Vue({
  el: '#header-cart',
  data:{itemcount:GetItemCount()},
  methods: {
    additems: function (items) {
      toastr.success('Item has been added to the cart successfully', 'Delivery Cart');
      this.itemcount=GetItemCount();
    }
  }
})


prodCategories=new Vue({
  el: '#idProdCategories',
  data:{categories:[]},
  methods: {
    load: function (items) {
      var self = this;

      SOSSGRID.callRest("apis/products/categories/all")
      .success(function(result){
        for (var i=0;i<result.response.length;i++)
          self.categories.push(result.response[i]);
        
      })
      .error(function(){
 
      });
    }
  }
})
prodCategories.load();

login=new Vue({
  el: '#header-login',
  data:{isLogin:false,
    email:"",
    name:"",
    profileurl:"",password:""  
},
    
  methods: {
    checkSession(){
      var session=getCookie("sosskey");
       
       var self = this;
      if(session!=""){
          SOSSGRID.callRest(url+"getsession/"+session)
          .success(function(result){
              var passhash = CryptoJS.MD5(result.email);
              self.profileimage = "https://www.gravatar.com/avatar/" + passhash+"?s=200&r=pg&d=mm";
              self.userid=result.userid;
              self.email=result.email;
              self.name=result.email;
              self.isLogin=true;
              self.password="";
              console.log(result); 
              console.log("result");

          })
          .error(function(){
              this.isLogin=false;
              self.password="";
              toastr.error('Session is not valied.', 'Security!');
            
          });
     }
      //console.log(session);
    },
    login: function () {
       //this.isLogin=true;
      var self = this;
      SOSSGRID.callRest(url+"login/"+this.email+"/"+this.password+"/"+domain)
      .success(function(result){
          var passhash = CryptoJS.MD5(result.email);
          self.profileimage = "https://www.gravatar.com/avatar/" + passhash+"?s=200&r=pg&d=mm";
          self.userid=result.userid;
          self.email=result.email;
          self.name=result.email;
          self.isLogin=true;
          self.password="";
          console.log(result); 
          console.log("result"); 
          SOSSGRID.callRest("http://en.gravatar.com/"+self.email+".json")
              .success(function(result){
                self.profileurl=result.thumbnailUrl;
            })
          .error(function(){
              //this.isLogin=false;
              //self.password="";
              //toastr.error('please update your profile pic on gravatar.', 'profile!');
              console.log("No Profile pic");
            
          }); 
      })
      .error(function(){
           this.isLogin=false;
          self.password="";
          toastr.error('email and password is incorrect.', 'Security!');
         
      });

      SOSSGRID.onError(function(error){
           toastr.error(error, 'Security!');
      });
    }
  }
})

login.checkSession();