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

function main(request, response, type) {
    let query = deleteSlash(request.url);
    console.log("_______________________");
    console.log("Query: " + query);
    console.log("Type: " + type);

    let now = 0;
    let finish = parseInt(query);

    if(type === "GET") {
        let myInterval = setInterval(() => {
            now += 1;
            console.log("Interval " + query);
            if (now === finish) {
                clearInterval(myInterval);
                console.log("Answer: " + "OK_" + query);
                response.end("OK_" + query);

                freeProcess = true;
                mass.splice(0, 1);
            }
        }, 1000);
    }

    if(type === "POST") {
        request.on('data', function(data) {
            const valueData = data + "";

            let myInterval = setInterval(() => {
                now += 1;
                console.log("Interval " + query + "   Data: " + valueData);
                if (now === finish) {
                    clearInterval(myInterval);
                    console.log("Answer: " + "OK_" + query);
                    response.end("OK_" + query);

                    freeProcess = true;
                    mass.splice(0, 1);
                }
            }, 1000);
        });
    }
}

app.get('/*', function(request, response) {
    mass.push({
        request: request,
        response: response,
        type: "GET"
    });
});

app.post('/*', function(request, response) {
    mass.push({
        request: request,
        response: response,
        type: "POST"
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
            main(obj.request, obj.response, obj.type);
        }
    }
}, 3);