'use strict' ;
const fs = require('fs') ;
const http = require('http');
const url = require('url');
const querystring = require('querystring');
let todos = [
    {
        id: Math.random() + '',
        message: "Do Homework #4",
        completed: false
    },
    {
        id: Math.random() + '',
        message: "Write down the questions",
        completed: false
    },
    {
        id: Math.random() + '',
        message: "Go to the office hour!",
        completed: false
    }
];

const httpServer = http.createServer(function(req, res){
    const parsedUrl = url.parse(req.url);
    const parsedQuery = querystring.parse(parsedUrl.query);
    const method = req.method;

// READ  index.html file **********************************************
    if(req.url==='/')
    {
        req.url='/index.html';
    }
    const fileLocation = '../cs110_hw4' + req.url;
    fs.readFile(fileLocation, function(err, data){
        if(err){
            res.statusCode = 404;
            return res.end('404: Sorry file not found');
        }	else{
            res.statusCode = 200;
            return res.end(data);
        }
    });

// METHOD FOR SENDING DATA **********************************************
    if(method === 'GET') {
        if(req.url.indexOf('/todos') === 0) {
            res.setHeader('Content-Type', 'application/json');
            let localTodos = todos;
            if(parsedQuery.searchtext) {
                localTodos = localTodos.filter(function(obj) {
                    return obj.message.indexOf(parsedQuery.searchtext) >= 0;
                });
            }
            return res.end(JSON.stringify({items : localTodos}));
        }
    }
// METHOD FOR UPDATE ITEM **********************************************
    if(method === 'PUT') {
    if(req.url.indexOf('/todos') === 0) {
    	let body = '';
    	req.on('data', function (chunk) { //cut data into parts to send
                body += chunk;
            });
    	req.on('end', function (){
    		let jsonObj = JSON.parse(body); //collect back the data
    		for(let i = 0; i < todos.length; i++){
                    if(todos[i].id === (jsonObj.id)) {
                        todos[i] = jsonObj;
                        res.setHeader('Content-Type', 'application/json');
                        res.statusCode = 200;
                        return res.end(JSON.stringify(jsonObj));
                    }
                }
    			res.statusCode = 404;
                	return res.end('Data was not found');
            });
            return;
        }
    }
// METHOD FOR CREATING NEW ITEM *****************************************
    if(method === 'POST') {
        if(req.url.indexOf('/todos') === 0) {
            let body = '';
            req.on('data', function (chunk) { //cut data into parts to send
                body += chunk;
            });
            req.on('end', function () {
                let jsonObj = JSON.parse(body); //collect back the data
                jsonObj.id = Math.random() + '';
                todos[todos.length] = jsonObj;
                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify(jsonObj));
            });
            return;
        }
    }
//METHOD FOR DELETING ITEM **********************************************
    if(method === 'DELETE') {
        if(req.url.indexOf('/todos/') === 0) {
            let id =  req.url.substr(7);
                for(let i = 0; i < todos.length; i++) {
                if(id === todos[i].id) {
                    todos.splice(i, 1); //delete one index
                    res.statusCode = 200;
                    return res.end('Successfully removed');
                }
            }
            res.statusCode = 404;
            return res.end('Data was not found');
        }
    }
});

httpServer.listen(3001);