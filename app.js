const express= require('express');
const mongoose= require('mongoose');
var morgan = require('morgan');
const Todos = require('./models/Todos');

const app=express();
/*:remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" */
app.use(morgan('combined'));

//connection
mongoose.connect("mongodb://127.0.0.1/blog",{
    useNewUrlparser: true,
    useUnifiedTopology: true
});

//middlewares


app.use(express.urlencoded({extend: true}));
app.set("view engine","ejs");


//router
// app.use(require('./routes/index'));

app.get("/",async(req,res)=>{
    const alltodo=await Todos.find();
    res.render("index",{todo: alltodo});

});

//just consoling particular todo
app.get("/find",async(req,res)=>{
    const p1= req.query.todo;
    console.log(p1);
    let data = await Todos.findOne({todo:p1})
   if(data)
   {
    res.render("index2",{todo:data});
   }else{
    //   res.status(404).send("<h1>Data not found</h1>"); 
    res.status(404).render("partials/message",{p1}); 
   }  
});




//app.use(require('./routes/todo'));
app.post("/add/todo",async(req,res)=>{ 
    const p1= req.body;
    console.log(p1);
    const newTodo=new Todos(p1);
   try {
     // res.send(await newTodo.save());
     await newTodo.save()
      res.redirect("/");
   } catch (error) {
       console.log(error);
   }


    // newTodo.save().then(()=>{
    //     console.log("sucessfully saved!");
    //     res.redirect("/");
       
    // }).catch((err)=>{ 
    //     console.log(err);
    // })

});

//note: dynamic route are always below the static one
app.delete("/delete/:_id",async(req,res)=>{
    const p1= req.params;
   console.log(p1);

  try {
    await Todos.deleteOne(p1);
    console.log("sucessfully deleted!");
    //res.render("partials/message",{p1}); 
    res.redirect('/');
  } catch (error) {
    console.log(err);
  }

//    await Todos.deleteOne(p1).then(()=>{
//        console.log("sucessfully deleted!");
//        res.render("partials/message",{p1}); 
//        //res.redirect("/");
//     }).catch((err)=>{
       
//         console.log(err);
//     })
}); 



app.post("/update/:_id",async(req,res)=>{
    const p1= req.params; 
     let data =await  Todos.updateOne(
        {_id:p1},
        {
            $set: { todo:req.body.todo } 
        }
      
    )
    res.redirect("/");
    // console.log(req.body.todo.length)
});




app.listen(5000,()=>{ 
    console.log("sever is listening at 5000");
})