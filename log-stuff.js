// log out environment variables
console.log(require('dotenv').config());

var username = require('username-sync');
console.log("username: " + username);
// log out username
console.log(username());


console.log('process.env.SITECORE_API_KEY', process.env.SITECORE_API_KEY);
console.log('process.env.SITECORE_API_HOST', process.env.SITECORE_API_HOST);
