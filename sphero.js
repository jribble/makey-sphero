var Cylon = require('cylon');
var express = require('express');
var app = express();

var cmd = {};

var robot = Cylon.robot({
    connection: { name: 'sphero', adaptor: 'sphero', port: '/dev/cu.Sphero-GRP-AMP-SPP' },
    device: { name: 'sphero', driver: 'sphero' },

    work: function(my) {
        var on = false;
        var color = null;
        every((1).seconds(), function() {
//            // flash light
//            if (on) {
//                my.sphero.setColor("blue");
//                on = false;
//            } else {
//                my.sphero.setColor('black');
//                on = true;
//            }
//
//            // Roll in a random direction
//            my.sphero.roll(60, Math.floor(Math.random() * 360));


            if(cmd.color) {
                my.sphero.setColor(cmd.color);
                color = cmd.color;
            }
            else if(color != null) {
                my.sphero.setColor(color);
            }

            if(cmd.roll != undefined) {
                var dir = cmd.roll % 360;
                my.sphero.roll(60, dir);
            }

            if(cmd.stop) {
                my.sphero.stop();
            }
            cmd = {};
        });
    }
});

// Tell Cylon we want it to spin up the API on port 4321
//Cylon.api({port: '4321'})

app.get("/color/:color", function(req, res) {
    cmd.color = "" + req.params.color;
    console.log("color " + cmd.color);
    res.send("ok");
});

app.get("/colorhex/:color", function(req, res) {
    cmd.color = parseInt(req.params.color, 16);
    console.log("color " + cmd.color);
    res.send("ok");
});

app.get("/roll/:direction", function(req, res) {
    cmd.roll = req.params.direction;
    console.log("roll ", cmd.roll);
    res.send("ok");
});

app.get("/stop", function(req, res) {
    console.log("stop");
    cmd.stop = true;
    res.send("ok");
});

app.get("/", function(req, res) {
    res.sendfile("./Makey.html");
});

app.listen(3001);

// Start up Cylon API server
Cylon.start();