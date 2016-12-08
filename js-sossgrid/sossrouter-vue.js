(function (w){

    var pInstance = w.SOSSGRID.getPlugin ("routes");
    

    var exports = {
        inject: function (data, cb){
            try {
                var routeSettings = pInstance.getSettings();
                var renderDiv = $("#" + routeSettings.routes.renderDiv);
                        
                renderDiv.html(data["partial.html"]);

                var vueData;
                eval ("vueData = " + data["script.js"]);
                vueData.el = '#' + routeSettings.routes.renderDiv;

                var app = new Vue(vueData);
                if (vueData.onReady)
                    vueData.onReady(app);
                cb (data);
            } catch (e){
                console.log ("Error Occured While Loading...");
                console.log (e);
                cb();
            }
        }
    };
    pInstance.configure ("inject-engine", exports);
})(window)