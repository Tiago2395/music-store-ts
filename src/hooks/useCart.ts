import { useState, useEffect } from "react";
import { db } from "../data/db";
import { useMemo } from "react";
import type { Guitar, CartItem } from "../types/types";

const useCart = () => {
    const initialCart = () : CartItem[] => {
    const localStorageItems = localStorage.getItem('cart');
    return localStorageItems ? JSON.parse(localStorageItems) : [];
  }

  const [data, setData] = useState<Guitar[]>([]);
  const [cart, setCart] = useState(initialCart());

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const MAX_ITEMS = 5;

  function addToCart(item : Guitar) {
    const itemExists = cart.findIndex(guitar => guitar.id === item.id);

    if(itemExists != -1) { //Si ya está el item en el carrito:
      const updatedCart = [...cart]; //Hacemos una copia del carrito actual
      if (updatedCart[itemExists].amount < MAX_ITEMS) {
        updatedCart[itemExists].amount++; //Aumentamos la cantidad del item elegido
        setCart(updatedCart); //Actualizamos el carrito
      }
    } else { //Si no está el item en el carrito
      const newItem : CartItem = {...item, amount : 1}; //Castemos de Guitar a CartItem. Además, ponemos la cantidad en 1
      setCart((prevCart) => [...prevCart, newItem]); //Añadimos el item a continuación de lo que ya había
    }
  }

  function increaseQuantity(id : Guitar['id']) {
    const updatedCart = cart.map((item) => {
      if(item.id === id && item.amount < MAX_ITEMS) {
        return {
          ...item,
          amount: item.amount + 1
        }
      }
      return item;
    });
    setCart(updatedCart);
  }

  function removeFromCart(id : Guitar['id']) {
    setCart( (prevCart) => prevCart.filter(guitar => guitar.id !== id));
  }

  function removeOneFromCart(id : Guitar['id']) {
    const updatedCart = cart.map((item) => {
      if(item.id === id) {
        if(item.amount > 1) {
          return {
            ...item,
            amount: item.amount - 1
          }
        } else {
          return null;
        }
      }
      return item;
    }).filter(item => item !== null);
    setCart(updatedCart);
  }

  function clearCart() {
    setCart([]);
  }

  /* El código anterior hace lo mismo que este pero es más óptimo
  function removeOneFromCart(id) {
    const index = cart.findIndex(guitar => guitar.id === id);
    const updatedCart = [...cart];
    if (updatedCart[index].amount > 1) {
      updatedCart[index].amount--;
      setCart(updatedCart);
    } else {
      removeFromCart(id);
    }
  }
  */

  useEffect(() => {
    setData(db);
  }, []);

  //State derivado:
    const isEmpty = useMemo(() => cart.length === 0, [cart]);
    const totalToPay = useMemo(() => cart.reduce((total, item) => {
        return total = total + (item.amount * item.price);
    }, 0), [cart]);

  return {
    data,
    cart,
    addToCart,
    increaseQuantity,
    removeFromCart,
    removeOneFromCart,
    clearCart,
    isEmpty,
    totalToPay
  }
}

export default useCart;