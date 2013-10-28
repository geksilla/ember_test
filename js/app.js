App = Ember.Application.create({
  LOG_TRANSITION: true
});

// ROUTER

App.Router.map(function() {
  this.resource('books', function(){
    this.resource('book', { path: ':book_id' });
  });
  this.resource('authors', function(){
    this.resource('author', { path: ':author_id' })
  });
});

App.Store = DS.Store.extend({
  adapter: DS.RESTAdapter.extend()
});

// ROUTES

App.IndexRoute = Ember.Route.extend();

App.BooksRoute = Ember.Route.extend({
  model: function() {
    var store, dLoader;
    store = this.get('store');
    dLoader = App.DataFill;
    dLoader.loadToStore(store, 'author');
    dLoader.loadToStore(store, 'book');
    return dLoader.simpleJSON('book');
  }
});

App.BookRoute = Ember.Route.extend({
  model: function(params) {
    return this.get('store').find('book', params.book_id);
  },
  setupController: function(controller, model) {
    var store;
    store = this.get('store')
    controller.set('model', store.find('book',model.id));
  }
  // authors: function(){
  //   return this.get('model').get('authors');
  // }.property()
});

App.AuthorsRoute = Ember.Route.extend({
  model: function() {
    var store, dLoader;
    store = this.get('store');
    dLoader = App.DataFill;
    dLoader.loadToStore(store, 'author');
    dLoader.loadToStore(store, 'book');
    return dLoader.simpleJSON('author');
  }
});

App.AuthorRoute = Ember.Route.extend({
  model: function(params) {
    return this.get('store').find('author', params.author_id);
  },
  setupController: function(controller, model) {
    var store;
    store = this.get('store');
    controller.set('model', store.find('author', model.id));
  }
});


// CONTROLLERS

App.IndexController = Ember.ObjectController.extend();

App.BookController = Ember.ObjectController.extend();

// MISC

App.DataFill = Ember.Object.extend();

App.DataFill.reopenClass({
  baseUrl: "https://dl.dropboxusercontent.com/u/73928805/",
  plural: function(string) {
    return Ember.String.pluralize(string);
  },
  loadToStore: function(store, name) {
    var name = name;
    var store = store;
    Ember.$.getJSON(this.baseUrl+this.plural(name)+'.json').then(function(data){
        data.forEach(function(item) {
          store.push(name, item);
        });
    });
  },
  simpleJSON: function(name) {
    return Ember.$.getJSON(this.baseUrl + this.plural(name) + '.json');
  }
});

// MODELS

App.Author = DS.Model.extend({
  first_name: DS.attr('string'),
  last_name: DS.attr('string'),
  biography: DS.attr('string'),
  full_name: function() {
    return this.get('first_name')+' '+this.get('last_name');
  }.property('first_name','last_name'),
  books: DS.hasMany('book', { async: true })
});

App.Book = DS.Model.extend({
  name: DS.attr('string'),
  description: DS.attr('string'),
  image: DS.attr('string'),
  authors: DS.hasMany('author', { async: true })
});

// FIXTURES

// App.Book.FIXTURES = [
//   {
//     "id": 1,
//     "name": "Sinatra: Up and Running",
//     "description": "Take advantage of Sinatra, the Ruby-based web application library and domain-specific language used by GitHub, LinkedIn, Engine Yard, and other prominent organizations. With this concise book, you will quickly gain working knowledge of Sinatra and its minimalist approach to building both standalone and modular web applications.<br><br>Sinatra serves as a lightweight wrapper around Rack middleware, with syntax that maps closely to functions exposed by HTTP verbs, which makes it ideal for web services and APIs. If you have experience building applications with Ruby, you'll quickly learn language fundamentals and see under-the-hood techniques, with the help of several practical examples. Then you'll get hands-on experience with Sinatra by building your own blog engine.<br><ul><li>Learn Sinatra's core concepts, and get started by building a simple application</li><li>Create views, manage sessions, and work with Sinatra route definitions</li><li>Become familiar with the language's internals, and take a closer look at Rack</li><li>Use different subclass methods for building flexible and robust architectures</li><li>Put Sinatra to work: build a blog that takes advantage of service hooks provided by the GitHub API</li></ul>",
//     "authors": ["2","3"]
//   },
//   {
//     "id": 2,
//     "name": "IronPython",
//     "description": "<p>IronPython represents a unique direction for developers interested in working with dynamic languages within the .NET Framework. Whether you’re looking to develop applications from scratch or add functionality and maintainability to an existing application, IronPython opens many doors while providing a high–speed, high–performance language that integrates tightly with other .NET languages.</p> <ul>     <li>Learn to create applications using the benefits of a dynamically typed language. </li>     <li>Discover how to leverage the power of IronPython to improve existing applications. </li>     <li>Explore interacting with other .NET languages by invoking the common language runtime. </li> </ul> <h3>Table of Contents</h3><ol>     <li>Introduction to IronPython </li>     <li>IronPython Syntax </li>     <li>Advanced IronPython </li>     <li>IronPython Studio </li>     <li>Mixing and Mingling with the CLR </li>     <li>Advanced Development </li>     <li>Data Manipulation </li>     <li>Caught in a Web </li>     <li>IronPython Recipes </li> </ol>",
//     "authors": ["3"]
//   },
//   {
//     "id": 3,
//     "name": "Instant Ember.js Application Development",
//     "description": "<p><b>In Detail</b></p> <p>Ember.js is a frontend web development framework that organizes your JavaScript into clean, reusable code. With its powerful tools and concepts at your disposal you can create large scale web applications that rival native applications.</p> <p>No matter how big your application gets, Ember.js makes your code manageable.</p> <p>\"Instant Ember.js Application Development: How-to\" is a practical guide that provides you with clear step-by-step examples. The in-depth examples take into account the key concepts and give you a solid foundation to expand your knowledge and your skills.</p> <p>That will help you utilize the power of Ember.JS in your applications.</p> <p>As you progress through the initial examples you will begin to develop an understanding of how Ember.js organizes your frontend development. Reading further you will see how the Model-View-Controller architecture (MVC) is incorporated into Ember.js. We'll guide you through the basics of Handlebars HTML templates, before finally diving into how routing works within an application and how the state of the application changes as the user interacts with it.</p> <p>Instant Ember.js Application Development: How-to will teach you to build ambitiously large web applications with practical examples.</p> <p><b>What you will learn from this book</b></p> <ul> <li>Determine where and how to incorporate Ember.js.</li> <li>Get to know the MVC architecture.</li> <li>Create an Ember model, view, and controller.</li> <li>Define semantic Handlebars HTML templates.</li> <li>Enhance Ember.js models with computed properties and bindings.</li> <li>Import external data into an Ember.js application.</li> <li>Build a router for your application.</li> </ul> <p><b>Approach</b></p> <p>Filled with practical, step-by-step instructions and clear explanations for the most important and useful tasks. Get the job done and learn as you go. A how-To book with practical recipes accompanied with rich screenshots for easy comprehension.This book follows a recipe-based approach that can be used both for problem solving or getting started with Ember.js. Regardless of your skill level you should find this book useful and beneficial to any of your application development projects.</p> <p><b>Who this book is written for</b></p> <p>Are you a frontend developer whose code has gotten out of control? This book will also show you how you can use Ember.js to make your web application easy to manage as it increases in complexity. Even if you've never used Ember.js before, but have HTML and JS skills, this guide will help you get up to speed in no time.</p>",
//     "authors": ["1"]
//   }
// ];

// App.Author.FIXTURES = [
//   {
//     "id": 1,
//     "first_name": "Marc",
//     "last_name": "Bodmer",
//     "foo": "bar"
//   },
//   {
//     "id": 2,
//     "first_name": "Konstantin",
//     "last_name": "Haase",
//     "foo": "bar"
//   },
//   {
//     "id": 3,
//     "first_name": "Alan",
//     "last_name": "Harris",
//     "foo": "bar"
//   }
// ];

