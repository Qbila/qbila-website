exports.register = function(server, options, next) {
	server.route([
		{
		  method: 'GET',
		  path: '/',
		  config: { auth: false },
		  handler: function(request, reply){
				reply.view('infoIndex/index', {title : 'Welcome to Qbila'}, {layout: 'layout'});
		  }
		}
	]);

	next();
};


/**
 * Plugin attributes...
 * we have here the Name and the Version of the plugin
 */
exports.register.attributes = {
	name : 'infoIndex',
	version : '1.0.0'
};
