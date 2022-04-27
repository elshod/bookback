const {Router} = require('express')
const router = Router()
const News = require('../model/news')

router.get('/',async(req,res)=>{
    let news = await News.find().sort({_id:-1}).lean()

    news = news.map((cat,index) => {
        cat.index = index+1
        cat.status = cat.status == 0 ? '<span class="badge light badge-danger">Nofaol</span>' : '<span class="badge light badge-success">Aktiv</span>'
        cat.createdAt = cat.createdAt.toLocaleString()
        return cat
    })

    res.render('news',{
        title:'Yangiliklar ro`yhati',
        news
    })
})

router.get('/:id',async(req,res)=>{
    if (req.params.id){
        let _id = req.params.id
        let news = await News.findOne({_id})
        res.send(news)
    } else {
        res.send(JSON.stringify('error'))
    }
})

router.post('/',async(req,res)=>{
    let {title,description,text,status} = req.body
    status = status || 0
    if (req.files){
        let file = req.files.img
        const uniquePreffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        let filepath = `uploads/${uniquePreffix}_${file.name}`
        file.mv(filepath,async err => {
            if (err) res.send(JSON.stringify(err))
            let news = await new News({title,description,text,status,img:filepath})
            await news.save()
            res.send(JSON.stringify('ok'))
        })
    } else {
        res.send(JSON.stringify('error'))
    }
    
})


router.get('/delete/:id',async(req,res)=>{
    let _id = req.params.id
    await News.findByIdAndRemove({_id})
    res.redirect('/news')
})

router.put('/save',async(req,res)=>{
    let {_id,name,description,text,status} = req.body
    status = status || 0
    order  = order  || 0
    if (req.files){
        let file = req.files.img
        const uniquePreffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        let filepath = `uploads/${uniquePreffix}_${file.name}`
        file.mv(filepath,async err => {
            if (err) res.send(JSON.stringify(err))
            let news = await new News({name,description,text,status,img:filepath})
            await news.save()
            res.send(JSON.stringify('ok'))
        })
    } else {
        await News.findByIdAndUpdate(_id,{name,description,text,status})
        res.send(JSON.stringify('ok'))
    }
    
})

module.exports = router