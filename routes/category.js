const { postCategory, getCategory, updateCategory, deleteCategory, getCategories} = require("../controllers/category");
const {verify} = require("../middleware/task")

const router = require("express").Router();

router.post("/category", verify, postCategory);
router.get("/category", getCategory);
router.get("/categories", getCategories);
router.put("/category", verify, updateCategory);
router.delete("/category", verify, deleteCategory);

module.exports = router;