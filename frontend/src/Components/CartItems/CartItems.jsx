import React, { useContext } from "react";
import "./CartItems.css";
import cross_icon from "../Assets/cart_cross_icon.png";
import { ShopContext } from "../../Context/ShopContext";
import { backend_url, currency } from "../../App";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";

//                    OLD CART PAYMENT CODE SOME ISSUES

// const CartItems = () => {
//   const { products } = useContext(ShopContext);
//   const { cartItems, removeFromCart, getTotalCartAmount } =
//     useContext(ShopContext);

//   console.log(products, cartItems);
//   const newCartItems = products.map((e) => {
//     return {
//       ...e,
//       quantity: cartItems[e.id],
//     };
//   });
//   console.log(newCartItems);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const stripe = await loadStripe(
//         "pk_test_51Pe96DDBIOaszM2vAyq5S4A9x3hNDBEz80qVaekptmvOEBCVfWlcFf6gCjsZvRDUzy0eUpP49OINJQOLy6G2yesf00anJCcou4"
//       );
//       const body = {
//         products: newCartItems,
//       };

//       const response = await axios.post(
//         `http://localhost:4000/create-checkout-session`,
//         body
//       );
//       const result = stripe.redirectToCheckout({
//         sessionId: response.data.id,
//       });
//       if (result.error) {
//         console.log(result.error);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//         NEW CART PAYMENT CODE WITH NO ISSUES

const CartItems = () => {
  const { products } = useContext(ShopContext);
  const { cartItems, removeFromCart, getTotalCartAmount } =
    useContext(ShopContext);

  const newCartItems = products
    .filter((e) => cartItems[e.id] > 0)
    .map((e) => ({
      name: e.name,
      new_price: e.new_price,
      quantity: cartItems[e.id],
    }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newCartItems.length === 0) {
      alert(
        "Your cart is empty. Please add some products before proceeding to checkout."
      );
      return;
    }
    try {
      const stripe = await loadStripe(
        "pk_test_51Pe96DDBIOaszM2vAyq5S4A9x3hNDBEz80qVaekptmvOEBCVfWlcFf6gCjsZvRDUzy0eUpP49OINJQOLy6G2yesf00anJCcou4"
      );
      const body = { products: newCartItems };

      const response = await axios.post(
        `http://localhost:4000/create-checkout-session`,
        body
      );
      const result = await stripe.redirectToCheckout({
        sessionId: response.data.id,
      });
      if (result.error) {
        console.log(result.error.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="cartitems">
      <div className="cartitems-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Price</p>
        <p>Quantity</p>
        <p>Total</p>
        <p>Remove</p>
      </div>
      <hr />
      {products.map((e) => {
        if (cartItems[e.id] > 0) {
          return (
            <div>
              <div className="cartitems-format-main cartitems-format">
                <img
                  className="cartitems-product-icon"
                  src={backend_url + e.image}
                  alt=""
                />
                <p cartitems-product-title>{e.name}</p>
                <p>
                  {currency}
                  {e.new_price}
                </p>
                <button className="cartitems-quantity">
                  {cartItems[e.id]}
                </button>
                <p>
                  {currency}
                  {e.new_price * cartItems[e.id]}
                </p>
                <img
                  onClick={() => {
                    removeFromCart(e.id);
                  }}
                  className="cartitems-remove-icon"
                  src={cross_icon}
                  alt=""
                />
              </div>
              <hr />
            </div>
          );
        }
        return null;
      })}

      <div className="cartitems-down">
        <div className="cartitems-total">
          <h1>Cart Totals</h1>
          <div>
            <div className="cartitems-total-item">
              <p>Subtotal</p>
              <p>
                {currency}
                {getTotalCartAmount()}
              </p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <p>Shipping Fee</p>
              <p>Free</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <h3>Total</h3>
              <h3>
                {currency}
                {getTotalCartAmount()}
              </h3>
            </div>
          </div>
          <button onClick={handleSubmit}>PROCEED TO CHECKOUT</button>
        </div>
        <div className="cartitems-promocode">
          <p>If you have a promo code, Enter it here</p>
          <div className="cartitems-promobox">
            <input type="text" placeholder="promo code" />
            <button>Submit</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItems;
