const Products = require('./models/Products');
const { productSchema, reviewsSchema} = require('./schema');

const validateProducts = (req, res, next) => {
    let {name, img, price, desc} = req.body;
    const { error } = productSchema.validate({name, img, price, desc})
    if(error){
        const msg = error.details.map((err) => err.message).join(',');
        console.log(msg);
        return res.render('error', {err:msg});
    }
    next();  
}

const validateReviews = (req, res, next) => {
    let { rating, comment } = req.body;
    const { error } = reviewsSchema.validate({ rating, comment });
    if(error){
        const msg = error.details.map((err) => err.message).join(',');
        return res.render('error', {err:msg});
    }
    next();
}

const isLoggedIn = (req, res, next) => {

    if(req.xhr && !req.isAuthenticated()){
        return res.status(401).send('unauthorised');
        // console.log(req.xhr);//ajax hai ya nhi hai?
    }  
    
    if(!req.isAuthenticated()){
        req.flash('warning', 'you need to login first');
        return res.redirect('/products')
    }
    next();
}

const isSeller = (req, res, next) => {
    let { productId } = req.params;

    if(!req.user.role){
        req.flash('warning', `you don't have the permission`)
        return res.redirect('/login')
    }
    else if(req.user.role != 'seller'){
        req.flash('warning', 'You need to login as seller');
        return res.redirect(`/products/${productId}`)
    }
    else next();
}

const isProductAuthor = async (req, res, next) => {
    let { productId } = req.params;
    let product = await Products.findById(productId);
    // console.log(product.author);
    // console.log(req.user._id);
    
    if(!product.author || !product.author.equals( req.user._id )){
        req.flash('error', 'You are not the owner of this product');
        return res.redirect('/products');
    }
    next();
}

module.exports = {validateProducts, validateReviews, isLoggedIn, isSeller, isProductAuthor};