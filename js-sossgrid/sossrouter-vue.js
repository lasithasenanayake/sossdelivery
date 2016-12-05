(function (w){

    var pInstance = w.SOSSGRID.getPlugin ("routes");
    

    var exports = {
        inject: function (data, cb){
            var routeSettings = pInstance.getSettings();
            var renderDiv = $("#" + routeSettings.routes.renderDiv);
                    
            renderDiv.html(data["partial.html"]);

            var vueData
            eval ("vueData = " + data["script.js"]);
            console.log (vueData);
            vueData.el = '#' + routeSettings.routes.renderDiv;

            var app = new Vue(vueData);

            cb (data);
        }
    };
    pInstance.configure ("inject-engine", exports);
})(window)