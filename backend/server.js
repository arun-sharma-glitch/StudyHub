require('dotenv').config();
const connectDB = require('./config/db');
const app = require('./src/app');


// Load environment variables from .env file
const port = process.env.PORT || 8080;

// Connect to the database
connectDB();

//app listening (server running)
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

