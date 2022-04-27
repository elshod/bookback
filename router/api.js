const {Router} = require('express')
const router = Router()

const Category = require('../model/category')
const Advan    = require('../model/advan')
const Review   = require('../model/review')
const News     = require('../model/news')
const Product  = require('../model/product')
const Checkout = require('../model/checkout')

const kirlot = (text) => {
    let lat = {'a':'а','q':'қ','s':'с','d':'д','e':'е','r':'р','f':'ф','t':'т','g':'г','y':'й','h':'ҳ','u':'у','j':'ж','i':'и','k':'к','o':'о','l':'л','p':'п','z':'з','x':'х','s':'с','v':'в','b':'б','n':'н','m':'м','ch':'ч',' ':' '}
    let kir = {'а':'a','қ':'q','с':'s','д':'d','е':'e','р':'r','ф':'f','т':'t','г':'g','й':'y','ҳ':'h','у':'u','ж':'j','и':'i','к':'k','о':'o','л':'l','п':'p','з':'z','х':'x','с':'s','в':'v','б':'b','н':'n','м':'m','ш':'sh','ч':'ch', ' ':' '}
    let res = ''
    text = text.toLowerCase().split('')
    let letterCount = 0
    while (letterCount < text.length) {
        if (text[letterCount]+text[letterCount+1]=='sh') {
            res+='ш'
            letterCount+=2
            continue
        }
        if (text[letterCount]+text[letterCount+1]=='ch') {
            res+='ч'
            letterCount+=2
            continue
        }
        if (text[letterCount]+text[letterCount+1]=='yo') {
            res+='ё'
            letterCount+=2
            continue
        }
        if (text[letterCount]+text[letterCount+1]=='ya') {
            res+='я'
            letterCount+=2
            continue
        }
        if (text[letterCount]+text[letterCount+1]=="o'") {
            res+='ў'
            letterCount+=2
            continue
        }
        if (text[letterCount]+text[letterCount+1]=="g'") {
            res+='ғ'
            letterCount+=2
            continue
        }
        if (lat[text[letterCount]]) {
            res+=lat[text[letterCount]]
        }
        if (kir[text[letterCount]]) {
            res+=kir[text[letterCount]]
        }
        letterCount++
    }

    return res
}

router.get('/category/all',async(req,res)=>{
    let category = await Category.find({status:1})
    res.send(category)
})

router.get('/category/byid/:id',async(req,res)=>{
    let _id = req.params.id
    let category = await Category.findOne({_id})
    let products = await Product
    .find({category:_id,status:1})
    .select(['_id','title','img','description','price','sale','reviews','author','year'])

    products = products.map(product => {
        product.img = product.img[0]
        return product
    })

    res.send({category,products})
})


router.get('/advan/all',async(req,res)=>{
    let advan = await Advan.find({status:1}).sort({order:1})
    if (advan){
        res.send(advan)
    } else {
        res.send('error')
    }
})

router.get('/review/all',async(req,res)=>{
    let review = await Review.find({status:1}).sort({_id:-1})
    if (review){
        res.send(review)
    } else {
        res.send('error')
    }
})


router.get('/news/all',async(req,res)=>{
    let news = await News.find({status:1})
    .select(['title','description','img','_id'])
    .sort({_id:-1})
    .limit(4)
    if (news){
        res.send(news)
    } else {
        res.send('error')
    }
})

router.get('/products/get/:id',async(req,res)=>{
    if (req.params){
        let _id = req.params.id
        let product = await Product.findOne({_id})
        .populate('atributs.atribut').populate('category')

        product.reviews = product.reviews.filter(review => review.status == 1)

        // product.reviews = product.reviews.map(review => {
        //     let date = new Date(review.createdAt)
        //     review.createdAt = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`
        //     console.log(`${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`)
        //     console.log(review.createdAt)
        //     return review
        // })

        let others = await Product.find({category:product.category})
        .select(['img','title','category','reviews','price','sale'])
        .where({_id:{$ne: product._id}})
        .populate('atributs.atribut')
        .populate('category')
        .limit(3)

        product.img = product.img[0]
        others = others.map(other => {

            other.img = other.img[0]
            return other
        })
        res.send({product,others})
    } else {
        res.send(JSON.stringify('error'))
    }
})

router.get('/products/cheap',async(req,res)=>{
    let product = await Product.find({status:1,cheap:1})
    .select(['title','img','price','sale','author','_id'])
    .limit(5)
    .sort({_id:-1})

    product = product.map(pro =>{
        pro.img = pro.img[0]
        return pro
    })

    res.send(product)
})

router.get('/products/recom',async(req,res)=>{
    let product = await Product.find({status:1,recom:1})
    .select(['img','title','_id'])
    .limit(10)
    .sort({_id:-1})

    product = product.map(pro =>{
        pro.img = pro.img[0]
        return pro
    })

    res.send(product)
})
router.get('/products/soon',async(req,res)=>{
    let product = await Product.find({status:1,soon:1}).populate('category')
    .select(['img','title','_id','author','description','category','price','sale','year'])
    .limit(6)
    .sort({_id:-1})
    if (product){
        product = product.map(pro =>{
            pro.img = pro.img[0]
            return pro
        })
        res.send(product)
    } else {
        res.send([])
    }
})
router.get('/products/popular',async(req,res)=>{
    let product = await Product.find({status:1,popular:1})
    .select(['img','title','_id'])
    .limit(10)
    .sort({_id:-1})

    product = product.map(pro =>{
        pro.img = pro.img[0]
        return pro
    })

    res.send(product)
})
router.get('/products/sale',async(req,res)=>{
    let product = await Product.find({status:1,sale: { $gte: 1}})
    .populate('category')
    .select(['img','title','_id','category','price','sale','reviews'])
    .limit(10)
    .sort({_id:-1})

    product = product.map(pro =>{
        pro.img = pro.img[0]
        return pro
    })
    res.send(product)
})

router.get('/getlast',async(req,res)=>{
    let product = await Product.find({status:1})
    .populate('category')
    .select(['img','title','_id','category','price','sale','reviews'])
    .limit(10)
    .sort({_id:-1})

    product = product.map(pro =>{
        pro.img = pro.img[0]
        return pro
    })
    res.send(product)
})

router.post('/newreview',async(req,res)=>{
    let {_id,name,mark,text} = req.body
    if (req.files){
        let file = req.files.avatar
        const uniquePreffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        let filepath = `uploads/${uniquePreffix}_${file.name}`
        file.mv(filepath,async err => {
            if (err) res.send(JSON.stringify(err))
            let product = await Product.findOne({_id})
            let review = {name, avatar:filepath, mark, text}
            product.reviews.push(review)
            await product.save()
            res.send('ok')
        })
    } else {
        res.send('error')
    }
})

router.post('/search',async(req,res)=>{
    let {text} = req.body
    let othertitle = kirlot(text)
    let products =  await Product.find({
            $or: [
                {
                    'title': {
                        $regex: new RegExp( text.toLowerCase(), 'i')
                    }
                },
                {
                    'title': {
                        $regex: new RegExp( othertitle.toLowerCase(), 'i')
                    }
                }
            ]
        }
    ).sort({_id:-1}).limit(10).lean()
    if (products.length>0){
        res.send(products)
    } else {
        res.send([])
    }
})

router.post('/products/ids',async(req,res)=>{
    let {ids} = req.body
    let products = await Product
    .find({_id:{$in:ids}})
    .select(['_id','title','price','sale','img','category'])
    .populate('category')
    .lean()
    res.send(products)
})



router.post('/products/cart',async(req,res)=>{
    let {ids} = req.body
    let products = await Product
    .find({_id:{$in:ids}})
    .select(['_id','title','price','sale','img','category'])
    .populate('category')
    .lean()
    res.send(products)
})

router.post('/checkout',async(req,res)=>{
    let {name,lname,address,phone,email,city,region,info,cart} = req.body
    cart = JSON.parse(cart)
    let newCheckout = await new Checkout({name,lname,address,phone,email,city,region,info,cart})
    await newCheckout.save()
    res.send('ok')
})

module.exports = router