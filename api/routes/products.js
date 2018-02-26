const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');

//auth check
const checkAuth = require('../middleware/check-auth');

//controllers
const ProductController = require('../controllers/products');

// const storage = multer.diskStorage({
//     destination: function(req, file, cb) {
//         cb(null, './uploads/');
//     },
//     filename: function(req, file, cb) {
//         cb(null, file.originalname);
//     }
// });

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + file.originalname)
    }
  });

const fileFilter = (req, file, cb) => {
    //reject a file
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true);
    }else{
        cb(null, false);
    }    
}

const upload = multer({
    storage:storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});
//const upload = multer({dest: 'uploads/'});



//Get Products
router.get('/', ProductController.products_get_all);

//Post Product
router.post("/", checkAuth, upload.single('productImage'), ProductController.products_post_product);

//Get Product Detail
router.get('/:productId', ProductController.products_detail_product);

//Update Product
router.patch('/:productId', checkAuth, ProductController.products_update_product);

//Delete Product
router.delete('/:productId', checkAuth, ProductController.products_delete_product);

module.exports = router;