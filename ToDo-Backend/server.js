// Using Express.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Create a instance of express
const app = express();
app.use(express.json());
app.use(cors({origin: 'http://localhost:5174'}));

// create a route
app.get('/', (req, res) => {
    res.send("Hello World");
})

// sample in memory storage for todo items
let todos = [];


// Connect DB
mongoose.connect('mongodb://127.0.0.1:27017/mern-todo')
.then( () => {
    console.log("Database Connected");
})
.catch( (error) => {
    console.log(error);
})


// create schema
const todoSchema = new mongoose.Schema({
    title: {
        required: true,
        type: String 
    },
    desc: {
        required: true,
        type: String 
    }
})

// create model
const todoModel = mongoose.model('todo', todoSchema);


// create a route for new ToDo list item:
app.post( '/todos', async (req, res) => {
    const {title, desc} = req.body;
    const newTodo = {
        id: todos.length+1,
        title,
        desc 
    };
    todos.push(newTodo);
    console.log(todos);
    try{
        const newTodo = new todoModel({ title, desc });
        await newTodo.save();
        res.status(201).json(newTodo);
    } catch(error){
        console.log(error);
        res.status(500).json({message: error.message});
    }
})


// get all items
app.get( '/todos', async (req, res) => {
    try {
        const todos = await todoModel.find();
        res.json(todos);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.message});
    }
})


// update a todo item
app.put( '/todos/:id', async (req, res) => {
    try {
        const {title, desc} = req.body;
        const id = req.params.id;
        const updateTodo = await todoModel.findByIdAndUpdate(
            id,
            { title, desc},
            { new: true }
        );
        if(!updateTodo){
            return res.status(404).json({ message: "Todo Not Found" });
        }
        res.json(updateTodo);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.message});
    }
})


// Delete the item
app.delete( '/todos/:id', async (req, res) =>{
    try {
        const id = req.params.id;
        await todoModel.findByIdAndDelete(id);
        res.status(204).end();   
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.message});
    }
})


//Start the Server
const port = 5000;
app.listen( port, () => {
    console.log("Server is running on port "+ port);
})