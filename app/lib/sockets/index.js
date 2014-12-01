var userdb = require('../db/userdb');
var roomdb = require('../db/roomdb');

var rooms = require('../../app.js');
var idmap = [];

// server
module.exports = function(io) {
    io.on('connection', function(socket) {
        
        ////
        // room
        ////
        
        // when a user joins a room
        socket.on('join_room',
            function (data) {
                print_data('join_room', data);
                
                socket.join('r' + data.roomid);
                // if the room doesn't exist
                if (!rooms[data.roomid]) {
                    rooms[data.roomid] = {};
                }
                // update the mappings
                rooms[data.roomid][data.userid] = data.nickname;
                idmap[socket.id] = [data.roomid, data.userid];
                
                // send the socket that joined the members list
                socket.emit('members', rooms[data.roomid]);
                // tell all other sockets that a new connection was made
                socket.broadcast.to(data.roomid).emit('newconnection', {
                    nickname: data.nickname,
                    userid: data.userid
                });
            }
        );
        // 
        // socket.on('request_memberlist', function(data) {
        //     if (rooms[data.roomid + ''] === undefined) {
        //         rooms[data.roomid + ''] = {};
        //         rooms[data.roomid + '']['online'] = {};
        //         rooms[data.roomid + '']['locked'] = {};
        //     }
        //     // rooms[data.roomid + '']['online'][data.userid + ''] = data;
        // 
        //     for (var prop in data) {
        //         console.log('request: ' + prop + ': ' + data[prop]);
        //     }
        // 
        //     socket.emit('receive_memberlist', rooms[data.roomid + '']['online']);
        // });

        // socket.on('adduser', function(data) {
        //     // Join client to specified roomid channel
        //     socket.join('' + data.roomid);
        //     var usrid = data.userid;
        //     rooms[data.roomid + '']['online'][usrid + ''] = data.nickname;
        //     idmap[socket.id] = [data.roomid + '', data.userid + ''];
        //     io.to('' + data.roomid).emit('newconnection', {
        //         nickname: data.nickname,
        //         userid: data.userid
        //     });
        //     for (var prop in rooms[data.roomid + '']['online']) {
        //         // for (var prop2 in data) {
        //         //     console.log('add user: ' + prop2 + ': ' + data[prop2]);
        //         // }
        //         console.log(prop + ': ' + rooms[data.roomid + '']['online'][prop]);
        //         // console.log('.');
        //         // console.log('add user: ' + rooms[data.roomid + '']['online']['user']);
        //     }
        // });

        socket.on('disconnect', function(data) {
            print_data('disconnect', data);
            if (!idmap[socket.id]) return;
            
            var roomid = idmap[socket.id][0];
            var userid = idmap[socket.id][1];
            
            var nickname = rooms[roomid][userid];
            
            console.log(userid + ' left.');
            
            userdb.readUser(+userid, function(err, res) {
                if(err) console.log('Error 76: ' + err);
                if(!err) {
                    if(res.access === -1) {
                        // Detroy the guest account
                        userdb.destroyUser(+userid, function(destroyerr, result) {
                            if(destroyerr) console.log('Could not remove guest user ' + userid);
                        });
            
                        // If only moderator was said guest, destroy room
                        roomdb.readModeratorsFor(+roomid, function(readmoderr, readmodresult) {
                            if(err) {
                                console.log('Error reading moderators for room (internal error 1) ' + roomid + ' - ' + readmoderr);
                            } else {
                                //console.log('readmodresult.length: ' + readmodresult.length + ' - ' + 'readmodresult[0].userid: ' + readmodresult[0].userid);
                                if(!readmodresult || (readmodresult.length === 1 && readmodresult[0].userid === +userid)){
                                    roomdb.destroyRoom(+roomid, function(roomdestroyerr, roomdestroyresult) {
                                        if(err) console.log('Could not leave room (internal error 2).');
                                    });
                                } else {
                                    roomdb.unjoinRoomMember(+roomid, +userid, function(unjoinerr, unjoinresult) {
                                        if(err) console.log('Could not leave room (internal error 3).');
                                    });
                                }
                            }
                        });
                    }
                }
            });
            
            socket.broadcast.to(roomid).emit('disconnection', {
                nickname: nickname,
                userid: userid
            });
            
            delete idmap[socket.id];
            delete rooms[roomid][userid];
        });
        
        ////
        // board
        ////
        
        socket.on('join_board',
            function (data) {
                print_data('join_board', data);
                
                socket.join('b' + data.boardid);
                // // if the room doesn't exist
                // if (!boards[data.boardid]) {
                //     boards[data.boardid] = {};
                // }
                // // update the mappings
                // boards[data.boardid][data.userid] = data.nickname;
                // // this should have an array of board ids?
                // idmap[socket.id] = [data.boardid, data.userid];
                // 
                // // send the socket that joined the members list
                // socket.emit('members', rooms[data.roomid]);
                // // tell all other sockets that a new connection was made
                // io.to(data.roomid).emit('newconnection', {
                //     nickname: data.nickname,
                //     userid: data.userid
                // });
            }
        );
        
        socket.on('mousemove',
            function (data) {
                // print_data('mousemove', data);
                socket.broadcast.to('b' + data.boardid).emit('cursorupdate', data);
            }
        );
        
        socket.on('draw',
            function (data) {
                // this will send actual objects
                // need to send room id, board id, actual drawing object
                // tell all clients that a new things need to be added and drawn
                //
            }
        );

        socket.on('erase',
            function (data) {
                // rooms[data.roomid]['locked']
            }
        );

        socket.on('lock',
            function (data) {
                //
            }
        );
        
        socket.on('unlock',
            function (data) {
                //
            }
        );

        socket.on('drag',
            function (data) {

            }
        );
    });
}

function print_data(message, data) {
    console.log(message + '>');
    for (var prop in data) {
        console.log(prop + ': ' + data[prop]);
    }
}