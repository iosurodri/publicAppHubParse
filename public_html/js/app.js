var app = {

    views: {},

    models: {},
    

    loadTemplates: function(views, callback) {

        var deferreds = [];

        $.each(views, function(index, view) {
            if (app[view]) {
                deferreds.push($.get('tpl/' + view + '.html', function(data) {
                    app[view].prototype.template = _.template(data);
                }, 'html'));
            } else {
                alert(view + " not found");
            }
        });

        $.when.apply(null, deferreds).done(callback);
    }

};

app.Router = Backbone.Router.extend({

    routes: {
        //Funciones que se ejecutarán tras concatenar las rutas indicadas a 
        //nuestra URL (tras el '#'):
        "":                 "showAllApps", //La función showAllApps() se
            //ejecuta al cargar la URL por defecto.
        "categories/:category": "showCategoriesApps",
        "apps/:id":    "detallesApp", //La función detallesApp() se
            //ejecutará si añadimos a la URL la dirección /apps/nuestroId
            //donde nuestroId será cualquier ID perteneciente a una de nuestras
            //apps.
        "codes/:id":    "detallesCode",
        "deployments/:id": "detallesDeployment",
        "newApp":     "addNewApp", //La función newApp() se ejecutará si el 
            //cliente desea añadir una nueva App al hub.
        "newCode/:id":    "addNewCode",
        "newDeployment/:id": "addNewDeployment"
    },

    initialize: function () {  //Definimos la función initialize
      app.allApps = new app.ApplicationCollection(); //Crea un objeto
        //ApplicationCollection.
      app.allCodes = new app.CodeCollection(); 
      app.allDeployments = new app.DeploymentCollection();
        
      app.theHeaderView = new app.HeaderView(); //Creamos un objeto
        //HeaderView que se encargará de mantener la cabecera de la aplicación.
      $('.header').html(app.theHeaderView.el);
      this.$content = $("#content");
    },

    showAllApps: function () {
      app.allApps.fetch({reset:true});
      
      //AÑADIDO FETCH()
      app.allCodes.fetch({reset:true});
      
      this.$content.html(new app.ApplicationListView(
                         {model: app.allApps}).render().el);
      app.theHeaderView.selectMenuItem('');
    },
    
    //SHOW ALL CODES:
    showAllCodes: function (id) {
        app.allCodes.fetch({reset:true});
        
        this.$code.html(new app.CodeListView(
                {model: app.allCodes}).renderId(id).el);
    },
    
    showCategoriesApps: function (category) {
        app.allApps.fetch({reset:true});
        this.$content.html(new app.ApplicationListView(
                {model: app.allApps}).renderCategory(category).el);
        app.theHeaderView.selectMenuItem('');
    },
    
    detallesApp: function (id) {
        var myApp = app.allApps.get(id); //CAMBIADO app por myApp
        var self = this;        
        myApp.fetch({
            //Si el fetch se realiza con éxito, el contenido del html carga una 
            //nueva vista que representa los datos del modelo.
            
            success: function (data) {                
                self.$content.html(new app.ApplicationView({model: data}).render().el);              
            }
        });
        app.allCodes.fetch({reset:true});
        //$("#code").html(new app.CodeListView({model: app.allCodes}).renderId(id).el);
        //app.allCodes.fetch({reset:true});
        this.$content.append(new app.CodeListView({model: app.allCodes}).renderId(id).el);
        app.theHeaderView.selectMenuItem('');
    },
    
    detallesCode: function (id) {
        var myCode = app.allCodes.get(id);
        var self = this;
        myCode.fetch({
            success: function (data) {
                self.$content.html(new app.CodeView({model: data}).render().el);
            }
            
        });
        app.allDeployments.fetch({reset:true});
        this.$content.append(new app.DeploymentListView({model: app.allDeployments}).renderId(id).el);
    },
    
    detallesDeployment: function (id) {
        var myDeployment = app.allDeployments.get(id);
        var self = this;
        myDeployment.fetch({
            success: function (data) {
                self.$content.html(new app.DeploymentView({model: data}).render().el);
            }
        });
    },
    
    addNewApp: function (id) {
       
        if (!this.formView) {
            this.formView = new app.newAppView();
        }
        this.$content.html(this.formView.el);
        app.theHeaderView.selectMenuItem('newApp-menu');
        
    },
    
    submit: function() {
        var name = $("input[name=name]").val();
        var description = $("textarea[name=description]");
        var category = $("input[name=category]:checked").val(); 
        var img1 = document.querySelector('img[id=img1]');        
        var img2 = document.querySelector('img[id=img2]');        
        var img3 = document.querySelector('img[id=img3]');        
        
        var newApp = new app.Application();
        newApp.set("name", name);
        newApp.set("description", description.val());
        newApp.set("category", category);
        newApp.set("img1", img1.src);
        newApp.set("img2", img2.src);
        newApp.set("img3", img3.src);
        
        app.allApps.create(newApp);
        
        var myForm = document.getElementById('newAppForm');
        myForm.reset(); //Reseteamos el formulario para futuros usos.
        img1.src = "";
        img2.src = "";
        img3.src = "";
        
        app.router.navigate("", {trigger: true}); //Esta función devuelve al 
            //usuario a la página principal una vez que ha realizado la 
            //adición de la nueva Application.
    },
    
    preview: function(inputi, imgi){
        
        var previewImg = document.querySelector('img[id='+imgi+']');
        var inputFile = document.querySelector('input[id='+inputi+']').files[0];
        var reader = new FileReader();
        
        reader.onloadend = function(){
            previewImg.src = reader.result;
        }
        
        if (inputFile){
            reader.readAsDataURL(inputFile);
        }
        else{
            previewImg.src ="";
        }
        
    },
    
    remove: function(id){
        var resultado = new app.Application();
        resultado = app.allApps.get(id);
        resultado.destroy();
    },
    
    removeCode: function(id){
        var resultado = new app.Code();
        resultado = app.allCodes.get(id);
        resultado.destroy();
    },
    
    addNewCode: function (id) {
       
        if (!this.codeView) {
            this.codeView = new app.newCodeView();
        }
        this.$content.html(this.codeView.el);
        
    },
    
    addNewDeployment: function (id) {
       
        if (!this.deploymentView) {
            this.deploymentView = new app.newDeploymentView();
        }
        this.$content.html(this.deploymentView.el);
        
    },
    
    submitCode: function (id) {
        var codeName = $("input[name=codeName]").val();
        var service = $("input[name=service]").val();
        var author = $("input[name=author]").val();
        var codeLocation = $("input[name=codeLocation]").val();
        var platform = $("input[name=platform]:checked").val();
        
        var newCode = new app.Code();
        newCode.set("codeName", codeName);
        newCode.set("service", service);
        newCode.set("author", author);
        newCode.set("codeLocation", codeLocation);
        newCode.set("platform", platform);
        newCode.set("appId", id); //Fijamos el id de la aplicación a la que
            //pertenece, en nuestro código. Más tarde, podremos mostrar para 
            //cada app, aquellos códigos que estén asociados a la misma, de
            //entre todos los existentes en la colección allCodes.
        
        app.allCodes.create(newCode); //IMPORTANTE: Obtener el
            //de la aplicación a la que pertenece el código.
            //CAMBIO DE PLANES: Creamos una única colección donde guardar todos
            //los códigos, filtrándolos por el appId de la aplicación padre.
        
        var myForm = document.getElementById('newCodeForm');
        myForm.reset(); //Reseteamos el formulario para futuros usos.
        
        app.router.navigate("", {trigger: true}); //Esta función devuelve al 
            //usuario a la página principal una vez que ha realizado la 
            //adición de la nueva Application.
    },
    submitDeployment: function (id) {
        var deploymentName = $("input[name=deploymentName]").val();
        var associatedCode = $("input[name=associatedCode]").val();        
        var URL = $("input[name=URL]").val();
        //var country = $("#country").options[selects.selectedIndex].text;
        var country = $("#country").name;
            //Obtenemos el valor escogido en el select.
        //var region = $("#crs-region").options[selects.selectedIndex].text;
        var region = $("#region").name;
        var empresa = $("input[name=empresa]").val();
        
        var newDeployment = new app.Code();
        console.log("Nombre del despliegue: " + deploymentName);
        newDeployment.set("deploymentName", deploymentName);
        console.log("Código asociado: " + associatedCode);
        newDeployment.set("associatedCode", associatedCode);
        console.log("URL: " + URL);
        newDeployment.set("URL", URL);
        console.log("País: " + country);
        newDeployment.set("country", country);
        console.log("Región: " + region);
        newDeployment.set("region", region);
        console.log("Empresa. " + empresa);
        newDeployment.set("empresa", empresa);
        console.log("ID de código: " + id);
        newDeployment.set("codeId", id);
        
        app.allDeployments.create(newDeployment); //IMPORTANTE: Obtener el
            //de la aplicación a la que pertenece el código.
            //CAMBIO DE PLANES: Creamos una única colección donde guardar todos
            //los códigos, filtrándolos por el appId de la aplicación padre.
        
        var myForm = document.getElementById('newDeploymentForm');
        myForm.reset(); //Reseteamos el formulario para futuros usos.
        
        app.router.navigate("", {trigger: true}); //Esta función devuelve al 
            //usuario a la página principal una vez que ha realizado la 
            //adición de la nueva Application.
    }
});


$(document).on("ready", function () {
    Parse.initialize("publicAppHubParse", "unused");
    Parse.server = 'https://publicapphubparse.herokuapp.com/';
    app.loadTemplates(["newAppView","HeaderView", "ApplicationListItemView", 
        "ApplicationView", "newCodeView", "CodeView", "CodeListItemView", 
        "DeploymentListItemView", "DeploymentView", "newDeploymentView"],
        function () {
            app.router = new app.Router();
            Backbone.history.start();
        });
});