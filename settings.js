/**
 * Copyright 2014 IBM Corp.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

var path = require("path");
var when = require("when");

var settings = module.exports = {
    uiPort: process.env.PORT || 1880,
    mqttReconnectTime: 15000,
    serialReconnectTime: 15000,
    debugMaxLength: 10000000,

    // Add the nodes in
    nodesDir: path.join(__dirname,"nodes"),

    // Blacklist the non-bluemix friendly nodes
    nodesExcludes:[ '66-mongodb.js','75-exec.js','35-arduino.js','36-rpi-gpio.js','25-serial.js','28-tail.js','50-file.js','31-tcpin.js','32-udp.js','23-watch.js' ],

    // Enable module reinstalls on start-up; this ensures modules installed
    // post-deploy are restored after a restage
    autoInstallModules: true,

    // Move the admin UI
    httpAdminRoot: '/red',

    // You can protect the user interface with a userid and password by using the following property
    // the password must be an md5 hash  eg.. 5f4dcc3b5aa765d61d8327deb882cf99 ('password')
    //httpAdminAuth: {user:"user",pass:"5f4dcc3b5aa765d61d8327deb882cf99"},

    // Serve up the welcome page
    httpStatic: path.join(__dirname,"public"),

    functionGlobalContext: { },

    storageModule: require("./mongostorage"),

    httpNodeCors: {
        origin: "*",
        methods: "GET,PUT,POST,DELETE"
    },

    // Disbled Credential Secret
    credentialSecret: false
}

settings.adminAuth = {
    type: "credentials",
    users: function(username) {
        var users = [{
          username: "joaomario",
          permissions: "*"
        },{
          username: "junitec",
          permissions: "flows.read, flows.write"
      }];

        if (process.env.NODE_RED_USERNAME == username) {
            return when.resolve({username:username,permissions:"flows.read, flows.write"});
        } else {
            var user = users.find((user) => {return user.username == username});
            if (user != null) return when.resolve({username, permissions: user.permissions});
            else return when.resolve(null);
       }
    },
    authenticate: function(username, password) {

        var users = [{
          username: "joaomario",
          password: "$2a$08$DWZVyMi/.4cdVo8Km28YS.XMYMKjkn955lrCJXLNmRVlJVK4XXA9G"
          permissions: "*"
        },{
          username: "junitec",
          password: "$2a$08$2C0o6P0zY6.toBi8IVUWLO3LQVgOzh6sGGdHvEYl5TWkobigp7rNe" //junitec-iot
          permissions: "flows.read, flows.write"
        }];

        if (process.env.NODE_RED_USERNAME == username &&
            process.env.NODE_RED_PASSWORD == password) {
            return when.resolve({username:username,permissions:"flows.read, flows.write"});
        } else {
            var user = users.find((user) => {return user.username == username && user.password == password});
            if (user != null) return when.resolve({username, permissions: user.permissions});
            else return when.resolve(null);
        }

        if (process.env.NODE_RED_USERNAME == username &&
            process.env.NODE_RED_PASSWORD == password) {
            return when.resolve({username:username,permissions:"*"});
        } else {
            return when.resolve(null);
        }
    }
}

settings.mongoAppname = 'nodered';
settings.mongoUrl = process.env.MONGODB_URI;
