const {Schema,model} = require('mongoose')

const checkout = new Schema({
    name:String,
    lname:String,
    email:String,
    phone:String,
    region:String,
    city:String,
    address:String,
    info:String,
    payment:{
        type:Number,
        default:0
    },
    status: {
        type:Number,
        default:0
    },
    createdAt: {
        type:Date,
        default: Date.now()
    },
    cart: [
        {
            id: {
                type:Schema.Types.ObjectId,
                ref:'Product'
            },
            count:{
                type:Number,
                default:1
            }
        }
    ]
})

module.exports = model('Checkout',checkout)