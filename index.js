const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middleware 
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.w5uqgn7.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){
        try{
            const taskCollection = client.db('myTask').collection('allTask')

            // add task to database api 
            app.post('/allTask', async(req, res)=> {
            const allTask = req.body
            console.log(allTask)
            const result = await taskCollection.insertOne(allTask);
            res.send(result)
        })


        }
        finally{

        }
}
run().catch(error => console.error(error))




app.get('/', (req, res)=> {
    res.send('server from my task')
})
app.listen(port, ()=> {
    console.log(`Listening to port`, port)
})
