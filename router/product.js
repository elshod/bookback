const {Router} = require('express')
const router = Router()
const Product = require('../model/product')
const Category = require('../model/category')
const Atribut = require('../model/atribut')
const auth = require('../middleware/auth')

router.get('/',auth,async(req,res)=>{
    let product = await Product.find().populate('category').sort({_id:-1}).lean()
    let category = await Category.find().lean()
    let atribut = await Atribut.find().lean()
    product = product.map((cat,index) => {
        cat.index = index+1
        cat.status = cat.status == 0 ? '<span class="badge light badge-danger">Nofaol</span>' : '<span class="badge light badge-success">Aktiv</span>'
        cat.createdAt = cat.createdAt.toLocaleString()
        return cat
    })

    res.render('product',{
        title:'Kitoblar ro`yhati',
        product, category, atribut
    })
})

router.get('/:id',async(req,res)=>{
    if (req.params.id){
        let _id = req.params.id
        let product = await Product.findOne({_id})
        res.send(product)
    } else {
        res.send(JSON.stringify('error'))
    }
})

router.post('/',auth,async(req,res)=>{
    let {title,description,text,price,sale,category,atributs,cheap,popular,recom,soon,author,year,delivery,status} = req.body
    status = status || 0
    popular = popular || 0
    recom = recom || 0
    soon = soon || 0
    atributs = JSON.parse(atributs)
    console.log(req.files)
    if (req.files){
        let files = req.files.img
        let img = []
        const uniquePreffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        if (files.length>1){
            await Promise.all(files.map(async (file) => {
                
                let filepath = `uploads/${uniquePreffix}_${file.name}`
                await file.mv(filepath)
                img.push(filepath)
            }))
            let product = await new Product({title,description,text,price,sale,category,atributs,cheap,popular,recom,soon,author,year,delivery,status,img})
            await product.save()
            res.send(JSON.stringify('ok'))
        } else {
            let filepath = `uploads/${uniquePreffix}_${files.name}`
            
            files.mv(filepath,async err => {
                if (err) res.send(JSON.stringify(err))
                img.push(filepath)
                let product = await new Product({title,description,text,price,sale,category,atributs,cheap,popular,recom,soon,author,year,delivery,status,img})
                await product.save()
                res.send(JSON.stringify('ok'))
            })
        }

        // console.log({title,description,text,price,sale,category,atributs,cheap,popular,recom,soon,author,year,delivery,status,img})
        
        
    } else {
        res.send(JSON.stringify('error'))
    }
    
})


router.get('/delete/:id',auth,async(req,res)=>{
    let _id = req.params.id
    await Product.findByIdAndRemove({_id})
    res.redirect('/product')
})

router.post('/save',auth,async(req,res)=>{
    try {
        let {_id,title,description,text,price,sale,category,atributs,cheap,popular,recom,soon,author,year,delivery,status} = req.body
        status = status || 0
        popular = popular || 0
        recom = recom || 0
        soon = soon || 0
        atributs = JSON.parse(atributs)
        if (req.files){
            let files = req.files.img
            let img = []
            await Promise.all(files.map(async (file) => {
                const uniquePreffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
                let filepath = `uploads/${uniquePreffix}_${file.name}`
                await file.mv(filepath)
                img.push(filepath)
            }))
            await Product.findByIdAndUpdate(_id,{title,description,text,price,sale,category,atributs,cheap,popular,recom,soon,author,year,delivery,status,img})
            res.send(JSON.stringify('ok'))
        } else {
            await Product.findByIdAndUpdate(_id,{title,description,text,price,sale,category,atributs,cheap,popular,recom,soon,author,year,delivery,status})
            res.send(JSON.stringify('ok'))
        }
    } catch (error) {
        res.send(JSON.stringify(error))
    }
    
})

router.get('/changenumber/:id/:field',auth,async(req,res)=>{
    let _id = req.params.id
    let field = req.params.field
    let product = await Product.findOne({_id})
    product[field] = product[field] == 0 ? 1 : 0
    await product.save()
    res.redirect(`/product/view/${_id}`)
})

router.get('/review/changestatus/:id/:index',auth,async(req,res)=>{
    let _id = req.params.id
    let index = req.params.index
    let product = await Product.findOne({_id})
    product.reviews[index].status = product.reviews[index].status == 0 ? 1 : 0
    await product.save()
    res.redirect(`/product/view/${_id}`)
})

router.get('/view/:id',auth,async(req,res)=>{
    let _id = req.params.id
    let product = await Product.findOne({_id}).populate('category').lean()
    product.createdAt = product.createdAt.toLocaleString()
    product.cheap = product.cheap == 0 ? '<span class="badge light badge-danger">Yo`q</span>' : '<span class="badge light badge-success">Ha</span>'
    product.popular = product.popular == 0 ? '<span class="badge light badge-danger">Yo`q</span>' : '<span class="badge light badge-success">Ha</span>'
    product.recom = product.recom == 0 ? '<span class="badge light badge-danger">Yo`q</span>' : '<span class="badge light badge-success">Ha</span>'
    product.soon = product.soon == 0 ? '<span class="badge light badge-danger">Yo`q</span>' : '<span class="badge light badge-success">Ha</span>'
    product.status = product.status == 0 ? '<span class="badge light badge-danger">Yo`q</span>' : '<span class="badge light badge-success">Ha</span>'

    switch (product.delivery) {
        case 0: 
            product.delivery = 'Bepul yetkazish'
            break
        case 1: 
            product.delivery = "Toshkent ichida 10 000 so'm. Respublika bo'ylab 35 000 so'm"
            break
        case 2: 
            product.delivery = "Toshkent ichida 20 000 so'm. Respublika bo'ylab 55 000 so'm"
            break
    }


    product.reviews = product.reviews.map((review,index) => {
        review.createdAt = review.createdAt.toLocaleString()
        review.index = index+1
        review.status = review.status == 0 ? '<span class="badge light badge-danger">Nofaol</span>' : '<span class="badge light badge-success">Aktiv</span>'
        return review
    })
    res.render('product/show',{
        title:`${product.title} sahifasi`,
        product,
    })
})

module.exports = router