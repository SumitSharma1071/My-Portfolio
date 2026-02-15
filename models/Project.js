const mongoose = require('mongoose');

// Define the Project Schema
const projectSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    image : {
        filename : {
            type : String,
        },
        url : String
    },
    gitLink : {
        type : String
    }
});

// Create the Project Model
const Project = mongoose.model('project', projectSchema);

module.exports = Project;