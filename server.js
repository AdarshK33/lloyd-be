const express = require("express");
const cors = require("cors");
const fs = require('fs');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const errorMiddleware = require("./middlewares/errors");
const app = express();

dotenv.config({ path: "config/config.env" });
// app.use(cors());

app.use(cors({
  origin: "http://localhost:3000", // React frontend URL
  credentials: true,
}));
// parse requests of content-type - application/json
app.use(express.json());
app.use(cookieParser());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(
  express.urlencoded({ extended: true })
); /* bodyParser.urlencoded() is deprecated */

// Swagger Config
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Node MySQL API',
      version: '1.0.0',
      description: 'API documentation for Node.js + MySQL project',
    },
    servers: [
      { url: 'http://localhost:8000' }
    ]
  },
  apis: ["./routes/*.ts"]
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Frontend Routes enabling
app.use(express.static(__dirname + "/public"));

// app.use("/login", express.static(__dirname + "/public"));
// app.use("/reset-password", express.static(__dirname + "/public"));
// app.use("/newpassword/:email/:token", express.static(__dirname + "/public"));




// app.use("/add-user", express.static(__dirname + "/public"));
// app.use("/all-users", express.static(__dirname + "/public"));

// app.use("/inbox", express.static(__dirname + "/public"));

//  Frontend routes ends here

app.use(
  "/resources/static/assets/uploads/invoices/",
  express.static(__dirname + "/resources/static/assets/uploads/invoices/")
);
// const { isAuthenticatedUser } = require("./middlewares/auth");

//Import all Routes

const auth = require("./routes/auth.routes");

const user = require("./routes/user.routes");
// const comment = require("./routes/comment.routes");
const otp = require("./routes/otp.routes");





const logger = require("./logger");
// app.use("/api/auth", auth);
// app.use(isAuthenticatedUser)
// 
app.use("/api/user", user);
app.use("/api/otp", otp);



const data = JSON.parse(fs.readFileSync('./utils/all_states_and_districts.json', 'utf-8'));

// GET all states
app.get('/api/states', (req, res) => {
  res.json(Object.keys(data));
});

// GET districts by state
app.get('/api/districts/:state', (req, res) => {
  const state = req.params.state;
  const districts = data[state];
  if (districts) {
    res.json(districts);
  } else {
    res.status(404).json({ error: 'State not found' });
  }
});






//Middleware to handle errors

app.use(errorMiddleware) 




// set port, listen for requests
const PORT = process.env.PORT || 8001;

const server = app.listen(PORT, () => {
  console.log(
    `Server is running on port ${PORT} on ${process.env.NODE_ENV} Environment`
  );
});

//Handle unhandle Promise rejection
process.on("unhandledRejection", (err) => {
  console.log("Shutting down the server due to unhandled promise rejection");
  // logger.debug(`ERROR: ${err.stack}`);

  if (logger && logger.debug) {
  logger.debug(`ERROR: ${err.stack}`);
} else {
  console.error(`ERROR: ${err.stack}`);
}
  server.close(() => {
    process.exit(1);
  });
});

//Handle Uncaught Exception
process.on("uncaughtException", (err) => {
  console.log("Shutting down the server due to uncaught exception");
  // logger.debug(`ERROR: ${err.stack}`);
  if (logger && logger.debug) {
  logger.debug(`ERROR: ${err.stack}`);
} else {
  console.error(`ERROR: ${err.stack}`);
}
  server.close(() => {
    process.exit(1);
  });
});
