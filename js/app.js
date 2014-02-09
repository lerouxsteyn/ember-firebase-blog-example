var App = Ember.Application.create();

App.ApplicationAdapter = DS.FirebaseAdapter.extend({
	firebase: new Firebase("https://popping-fire-4502.firebaseio.com")
});

App.Router.map(function() {
	this.resource('blog', function() {
    	this.resource('post', { path: ':slug/:id' });
  	});
});

App.IndexRoute = Ember.Route.extend({
	beforeModel: function() {
		this.transitionTo('blog');
	}
});

App.BlogRoute = Ember.Route.extend({
	model: function() {
		return this.store.find('posts');
	}
});

App.PostRoute = Ember.Route.extend({
	model: function(params) {
		return this.store.find('posts', params.id);
	}
});

App.Posts = DS.Model.extend({
	title: DS.attr('string'),
	slug: DS.attr('string'),
	date: DS.attr('date'),
	body: DS.attr('string')
});

App.PostController = Ember.ObjectController.extend({
	isEditing: false,
	actions: {
		edit: function() {
	    	this.set('isEditing', true);
		},
		doneEditing: function() {
	  		this.set('isEditing', false);
	    	this.get('model').save();
	  	}
	}
});

var showdown = new Showdown.converter();

Ember.Handlebars.helper('format-markdown', function(input) {
	return new Handlebars.SafeString(showdown.makeHtml(input));
});

Ember.Handlebars.helper('format-date', function(date) {
	return moment(date).fromNow();
});