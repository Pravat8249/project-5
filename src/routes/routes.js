const express = require("express")
const route = express.Router()
const { registerUser, userLogin, updateUserProfile, getUserDetails } = require("../controllers/userController")
const { createProduct, getProducts, getProductById, updateProduct, deleteProduct } = require("../controllers/productController")
const { userAuthentication } = require("../middlewares/authentication")
const { userAuthorization } = require("../middlewares/authorization")
const { createCart, updateCart, getCart, deleteCart } = require("../controllers/cartController")
const { createOrder, updateOrder } = require("../controllers/orderController")

//User
route.post("/register", registerUser)
route.post("/login", userLogin)
route.get("/user/:userId/profile", userAuthentication, getUserDetails)
route.put("/user/:userId/profile", userAuthentication, userAuthorization, updateUserProfile)

//Product
route.post("/products", createProduct)
route.get("/products", getProducts)
route.get("/products/:productId", getProductById)
route.put("/products/:productId", updateProduct)
route.delete("/products/:productId", deleteProduct)

//Cart
route.post("/users/:userId/cart", userAuthentication, userAuthorization, createCart)
route.put("/users/:userId/cart", userAuthentication, userAuthorization, updateCart)
route.get("/users/:userId/cart", userAuthentication, userAuthorization, getCart)
route.delete("/users/:userId/cart", userAuthentication, userAuthorization, deleteCart)

//Order
route.post("/users/:userId/orders", userAuthentication, userAuthorization, createOrder)
route.put("/users/:userId/orders", userAuthentication, userAuthorization, updateOrder)

module.exports = route