/*eslint no-console: 0, no-unused-vars: 0, no-undef:0, no-process-exit:0*/
/*eslint-env node, es6 */
"use strict";
const port = process.env.PORT || 8083;
const server = require("http").createServer();

const cds = require("@sap/cds");
//Initialize Express App for XSA UAA and HDBEXT Middleware
const xsenv = require("@sap/xsenv");
const passport = require("passport");
const xssec = require("@sap/xssec");
const xsHDBConn = require("@sap/hdbext");
const express = require("express");
global.__base = __dirname + "/";

//bot
const bodyParser = require("body-parser");
const request = require("request");

//logging
var logging = require("@sap/logging");
var appContext = logging.createAppContext();

//Initialize Express App for XS UAA and HDBEXT Middleware
var app = express();

//Compression
app.use(require("compression")({
  threshold: "1b"
}));

//Helmet for Security Policy Headers
const helmet = require("helmet");
// ...
app.use(helmet());
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    styleSrc: ["'self'", "sapui5.hana.ondemand.com"],
    scriptSrc: ["'self'", "sapui5.hana.ondemand.com"]
  }
}));
// Sets "Referrer-Policy: no-referrer".
app.use(helmet.referrerPolicy({ policy: "no-referrer" }));

passport.use("JWT", new xssec.JWTStrategy(xsenv.getServices({
	uaa: {
		tag: "xsuaa"
	}
}).uaa));
app.use(logging.middleware({
	appContext: appContext,
	logNetwork: true
}));
app.use(passport.initialize());
var hanaOptions = xsenv.getServices({
	hana: {
		tag: "hana"
	}
});
hanaOptions.hana.pooling = true;
app.use(
	passport.authenticate("JWT", {
		session: false
	}),
	xsHDBConn.middleware(hanaOptions.hana)
);

//CDS OData V4 Handler
var options = {
	driver: "hana",
	logLevel: "error"
};
//Use Auto Lookup in CDS 2.10.3 and higher
//Object.assign(options, hanaOptions.hana, {
//	driver: options.driver
//});

cds.connect(options);


// Main app
/*
cds.serve("gen/csn.json", {
		crashOnError: false
	})
	.at(odataURL)
	.with(require("./lib/handlers"))
	.in(app)
	.catch((err) => {
		console.log(err);
		process.exit(1);
	});
*/

//******************************************* Bot Engine **********************************************************
app.use(bodyParser.json());

function sendTextReply(res, msg) {
    res.send({
        replies: [{
            type: 'text',
            content: msg
        }],
        conversation: {
            memory: {
                key: "Null"
            }
        }
    });
}

function sendCardsReply(res, card_title, card_sub_title, image_url, button_title, button_type, button_value, memkey) {
    res.send({
        replies: [{
            type: "card",
            content: {
			  title: card_title,
			  subtitle: card_sub_title,
			  imageUrl: image_url,
			  buttons: [
				{
				  title: button_title,
				  type: button_type,
				  value: button_value
				}
			  ]
			}
        }],
        conversation: {
            memory: {
                key: memkey
            }
        }
    });
}

function sendQuickReply(res, msg, memkey) {
    res.send({
		replies: [{
			type: "quickReplies",
            content: {
				title: msg,
				buttons: [{ title: "Yes", value: "Yes" }, { title: "No", value: "No"} ]
			}
        }],
        conversation: {
			memory: {
				key: memkey
            }
        }
    });
}

function sendButtonReply(res, msg, title, linkvalue) {
    res.send({
        replies: [{
			type: 'buttons',
            content: {
				title: msg,
				buttons: [
				{
				  title: title,
				  type: "web_url",
				  value: linkvalue
				}
			  ]
			}
        }],
        conversation: {
			memory: {
				key: "Null"
            }
        }
    });
}

app.post('/', (req, res) => {

    let slug = req.body.nlp.intents[0].slug;
    console.log("slug: " + slug);

    //Question: Show me top 10 routes with high actual variances 
	if (slug === "create_catalog") {

        let entities = req.body.nlp.entities;
		if(entities.hasOwnProperty("vendor")) {
			console.log("Entities vendor");
			sendCardsReply(res, "Vendor", "Create Vendor", "https://ferrydjaja.github.io/AODImages/vendor.jpg", "Open link", "web_url", "https://sdb1d1d.pfizer.com:8134/nwbc/~canvas/roleEntry/PB1_MDGS_LVC_MENU_GLBL:60?sap-client=226&PARTITION=SAP&BUKRS=&sap-language=EN", "memkey");
		}

		if(entities.hasOwnProperty("office")) {
			console.log("Entities office");
			sendCardsReply(res, "Office", "Create Office Supplies", "https://ferrydjaja.github.io/AODImages/officesupply.jpg", "Open link", "web_url", "https://s1.ariba.com/gb/landingPage?id=OfficeSupplies&realm=pfizerdevchild3-T", "memkey");
		}
    } 
});
//******************************************* Bot Engine **********************************************************

// Redirect any to service root
app.get("/", (req, res) => {
	res.send("Bot Server");
});
app.get("/node", (req, res) => {
	//res.redirect(odataURL);
	res.send("PFE iERP Bot Server");
});

//Setup Additonal Node.js Routes
require("./router")(app, server);

//Start the Server 
server.on("request", app);
server.listen(port, function () {
	console.info(`HTTP Server: ${server.address().port}`);
});