export const addToCart = (pizza, quantity, varient) => (dispatch, getState) => {
    var cartItem = {
      name: pizza.name,
      description: pizza.description,
      _id: pizza._id,
      image: pizza.image,
      varient: varient,
      quantity: Number(quantity),
      prices: pizza.prices,
      price: pizza.prices[0][varient] * quantity,
    };
    if (cartItem.quantity > 5) {
      alert("you Can only add 5 pizzas");
    } else {
      if (cartItem.quantity < 1) {
        dispatch({ type: "DELETE_FROM_CART", payload: pizza });
      } else {
        dispatch({ type: "ADD_TO_CART", payload: cartItem });
        localStorage.setItem(
          "cartItems",
          JSON.stringify(getState().cartReducer.cartItems)
        );
      }
    }
  };
  
  export const deleteFromCart = (pizza) => (dispatch, getState) => {
    dispatch({ type: "DELETE_FROM_CART", payload: pizza });
    const cartItems = getState().cartReducer.cartitems;
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  };
  