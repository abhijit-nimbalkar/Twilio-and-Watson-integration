/*eslint-env node*/

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');
// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();


const http = require('http');
const express = require('express');
const app = express();
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const bodyParser = require('body-parser');


const AssistantV1 = require('watson-developer-cloud/assistant/v1');

const assistant = new AssistantV1({
  iam_apikey: 'APt-AdfNPr_aaEvFlvkbJiDvwnKTlao8JCDCocwLeHQG',
  version: '2019-02-28',
  url: 'https://gateway.watsonplatform.net/assistant/api'
});

var userContext=null;

app.use(bodyParser.urlencoded({extended:true}));

app.post('/sms', (req, res) => {
	
	var textingNumber = req.body.From;
	var myTwilioNumber = req.body.To;
	var textmsg = req.body.Body
	
	assistant.message(
	{
		workspace_id: '9d9902f9-43bd-462f-9c70-78204d78aa98',
		input: {'text': textmsg},
		context: userContext 
	},  
	function(err, response) {
		if (err) {
			console.log('error:', err);
		}
		else {
			console.log('watson returned = ' + JSON.stringify(response));
			userContext = response.context;
			const twiml = new MessagingResponse();
			twiml.message(response.output.text[0]);
			res.writeHead(200, {'Content-Type': 'text/xml'});
			res.end(twiml.toString());
		}
	});
 
});


// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});
