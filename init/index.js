const mongoose = require("mongoose");
const initData = require("./data.js");   //  destructuring
const Listing = require("../models/listing.js");
 require('dotenv').config();

const dbUrl = process.env.ATLASDB_URL;

main()
  .then(() => console.log("connected to DB"))
  .catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
  await initDB();
}

const initDB = async () => {
  await Listing.deleteMany({});
  const ownerId = "69b7d9faf7a4203ebd89f622";
  const dataWithOwner = initData.data.map((obj) => ({
    ...obj,
    owner: ownerId,
    geometry: {
      type : "Point",
      coordinates: [85.3096,23.3441],
    },
  }));

  await Listing.insertMany(dataWithOwner);
  console.log("data initialized with owner");
};
