const {Router} = require('express')
const router = Router()
const Review = require('../model/review')

router.get('/',async(req,res)=>{
    let review = await Review.find().sort({_id:-1}).lean()

    review = review.map((cat,index) => {
        cat.index = index+1
        cat.status = cat.status == 0 ? '<span class="badge light badge-danger">Nofaol</span>' : '<span class="badge light badge-success">Aktiv</span>'
        return cat
    })

    res.render('review',{
        title:'Afzalliklar ro`yhati',
        review
    })
})

router.get('/:id',async(req,res)=>{
    if (req.params.id){
        let _id = req.params.id
        let review = await Review.findOne({_id})
        res.send(review)
    } else {
        res.send(JSON.stringify('error'))
    }
})

router.post('/',async(req,res)=>{
    let {name,work,mark,text,status} = req.body
    status = status || 0
    if (req.files){
        let file = req.files.avatar
        const uniquePreffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        let filepath = `uploads/${uniquePreffix}_${file.name}`
        file.mv(filepath,async err => {
            if (err) res.send(JSON.stringify(err))
            let review = await new Review({name,work,mark,text,status,avatar:filepath})
            await review.save()
            res.send(JSON.stringify('ok'))
        })
    } else {
        res.send(JSON.stringify('error'))
    }
    
})


router.get('/delete/:id',async(req,res)=>{
    let _id = req.params.id
    await Review.findByIdAndRemove({_id})
    res.redirect('/review')
})

router.put('/save',async(req,res)=>{
    let {_id,name,work,mark,text,status} = req.body
    status = status || 0
    order  = order  || 0
    if (req.files){
        let file = req.files.avatar
        const uniquePreffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        let filepath = `uploads/${uniquePreffix}_${file.name}`
        file.mv(filepath,async err => {
            if (err) res.send(JSON.stringify(err))
            let review = await new Review({name,work,mark,text,status,avatar:filepath})
            await review.save()
            res.send(JSON.stringify('ok'))
        })
    } else {
        await Review.findByIdAndUpdate(_id,{name,work,mark,text,status})
        res.send(JSON.stringify('ok'))
    }
    
})

module.exports = router