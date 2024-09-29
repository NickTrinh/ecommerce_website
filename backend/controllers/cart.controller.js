import Product from "../models/product.model.js";

// get items from cart
export const getCartProducts = async (req, res) => {
    try {
        // check id for cart items and get them from the cart
        const products = await Product.find({_id:{$in:req.user.cartItems}});
        
        // add quantity for each product
        const cartItems = products.map(product => {
            const item = req.user.cartItems.find(cartItem => cartItem.id == product.id);
            return { ...product.toJSON(), quantity: item.quantity};
        });

        res.json(cartItems);
    } catch (error) {
        console.log("Error in getCartProducts controller", error.message);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}



// add 1 item to cart
export const addToCart = async (req, res) => {
    try {
        // get product item from user in protected route
        const {productId} = req.body;
        const user = req.user;
        // check if the item exists
        const existingItem = user.cartItems.find(item => item.id == productId);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            user.cartItems.push(productId);
        }
        // save user and their cart item to database
        await user.save();
        res.json(user.cartItems)

    } catch (error) {
        console.log("Error in addToCart controller", error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// remove all from cart
export const removeAllFromCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const user = req.user;
        if (!productId) {
            user.cartItems = [];
        } else {
            user.cartItems = user.cartItems.filter((item) => item.id !== productId);
        }
        await user.save();
        res.json(user.cartItems);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// get request and update of response
export const updateQuantity = async (req, res) => {
    try {
        const {id:productId} = req.params;
        const {quantity} = req.body;
        const user = req.user;
        const existingItem = user.cartItems.find((item) => item.id === productId);

        
        if(existingItem) {
            // if quantity is 0, remove from cart
            if(quantity == 0) {
                user.cartItems = user.cartItems.filter((item) => item.id !== productId);
                await user.save();
                return res.json(user.cartItems);
            }
            // update quantity -1 or +1
            existingItem.quantity = quantity;
            await user.save();
            res.json(user.cartItems);
        } else {
            res.status(404).json({message: "Product not found"});
        }
    } catch (error) {
        console.log("Error in updateQuantity controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

