const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.urlencoded({extended: true}));



//DB connections
main()
.then(()=> console.log("Connected to DB"))
.catch(err => console.log(err));


async function main(){
    await mongoose.connect(''+process.env.DB_URL);
}


//Schema
const ArticleSchema = new mongoose.Schema({
    rank: {
        type: Number,
        required: true,
        validate : {
            validator : Number.isInteger,
            message   : '{VALUE} is not an integer value'
          }
    },
    content: {
        type: String,
        required: true
    }
});


//model
const Article = new mongoose.model('Article', ArticleSchema);

app.route('/articles')

.get((req, res)=>{
    Article.find({})
    .then( result =>res.send(result))
    .catch(err => console.log(err))

})
.post((req, res)=>{

    const newArticle = new Article({
        rank: req.body.rank,
        content: req.body.content
    });

    newArticle.save()
    .then( () => res.send("Successfully added a new Article"))
    .catch( err => res.send(err))

})
.delete((req, res)=>{

    Article.deleteMany({})
    .then( () =>res.send("Delete Successful "))
    .catch(err => console.log(err))

})


//localhost:3000/articles/1


app.route('/articles/:rank_id')

.get((req, res)=>{
    
    Article.find({rank: req.params.rank_id})
    .then( result =>res.send(result))
    .catch(err => console.log(err))
})

.put((req, res)=>{
    Article.findOneAndReplace( //replace with an entire new Doc
        {rank : req.params.rank_id},
        {rank: req.body.rank, content: req.body.content},
        )
        .then(()=>res.send("updated Successfully"))
        .catch(err => res.send(err))
})

.patch((req, res)=>{
    Article.findOneAndUpdate(
        {rank: req.params.rank_id},
        req.body,
        {new: true}
    )
        .then(()=>res.send("updated Successfully"))
        .catch(err => res.send(err))
})

.delete((req, res)=>{
    Article.deleteOne(
        {rank: req.params.rank_id},
    )
        .then(()=>res.send("Deleted Successfully"))
        .catch(err => res.send(err))
})











app.listen(3000, ()=>{
    console.log("server is listening on 3000")
})
