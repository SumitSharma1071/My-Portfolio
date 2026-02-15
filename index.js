const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Project = require('./models/Project');
const Contact = require('./models/contact');
const ejs = require('ejs');
let path = require('path');
const ejsMate = require('ejs-mate');
const { title } = require('process');
const methodOverride = require('method-override');

// Connect to MongoDB
async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/myportfolio');
}
main()
.then(() =>{
    console.log('Connected to MongoDB');
}).catch((err) =>{
    console.log('Error Connecting to MongoDB:', err);
});

app.use(express.urlencoded({extended : true}));
app.use(express.json());
app.use(methodOverride("_method"));
// Set EJS as the view engine
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.engine('ejs', ejsMate);

app.get('/', (req, res) =>{
    res.redirect('/home');
});

// Home Route
app.get('/Home', (req, res) =>{
    res.render('pages/home.ejs');
});

// Admin Route
app.get('/home/admin', (req, res) =>{
    res.send('Admin Page');
});

// Main Route
app.get('/home/main', (req, res) =>{
   res.render('pages/main.ejs');
})
// Contact Route
// app.get('/home/contact', (req, res) =>{
//     res.render('pages/contact.ejs');
// });

// Contact Form Submission
app.post('/home/contact', async (req, res) =>{
    try{
        const {name, email, purpose} = req.body;
        const contact = new Contact({name : name, email : email, purpose : purpose});
       let savedContact = await contact.save();
        res.redirect('/home/contact?success=1');
    }catch(err){
        res.status(500).send('Internal Server Error');
    }
});

app.get('/home/contact', (req, res) =>{
    let {success} = req.query;
    const message = success ? "Contact form submitted successfully!" : null;
     res.render('pages/contact.ejs', {message});
});


// Project Routes
app.get('/home/main/project', async (req, res) =>{
    try{
        const projects = await Project.find({});
        console.log(projects);
        res.render('pages/project.ejs', {projects : projects});
    }catch(err){
        res.status(500).send('Internal Server Error');
    }
});

// Add Project
app.get('/home/main/project/add', (req, res) =>{
    res.render('pages/newProject.ejs');
});

app.post('/home/main/project/add', async (req, res) =>{
    let { title, description, image, gitLink } = req.body;
    try{
        let project = new Project({
        title : title,
        description : description,
        image : {
            url : image
        },
        gitLink : gitLink
    });
    await project.save();
    res.redirect('/home/main/project');
    }catch(err){
        res.status(500).send("Backend error");
    }
}); 

// Edit Route
app.get('/home/main/project/:id/edit', async (req, res) => {
    let {id} = req.params;
    let projectDetail = await Project.findById(id);
    res.render('pages/editProject.ejs', {projectDetail});
});

app.patch('/home/main/project/:id/edit', async (req, res) =>{
    let {id} = req.params;
    let {title, description, image, gitLink} = req.body;
    await Project.findByIdAndUpdate(id, {title : title, description : description, image : {url : image}, gitLink : gitLink});
    res.redirect('/home/main/project');
});

// Delete Route

app.delete('/home/main/project/:id/delete', async (req, res) =>{
    let {id} = req.params;
    await Project.findByIdAndDelete(id);
    res.redirect('/home/main/project');
});

// App Listening
app.listen(8080, () =>{
    console.log('Server is running on port 8080');
});


