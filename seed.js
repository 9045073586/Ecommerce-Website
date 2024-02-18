let Products = require('./models/Products')
const mongoose = require('mongoose');

const products = [
    { 
        name:"iphone 15pro" , 
        img: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aXBob25lJTIwMTV8ZW58MHx8MHx8fDA%3D" , 
        price: 124000,
        desc: "very costly phone it is",
        author: "65c9d7caeffc21db861215c3"
    },
    { 
        name: "macbook pro", 
        img: "https://images.unsplash.com/photo-1598495037740-2c360cf49e50?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bWFjJTIwYm9vayUyMHByb3xlbnwwfHwwfHx8MA%3D%3D" , 
        price: 230000,
        desc: "hello i am a good machine",
        author: "65c9d7caeffc21db861215c3"
    },
    { 
        name: "apple pencil", 
        img: "https://images.unsplash.com/photo-1551651639-927b595f815c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YXBwbGUlMjBwZW5jaWx8ZW58MHx8MHx8fDA%3D", 
        price: 10000,
        desc: "i can write future",
        author: "65c9d7caeffc21db861215c3"
    }
]

async function seedDB(){
    await Products.insertMany(products);
}

module.exports = seedDB;