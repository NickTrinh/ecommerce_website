import Product from '../models/product.model.js';
import cloudinary from "../lib/cloudinary.js";
export const getAllProducts = async (req, res) => {
	try {
		const products = await Product.find({}); // Fetch all products
		res.json({ products });
	} catch (error) {
		console.log('Error in getAllProducts controller', error.message);
		res.status(500).json({ message: 'Server error', error: error.message });
	}
};

// save in redis and cache products for user to access 
export const getFeaturedProducts = async (req, res) => {
	try {
		let featuredProducts = await redis.get("featured_products")
		if(featuredProducts) {
			return res.json(JSON.parse(featuredProducts));
		}
		// if not in redis, fetch from mongodb
		// .lean() is going to return a plain js object instead of monodb document (good for performance)

		featuredProducts = await Product.find({isFeatured:true}).lean();

		if(!featuredProducts) {
			return res.status(404).json({ message: 'Featured products not found' });
		}
		
		// update cache to store in redis for future quick access
		await redis.set("featured_products", JSON.stringify(featuredProducts));
		
		res.json(featuredProducts);
	} catch (error) {
		console.log('Error in getFeaturedProducts controller', error.message);
		res.status(500).json({ message: 'Server error', error: error.message });
	}

};

// create product
export const createProduct = async (req, res) => {
	try {
		const {name, description, price, image, category} = req.body

		let cloudinaryResponse = null

		if(image){
			await cloudinary.uploader.upload(image,{folder:"products"})
		}

		const product = await Product.create({
			name,
			description,
			price,
			image: cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url : "",
			category
		})

		res.status(201).json({product})
	} catch (error) {
		console.log('Error in createProduct controller', error.message);
		res.status(500).json({ message: 'Server error', error: error.message });

	}
}

// delete product
export const deleteProduct = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);

		if (!product) {
			return res.status(404).json({ message: "Product not found"});
		}

		if(product.image){
			const publicId = product.image.split("/").pop().split(".")[0]; // this will get the id of the image
			try {
				await cloudinary.uploader.destroy(`products/${publicId}`)
				console.log("deleted image from cloudinary")
			} catch (error) {
				console.log("error deleting image from cloudinary", error)
			}
		}

		await Product.findByIdAndDelete(req.params.id)
		res.json({ message: "Product deleted successfully"})
	} catch (error) {
		console.log('Error in deleteProduct controller', error.message);
		res.status(500).json({ message: 'Server error', error: error.message });
	}
}