const Product = require('../models/product');

//Get all products
exports.products_get_all = (req, res, next) => {
    Product
        .find()
        .select('name price _id productImage')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        productImage: doc.productImage,
                        _id: doc._id,
                        request: {
                            type: 'GET',
                            url: '/products/' + doc._id
                        }
                    }
                })
            };
            console.log(response);
            if(docs.length >= 0){
                res.status(200).json(response);
            }else{
                res.status(404).json({
                    message: 'No entries found'
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error:err
            });
        });
}

//Post product
exports.products_post_product = (req, res, next) => {
    console.log(req.file);
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.filename
    });
    product
        .save()
        .then(result => {
            console.log(result);            
            res.status(201).json({
                message:'Create product succesfully',
                createdProduct: {
                    name: result.name,
                    price: result.price,
                    productImage: result.productImage,
                    _id: result._id,
                    request: {
                        type: 'GET',
                        url: "/products/" + result._id
                    }
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error:err
            });
        });
}

//Product Detail
exports.products_detail_product = (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .select('name price _id productImage')
        .exec()
        .then(doc => {
            if(doc){
                res.status(200).json({
                    product: doc,
                    request: {
                        type: 'GET',
                        url: "/products"
                    }
                });
            }else{
                res.status(404).json({
                    message:'No valid entry provaided ID'
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error:err});
        });
}

//Product Update
exports.products_update_product = (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    // ops = operations
    for (const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    Product
        .update({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Product updated',
                request: {
                    type: 'GET',
                    url: '/products/' + id
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

//Delete product
exports.products_delete_product = (req, res, next) => {
    const id = req.params.productId;
    Product
        .remove({_id:id})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Product Deleted',
                request: {
                    type: 'POST',
                    url: '/products',
                    body: {
                        name: 'String',
                        price: 'Number'
                    }
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error:err
            });
        });
}