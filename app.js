const mongoDB = "mongodb://127.0.0.1:27017/blog_app"
const port = 3000;
var express    = require("express"),
    app        = express(),
    mongoose   = require("mongoose"),
    bodyParser = require("body-parser");

mongoose.connect(mongoDB, {useNewUrlParser:true});
//boilerplate
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

//blog schema
var blogSchema = mongoose.Schema({
    title:String,
    image:{type:String, default:"https://blog.hubspot.com/hubfs/how-to-write-a-blog-post.jpg"},
    body: {type:String, default:"no content"},
    created:{type:Date, default:Date.now}
});
var Blog = mongoose.model("Blog",blogSchema);


//routes
app.get("/blogs", function(req, res){
    var blogs = Blog.find({},function(err,blogs){
        if(err){
            console.log(err);
        }else{
            res.render("index", {blogs:blogs});
        }
    });
});

app.get("/blogs/new", function(req, res){
    res.render("newblog");
});

app.post("/blogs", function(req, res){
    Blog.create(req.body.blog , function(err, newblog){
        if(err){
            console.log(err)
        }else{
            console.log("created new blog")
            console.log(newblog)
            res.redirect("/blogs")
        }
    });
});

app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err,foundBlog){
        if(err){
            console.log(err);
        }else{
            res.render("show",{blog:foundBlog})
        }
    });
})


app.listen(port, function(){
    console.log("Server is running");
})