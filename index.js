const express = require('express')
const fs = require('fs')
const crypto = require('crypto');

const app = express()

const port = 10333
const channelsFile = "channels.json"


let channels = JSON.parse(fs.readFileSync(channelsFile));
let count = 0;

function writeChannels() {
	fs.writeFileSync(channelsFile, JSON.stringify(channels));
}

function hash(secret, data) {
	return crypto.createHmac('sha256', secret)
		.update(data)
		.digest('hex');
}

writeChannels();

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

app.get('/master/', (req, res) => {
  res.send(`Running. Served: ${count}`)
})

app.get('/master/channel', (req, res) => {
	count = count + 1 

	try {
		let id = req.query["id"];
		let channel = channels[id];

		if(channel === undefined) {
			res.status(404);
			res.send(`Channel '${id}'' not found!`)
			return;
		}

		res.status(200);
		res.send(JSON.stringify({
			"status": channel["status"],
			"description": channel["description"],
			"url": channel["url"]
		}));
		
 	} catch (err) {
 		console.log(err);
 		res.status(500)
		res.send("Error!");
 		return;
 	}
});

app.get('/master/set', async (req, res) => {
	count = count + 1 

	try {
		let id = req.query["id"];
		let channel = channels[id];

		if(channel === undefined) {
			res.status(404);
			res.send(`Channel '${id}'' not found!`)
			return;
		}

		let payload = req.query["payload"];
		let checkHash = req.query["hash"];

		payload = new Buffer.from(payload, 'base64').toString('ascii');

		let myHash = hash(channel["secret"], payload)

		if(myHash != checkHash) {
			res.status(403);
			res.send('Could not update channel: Hash mismatch!');
			return;
		}

		let object = JSON.parse(payload)
		if(object["url"] !== undefined) {
			channel["url"] = object["url"]
		}
		if(object["status"] !== undefined) {
			channel["status"] = object["status"]
		}
		res.status(200);
		res.send("OK");

		writeChannels();
		
 	} catch (err) {
 		console.log(err);
 		res.status(500);
		res.send("Error!");
 		return;
 	}
})

app.listen(port, () => {
  console.log(`codeklavier-ar-masster running on @ http://localhost:${port}`)
})