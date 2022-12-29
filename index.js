const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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

            // load user specific task 
            app.get('/myTask', async (req, res)=> {
                const email = req.query.email
                // const status = req.query.status
                const query = {
                    userEmail : email,
                    // status : status
                };
                const result = await taskCollection.find(query).toArray();
                res.send(result)
            })


            app.delete('/myTask/:id', async (req, res)=> {
                const id = req.params.id
                console.log(id)
                const filter = {_id : ObjectId(id)}
                const result = await taskCollection.deleteOne(filter);
                res.send(result);
            })


            // make admin api is created 
        app.put('/myTask/:id',  async (req, res)=> {
            const id = req.params.id
            console.log(id)
            const filter = {_id : ObjectId(id)}
            const option = {upsert : true};
            const updatedDoc = {
                        $set : {
                            status : 'completed'
                        }
                    }
                    const result = await taskCollection.updateOne(filter, updatedDoc, option)
            res.send(result);
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
