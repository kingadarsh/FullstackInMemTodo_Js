const express= require("express");
const jwt = require("jsonwebtoken");
const cors=require("cors");


const app= express();
const JWT_SECRET="TODOAPP";

app.use(express.json());
app.use(cors());
app.use(express.static("public"));

// Authentication Middleware
app.use(["/todo","/deletetodo","/updatetodo"],(req,res,next)=>{
    const token = req.headers.token;

    try{
        if(token){
            const DecodedUser=jwt.verify(token,JWT_SECRET);
            req.user=DecodedUser;
            req.username=DecodedUser.username;
            next();
        }
        else{
            res.status(401).json({
                message:"Token missing. Unauthorized Access"
            })
        }
    }
    catch(err){
        res.json({
            message:"Unauthorized Access"
        })
    }
})


const User_Todo_List=[];

// SignUp Here 
app.post("/signup",(req,res)=>{
    
    const username=req.body.username;
    const password=req.body.password;

    User_Todo_List.push({
        username:username,
        password:password,
        todos:[]
    });

    res.status(200).json({
        message:"You are signed up"
    });

})

// SignIp Here 
app.post("/signin",(req,res)=>{
    const username=req.body.username;
    const password=req.body.password;

    const FoundUser=User_Todo_List.find((u)=>u.password===password && u.username===username);

    if(FoundUser){
        const token=jwt.sign({
            username:username
        },JWT_SECRET);

        res.json({
            message:"Signed in succesfully",
            token:token
        });
    }
    else{
        res.json({
            message:"Unauthorized Credentials"
        })
    }
})

// Create a Todo
app.post("/todo",(req,res)=>{
    const {content} = req.body;

    const user=User_Todo_List.find((u)=>u.username===req.user.username);

    const newtodo = {
        id:Date.now(),
        todo: content
    };

    user.todos.push(newtodo);

    res.status(200).json({
        message:"Todo added",
        todo : newtodo
    });    
})

// View Todo
app.get("/todo",(req,res)=>{
    const user = User_Todo_List.find((u)=>u.username===req.user.username);
    res.json(user.todos)
})

// Update the Todo 
app.put("/todo/:id", (req, res) => {
    const id = req.params.id; // Use id as a string
    const updatedTodo = req.body.updatedTodo; // Ensure the key is "updatedTodo"
    const user = User_Todo_List.find((u) => u.username === req.user.username);

    if (!user) {
        return res.status(400).json({
            message: "No user found"
        });
    }

    // Find the specific to-do by id (matching as a string)
    const todoItem = user.todos.find((i) => i.id.toString() === id);

    if (!todoItem) {
        return res.status(404).json({
            message: "Todo ID not found"
        });
    }

    // Update the content of the to-do item
    todoItem.todo = updatedTodo;

    res.status(200).json({
        id: todoItem.id,
        UpdatedTodo: todoItem,
        message: "Todo Updated successfully!"
    });
});

// Delete Todo
app.delete("/todo/:id",(req,res)=>{
    const user = User_Todo_List.find((u)=>u.username===req.user.username);
    const id=parseInt(req.params.id);


    if(!user){
        res.status(401).json({
            message:"You are not the legal user"
        })
    }
    const todoIndex=user.todos.findIndex((i)=> i.id===id)
    if (todoIndex===-1) {
        return res.status(404).json({
            message: "Todo ID not found",
            availableTodos:user.todos
        });
    }

    const deletedTodo = user.todos[todoIndex];
    user.todos.splice(todoIndex, 1);

    res.status(200).json({
        message: "Todo deleted successfully",
        deletedTodo: deletedTodo
    });


})





const port=3000;
app.listen(port,()=>{
    console.log(`Serving on http://localhost:${port}`);
})