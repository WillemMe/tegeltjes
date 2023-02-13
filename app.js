const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const { spawn } = require('child_process');
const validator = require('express-validator');
const fs = require("fs");
var app = express();

// ╔═════════════════════════════════════════════════════════════════════════════╗
// ║                                MIDDLEWARE                                   ║
// ╚═════════════════════════════════════════════════════════════════════════════╝

// parse application/x-module.exports=www-form-urlencoded
var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(urlencodedParser)

// parse application/json
var jsonParser = bodyParser.json();
app.use(jsonParser)
// ╔═════════════════════════════════════════════════════════════════════════════╗
// ║                               EXPRESS SETUP                                 ║
// ╚═════════════════════════════════════════════════════════════════════════════╝

app.listen(3000, function(){console.log("Listening on port 3131")})
app.use("/tegelfabriek",express.static(__dirname + '/public'));

// ╔═════════════════════════════════════════════════════════════════════════════╗
// ║                             ERROR HANDLERS                                  ║
// ╚═════════════════════════════════════════════════════════════════════════════╝

app.use(function(err, req, res, _next) {
  res.status(err.status || 404).send("Something went wrong!");
  console.log("ERROR:" + err);
});

function error(err){
  if(err){
    console.log("ERROR")
    throw err;
  }
}

// ╔═════════════════════════════════════════════════════════════════════════════╗
// ║                                 Functions                                   ║
// ╚═════════════════════════════════════════════════════════════════════════════╝



function makeid(length) {
   var result           = '';
   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

// ╔═════════════════════════════════════════════════════════════════════════════╗
// ║                                  Routing                                    ║
// ╚═════════════════════════════════════════════════════════════════════════════╝
//

app.get

app.post("/tegelfabriek/nieuweTegel",(req, res) =>{
	console.log(req.body);
	let name = req.body.naam.replace(/(["\s'$`\\])/g,'\\$1');

	let qoute = req.body.qoute.replace(/(["\s'$`\\])/g,'\\$1')
	let id = makeid(12);
	fs.mkdir(path.join(__dirname, "public/tegels", id),(err)=>{
		console.log(req.body);
		let font = getFont(req.body.type);
		let command = "convert"
		let args = ["-gravity", "Center", "-font", `${font}`, "-size", "330x330", "-background", "none", `caption:${qoute}\n\n${name}`, `${path.join(__dirname,"public/tegelTemplate",req.body.kleur, req.body.tegel)}.jpg`, "+swap", "-gravity", "Center", "-composite", `${path.join(__dirname, "public/tegels",id)}/tegel.jpg`]
		console.log(command, args);
		let image = spawn(command,args);
		image.stdout.on('data', (data) => {
  		console.log(`stdout: ${data}`);
		});
		image.stderr.on('data', (data) => {
  		console.log(`stdout: ${data}`);
		});
		image.on("exit", (code) =>{

			res.status(200).send(`tegels/${id}/tegel.jpg`)
		});
	})
});

app.post("/tegelfabriek/nieuweTegelLinked", (req, res) =>{
	let id = makeid(12);
	let tegelPath = path.join(__dirname, "public/tegels", id);
	fs.mkdir(tegelPath,(err)=>{
		let tegels = req.body.tegels;
		console.log(tegels);
		for(let i = tegels.length-1; i>=0;i--){
			let cur = tegels[i];
			let font = getFont(cur.type);
			let command = "convert"
			let args = ["-gravity", "Center", "-font", `${font}`, "-size", "330x330", "-background", "none", `caption:${cur.qoute}\n\n${cur.naam}`, `${path.join(__dirname,"public/tegelTemplate",cur.kleur, cur.tegel)}.jpg`, "+swap", "-gravity", "Center", "-composite", `${tegelPath}/${i}.jpg`]
			let image = spawn(command,args);
			image.stdout.on('data', (data) => {
	  		console.log(`stdout: ${data}`);
			});
			image.stderr.on('data', (data) => {
	  		console.log(`stdout: ${data}`);
			});
			image.on("exit", (code) =>{
				let prev = (i !== tegels.length-1? i+1 : "#");
				let html = `
				<!DOCTYPE html>
				<html lang="en" dir="ltr">
  				<head>
						<meta content="text/html;charset=utf-8" http-equiv="Content-Type">
						<meta content="utf-8" http-equiv="encoding">
						<title>Willems tegelfabriek</title>
					</head>
					<body>
						<a href="${prev}.html"><img src="/tegelfabriek/tegels/${id}/${i}.jpg"/></a>
					</body>
					</html>
				`
				fs.writeFile(`${tegelPath}/${i}.html`,html, err =>{
					if (err) throw err;
					if (i == 0){
						res.json(`tegels/${id}/0.html`);
					}
				});
			});
		}
	})
});


function getFont(font){
	switch(font){
		case "one":
			return "Great-Vibes";
			break;
		case "two":
			return "Cookie-Regular";
			break;
		case "three":
			return "Merienda";
			break;
		default:
			return "Great-Vibes"
	}
}
