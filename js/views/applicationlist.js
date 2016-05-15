app.ApplicationListView = Backbone.View.extend({
  className:'row',
 
   initialize:function () {
        var self = this;
        this.model.on("reset", this.render, this);
        this.model.on("add", function (application) {
            self.$el.append(new app.ApplicationListItemView({model:application}).render().el);
        });
        //Añadido para actualizar la vista tras eliminar un elemento:
        this.model.on('remove', this.render, this);
    },
       
    render:function () {
        this.$el.empty();    
        _.each(this.model.models, function (application) {
            this.$el.append(new app.ApplicationListItemView({model:application}).render().el);
        }, this);
        return this;
    },
    
    renderCategory: function(nombre) {
        this.$el.empty();
        _.each(this.model.models, function (application) {
            var newApp = new app.ApplicationListItemView({model:application});
            if (newApp.model.get("category") === nombre){
                this.$el.append(newApp.render().el);
            }
        }, this);
        return this;
    }
});

app.ApplicationListItemView = Backbone.View.extend({
 className:'col-md-4',

  initialize:function () {
    },
  render:function () {
        var data = _.clone(this.model.attributes); //Pasamos una copia de 
            //model.attributes al template, porque parse.com no permite el envío
            //de los datos directos.
        data.id = this.model.id;
        this.$el.html(this.template(data));
        return this;
    }
});