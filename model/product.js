const {Schema,model} = require('mongoose')

const product = new Schema({
    title:String,
    img:[String],
    text:String,
    description:String,
    price:{
        type:Number,
        default:0
    },
    sale: {
        type:Number,
        default:0
    },
    category:{
        type:Schema.Types.ObjectId,
        ref:'Category'
    },
    reviews:[
        {
            name:String,
            avatar:String,
            createdAt:{
                type:Date,
                default:Date.now()
            },
            text:String,
            mark:Number,
            status:{
                type:Number,
                default:0
            }
        }
    ],
    atributs:[
        {
            atribut:{
                type:Schema.Types.ObjectId,
                ref:'Atribut'
            },
            value:String
        }
    ],
    cheap:{
        type:Number,
        default:0
    },
    popular:{
        type:Number,
        default:0
    },
    recom:{
        type:Number,
        default:0
    },
    soon:{
        type:Number,
        default:0
    },
    author:String,
    year:String,
    createdAt:{
        type:Date,
        default:Date.now()
    },
    delivery:{
        type:Number,
        default:0
    },
    status: {
        type:Number,
        default:0
    }
})

module.exports = model('Product',product)