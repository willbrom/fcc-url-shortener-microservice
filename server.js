require("dotenv").config()

const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const dns = require("dns")
const { URL } = require("url")

const app = express()
const port = process.env.PORT

let urls = []
let count = 0

app.use(cors())
app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static(__dirname + "/public"))

app.get("/", (req, res) => {
	res.sendFile(__dirname + "/views/index.html")
})

app.post("/api/shorturl", (req, res) => {
	let url = req.body.url
	
	try {
		let hostname = new URL(url).hostname
		let protocol = new URL(url).protocol

		if (protocol == "http:" || protocol == "https:") {
			dns.lookup(hostname, (err, address, family) => {
				if (err) throw(err)
				else {
					let urlObj = {original_url: url, short_url: ++count}
					urls.push(urlObj)
					res.json(urlObj)
				}
			})
		} else throw("protocol error")
	} catch (e) {
		res.json({
			error: "invalid url"
		})
	}
})

app.get("/api/shorturl/:num", (req, res) => {
	let num = req.params.num
	try {
		res.redirect(urls[num - 1]["original_url"])
		res.end()
	} catch (e) {
		res.json({
			error: "invalid url"
		})
	} 
})

app.listen(port, () => {
	console.log(`listening at port: ${port}`)
})
