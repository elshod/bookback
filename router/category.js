const {Router} = require('express')
const router = Router()
const Category = require('../model/category')

router.get('/',async(req,res)=>{
    let category = await Category.find().lean()

    category = category.map((cat,index) => {
        cat.index = index+1
        cat.status = cat.status == 0 ? '<span class="badge light badge-danger">Nofaol</span>' : '<span class="badge light badge-success">Aktiv</span>'
        return cat
    })

    res.render('category',{
        title:'Bo`limlar ro`yhati',
        category
    })
})

router.get('/:id',async(req,res)=>{
    if (req.params.id){
        let _id = req.params.id
        let category = await Category.findOne({_id})
        res.send(category)
    } else {
        res.send(JSON.stringify('error'))
    }
})

router.post('/',async(req,res)=>{
    try {
        let {title,order,status} = req.body
        status = status || 0
        order = order || 0
        let newCategory = await new Category({title,order,status})
        await newCategory.save()
        res.send(JSON.stringify('ok'))
    } catch (error) {   
        res.send(JSON.stringify(error))
    }
})

router.get('/delete/:id',async(req,res)=>{
    let _id = req.params.id
    await Category.findByIdAndRemove({_id})
    res.redirect('/category')
})

router.put('/save',async(req,res)=>{
    let {_id,title,order,status} = req.body
    status = status || 0
    order  = order  || 0
    await Category.findByIdAndUpdate(_id,{title,order,status})
    res.send(JSON.stringify('ok'))
})

module.exports = router