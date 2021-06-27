const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');


const userRoutes = require('./routes/user');
const medicRoutes = require('./routes/medic');
const scheduleRoutes = require('./routes/schedule');
const sendEmailRouter = require('./routes/sendEmail');

const scheduleUpDownRoutes = require('./routes/scheduleUpDown');
const app = express();

mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);


mongoose.connect("mongodb+srv://manuel:" + process.env.MONGO_ATLAS_PW +"@medical-cabinet.k9x3i.mongodb.net/medical-cabinet")
  .then(() => {
    console.log('Connected to DataBase!');
  }).catch(err => {
    console.log(err);
  });

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.use("/profileImages", express.static(path.join("backend/profileImages")));


app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
     "http://localhost:4200");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  next();
});

// app.use(cors());

app.use("/api/user", userRoutes);
app.use("/api/medic", medicRoutes);
app.use("/api/schedule", scheduleRoutes);
app.use('/api/documents', scheduleUpDownRoutes);
app.use('/api/sendEmail', sendEmailRouter);
// app.use("/chat", chatRoutes)

module.exports = app;
