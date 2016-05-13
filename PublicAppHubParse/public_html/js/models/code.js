app.Code = Backbone.Model.extend({

   className: "code",
   _parse_class_name: "code",
       
    initialize:function () {
    },
     
    defaults: {
       
        codeName: "", 
        service: "", 
        author: "", 
        location: "", 
        platform: "",
        appId: "" //Id que identifica a su modelo padre, de modo que podamos
            //mostrar los códigos asociados a una app concreta, de entre todos
            //los existentes.
    }
  
});

app.CodeCollection = Backbone.Collection.extend({

    model: app.Code,
    _parse_class_name: "codeCollection"
    
    //localStorage: new Backbone.LocalStorage('code-backbone')
            
  
});

