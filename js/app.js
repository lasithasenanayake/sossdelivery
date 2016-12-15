var url="http://localhost:9000/";
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
        "/admin-productform" : "admin-productform"
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
              self.userid=result.userid;
              self.email=result.email;
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
          self.userid=result.userid;
          self.email=result.email;
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