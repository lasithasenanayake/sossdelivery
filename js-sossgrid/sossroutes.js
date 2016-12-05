(function (w){

    var currentRoute;
    
    var settings = {
        routes: {}
    };

    w.onhashchange =  function(url){
        navigate(url);
    };


    function browserNavigate (route){
        var mainUrl = location.protocol+'//'+location.host+location.pathname+(location.search?location.search:"");
        var hashUrl = mainUrl + "#"  + route;
        window.location.href = hashUrl;  
    }


    function navigate(url){

        if (!url){
            browserNavigate(settings.routes.home);
            return;
        }
        var hi = url.newURL.indexOf ("#");
        var ohi = url.oldURL.indexOf ("#");

        var partialToDownload;
        if (hi !=-1){
            var toUrl = url.newURL.substring(hi +1);
            var fromUrl = url.oldURL.substring(ohi +1);


            var qi = toUrl.indexOf ("?");
            
            if (qi !=-1){
                qparams = toUrl.substring (qi + 1);
                toUrl = toUrl.substring(0,qi);

                var paramList = qparams.split ("&");
                if (!dataBag[toUrl]) dataBag[toUrl] = {};

                for (pi in paramList){
                    var kv =  paramList[pi].split ("=");                    
                    dataBag[toUrl][kv[0]] = kv.length == 1 ? undefined : kv [1];
                }

            } 

            currentRoute = toUrl;

            if (settings.routes.partials)
                partialToDownload = settings.routes.partials[toUrl];
            
        }else{
            if (settings.routes)
            if (settings.routes.home){
                browserNavigate(settings.routes.home);
            }            
        }

        if (!partialToDownload){
            if (settings.routes.notFound && settings.routes.partials){
                partialToDownload = settings.routes.partials[settings.routes.notFound];
            }
        }

        if (!partialToDownload){
            alert ("Not Found at all!!!");
        } else {
            if (typeof partialToDownload === "string")
                partialToDownload = {
                    partial: partialToDownload,
                    persist: false
                }
            injectPartial (partialToDownload);
        }

    }

    function injectPartial(partial){
        downloadPartials(partial, function(data){
            if (settings["inject-engine"]){
                var ie = settings["inject-engine"];
                ie.inject(data, function(){
                    //console.log (data);
                });
            }
        })
    }

    function downloadPartials(pObj, cb){
        var downloadArray = ["partial.html", "script.js"]

        var di=-1;
        var downloadedFiles = {};
        function nextDownload (){
            di++;
            
            if (downloadArray.length === di){
                cb (downloadedFiles);
            }else{
                var fileName = downloadArray[di];
                downloadOne (pObj.partial,fileName,  function (data){
                    downloadedFiles[fileName] = data;    
                    nextDownload();
                });
            }
        }

        function downloadOne (partial, file, cb){
            var promise = $.ajax({
                url: "partials/" + partial + "/" + file
            });
            
            promise.done(function (data){
                cb (data);
            });
            promise.fail(function (){
                cb (null);
            });
        }

        nextDownload ();
    }


    var dataBag = {

    }

    function initialNavigate(){
        var hashLoc = window.location.href.indexOf("#")
        if (hashLoc != -1){
            var routeToNavigate = window.location.href.substr(hashLoc);
            navigate ({
                newURL: routeToNavigate,
                oldURL: routeToNavigate
            });
        }else navigate();
    }

    var exports = {
        name: "routes",
        onLoad: initialNavigate,
        sendMessage: function (m){

        },
        set: function (r){
            settings.routes = r;
        },
        configure: function (k, v){
            settings [k] = v;
        },
        getSettings: function(){
            return settings;
        },
        navigate : function (route, data){
            dataBag[route] = data;
            browserNavigate("route");
        },
        getInputData : function (){
            return (dataBag && currentRoute) ? dataBag[currentRoute] : undefined;;
        }
    }

    w.SOSSGRID.registerPlugin (exports);

})(window)