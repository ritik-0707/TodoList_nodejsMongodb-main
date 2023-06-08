const router= require("express").Router();
const Todos = require('../models/Todos');

router.get("/",async(req,resp)=>{
    const alltodo=await Todos.find();
    resp.render("index",{todo: alltodo});

})

//module.exports=router; 