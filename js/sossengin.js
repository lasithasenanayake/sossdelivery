var url="http://localhost:9000/";

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length,c.length);
        }
    }
    return "";
} 


function login(email,password){
    $.ajax({url: url+"login/"+this.email+"/"+this.password+"/localhost", xhrFields: {withCredentials: true},
          contentType: "application/json",success: function(result){
          return  result;
          //console.log("result"); 
      },error: function (jqXHR, exception){
          /*this.isLogin=false;
          self.password="";
          toastr.error('email and password is incorrect.', 'Security!');
          console.log(exception);
           console.log(jqXHR.status);*/

           handleError("Authentication Exception!!!!", exception);
      }})
}

function handleError(message, ex){
    
}