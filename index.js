import express from "express";
import bodyParser from "body-parser";
import fs from "fs";
//import { fileURLToPath } from "url";
//import { dirname, join } from "path";


const app = express();
const port = 3000;
var blogArray = [];

//const __filename = fileURLToPath(import.meta.url);
//const __dirname = dirname(__filename);

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

 // Assuming you're using EJS as the template engine
//app.set("views", join(__dirname, "views"));
//app.set("view engine", "ejs");

// Load initial data from JSON file
let blogData = [];
try {
  const data = fs.readFileSync('blogData.json', 'utf8');
  blogData = JSON.parse(data);
} catch (err) {
  console.error('Error reading blog data from file:', err);
}

app.get("/", (req, res) => {
    res.render("index.ejs", {blogData: blogData});
  });

app.get("/about", (req, res) => {
    res.render("about.ejs");
});

app.get("/draft", (req, res) => {
  res.render("draftBlog.ejs",{blogData: blogData});
});

app.post("/submit", (req, res) => {
  //------------------------------------------------------------
    var firstName = req.body.fName;
    var lastName = req.body.lName;
    var title = req.body.title;
    var blogContent = req.body.blogContent;

     // Generate current timestamp
     var dateCreated = new Date().toLocaleString();

    if((firstName) && (lastName)){
        blogArray.push([firstName,lastName,title, blogContent, dateCreated] );
    }
  //----------------------------------------------------------------
    
    //creating Entry in JSON
    const newEntry = {
        firstName: req.body.fName,
        lastName: req.body.lName,
        title: req.body.title,
        blogContent: req.body.blogContent,
        dateCreated: new Date().toLocaleString()
      };
    
      // Add new entry to blogData
      blogData.push(newEntry);
    
      //Write updated data back to JSON file
      fs.writeFile('blogData.json', JSON.stringify(blogData, null, 2), (err) => {
        if (err) {
          console.error('Error writing blog data to file:', err);
          return res.status(500).send('Internal Server Error');
        }
        console.log('Blog data written to file successfully');
      });
      const successMessage = "Your Blog has been submitted!";

      res.render("draftBlog.ejs", {successMessage: successMessage});
;
});

// Example route handler to handle blog post links
app.get("/blogs/:title", (req, res) => {
    const title = req.params.title;
    // Find the corresponding blog post based on the title
    const blogPost = blogData.find(entry => entry.title === title);
    //console.log(blogPost);
    if (blogPost) {
        // Render a view specific to the blog post
        res.render("blogPost.ejs", {blogPost, blogData: blogData});
    } else {
        // Handle the case when the blog post is not found
        res.status(404).send("Blog post not found");
    }
});



app.post('/delete/:id', (req, res) => {
  const id = req.params.id; // Get the ID from the request parameters
  console.log(id);
  // Find the index of the entry with the specified ID in the JSON data array
  const index = blogData.findIndex(entry => entry.title === id);

  if (index !== -1) {
    // If the entry is found, remove it from the JSON data array
    blogData.splice(index, 1);

    // Write the updated data back to the JSON file
    fs.writeFile('blogData.json', JSON.stringify(blogData, null, 2), (err) => {
      if (err) {
        console.error('Error writing blog data to file:', err);
        return res.status(500).send('Internal Server Error');
      }
      console.log('Entry deleted successfully');
      res.redirect('/'); // Redirect back to the homepage or wherever appropriate
    });
  } else {
    // If the entry is not found, return a 404 status
    res.status(404).send('Entry not found');
  }
});


  
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});




