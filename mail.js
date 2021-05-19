const mailgun = require("mailgun-js");
const DOMAIN = "sandbox473fdcec8c9646e5a03622f50f53abf4.mailgun.org";
const mg = mailgun({apiKey: "228f80d88f5aa544cf6e9cedd0ace19f-6ae2ecad-92838f8e", domain: DOMAIN});
const data = {
	from: "Mailgun Sandbox <postmaster@sandbox473fdcec8c9646e5a03622f50f53abf4.mailgun.org>",
	to: "chikajohnson@gmail.com",
	subject: "Hello testing app",
	text: "Testing some Mailgun awesomness!"
};
mg.messages().send(data, function (error, body) {
	console.log(body);
});