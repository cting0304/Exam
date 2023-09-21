const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoute = require("./Routes/userRoute");

const app = express();
require("dotenv").config();

app.use(express.json());
app.use(cors());

const corsOrigin = function (origin, callback) {
  const allowedList = [origin];

  if (allowedList.includes(origin)) {
    callback(null, allowedList); 
  } 
};

app.use(cors({ origin: corsOrigin, credentials: true }));


app.use("/users", userRoute);

const port = process.env.PORT || 4000;
const uri = process.env.ATLAS_URI;

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB connection established")).catch((error) => console.log("MongoDB connection failed: ", error.message));