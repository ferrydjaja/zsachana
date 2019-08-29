//$.response.contentType = "text/plain";

//$.response.setBody("Hello World");
/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, new-cap: 0*/
/*eslint-env node, es6 */
"use strict";



$.response.setBody(JSON.stringify("Bot Server"));
$.response.contentType = "application/json";
$.response.status = $.net.http.OK;
