const { postCategory, getCategory, deleteCategory, getCategories} = require("../controllers/category");
const {verify, verifyAdmin} = require("../middleware/task")

const router = require("express").Router();

router.post("/category", verifyAdmin, postCategory);
router.get("/category",verify, getCategory);
router.get("/categories",verify, getCategories);
router.delete("/category", verifyAdmin, deleteCategory);

module.exports = router;