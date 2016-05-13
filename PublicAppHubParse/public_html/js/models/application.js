app.Application = Backbone.Model.extend({

   className: "application",
   _parse_class_name: "application",
       
    initialize:function () {

    },
     
    defaults: {
       
        name: "", //Nombre de la app.
        category: "", //Categoría a la que pertenece la app.
        description: "", //Descripcion textual de la app.
        img1: "", //Descripción visual de la app: conjunto de imágenes.
        img2: "",
        img3: "",
        appId: "" //Id de la aplicación que servirá para identificar qué
            //códigos renderizamos al querer mostrar códigos de 
        //app.allApps.get(id).model.get("name");
    }
  
});

app.ApplicationCollection = Backbone.Collection.extend({

    model: app.Application,
    _parse_class_name: "ApplicationCollection"
    
    //localStorage: new Backbone.LocalStorage('apps-backbone')
            
  
});