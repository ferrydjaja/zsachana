//$.response.contentType = "text/plain";

//$.response.setBody("Hello World");
/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, new-cap: 0*/
/*eslint-env node, es6 */
"use strict";

var conn = $.hdb.getConnection();
var id = $.request.parameters.get('id');
var data = $.request.parameters.get('data');

var query = "INSERT INTO ZSACHANA_DUMMY VALUES(" + id + ", '" + data + "')";
var rs = conn.executeUpdate(query);
conn.commit();
conn.close();

$.response.setBody(JSON.stringify(rs));
$.response.contentType = "application/json";
$.response.status = $.net.http.OK;
