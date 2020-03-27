const mongoDB = "mongodb://127.0.0.1:27017/blog_app"
const port = process.env.PORT || 3000;
var express          = require("express"),
    app              = express(),
    methodOverride   = require("method-override")
    mongoose         = require("mongoose"),
    expressSanitizer = require("express-sanitizer")
    bodyParser       = require("body-parser");


mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

mongoose.connect(mongoDB);

//boilerplate
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

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
    req.body.blog.body = req.sanitize(req.body.blog.body);
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
            res.render("show",{blog:foundBlog});
        }
    });
})

app.get("/blogs/:id/edit",function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("edit",{blog:foundBlog});
        }
    });
});

app.put("/blogs/:id", function(req, res){
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err, updatedBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs/"+req.params.id)
        }
    })
});

app.delete("/blogs/:id",function(req,res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs");
        }
    });
});

app.listen(port, function(){
    console.log("Server is running");
})