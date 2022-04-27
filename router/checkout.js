const {Router} = require('express')
const router = Router()
const Checkout = require('../model/checkout')
const auth = require('../middleware/auth')

router.get('/',async(req,res)=>{
    let checkout = await Checkout.find().populate('cart.id').lean()
    console.log(checkout)
    checkout = checkout.map((cat,index) => {
        cat.index = index+1
        cat.products = ''
        cat.summa = 0
        if (cat.cart.length>0){
            cat.cart.forEach(product => {
                cat.products += `${product.id.title} x <b>${product.count} ta </b> (${product.id.sale>0?product.id.price * (100 - product.id.sale)/100:product.id.price} so'm)<br>`
                if (product.id.sale>0){
                    cat.summa += product.count * product.id.price * (100 - product.id.sale)/100
                } else {
                    cat.summa += product.count * product.id.price 
                }
            })
        }
        cat.createdAt = cat.createdAt.toLocaleString()
        cat.status = cat.status == 0 ? '<span class="badge light badge-warning">Ko`rib chiqilmadi</span>' 
        : cat.status == 1 ? '<span class="badge light badge-info">Qabul qilindi</span>'
        : cat.status == 2 ? '<span class="badge light badge-success">Yetkazib berildi</span>' 
        : '<span class="badge light badge-danger">Bekor qilindi</span>' 
        return cat
    })

    res.render('checkout',{
        title:'Bo`limlar ro`yhati',
        checkout
    })
})

router.get('/:id',async(req,res)=>{
    if (req.params.id){
        let _id = req.params.id
        let checkout = await Checkout.findOne({_id})
        res.send(checkout)
    } else {
        res.send(JSON.stringify('error'))
    }
})

router.post('/save',auth,async(req,res)=>{
    let {_id,status} = req.body
    let checkout = await Checkout.findOne({_id})
    checkout.status = status
    await checkout.save()
    res.redirect('/checkout')
})

router.get('/delete/:id',auth,async(req,res)=>{
    let _id = req.params.id
    await Checkout.findByIdAndRemove({_id})
    res.redirect('/checkout')
})

router.put('/save',async(req,res)=>{
    let {_id,title,order,status} = req.body
    status = status || 0
    order  = order  || 0
    await Checkout.findByIdAndUpdate(_id,{title,order,status})
    res.send(JSON.stringify('ok'))
})

module.exports = router