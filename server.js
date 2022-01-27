// Require dependencies 
const express = require("express");
const path = require('path')


// Assign dependencies 
const app = express();
app.use(express.static(path.join(__dirname, 'build')));


// Listener compatible with Heroku, Localhost
let port = process.env.PORT;
if (port === null || port === "" || port === undefined ) { port = 3000; };
app.listen(port, () => console.log(`Server accessible at port ${port}.`));
// END Listener 

// END of document
