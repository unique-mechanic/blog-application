import express from "express";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";
import { dirname, join } from "path";


const app = express();
const port = 3000;
var blogArray = [];

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

 // Assuming you're using EJS as the template engine
//app.set("views", join(__dirname, "views"));
//app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("index.ejs", {blogArray});
  });

app.get("/about", (req, res) => {
    res.render("about.ejs");
});


app.post("/submit", (req, res) => {
    var firstName = req.body.fName;
    var lastName = req.body.lName;
    var title = req.body.title;
    var blogContent = req.body.blogContent;

     // Generate current timestamp
     var dateCreated = new Date().toLocaleString();

    if((firstName) && (lastName)){
        blogArray.push([firstName,lastName,title, blogContent, dateCreated] );
    }
    res.render("index.ejs", {blogArray});
});

// Example route handler to handle blog post links
app.get("/blogs/:title", (req, res) => {
    const title = req.params.title;
    // Find the corresponding blog post based on the title
    const blogPost = blogArray.find(entry => entry[2] === title);
    if (blogPost) {
        // Render a view specific to the blog post
        res.render("blogPost.ejs", {blogPost, blogArray});
    } else {
        // Handle the case when the blog post is not found
        res.status(404).send("Blog post not found");
    }
});
  
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});




