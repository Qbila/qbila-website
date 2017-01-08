'use strict';

const Hapi = require('hapi');
// const Mongoose = require('mongoose');
// const env = require('env2')('./config.env');
// var Request = require('request');

global.SERVER = new Hapi.Server();

// global.QBILA_WEBSITE = 'http://' + process.env.QBILA_WEBSITE_LOCAL_HOST  + ':' + process.env.QBILA_WEBSITE_LOCAL_PORT;

SERVER.connection({
  host: '127.0.0.1',
  port: '1337'
});

// language for api and status messages. to be made configurable later. Can be used for changing user's language. Hardcoded to be English.
global.QBILA_WEBSITE = {
  lang: 'en'
};

// // Mongoose.connect('mongodb://' + process.env.DB_HOST + ':' + process.env.DB_PORT + '/' + process.env.DB_DB);
// Mongoose.connect('mongodb://localhost:' + process.env.DB_PORT + '/' + process.env.DB_DB);
// var db = Mongoose.connection;
//
// db.on('error', console.error.bind(console, 'connection error'));
// db.once('open', function callback() {
//   console.log("Connection with database succeeded");
// });

const Inert = require('inert');
const Joi = require('joi');
const Vision = require('vision');
const Path = require('path');
const HapiSwagger = require('hapi-swagger');

/**
 * Routing Static Pages [JS, Css, Images, etc]
 */
SERVER.register(Inert, function(err) {

  if (err) {
		throw err;
	}

	SERVER.route({
		method : 'GET',
    path : '/public/{path*}',
    config: { auth: false },
    handler : {
			directory : {
				path : Path.join(__dirname, './public'),
				listing : false,
				index : false
			}
		}
	});

});

var hapiSwaggerOptions = {
  'info': {
    'title': 'API Documentation',
    'version': '1.0.0',
    'contact': {
        'name': 'Ashish Rana',
        'email': 'deviced.in@gmail.com'
    },
  }
}

/**
 * Register all Modules as Plugins Here
 */
var plugins = [
	{ register : require('vision') },
	{ register : require('./modules/infoIndex/index.js') },
  { register : HapiSwagger, options: hapiSwaggerOptions },
];


// /**
//  * Routing Views
//  */
SERVER.register(
  plugins,
  function (err) {
    if (err) {
        throw err;
    }

    SERVER.views({
      engines: { html: require('handlebars') },
		  layout : true,
      path: __dirname + '/views',
      layoutPath : Path.join(__dirname, './views/layouts'), //setting Global Layout,
  		partialsPath : Path.join(__dirname,'./partials') //partial Views
    });

  	/**
  	 * Default route
  	 */
});


// Request life cycle Extension points : onRequest, onPreAuth, onPostAuth, onPreHandler, onPostHandler, onPreResponse
SERVER.ext('onPreAuth', function(request, reply) {
  // give control back to the SERVER and continue the request life cycle

  if (request.route.path != '/public/{path*}') {
    // console.log(request.path);
    // this is most likely a service request
  }

  reply.continue();
});



SERVER.ext('onPreResponse', function(request, reply){

  if (request.route.path != '/public/{path*}' ) {

  }

  reply.continue();
});



SERVER.start(function(err){
  if(err){
    throw err;
  }

  console.log('SERVER running at ', SERVER.info.uri)
});
