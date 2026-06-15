/* eslint-disable react-refresh/only-export-components */
import {useContext, createContext, useState, useEffect} from 'react'
import {authFetch, getAccessToken} from '../utils/auth'

const CartContext = createContext()

export const CartProvider = ({children}) => {
    const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL
    const [cartItems, setCartItms] = useState([])
    const [total, setTotal] = useState(0)

    //fetch cart items
    const fetchCart = async () => {
        try {
            const res = await authFetch(`${BASEURL}/api/cart/`)
            const data = await res.json()
            setCartItms(data.items || [])
            setTotal(data.total || 0)
        } catch (error) {
        if (error.response && error.response.status === 401) {
            console.log(error.response.data.detail)
        } else {
            console.log(error.message)
        }
        }
        
    }

    useEffect(() => {
        fetchCart();
    }, [])

    //Add to cart
    const addToCart = async (productId) => {
        try {
            await authFetch(`${BASEURL}/api/cart/add/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({  
                    product_id: productId,
                    quantity: 1
                })
            })
            fetchCart()

        }catch (error) {
            console.error("Error adding to cart",error)
        }
      
    }

    //Remove from cart
    const removeFromCart = async (itemId) => {
        try{
            await authFetch(`${BASEURL}/api/cart/remove/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ item_id: itemId }),
            });
            fetchCart();
        } catch (error) {
            console.error("Error removing from cart:", error);
        }
    }

    //Update quantity
    const updateQuantity = async (itemId, quantity) => {
        if (quantity < 1){
            await removeFromCart(itemId);
            return;
        }
        try{
            await authFetch(`${BASEURL}/api/cart/update/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ item_id: itemId, quantity }),
            });
            fetchCart();
        } catch (error) {
            console.error("Error updating quantity:", error);
        }
    }
    const clearCart = () => {
        setCartItms([])
        setTotal(0)
    }

    return (
        <CartContext.Provider value={{cartItems,total, addToCart, removeFromCart, updateQuantity, clearCart}}>
            {children}
        </CartContext.Provider>
    )

}

export const useCart = () => useContext(CartContext)