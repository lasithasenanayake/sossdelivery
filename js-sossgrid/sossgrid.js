(function (w){
    var settings = {
        plugins: {}
    };

    var onErrorCallback, statusChangeCallback, currentState = "IDLE";

    function changeState(state, msg){
        if (statusChangeCallback)
            statusChangeCallback({state: currentState, message: msg});
    }

    function AjaxRequestor(url){
        var sendObj;
        var sf, ef;
        var retries = 1;

        function issueRequest(){
            changeState ("BUSY");
            $.ajax(sendObj);
        }

        function errorFunc(){
            retries++;
            if (retries ==3){
                changeState ("IDLE");
                ef();
            }
            else 
                issueRequest();
        }

        function successFunc(data){
            changeState ("IDLE");
            sf (data);
        }

        function callRest(){
            if (!sf || !ef) return;

            if (typeof (url) === "string"){
                sendObj = {
                    url: url,
                    xhrFields: {withCredentials: true},
                    contentType: "application/json",
                    success: successFunc,
                    error: errorFunc
                }
            }else{
                sendObj = url;
                sendObj.success = successFunc;
                sendObj.error = errorFunc;
            }

            issueRequest();
        }

        
        return {
            success: function (f){ sf = f; callRest(); return this;},
            error: function(f){ ef = f; callRest(); return this;}
        }
    }


    w.SOSSGRID = {
        registerPlugin: function(p){
            this[p.name] = p;
            settings.plugins[p.name] = p;
        },
        getPlugin: function(n){
            return settings.plugins[n];
        },
        callRest: function (url, params){
            return new AjaxRequestor(url, params);
        },
        onStatusChange: function(scf){
            statusChangeCallback = scf;
        },
        onError: function (onf){
            onErrorCallback = onf;
        },
        changeState: changeState
    };

    w.onload  = function(){
        for (pk in settings.plugins)
            if (settings.plugins[pk].onLoad)
                settings.plugins[pk].onLoad();
    }

})(window);