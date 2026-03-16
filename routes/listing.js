const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner,validateListing} = require("../middleware.js");
const listingController = require("../controller/listings.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const Listing = require("../models/listing.js");
const upload = multer({storage});



router
.route("/")
.get (wrapAsync(listingController.index))
.post( 
    isLoggedIn, 
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createListing)
);

//New Route
router.get("/new",
    isLoggedIn,
    listingController.renderNeWForm);

// Search Route
router.get("/search",async(req,res)=> {
    let search = req.query.q;
    let results = await Listing.find({
      $or: [
        { location: { $regex: search, $options:"i"}},
        {country: {$regex:search, $options: "i"}}
        ]
    });
    if(results.length > 0){
    res.render("listings/index",{allListings:results});
    }else{
        req.flash("error","No listings found!");
        res.redirect("/listings");
    }
});

    router
    .route("/:id")
    .get(
    wrapAsync(listingController.showListing))
    .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
     wrapAsync(listingController.updateListing))
     .delete( 
    isLoggedIn, 
    isOwner,
    wrapAsync(listingController.destroyListing)
);

//Edit Route
router.get("/:id/edit", 
    isLoggedIn, 
    isOwner,
    wrapAsync(listingController.renderEditForm));


module.exports = router;
