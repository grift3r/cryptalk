/*

	Accepts:
		mediator.on('command:join', ...);
		mediator.on('command:leave', ...);
		mediator.on('command:key', ...);

	Emits:
		mediator.emit('room:changed',...);
		mediator.emit('console:error',...);
		mediator.emit('socket:emit',...);

*/

define(
	{
		compiles: ['$'],
		requires: ['castrato','settings','templates']
	}, function ($, requires, data) { 

	var 

		// Private properties
		room=false,

		// Require shortcuts
		mediator = requires.castrato,
		settings = requires.settings,
		templates = requires.templates,

		join = function(payload) {
			if (room !== false) {
				mediator.emit('console:error',$.template(templates.messages.already_in_room, { room: room }));
			} else {
				room = payload;
				mediator.emit('room:changed', room );
				mediator.emit('socket:emit',{ data: 'room:join' , payload: $.SHA1(room) } );
			}
		},

		leave = function() {
			if (room !== false) {
				mediator.emit('socket:emit',{ data: 'room:leave' , payload: $.SHA1(room) } );
				room = false;
			} else {
				mediator.emit('console:error',templates.messages.leave_from_nowhere);
			}
		},

		count = function() {
			if (room) {
				mediator.emit('socket:emit','room:count');
			} else {
				mediator.emit('console:error', templates.messages.not_in_room);
			}
		};

	// Connect events
	mediator.on('command:join', join);
	mediator.on('command:leave', leave);
	mediator.on('command:count', count);
	
});