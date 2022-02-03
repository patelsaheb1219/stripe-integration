const express = require("express");
const bodyparser = require("body-parser");
const dotenv = require("dotenv");
const uuid = require("uuid").v4;
const cors = require("cors");
const app = express();

dotenv.config({ path: "./config/config.env" });
const stripe = require("stripe")(process.env.SECRET_KEY);

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyparser.urlencoded({ extended: false }))
app.use(bodyparser.json())

app.post('/checkout', async (req, res, next) => {
  console.log("Request:", req.body);

  let error = null;
  let status = null;

  try {
    const { product, token } = req.body;

    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id
    })

    const key = uuid();

    const charge = await stripe.charges.create(
      {
        amount: product.price * 100,
        currency: "usd",
        customer: customer.id,
        receipt_email: token.email,
        description: `Purchased the ${product.name}`,
        shipping: {
          name: token.card.name,
          address: {
            line1: token.card.address_line1,
            line2: token.card.address_line2,
            city: token.card.address_city,
            country: token.card.address_country,
            postal_code: token.card.address_zip,
          },
        },
      },
      {
        idempotencyKey: key,
      }
    );
    console.log("Charge:", { charge });
    status = "success";
  } catch (err) {
    console.error("Error:", err);
    status = "failure";
  }
  res.json({ error, status });
})

//Serve static assets if in production
if (process.env.NODE_ENV === "production") {
  //Set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Port is running on ${PORT}`);
})