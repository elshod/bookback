const {Router} = require('express')
const router = Router()
const Atribut = require('../model/atribut')

router.get('/',async(req,res)=>{
    let atribut = await Atribut.find().lean()

    atribut = atribut.map((cat,index) => {
        cat.index = index+1
        cat.status = cat.status == 0 ? '<span class="badge light badge-danger">Nofaol</span>' : '<span class="badge light badge-success">Aktiv</span>'
        return cat
    })

    res.render('atribut',{
        title:'Atributlar ro`yhati',
        atribut
    })
})

router.get('/:id',async(req,res)=>{
    if (req.params.id){
        let _id = req.params.id
        let atribut = await Atribut.findOne({_id})
        res.send(atribut)
    } else {
        res.send(JSON.stringify('error'))
    }
})

router.post('/',async(req,res)=>{
    try {
        let {title,order,status} = req.body
        status = status || 0
        order = order || 0
        let newAtribut = await new Atribut({title,order,status})
        await newAtribut.save()
        res.send(JSON.stringify('ok'))
    } catch (error) {   
        res.send(JSON.stringify(error))
    }
})

router.get('/delete/:id',async(req,res)=>{
    let _id = req.params.id
    await Atribut.findByIdAndRemove({_id})
    res.redirect('/atribut')
})

router.put('/save',async(req,res)=>{
    let {_id,title,order,status} = req.body
    status = status || 0
    order  = order  || 0
    await Atribut.findByIdAndUpdate(_id,{title,order,status})
    res.send(JSON.stringify('ok'))
})

module.exports = router