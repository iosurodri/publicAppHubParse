app.Deployment = Backbone.Model.extend({

   className: "deployment",
   _parse_class_name: "deployment",
       
    initialize:function () {
    },
     
    defaults: {
       
        deploymentName: "", 
        associatedCode: "",
        URL: "", 
        country: "",
        region: "",
        empresa: "", 
        appId: "", //Id que identifica a su modelo padre, de modo que podamos
            //mostrar los códigos asociados a una app concreta, de entre todos
            //los existentes.
        codeId: "" //Id que identifica a su modelo padre, de modo que podamos
            //mostrar los deployments asociados a un código concreto, de entre
            //todos los existentes.
    }
});

app.DeploymentCollection = Backbone.Collection.extend({

    model: app.Deployment,
    _parse_class_name: "deploymentCollection"
    
    //localStorage: new Backbone.LocalStorage('deployment-backbone')
            
  
});