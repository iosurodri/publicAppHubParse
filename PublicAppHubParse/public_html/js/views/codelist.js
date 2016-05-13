app.CodeListView = Backbone.View.extend({
  className:'row',
 
   initialize:function () {
        var self = this;
        this.model.on("reset", this.render, this);
        this.model.on("add", function (code) {
            self.$el.append(new app.CodeListItemView({model:code}).render().el);
        });
        //Añadido para actualizar la vista tras eliminar un elemento:
        this.model.on('remove', this.render, this);
    },
       
    render:function () {
        this.$el.empty();    
        _.each(this.model.models, function (code) {
            this.$el.append(new app.CodeListItemView({model:code}).render().el);
        }, this);
        return this;
    },
    
    renderId: function (id) {
        //this.$el.empty();
        this.$el.html(this.template);
        _.each(this.model.models, function (code){
            if (code.get("appId") === id){
                this.$el.append(new app.CodeListItemView({model:code}).render().el);
                //Renderizamos únicamente aquellos códigos asociados a la 
                //aplicación consultada.
            }
      }, this);
      return this;
    }

});

app.CodeListItemView = Backbone.View.extend({
 className:'col-md-4',

  initialize:function () {

    },
  render:function () {
        var data = _.clone(this.model.attributes);
        data.id = this.model.id;
        this.$el.html(this.template(data));
        return this;
    }
});