const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Types.ObjectId,
            ref: 'users',
            required: true
        },
        items: [
            {
                productId: {
                    type: mongoose.Types.ObjectId,
                    ref: 'products',
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1
                }
            }
        ],
        totalPrice: {
            type: Number,
            required: true,
            //Holds total price of all the items in the cart
        },
        totalItems: {
            type: Number,
            required: true,
            //Holds total number of items in the cart
        },
        totalQuantity: {
            type: Number,
            required: true,
            //Holds total number of quantity in the cart
        },
        cancellable: {
            type: Boolean,
            default: true
        },
        status: {
            type: String,
            default: 'pending',
            enum: ["pending", "completed", "cancelled"]
        },
        deletedAt: {
            type: Date,
            //when the document is deleted
        },
        isDeleted: {
            type: Boolean,
            default: false
        }
    }, { timestamps: true }
)

module.exports = mongoose.model('orders', orderSchema)