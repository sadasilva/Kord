//StarterCode

var http = require('http');
var pg = require('pg');

var conString = "postgres://cordio:password@localhost/postgres";

var resource = require('../resource');

function userCheck(username, callback) {
  pg.connect(connString, function (err, user, done){
    if(err){callback('Connection error: '+err);
      done();}
    else{
      var query = 'SELECT * FROM users WHERE username' = user.name;
      user.query(query, function(err, result) {

        if(err){callback('Search error: '+err); 
          done();}
        else{callback(undefined);
          done();}
      });
    }
  });
}

function userAdd(username, callback) {
  pg.connect(connString, function (err, user, done){
    if(err){callback('Connection error: '+err);
      done();}
    else{
      userCheck(username, function(err, userCheck){
         if(err){callback(undefined, 'Username already in use.');
          done();}
         else{
          user.insertInto(userList, username, user);
          done();
            if(err){callback('Couldnt add: '+err);
              done();}
            else{
              callback(undefined, 'Username avaliable.');
              done();}
          }
        });
      }
    });

exports.insertInto = function (table, data, id) {
  return 'INSERT INTO ' + table + ' ' + values(data, id);           
}

exports.selectFrom = function (columns, table, attribute, id) { 
  return 'SELECT ' + columns + ' FROM ' + table + ' ' + 'WHERE ' + attribute + ' = ' + id + ';';
}

exports.nextID = function(table, id) {                      
  return "nextval('" + table + "_" + id + "_seq')";            
}
//Testing


//ar server = http.createServer(function(req, res) {
//
  // get a pg client from the connection pool
// pg.connect(conString, function(err, client, done) {
//
//    var handleError = function(err) {
      // no error occurred, continue with the request
//      if(!err) return false;

//      done(client);
//      res.writeHead(500, {'content-type': 'text/plain'});
//      res.end('An error occurred');
//      return true;
//    };

    // record the visit
    //      client.query('INSERT INTO visit (date) VALUES ($1)', [new Date()], function(err, result) {
  //      if(handleError(err)) return;
 //     client.query('SELECT COUNT(date) AS count FROM visit', function(err, result) {
//        if(handleError(err)) return;
//       done();
 //       res.writeHead(200, {'content-type': 'text/plain'});

//server.listen(1000);

exports.userCheck = userCheck;
exports.userAdd = userAdd;
      