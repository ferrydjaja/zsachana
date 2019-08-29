//$.response.contentType = "text/plain";

//$.response.setBody("Hello World");
/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, new-cap: 0*/
/*eslint-env node, es6 */
"use strict";

var conn = $.hdb.getConnection();
var content = $.request.body.asString();

var top = content.split("=")[1];
if(top <= 10) {
	var query = "SELECT TOP " + top + " DATA FROM ZSACHANA_DUMMY";
	var rs = conn.executeUpdate(query);
	conn.commit();
	conn.close();
	
	$.response.setBody(JSON.stringify(rs));
	$.response.contentType = "application/json";
	$.response.status = $.net.http.OK;
} else  {
	$.response.setBody(JSON.stringify("ER"));
	$.response.contentType = "application/json";
	$.response.status = $.net.http.OK;
}


