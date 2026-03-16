const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const {validateReview, isLoggedIn, isreviewAuthor} = require("../middleware.js");
const reviewController = require("../controller/reviews.js");

//Review Post Routte
router.post("/",
    isLoggedIn,
     validateReview,
    wrapAsync(reviewController.createReview));

//review Delete Route
router.delete("/:reviewId",
    isLoggedIn,
    isreviewAuthor, 
    wrapAsync(reviewController.destroyReview));

module.exports= router;