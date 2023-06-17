require("dotenv").config();
const express = require("express");
let cors = require("cors");
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_TEST_KEY);

const app = express();
app.use(cors());
app.use(express.static("public"));
app.use(express.json());

app.post("/checkout", async (req, res) => {
	console.log(req.body);
	const items = req.body.items;
	let lineItems = [];
	items.forEach((item) => {
		lineItems.push({
			price: item.id,
			quantity: item.quantity,
		});
	});

	const session = await stripe.checkout.sessions.create({
		line_items: lineItems,
		mode: "payment",
		success_url: "https://froot-emporium.vercel.app/success",
		cancel_url: "https://froot-emporium.vercel.app/cancel",
	});

	res.send(
		JSON.stringify({
			url: session.url,
		})
	);
});

app.listen(4000, () => console.log("Listening on port 4000!"));
