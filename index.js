import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app=express();
const port=3000;
let blogs=[];
let newBlogID=1;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/create",(req,res)=>{
    const {id,authorName,title,content}=req.query;
    if (id && authorName && title && content){
        res.render("create.ejs",{id,authorName,title,content});
    }else{
    res.render("create.ejs");
    }
})

app.get("/",(req,res)=>{
    res.render("home.ejs",{blogs:blogs});
})

app.get("/view/:id",(req,res)=>{
    const blogID=parseInt(req.params.id);
    const blog=blogs.find(blog=>blog.id===blogID);
    if (!blog){
        res.status(404).send("Blog not found!");
        return;
    }
    res.render("view.ejs",{blog:blog});
})

app.get("/delete/:id",(req,res)=>{
    const blogID=parseInt(req.params.id);
    blogs=blogs.filter(blog=>blog.id!==blogID);
    res.render("home.ejs",{blogs:blogs});
})

app.post("/submit",(req,res)=>{
    const {id,authorName,title,content}=req.body;
    if (id){
        const ind=blogs.findIndex(blog=>blog.id===parseInt(id));
        if (ind!==-1){
            blogs[ind]={id:parseInt(id),authorName,title,content};
        }
    }else{
        const newBlog={
            id:newBlogID++,
            authorName:req.body['authorName'],
            content:req.body['content'],
            title:req.body['title']
        };
        blogs.push(newBlog);
    }
    res.redirect("/");
})

app.listen(port,()=>{
    console.log(`Server running at port ${port}`);
});