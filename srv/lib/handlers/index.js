/*eslint no-console: 0, no-unused-vars: 0, no-undef:0, no-process-exit:0, new-cap:0*/
/*eslint-env node, es6 */

"use strict";

const uuid = require("uuid/v4");
const cds = require("@sap/cds");

module.exports = function (entities) {
	const {
		catalog
	} = entities;

	const adm = "ODATASERVICEADMIN";

	this.after("READ", "zearn_ganttchart", (entity) => {
		console.log("** Read zearn_ganttchart **");
		if (entity.length > 0) {
			var oldVal = null;
			var x = 1000;
			var y = 0;

			for (let item of entity) {
				//console.log(item.PRODUCT_NAME_SHORT);
				if (item.children.length > 0) {
					for (let itemx of item.children) {
						//console.log(itemx.APPLICATION_ID);
						if (itemx.APPLICATION_ID !== oldVal) {
							oldVal = itemx.APPLICATION_ID;
							y = 1;
						} else {
							y = y + 1;
						}
						itemx.id = (itemx.APPLICATION_ID * x) + y;
					}
				}
			}
		}
	});

	this.after("READ", "zearn_inforesources", async(Entity) => {
		console.log("** Read zearn_inforesources **");
		console.log(Entity);
	});

	this.before("CREATE", "zearn_inforesources", async(User) => {
		console.log("** Create zearn_inforesources **");
		const {
			data
		} = User;
		console.log(data);

		const dbClass = require(global.__base + "utils/dbPromises");
		var client = await dbClass.createConnection();
		let db = new dbClass(client);

		const statement = await db.preparePromisified(
			`SELECT \"inforesourceSeqId\".NEXTVAL AS ID
							 FROM DUMMY`);
		const dataResults = await db.statementExecPromisified(statement, []);
		console.log(dataResults[0].ID);

		data.ID = dataResults[0].ID;

		return data;
	});

	this.before("CREATE", "zearn_integrations", async(User) => {
		console.log("** Create zearn_integrations **");
		const {
			data
		} = User;
		console.log(data);

		const {
			attr
		} = User;

		var dataRes = [];
		Object.keys(attr).forEach(function (key) {
			dataRes[key] = attr[key];
		});

		var proceed = false;
		for (var i = 0; i < dataRes.scopes.length; i++) {
			if (dataRes.scopes[i].includes(adm)) {
				console.log("adm");
				proceed = true;
				break;
			}
		}

		if (proceed) {
			const dbClass = require(global.__base + "utils/dbPromises");
			var client = await dbClass.createConnection();
			let db = new dbClass(client);

			const statement = await db.preparePromisified(
				`SELECT \"integrationSeqId\".NEXTVAL AS ID
							 FROM DUMMY`);
			const dataResults = await db.statementExecPromisified(statement, []);
			console.log(dataResults[0].ID);

			data.ID = dataResults[0].ID;

			return data;
		} else {
			throw new Error(`Erro: doesn't have admin right`);
		}
	});

	this.before("CREATE", "zearn_processes", async(User) => {
		console.log("** Create zearn_processes **");
		const {
			data
		} = User;
		console.log(data);

		const {
			attr
		} = User;

		var dataRes = [];
		Object.keys(attr).forEach(function (key) {
			dataRes[key] = attr[key];
		});
		var proceed = false;
		for (var i = 0; i < dataRes.scopes.length; i++) {
			if (dataRes.scopes[i].includes(adm)) {
				console.log("adm");
				proceed = true;
				break;
			}
		}

		if (proceed) {
			const dbClass = require(global.__base + "utils/dbPromises");
			var client = await dbClass.createConnection();
			let db = new dbClass(client);

			const statement = await db.preparePromisified(
				`SELECT \"processSeqId\".NEXTVAL AS ID
							 FROM DUMMY`);
			const dataResults = await db.statementExecPromisified(statement, []);
			console.log(dataResults[0].ID);

			data.ID = dataResults[0].ID;

			return data;
		} else {
			throw new Error(`Erro: doesn't have admin right`);
		}
	});

	this.before("CREATE", "zearn_middleware", async(User) => {
		console.log("** Create zearn_middleware **");
		const {
			data
		} = User;
		console.log(data);

		const {
			attr
		} = User;

		var dataRes = [];
		Object.keys(attr).forEach(function (key) {
			dataRes[key] = attr[key];
		});

		var proceed = false;
		for (var i = 0; i < dataRes.scopes.length; i++) {
			if (dataRes.scopes[i].includes(adm)) {
				console.log("adm");
				proceed = true;
				break;
			}
		}

		if (proceed) {
			const dbClass = require(global.__base + "utils/dbPromises");
			var client = await dbClass.createConnection();
			let db = new dbClass(client);

			const statement = await db.preparePromisified(
				`SELECT ID AS ID 
				    FROM ZEARN_MIDDLEWARE
					WHERE UPPER(MIDDLEWARE_NAME) = UPPER(?)`);
			const dataResults = await db.statementExecPromisified(statement, [data.MIDDLEWARE_NAME]);

			console.log(dataResults.length);

			if (dataResults.length < 1) {

				const Seqstatement = await db.preparePromisified(
					`SELECT \"middlewareSeqId\".NEXTVAL AS ID
								 FROM DUMMY`);
				const seqResult = await db.statementExecPromisified(Seqstatement, []);
				console.log("ID: " + seqResult[0].ID);

				data.ID = seqResult[0].ID;

				return data;
			} else {
				throw new Error(`Middleware Name for ${data.MIDDLEWARE_NAME} already exist`);
			}
		} else {
			throw new Error(`Erro: doesn't have admin right`);
		}
	});

	this.on("DELETE", "zearn_appportfolio", async(User) => {
		console.log("** Delete zearn_appportfolio **");
		const {
			data
		} = User;
		console.log(data);

		const {
			attr
		} = User;

		var dataRes = [];
		Object.keys(attr).forEach(function (key) {
			dataRes[key] = attr[key];
		});
		var proceed = false;
		for (var i = 0; i < dataRes.scopes.length; i++) {
			if (dataRes.scopes[i].includes(adm)) {
				console.log("adm");
				proceed = true;
				break;
			}
		}

		if (proceed) {
			const dbClass = require(global.__base + "utils/dbPromises");
			var client = await dbClass.createConnection();
			let db = new dbClass(client);

			//Delete Applications
			const delStatement0 = await db.preparePromisified(
				`DELETE FROM "ZEARN_APPLICATIONS" 
					        WHERE APPLICATION_ID = ?`
			);
			const updResults0 = await db.statementExecPromisified(delStatement0, [data.APPLICATION_ID]);

			//Delete Capabilities
			const delStatement1 = await db.preparePromisified(
				`DELETE FROM "ZEARN_CAPABILITIES" 
					        WHERE APPLICATION_ID = ?`
			);
			const updResults1 = await db.statementExecPromisified(delStatement1, [data.APPLICATION_ID]);

			//Delete Events
			const delStatement2 = await db.preparePromisified(
				`DELETE FROM "ZEARN_EVENT" 
					        WHERE APPLICATION_ID = ?`
			);
			const updResults2 = await db.statementExecPromisified(delStatement2, [data.APPLICATION_ID]);

			//Delete Info Resources
			const delStatement3 = await db.preparePromisified(
				`DELETE FROM "ZEARN_INFORESOURCES" 
					        WHERE APPLICATION_ID = ?`
			);
			const updResults3 = await db.statementExecPromisified(delStatement3, [data.APPLICATION_ID]);

			//Delete Business Processes
			const delStatement4 = await db.preparePromisified(
				`DELETE FROM "ZEARN_PROCESSES" 
					        WHERE APPLICATION_ID = ?`
			);
			const updResults4 = await db.statementExecPromisified(delStatement4, [data.APPLICATION_ID]);

			//Delete Integrations
			const delStatement5 = await db.preparePromisified(
				`DELETE FROM "ZEARN_INTEGRATIONS" 
					        WHERE SOURCE_APPLICATION_ID = ?`
			);
			const updResults5 = await db.statementExecPromisified(delStatement5, [data.APPLICATION_ID]);

			//Delete Metrics
			const delStatement6 = await db.preparePromisified(
				`DELETE FROM "ZEARN_METRICS" 
					        WHERE APPLICATION_ID = ?`
			);
			const updResults6 = await db.statementExecPromisified(delStatement6, [data.APPLICATION_ID]);

			//Delete Alias
			const delStatement7 = await db.preparePromisified(
				`DELETE FROM "ZEARN_ALIAS" 
					        WHERE APPLICATION_ID = ?`
			);
			const updResults7 = await db.statementExecPromisified(delStatement7, [data.APPLICATION_ID]);

			//Delete Tag
			const delStatement8 = await db.preparePromisified(
				`DELETE FROM "ZEARN_TAG" 
					        WHERE APPLICATION_ID = ?`
			);
			const updResults8 = await db.statementExecPromisified(delStatement8, [data.APPLICATION_ID]);

			return data;
		} else {
			throw new Error(`Erro: doesn't have admin right`);
		}
	});

	this.before("CREATE", "zearn_contactpersons", async(User) => {
		console.log("** Create zearn_contactpersons **");
		const {
			data
		} = User;
		console.log(data);

		const {
			attr
		} = User;

		var dataRes = [];
		Object.keys(attr).forEach(function (key) {
			dataRes[key] = attr[key];
		});

		var proceed = false;
		for (var i = 0; i < dataRes.scopes.length; i++) {
			if (dataRes.scopes[i].includes(adm)) {
				console.log("adm");
				proceed = true;
				break;
			}
		}

		if (proceed) {
			const dbClass = require(global.__base + "utils/dbPromises");
			var client = await dbClass.createConnection();
			let db = new dbClass(client);

			const statement = await db.preparePromisified(
				`SELECT ID AS ID 
				    FROM ZEARN_CONTACTPERSONS
					WHERE UPPER(EMAIL) = UPPER(?)`);
			const dataResults = await db.statementExecPromisified(statement, [data.EMAIL]);

			console.log(dataResults.length);

			if (dataResults.length < 1) {

				const Seqstatement = await db.preparePromisified(
					`SELECT \"contactpersonsSeqId\".NEXTVAL AS ID
								 FROM DUMMY`);
				const seqResult = await db.statementExecPromisified(Seqstatement, []);
				console.log("ID: " + seqResult[0].ID);

				data.ID = seqResult[0].ID;

				return data;
			} else {
				throw new Error(`Email for ${data.EMAIL} already exist`);
			}
		} else {
			throw new Error(`Erro: doesn't have admin right`);
		}
	});

	this.before("CREATE", "zearn_hostingtypes", async(User) => {
		console.log("** Create zearn_hostingtypes **");
		const {
			data
		} = User;
		console.log(data);

		const {
			attr
		} = User;

		var dataRes = [];
		Object.keys(attr).forEach(function (key) {
			dataRes[key] = attr[key];
		});

		var proceed = false;
		for (var i = 0; i < dataRes.scopes.length; i++) {
			if (dataRes.scopes[i].includes(adm)) {
				console.log("adm");
				proceed = true;
				break;
			}
		}

		if (proceed) {
			const dbClass = require(global.__base + "utils/dbPromises");
			var client = await dbClass.createConnection();
			let db = new dbClass(client);

			const statement = await db.preparePromisified(
				`SELECT ID AS ID 
				    FROM ZEARN_HOSTINGTYPES
					WHERE UPPER(HOSTINGTYPE_DESC) = UPPER(?)`);
			const dataResults = await db.statementExecPromisified(statement, [data.HOSTINGTYPE_DESC]);

			console.log(dataResults.length);

			if (dataResults.length < 1) {

				const Seqstatement = await db.preparePromisified(
					`SELECT \"hostingtypesSeqId\".NEXTVAL AS ID
								 FROM DUMMY`);
				const seqResult = await db.statementExecPromisified(Seqstatement, []);
				console.log("ID: " + seqResult[0].ID);

				data.ID = seqResult[0].ID;

				return data;
			} else {
				throw new Error(`Hosting Type Desc for ${data.HOSTINGTYPE_DESC} already exist`);
			}
		} else {
			throw new Error(`Erro: doesn't have admin right`);
		}
	});

	this.before("CREATE", "zearn_vendor", async(User) => {
		console.log("** Create zearn_vendor **");
		const {
			data
		} = User;
		console.log(data);

		const {
			attr
		} = User;

		var dataRes = [];
		Object.keys(attr).forEach(function (key) {
			dataRes[key] = attr[key];
		});

		var proceed = false;
		for (var i = 0; i < dataRes.scopes.length; i++) {
			if (dataRes.scopes[i].includes(adm)) {
				console.log("adm");
				proceed = true;
				break;
			}
		}

		if (proceed) {
			const dbClass = require(global.__base + "utils/dbPromises");
			var client = await dbClass.createConnection();
			let db = new dbClass(client);

			const statement = await db.preparePromisified(
				`SELECT ID AS ID 
				    FROM ZEARN_VENDOR
					WHERE UPPER(VENDOR_NAME) = UPPER(?)`);
			const dataResults = await db.statementExecPromisified(statement, [data.VENDOR_NAME]);

			console.log(dataResults.length);

			if (dataResults.length < 1) {

				const Seqstatement = await db.preparePromisified(
					`SELECT \"vendorSeqId\".NEXTVAL AS ID
								 FROM DUMMY`);
				const seqResult = await db.statementExecPromisified(Seqstatement, []);
				console.log("ID: " + seqResult[0].ID);

				data.ID = seqResult[0].ID;

				return data;
			} else {
				throw new Error(`Vendor Name for ${data.VENDOR_NAME} already exist`);
			}
		} else {
			throw new Error(`Erro: doesn't have admin right`);
		}
	});

	this.before("CREATE", "zearn_eventtype", async(User) => {
		console.log("** Create zearn_eventtype **");
		const {
			data
		} = User;
		console.log(data);

		const {
			attr
		} = User;

		var dataRes = [];
		Object.keys(attr).forEach(function (key) {
			dataRes[key] = attr[key];
		});

		var proceed = false;
		for (var i = 0; i < dataRes.scopes.length; i++) {
			if (dataRes.scopes[i].includes(adm)) {
				console.log("adm");
				proceed = true;
				break;
			}
		}

		if (proceed) {
			const dbClass = require(global.__base + "utils/dbPromises");
			var client = await dbClass.createConnection();
			let db = new dbClass(client);

			const statement = await db.preparePromisified(
				`SELECT ID AS ID 
				    FROM ZEARN_EVENTTYPE
					WHERE UPPER(EVENTTYPE_DESC) = UPPER(?)`);
			const dataResults = await db.statementExecPromisified(statement, [data.EVENTTYPE_DESC]);

			console.log(dataResults.length);

			if (dataResults.length < 1) {

				const Seqstatement = await db.preparePromisified(
					`SELECT \"eventtypeSeqId\".NEXTVAL AS ID
								 FROM DUMMY`);
				const seqResult = await db.statementExecPromisified(Seqstatement, []);
				console.log("ID: " + seqResult[0].ID);

				data.ID = seqResult[0].ID;

				return data;
			} else {
				throw new Error(`Event Type Desc for ${data.EVENTTYPE_DESC} already exist`);
			}
		} else {
			throw new Error(`Erro: doesn't have admin right`);
		}
	});

	this.before("CREATE", "zearn_lineofbusiness", async(User) => {
		console.log("** Create zearn_lineofbusiness **");
		const {
			data
		} = User;
		console.log(data);

		const {
			attr
		} = User;

		var dataRes = [];
		Object.keys(attr).forEach(function (key) {
			dataRes[key] = attr[key];
		});

		var proceed = false;
		for (var i = 0; i < dataRes.scopes.length; i++) {
			if (dataRes.scopes[i].includes(adm)) {
				console.log("adm");
				proceed = true;
				break;
			}
		}

		if (proceed) {
			const dbClass = require(global.__base + "utils/dbPromises");
			var client = await dbClass.createConnection();
			let db = new dbClass(client);

			const statement = await db.preparePromisified(
				`SELECT ID AS ID 
				    FROM ZEARN_LINEOFBUSINESS
					WHERE UPPER(LINEOFBUSINESS_DESC) = UPPER(?)`);
			const dataResults = await db.statementExecPromisified(statement, [data.LINEOFBUSINESS_DESC]);

			console.log(dataResults.length);

			if (dataResults.length < 1) {

				const Seqstatement = await db.preparePromisified(
					`SELECT \"lineofbusinessSeqId\".NEXTVAL AS ID
								 FROM DUMMY`);
				const seqResult = await db.statementExecPromisified(Seqstatement, []);
				console.log("ID: " + seqResult[0].ID);

				data.ID = seqResult[0].ID;

				return data;
			} else {
				throw new Error(`LOB Desc for ${data.LINEOFBUSINESS_DESC} already exist`);
			}
		} else {
			throw new Error(`Erro: doesn't have admin right`);
		}
	});

	this.before("CREATE", "zearn_category", async(User) => {
		console.log("** Create zearn_category **");
		const {
			data
		} = User;
		console.log(data);

		const {
			attr
		} = User;

		var dataRes = [];
		Object.keys(attr).forEach(function (key) {
			dataRes[key] = attr[key];
		});

		var proceed = false;
		for (var i = 0; i < dataRes.scopes.length; i++) {
			if (dataRes.scopes[i].includes(adm)) {
				console.log("adm");
				proceed = true;
				break;
			}
		}

		if (proceed) {
			const dbClass = require(global.__base + "utils/dbPromises");
			var client = await dbClass.createConnection();
			let db = new dbClass(client);

			const statement = await db.preparePromisified(
				`SELECT ID AS ID 
				    FROM ZEARN_CATEGORY
					WHERE UPPER(CATEGORY_DESC) = UPPER(?)`);
			const dataResults = await db.statementExecPromisified(statement, [data.CATEGORY_DESC]);

			console.log(dataResults.length);

			if (dataResults.length < 1) {

				const Seqstatement = await db.preparePromisified(
					`SELECT \"categorySeqId\".NEXTVAL AS ID
								 FROM DUMMY`);
				const seqResult = await db.statementExecPromisified(Seqstatement, []);
				console.log("ID: " + seqResult[0].ID);

				data.ID = seqResult[0].ID;

				return data;
			} else {
				throw new Error(`Category Desc for ${data.CATEGORY_DESC} already exist`);
			}
		} else {
			throw new Error(`Erro: doesn't have admin right`);
		}
	});

	this.on("CREATE", "zearn_apps", async(User) => {
		console.log("** Create zearn_apps **");
		const {
			data
		} = User;
		console.log(data);

		const {
			attr
		} = User;

		var dataRes = [];
		Object.keys(attr).forEach(function (key) {
			dataRes[key] = attr[key];
		});

		var proceed = false;
		for (var i = 0; i < dataRes.scopes.length; i++) {
			if (dataRes.scopes[i].includes(adm)) {
				console.log("adm");
				proceed = true;
				break;
			}
		}

		if (proceed) {
			const dbClass = require(global.__base + "utils/dbPromises");
			var client = await dbClass.createConnection();
			let db = new dbClass(client);

			const statement = await db.preparePromisified(
				`SELECT APPLICATION_ID AS APPLICATION_ID 
				    FROM ZEARN_APPLICATIONS
					WHERE UPPER(PRODUCT_NAME_SHORT) = UPPER(?)`);
			const dataResults = await db.statementExecPromisified(statement, [data.PRODUCT_NAME_SHORT]);

			console.log(dataResults.length);

			if (dataResults.length < 1) {

				if (data.LAST_ARCHITECTURE_REVIEW_DATE === "1970-01-01") {
					data.LAST_ARCHITECTURE_REVIEW_DATE = null;
				}

				if (data.CURRENT_VERSION_END_OF_MAINTENANCE === "1970-01-01") {
					data.CURRENT_VERSION_END_OF_MAINTENANCE = null;
				}

				const Seqstatement = await db.preparePromisified(
					`SELECT \"applicationsSeqId\".NEXTVAL AS ID
								 FROM DUMMY`);
				const seqResult = await db.statementExecPromisified(Seqstatement, []);
				console.log("App ID: " + seqResult[0].ID);

				//** Applications **
				const insStatement = await db.preparePromisified(
					`INSERT INTO  "ZEARN_APPLICATIONS" 
					("APPLICATION_ID", "PRODUCT_NAME_SHORT", "PRODUCT_NAME_CAPTION", "PRODUCT_NAME_LONG", "VENDOR_ID", "PRODUCT_OWNER", "HOSTING_TYPE_ID", "CATEGORY_ID", "LINE_OF_BUSINESS_ID", "CURRENT_ARCHITECTURE", "CURRENT_VERSION", "TARGET_ARCHITECTURE", "TARGET_VERSION", "NOTES", "LAST_ARCHITECTURE_REVIEW_DATE", "CURRENT_VERSION_END_OF_MAINTENANCE", "TARGET_UPGRADE_CYCLE", "EXECUTIVE_SUMMARY", "APPLICATION_FUNCTION", "MASTER_CI") 
					VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
				);
				const updResults = await db.statementExecPromisified(insStatement, [
					seqResult[0].ID,
					data.PRODUCT_NAME_SHORT,
					data.PRODUCT_NAME_CAPTION,
					data.PRODUCT_NAME_LONG,
					data.VENDOR_ID,
					data.PRODUCT_OWNER,
					data.HOSTING_TYPE_ID,
					data.CATEGORY_ID,
					data.LINE_OF_BUSINESS_ID,
					data.CURRENT_ARCHITECTURE,
					data.CURRENT_VERSION,
					data.TARGET_ARCHITECTURE,
					data.TARGET_VERSION,
					data.NOTES,
					data.LAST_ARCHITECTURE_REVIEW_DATE,
					data.CURRENT_VERSION_END_OF_MAINTENANCE,
					data.TARGET_UPGRADE_CYCLE,
					data.EXECUTIVE_SUMMARY,
					data.APPLICATION_FUNCTION,
					data.MASTER_CI
				]);

				// ** Metrics **
				const Seqstatement2 = await db.preparePromisified(
					`SELECT \"metricSeqId\".NEXTVAL AS ID
								 FROM DUMMY`);
				const seqResult2 = await db.statementExecPromisified(Seqstatement2, []);
				console.log("Metric ID: " + seqResult2[0].ID);

				const insStatement2 = await db.preparePromisified(
					`INSERT INTO "ZEARN_METRICS" 
					("ID", "APPLICATION_ID", "METRIC_01", "METRIC_02", "METRIC_03") 
					VALUES (?,?,?,?,?)`
				);
				const updResults2 = await db.statementExecPromisified(insStatement2, [
					seqResult2[0].ID,
					seqResult[0].ID,
					data.METRIC_01,
					data.METRIC_02,
					data.METRIC_03
				]);

				// ** Alias **
				const Seqstatement3 = await db.preparePromisified(
					`SELECT \"aliasSeqId\".NEXTVAL AS ID
								 FROM DUMMY`);
				const seqResult3 = await db.statementExecPromisified(Seqstatement3, []);
				console.log("Alias ID: " + seqResult3[0].ID);

				const insStatement3 = await db.preparePromisified(
					`INSERT INTO "ZEARN_ALIAS" 
					("ID", "APPLICATION_ID", "ALIAS") 
					VALUES (?,?,?)`
				);
				const updResults3 = await db.statementExecPromisified(insStatement3, [
					seqResult3[0].ID,
					seqResult[0].ID,
					data.ALIAS
				]);

				// ** Tag **
				const Seqstatement4 = await db.preparePromisified(
					`SELECT \"tagSeqId\".NEXTVAL AS ID
								 FROM DUMMY`);
				const seqResult4 = await db.statementExecPromisified(Seqstatement4, []);
				console.log("Tag ID: " + seqResult4[0].ID);

				const insStatement4 = await db.preparePromisified(
					`INSERT INTO "ZEARN_TAG" 
					("ID", "APPLICATION_ID", "TAG") 
					VALUES (?,?,?)`
				);
				const updResults4 = await db.statementExecPromisified(insStatement4, [
					seqResult4[0].ID,
					seqResult[0].ID,
					data.TAG
				]);

				//**End

				data.APPLICATION_ID = seqResult[0].ID;
				console.log(data);
				return data;
			} else {
				throw new Error(`Product Name Short for ${data.PRODUCT_NAME_SHORT} already exist`);
			}
		} else {
			throw new Error(`Erro: doesn't have admin right`);
		}
	});

	this.on("UPDATE", "zearn_apps", async(User) => {
		console.log("** Update zearn_apps **");
		const {
			data
		} = User;
		console.log(data);

		const {
			attr
		} = User;

		var dataRes = [];
		Object.keys(attr).forEach(function (key) {
			dataRes[key] = attr[key];
		});

		var proceed = false;
		for (var i = 0; i < dataRes.scopes.length; i++) {
			if (dataRes.scopes[i].includes(adm)) {
				console.log("adm");
				proceed = true;
				break;
			}
		}
		
		if(proceed) {
			const dbClass = require(global.__base + "utils/dbPromises");
			var client = await dbClass.createConnection();
			let db = new dbClass(client);
	
			// ** Applications **
			const statement1 = await db.preparePromisified(
				`SELECT * FROM ZEARN_APPLICATIONS 
							  WHERE APPLICATION_ID = ?`);
			const dataResults = await db.statementExecPromisified(statement1, [data.APPLICATION_ID]);
			Object.keys(data).forEach(function (key) {
				dataResults[0][key] = data[key];
			});
			console.log(dataResults);
	
			var PRODUCT_NAME_SHORT, PRODUCT_NAME_CAPTION, PRODUCT_NAME_LONG, VENDOR_ID, PRODUCT_OWNER, HOSTING_TYPE_ID, CATEGORY_ID,
				LINE_OF_BUSINESS_ID, CURRENT_ARCHITECTURE, CURRENT_VERSION, TARGET_ARCHITECTURE, TARGET_VERSION, NOTES, LAST_ARCHITECTURE_REVIEW_DATE,
				CURRENT_VERSION_END_OF_MAINTENANCE, TARGET_UPGRADE_CYCLE, EXECUTIVE_SUMMARY, APPLICATION_FUNCTION, METRIC_01, METRIC_02, METRIC_03,
				ALIAS, TAG, MASTER_CI;
			PRODUCT_NAME_SHORT = PRODUCT_NAME_CAPTION = PRODUCT_NAME_LONG = VENDOR_ID = PRODUCT_OWNER = HOSTING_TYPE_ID = CATEGORY_ID =
				LINE_OF_BUSINESS_ID = CURRENT_ARCHITECTURE = CURRENT_VERSION = TARGET_ARCHITECTURE = TARGET_VERSION = NOTES =
				LAST_ARCHITECTURE_REVIEW_DATE = CURRENT_VERSION_END_OF_MAINTENANCE = TARGET_UPGRADE_CYCLE = EXECUTIVE_SUMMARY = APPLICATION_FUNCTION =
				METRIC_01 = METRIC_02 = METRIC_03 = ALIAS = TAG = MASTER_CI = null;
	
			if (!data.hasOwnProperty("PRODUCT_NAME_SHORT")) {
				PRODUCT_NAME_SHORT = dataResults[0].PRODUCT_NAME_SHORT;
			} else {
				PRODUCT_NAME_SHORT = data.PRODUCT_NAME_SHORT;
			}
	
			if (!data.hasOwnProperty("PRODUCT_NAME_CAPTION")) {
				PRODUCT_NAME_CAPTION = dataResults[0].PRODUCT_NAME_CAPTION;
			} else {
				PRODUCT_NAME_CAPTION = data.PRODUCT_NAME_CAPTION;
			}
	
			if (!data.hasOwnProperty("PRODUCT_NAME_LONG")) {
				PRODUCT_NAME_LONG = dataResults[0].PRODUCT_NAME_LONG;
			} else {
				PRODUCT_NAME_LONG = data.PRODUCT_NAME_LONG;
			}
	
			if (!data.hasOwnProperty("VENDOR_ID")) {
				VENDOR_ID = dataResults[0].VENDOR_ID;
			} else {
				VENDOR_ID = data.VENDOR_ID;
			}
	
			if (!data.hasOwnProperty("PRODUCT_OWNER")) {
				PRODUCT_OWNER = dataResults[0].PRODUCT_OWNER;
			} else {
				PRODUCT_OWNER = data.PRODUCT_OWNER;
			}
	
			if (!data.hasOwnProperty("HOSTING_TYPE_ID")) {
				HOSTING_TYPE_ID = dataResults[0].HOSTING_TYPE_ID;
			} else {
				HOSTING_TYPE_ID = data.HOSTING_TYPE_ID;
			}
	
			if (!data.hasOwnProperty("CATEGORY_ID")) {
				CATEGORY_ID = dataResults[0].CATEGORY_ID;
			} else {
				CATEGORY_ID = data.CATEGORY_ID;
			}
	
			if (!data.hasOwnProperty("LINE_OF_BUSINESS_ID")) {
				LINE_OF_BUSINESS_ID = dataResults[0].LINE_OF_BUSINESS_ID;
			} else {
				LINE_OF_BUSINESS_ID = data.LINE_OF_BUSINESS_ID;
			}
	
			if (!data.hasOwnProperty("CURRENT_ARCHITECTURE")) {
				CURRENT_ARCHITECTURE = dataResults[0].CURRENT_ARCHITECTURE;
			} else {
				CURRENT_ARCHITECTURE = data.CURRENT_ARCHITECTURE;
			}
	
			if (!data.hasOwnProperty("CURRENT_VERSION")) {
				CURRENT_VERSION = dataResults[0].CURRENT_VERSION;
			} else {
				CURRENT_VERSION = data.CURRENT_VERSION;
			}
	
			if (!data.hasOwnProperty("TARGET_ARCHITECTURE")) {
				TARGET_ARCHITECTURE = dataResults[0].TARGET_ARCHITECTURE;
			} else {
				TARGET_ARCHITECTURE = data.TARGET_ARCHITECTURE;
			}
	
			if (!data.hasOwnProperty("TARGET_VERSION")) {
				TARGET_VERSION = dataResults[0].TARGET_VERSION;
			} else {
				TARGET_VERSION = data.TARGET_VERSION;
			}
	
			if (!data.hasOwnProperty("NOTES")) {
				NOTES = dataResults[0].NOTES;
			} else {
				NOTES = data.NOTES;
			}
	
			if (!data.hasOwnProperty("LAST_ARCHITECTURE_REVIEW_DATE")) {
				LAST_ARCHITECTURE_REVIEW_DATE = dataResults[0].LAST_ARCHITECTURE_REVIEW_DATE;
			} else {
				LAST_ARCHITECTURE_REVIEW_DATE = data.LAST_ARCHITECTURE_REVIEW_DATE;
			}
	
			if (!data.hasOwnProperty("CURRENT_VERSION_END_OF_MAINTENANCE")) {
				CURRENT_VERSION_END_OF_MAINTENANCE = dataResults[0].CURRENT_VERSION_END_OF_MAINTENANCE;
			} else {
				CURRENT_VERSION_END_OF_MAINTENANCE = data.CURRENT_VERSION_END_OF_MAINTENANCE;
			}
	
			if (!data.hasOwnProperty("TARGET_UPGRADE_CYCLE")) {
				TARGET_UPGRADE_CYCLE = dataResults[0].TARGET_UPGRADE_CYCLE;
			} else {
				TARGET_UPGRADE_CYCLE = data.TARGET_UPGRADE_CYCLE;
			}
	
			if (!data.hasOwnProperty("EXECUTIVE_SUMMARY")) {
				EXECUTIVE_SUMMARY = dataResults[0].EXECUTIVE_SUMMARY;
			} else {
				EXECUTIVE_SUMMARY = data.EXECUTIVE_SUMMARY;
			}
	
			if (!data.hasOwnProperty("APPLICATION_FUNCTION")) {
				APPLICATION_FUNCTION = dataResults[0].APPLICATION_FUNCTION;
			} else {
				APPLICATION_FUNCTION = data.APPLICATION_FUNCTION;
			}
	
			if (!data.hasOwnProperty("MASTER_CI")) {
				MASTER_CI = dataResults[0].MASTER_CI;
			} else {
				MASTER_CI = data.MASTER_CI;
			}
	
			const updStatement1 = await db.preparePromisified(
				`UPDATE "ZEARN_APPLICATIONS" SET
							  "PRODUCT_NAME_SHORT" = ?,
				              "PRODUCT_NAME_CAPTION" = ?,
				              "PRODUCT_NAME_LONG" = ?,
				              "VENDOR_ID" = ?,
				              "PRODUCT_OWNER" = ?,
				              "HOSTING_TYPE_ID" = ?,
				              "CATEGORY_ID" = ?,
				              "LINE_OF_BUSINESS_ID" = ?,
				              "CURRENT_ARCHITECTURE" = ?,
				              "CURRENT_VERSION" = ?,
				              "TARGET_ARCHITECTURE" = ?,
				              "TARGET_VERSION" = ?,
				              "NOTES" = ?,
				              "LAST_ARCHITECTURE_REVIEW_DATE" = ?,
				              "CURRENT_VERSION_END_OF_MAINTENANCE" = ?,
				              "TARGET_UPGRADE_CYCLE" = ?,
				              "EXECUTIVE_SUMMARY" = ?,
				              "APPLICATION_FUNCTION" = ?,
				              "MASTER_CI" = ?
							  WHERE "APPLICATION_ID" = ?`
			);
			const updResults1 = await db.statementExecPromisified(updStatement1, [
				PRODUCT_NAME_SHORT,
				PRODUCT_NAME_CAPTION,
				PRODUCT_NAME_LONG,
				VENDOR_ID,
				PRODUCT_OWNER,
				HOSTING_TYPE_ID,
				CATEGORY_ID,
				LINE_OF_BUSINESS_ID,
				CURRENT_ARCHITECTURE,
				CURRENT_VERSION,
				TARGET_ARCHITECTURE,
				TARGET_VERSION,
				NOTES,
				LAST_ARCHITECTURE_REVIEW_DATE,
				CURRENT_VERSION_END_OF_MAINTENANCE,
				TARGET_UPGRADE_CYCLE,
				EXECUTIVE_SUMMARY,
				APPLICATION_FUNCTION,
				MASTER_CI,
				data.APPLICATION_ID
			]);
	
			// ** Metrics **
			const statement2 = await db.preparePromisified(
				`SELECT * FROM ZEARN_METRICS 
							  WHERE APPLICATION_ID = ?`);
			const dataResults2 = await db.statementExecPromisified(statement2, [data.APPLICATION_ID]);
			console.log("metrics length: " + dataResults2.length);
	
			if (dataResults2.length < 1) { //If no records in zearn_metrics, then create an entry otherwise update entry
				//No Records
				console.log('Metrics No Records');
				METRIC_01 = data.METRIC_01;
				METRIC_02 = data.METRIC_02;
				METRIC_03 = data.METRIC_03;
	
				const Seqstatement2 = await db.preparePromisified(
					`SELECT \"metricSeqId\".NEXTVAL AS ID
								 FROM DUMMY`);
				const seqResult2 = await db.statementExecPromisified(Seqstatement2, []);
				console.log("Metric ID: " + seqResult2[0].ID);
	
				const insStatement2 = await db.preparePromisified(
					`INSERT INTO "ZEARN_METRICS" 
					("ID", "APPLICATION_ID", "METRIC_01", "METRIC_02", "METRIC_03") 
					VALUES (?,?,?,?,?)`
				);
				const updResults2 = await db.statementExecPromisified(insStatement2, [
					seqResult2[0].ID,
					data.APPLICATION_ID,
					data.METRIC_01,
					data.METRIC_02,
					data.METRIC_03
				]);
	
			} else {
				//Has Records
				console.log("Metrics has records");
				Object.keys(data).forEach(function (key) {
					dataResults2[0][key] = data[key];
				});
	
				if (!data.hasOwnProperty("METRIC_01")) {
					METRIC_01 = dataResults2[0].METRIC_01;
				} else {
					METRIC_01 = data.METRIC_01;
				}
	
				if (!data.hasOwnProperty("METRIC_02")) {
					METRIC_02 = dataResults2[0].METRIC_02;
				} else {
					METRIC_02 = data.METRIC_02;
				}
	
				if (!data.hasOwnProperty("METRIC_03")) {
					METRIC_03 = dataResults2[0].METRIC_03;
				} else {
					METRIC_03 = data.METRIC_03;
				}
	
				const updStatement2 = await db.preparePromisified(
					`UPDATE "ZEARN_METRICS" SET
								  "METRIC_01" = ?,
					              "METRIC_02" = ?,
					              "METRIC_03" = ?
								  WHERE "APPLICATION_ID" = ?`
				);
				const updResults2 = await db.statementExecPromisified(updStatement2, [
					METRIC_01,
					METRIC_02,
					METRIC_03,
					data.APPLICATION_ID
				]);
			}
	
			// ** Alias **
			const statement3 = await db.preparePromisified(
				`SELECT * FROM ZEARN_ALIAS 
							  WHERE APPLICATION_ID = ?`);
			const dataResults3 = await db.statementExecPromisified(statement3, [data.APPLICATION_ID]);
			console.log("alias length: " + dataResults3.length);
	
			if (dataResults3.length < 1) { //If no records in zearn_alias, then create an entry otherwise update entry
				//No Records
				console.log('Alias No Records');
				ALIAS = data.ALIAS;
	
				const Seqstatement3 = await db.preparePromisified(
					`SELECT \"aliasSeqId\".NEXTVAL AS ID
								 FROM DUMMY`);
				const seqResult3 = await db.statementExecPromisified(Seqstatement3, []);
				console.log("ALIAS ID: " + seqResult3[0].ID);
	
				const insStatement3 = await db.preparePromisified(
					`INSERT INTO "ZEARN_ALIAS" 
					("ID", "APPLICATION_ID", "ALIAS") 
					VALUES (?,?,?)`
				);
				const updResults3 = await db.statementExecPromisified(insStatement3, [
					seqResult3[0].ID,
					data.APPLICATION_ID,
					data.ALIAS
				]);
			} else {
				//Has Records
				console.log("Alias has records");
				Object.keys(data).forEach(function (key) {
					dataResults3[0][key] = data[key];
				});
	
				if (!data.hasOwnProperty("ALIAS")) {
					ALIAS = dataResults3[0].ALIAS;
				} else {
					ALIAS = data.ALIAS;
				}
	
				const updStatement3 = await db.preparePromisified(
					`UPDATE "ZEARN_ALIAS" SET
								  "ALIAS" = ?
								  WHERE "APPLICATION_ID" = ?`
				);
				const updResults3 = await db.statementExecPromisified(updStatement3, [
					ALIAS,
					data.APPLICATION_ID
				]);
			}
	
			// ** Tag **
			const statement4 = await db.preparePromisified(
				`SELECT * FROM ZEARN_TAG 
							  WHERE APPLICATION_ID = ?`);
			const dataResults4 = await db.statementExecPromisified(statement4, [data.APPLICATION_ID]);
			console.log("Tag length: " + dataResults4.length);
	
			if (dataResults4.length < 1) { //If no records in zearn_alias, then create an entry otherwise update entry
				//No Records
				console.log('Tag No Records');
				TAG = data.TAG;
	
				const Seqstatement4 = await db.preparePromisified(
					`SELECT \"tagSeqId\".NEXTVAL AS ID
								 FROM DUMMY`);
				const seqResult4 = await db.statementExecPromisified(Seqstatement4, []);
				console.log("TAG ID: " + seqResult4[0].ID);
	
				const insStatement4 = await db.preparePromisified(
					`INSERT INTO "ZEARN_TAG" 
					("ID", "APPLICATION_ID", "TAG") 
					VALUES (?,?,?)`
				);
				const updResults4 = await db.statementExecPromisified(insStatement4, [
					seqResult4[0].ID,
					data.APPLICATION_ID,
					data.TAG
				]);
			} else {
				//Has Records
				console.log("Tag has records");
				Object.keys(data).forEach(function (key) {
					dataResults4[0][key] = data[key];
				});
	
				if (!data.hasOwnProperty("TAG")) {
					TAG = dataResults4[0].TAG;
				} else {
					TAG = data.TAG;
				}
	
				const updStatement4 = await db.preparePromisified(
					`UPDATE "ZEARN_TAG" SET
								  "TAG" = ?
								  WHERE "APPLICATION_ID" = ?`
				);
				const updResults4 = await db.statementExecPromisified(updStatement4, [
					TAG,
					data.APPLICATION_ID
				]);
			}
	
			return data;
		} else {
			throw new Error(`Erro: doesn't have admin right`);
		}
	});

	this.before("UPDATE", "zearn_capabilities", async(User) => {
		console.log("** Update zearn_capabilities **");
		const {
			data
		} = User;
		console.log(data);

		if (data.TARGET_ARCHITECTURE_DATE === "1970-01-01") {
			data.TARGET_ARCHITECTURE_DATE = null;
		}
	});

	this.before("CREATE", "zearn_capabilities", async(User) => {
		console.log("** Create zearn_capabilities **");
		const {
			data
		} = User;
		console.log(data);

		const dbClass = require(global.__base + "utils/dbPromises");
		var client = await dbClass.createConnection();
		let db = new dbClass(client);

		const statement = await db.preparePromisified(
			`SELECT \"capabilitySeqId\".NEXTVAL AS ID
						 FROM DUMMY`);
		const dataResults = await db.statementExecPromisified(statement, []);
		console.log(dataResults[0].ID);

		if (data.TARGET_ARCHITECTURE_DATE === "1970-01-01") {
			data.TARGET_ARCHITECTURE_DATE = null;
		}

		data.ID = dataResults[0].ID;

		return data;
	});

	this.before("UPDATE", "zearn_event", async(User) => {
		console.log("** Update zearn_event **");
		const {
			data
		} = User;
		console.log(data);

		if (data.STARTDATE === "1970-01-01") {
			data.STARTDATE = null;
		}

		if (data.ENDDATE === "1970-01-01") {
			data.ENDDATE = null;
		}
	});

	this.before("CREATE", "zearn_event", async(User) => {
		console.log("** Create zearn_event **");
		const {
			data
		} = User;
		console.log(data);

		const dbClass = require(global.__base + "utils/dbPromises");
		var client = await dbClass.createConnection();
		let db = new dbClass(client);

		const statement = await db.preparePromisified(
			`SELECT \"eventSeqId\".NEXTVAL AS ID
						 FROM DUMMY`);
		const dataResults = await db.statementExecPromisified(statement, []);
		console.log(dataResults[0].ID);

		if (data.STARTDATE === "1970-01-01") {
			data.STARTDATE = null;
		}

		if (data.ENDDATE === "1970-01-01") {
			data.ENDDATE = null;
		}

		data.ID = dataResults[0].ID;

		return data;
	});

	this.before("CREATE", "zearn_projects", async(User) => {
		console.log("** Create zearn_projects **");
		const {
			data
		} = User;
		console.log(data);
		
		const {
			attr
		} = User;

		var dataRes = [];
		Object.keys(attr).forEach(function (key) {
			dataRes[key] = attr[key];
		});

		var proceed = false;
		for (var i = 0; i < dataRes.scopes.length; i++) {
			if (dataRes.scopes[i].includes(adm)) {
				console.log("adm");
				proceed = true;
				break;
			}
		}
		
		if(proceed) {
			const dbClass = require(global.__base + "utils/dbPromises");
			var client = await dbClass.createConnection();
			let db = new dbClass(client);
	
			const statement = await db.preparePromisified(
				`SELECT APPLICATION_ID AS APPLICATION_ID 
				    FROM ZEARN_PROJECTS
					WHERE APPLICATION_ID = ?`);
			const dataResults = await db.statementExecPromisified(statement, [data.APPLICATION_ID]);
	
			console.log(dataResults.length);
	
			if (dataResults.length < 1) {
	
				const statement = await db.preparePromisified(
					`SELECT \"projectsSeqId\".NEXTVAL AS ID
							 FROM DUMMY`);
				const dataResults = await db.statementExecPromisified(statement, []);
				console.log(dataResults[0].ID);
	
				data.ID = dataResults[0].ID;
	
				return data;
			} else {
				throw new Error(`Application ID for ${data.APPLICATION_ID} already exist`);
			}
		} else {
			throw new Error(`Erro: doesn't have admin right`);
		}
	});
};