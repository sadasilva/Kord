

window.onload = function () {
	var canvas = document.getElementById('canvas');
	var paper = new Raphael(canvas, 800, 800);
	var px;
	var py;
	var mousedown = false;
	var path;
	var pathString;
	var cursors = {};

	
	// var cursor = paper.circle(0, 0, 10).attr(
	// 	{fill: '#9cf', stroke: '#ddd', 'stroke-width': 5}
	// );
		
	$(canvas).mousedown(
		function (event) {
			mousedown = true;
			var x = event.offsetX;
			var y = event.offsetY;
			
			pathString = 'M' + x + ' ' + y + 'l0 0';
			path = paper.path(pathString);
			
			px = x;
			py = y;
		}
	);
	$(document).mouseup(
		function (event) {
			mousedown = false;
		}
	);
	$(canvas).mousemove(
		function (event) {
			if (!mousedown) return;
			var x = event.offsetX;
			var y = event.offsetY;
			
			pathString += 'l' + (x - px) + ' ' + (y - py);
			path.attr('path', pathString);
			
			px = x;
			py = y;
		}
	);
	$(document).mousemove(
		function (event) {
			px = event.offsetX;
			py = event.offsetY;
			
			// cursor.attr(
			// 	{ 'cx' : px,
			// 	'cy' : py }
			// );
			
		}
	);
	
	setInterval(emit, 500);
	
	function emit() {
		socket.emit('mousemove',
			{ userid : userid,
			roomid : roomid,
			boardid : boardid,
			cx : px,
			cy : py }
		);
	}

	socket.on('cursorupdate',
			function (data) {
				print_data('cursorupdate', data);
				if(cursors[data.userid]) {
					cursors[data.userid].attr(
						{ cx : data.cx,
						cy : data.cy }
					);
				}
				else {
					function random(min, max) {
						return Math.floor(Math.random() * (max - min)) + min;
					}
					var f = Raphael.getColor();
					var s = Raphael.getColor();
					var w = random(1, 10);
					cursors[data.userid] = paper.circle(data.cx, data.cy, 10).attr(
						{ fill : f,
						stroke : s,
						'stroke-width' : w }
					);
					
					
				}
			}
		);

	socket.on('connect', function(data) {
	    print_data('connect', data);
	    socket.emit('join_board', {
	        boardid: boardid,
	        userid: userid
	    });
	});

	function print_data(message, data) {
	    console.log(message + '>');
	    for (var prop in data) {
	        console.log(prop + ': ' + data[prop]);
	    }
	}
}