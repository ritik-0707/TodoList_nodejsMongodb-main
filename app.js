const express= require('express');
const mongoose= require('mongoose');
const Todos = require('./models/Todos');

const app=express();

//connection
mongoose.connect("mongodb://127.0.0.1/blog",{
    useNewUrlparser: true,
    useUnifiedTopology: true
})

//middlewares
app.use(express.urlencoded({extend: true}));
app.set("view engine","ejs");


//router
// app.use(require('./routes/index'));

app.get("/",async(req,resp)=>{
    const alltodo=await Todos.find();
    resp.render("index",{todo: alltodo});

});

//just consoling particular todo
app.get("/find",async(req,resp)=>{
    const p1= req.query.todo;
    console.log(p1);
    let data = await Todos.findOne({todo:p1})
   if(data)
   {
    resp.render("index2",{todo:data});
   }else{
    //   resp.status(404).send("<h1>Data not found</h1>"); 
    resp.status(404).render("partials/message.ejs"); 
   }
   
});




//app.use(require('./routes/todo'));
app.post("/add/todo",(req,resp)=>{ 
    const p1= req.body;
    const newTodo=new Todos(p1)
    //save p1
    newTodo.save().then(()=>{
        console.log("sucessfully saved!");
        resp.redirect("/");
    }).catch((err)=>{ 
        console.log(err);
    })

});

app.get("/delete/todo/:_id",(req,resp)=>{
    const p1= req.params;
    //delete p1
    Todos.deleteOne(p1).then(()=>{
        console.log("sucessfully deleted!");
        resp.redirect("/");
    }).catch((err)=>{
        console.log(err);
    })

}); 


app.post("/update/:_id",async(req,resp)=>{
    const p1= req.params; 
     let data =await  Todos.updateOne(
        {_id:p1},
        {
            $set: { todo:req.body.todo } 
        }
      
    )
    resp.redirect("/");
    // console.log(req.body.todo.length)
});




app.listen(5000,()=>{ 
    console.log("sever is listening at 5000");
})