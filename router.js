const {Router} = require('express')
const router = Router()
const auth = require('./middleware/auth')

const userRouter = require('./router/user')
const categoryRouter = require('./router/category')
const advanRouter = require('./router/advan')
const reviewRouter = require('./router/review')
const productRouter = require('./router/product')
const checkoutRouter = require('./router/checkout')
const atributRouter = require('./router/atribut')
const promoRouter = require('./router/promo')
const newsRouter = require('./router/news')
const apiRouter = require('./router/api')

router.get('/',auth,async(req,res)=>{
    res.render('index',{
        title:'Boshqaruv sahifasi'
    })
})

router.use('/user',userRouter)
router.use('/category',categoryRouter)
router.use('/advan',advanRouter)
router.use('/news',newsRouter)
router.use('/checkout',checkoutRouter)
router.use('/promo',promoRouter)
router.use('/product',productRouter)
router.use('/atribut',atributRouter)
router.use('/review',reviewRouter)
router.use('/api',apiRouter)


module.exports = router