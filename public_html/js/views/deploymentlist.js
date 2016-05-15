app.DeploymentListView = Backbone.View.extend({
  className:'row',
 
   initialize:function () {
        var self = this;
        this.model.on("reset", this.render, this);
        this.model.on("add", function (deployment) {
            self.$el.append(new app.DeploymentListItemView({model:deployment}).render().el);
        });
        //Añadido para actualizar la vista tras eliminar un elemento:
        this.model.on('remove', this.render, this);
    },
       
    render:function () {
        this.$el.empty();    
        _.each(this.model.models, function (deployment) {
            this.$el.append(new app.DeploymentListItemView({model:deployment}).render().el);
        }, this);
        return this;
    },
    
    renderId: function (id) {
        //this.$el.empty();
        this.$el.html(this.template);
        _.each(this.model.models, function (deployment){
            if (deployment.get("codeId") === id){
                this.$el.append(new app.DeploymentListItemView({model:deployment}).render().el);
                //Renderizamos únicamente aquellos despliegues asociados al 
                //código consultado.
            }
      }, this);
      return this;
    }

});

app.DeploymentListItemView = Backbone.View.extend({
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

