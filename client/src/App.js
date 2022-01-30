import "./App.css";
import StripeCheckout from "react-stripe-checkout";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  // Product Object
  const [product] = useState({
    name: "Pixel Buds A series",
    price: 200,
    description: "This is book written by Mr. Kishankumar Patel",
  });

  // Configure toast
  toast.configure();

  const handleToken = async (token, addresses) => {
    const response = await axios.post("http://localhost:5000/checkout", {
      token,
      product,
    });

    // take response
    console.log(response.status);

    if (response.status === 200) {
      toast("Success Payment is completed", { type: "success" });
    } else {
      toast("Failure Payment is not completed", { type: "failure" });
    }
  };

  return (
    <div className="App">
      <div className="container">
        <br />
        <br />
        <h1 className="text-center">Stripe Payment Checkout</h1>
        <br />
        <br />
        <div class="container">
          <div class="row justify-content-center">
            <div class="col" />
            <div class="col">
              <div className="card" style={{ width: "18rem" }}>
                <img src="/buds.jpeg" className="card-img-top" alt="..." />
                <div>
                  <div className="card-body text-center">
                    <h5 className="card-title">{product.name}</h5>
                    <p className="card-text">
                      Some quick example text to build on the card title and
                      make up the bulk of the card's content.
                    </p>
                    <StripeCheckout
                      className={"center"}
                      stripeKey={
                        "pk_test_51KKmc4Ix096HLZB7nVns8hNYemvW1hRXwd0IPCBXBG8Za0eKwgsAOxnp26jahdklnvDqdaqQEGaHRMYKhh2N2pX300v2STlu6W"
                      }
                      token={handleToken}
                      amount={product.price * 100}
                      name={product.name}
                      billingAddress
                      shippingAddress
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="col" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
