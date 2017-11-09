"use strict";

let express = require("express");
let app = express();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

function deleteSlash(s) {
    return s.toString().split("/").join("");
}

const mass = [];
let freeProcess = true;

function main(request, response) {
    let query = deleteSlash(request.url);
    console.log("Query: " + query);

    let now = 0;
    let finish = parseInt(query);

    let myInterval = setInterval(() => {
        now += 1;
        console.log("Interval " + query);
        if(now === finish) {
            clearInterval(myInterval);
            console.log("Answer: " + "OK_" + query);
            response.end("OK_" + query);

            freeProcess = true;
            mass.splice(0,1);
        }
    }, 1000);
}

app.get('/*', function(request, response) {
    mass.push({
        request: request,
        response: response
    });
});


const port = process.env.PORT || 5000;
app.listen(port);

console.log("Server works on port " + port);

let callingInterval = setInterval(() => {
    if(freeProcess === true) {
        if(mass.length > 0) {
            freeProcess = false;
            const obj = mass[0];
            main(obj.request, obj.response);
        }
    }
}, 50);