var express = require('express');
var productRepo = require('../repos/productRepo');
var brandRepo = require('../repos/brandRepo');
var catRepo = require('../repos/categoryRepo');
var detailRepo = require('../repos/detailRepo');

var db = require('../fn/db');

var restrict = require('../middle-wares/restrict');

var config = require('../config/config');

var router = express.Router();

router.get('/byCat/:catId', (req, res) => {
    var catId = req.params.catId;

    var page = req.query.page;
    if (!page) {
        page = 1;
    }

    var offset = (page - 1) * config.PRODUCTS_PER_PAGE;

    var loadAll = productRepo.loadAllByCat(catId, offset);
    var countByCat = productRepo.countByCat(catId);
    var category = catRepo.single(catId);
    Promise.all([loadAll, countByCat, category]).then(([pRows, countRows, categoryRows]) => {
        var total = countRows[0].total;
        var nPages = total / config.PRODUCTS_PER_PAGE;
        if (total % config.PRODUCTS_PER_PAGE > 0) {
            nPages++;
        }

        var numbers = [];
        for (let i = 1; i <= nPages; i++) {
            numbers.push({
                value: i,
                isCurPage: i === +page
            });
        }

        var vm = {
            products: pRows,
            noProducts: pRows.length === 0,
            page_numbers: numbers,
            catName: categoryRows.CatName
        };
        res.render('product/byCat', vm);
    });
});

router.get('/byBrand/:brandId', (req, res) => {
    var brandId = req.params.brandId;

    var page = req.query.page;
    if (!page) {
        page = 1;
    }
    console.log(page);
    var offset = (page - 1) * config.PRODUCTS_PER_PAGE;
    console.log(offset);
    var loadAll = productRepo.loadAllByBrand(brandId, offset);
    var countByBrand = productRepo.countByBrand(brandId);
    var brand = brandRepo.single(brandId);
    Promise.all([loadAll, countByBrand, brand]).then(([pRows, countRows, brandRows]) => {
        var total = countRows[0].total;
        console.log(total);
        var nPages = total / config.PRODUCTS_PER_PAGE;
        if (total % config.PRODUCTS_PER_PAGE > 0) {
            nPages++;
        }

        var numbers = [];
        for (let i = 1; i <= nPages; i++) {
            numbers.push({
                value: i,
                isCurPage: i === +page
            });
        }

        var vm = {
            products: pRows,
            noProducts: pRows.length === 0,
            page_numbers: numbers,
            brandName: brandRows.BrandName
        };
        res.render('product/byBrand', vm);
    });
});

router.get('/detail/:proID', (req, res) => {
    var proID = req.params.proID;
    productRepo.single(proID).then(product => {
        if (product) {
            var brand = brandRepo.single(product.BrandID);
            var category = catRepo.single(product.CatID);
            var detail = detailRepo.single(proID);
            var product_same_category = productRepo.randomSameCategory(product.CatID);
            var product_same_brand = productRepo.randomSameBrand(product.BrandID);
            
            
            var productArray = product.Image.split(',');
            var productThumb = productArray.map(data => data);
            var productThumbMain = product.Image.split(',')[0];

            var rating = productRepo.loadAllrating(proID);
            var staraverage = productRepo.staraverage(proID);
            var countstar = productRepo.countstar(proID);

            // for(var i = 0; i <= productThumb.length; i++) {
            //     var productThumbImage = productThumb[i];
            //     console.log(productThumbImage);
            // }
            Promise.all([brand, category, detail, product_same_brand, product_same_category, productThumb, productThumbMain, rating, staraverage, countstar]).then(([brand, category, detail, product_same_brand, product_same_category, productThumb, productThumbMain, rating, staraverage, countstar]) => {
                var vm = {
                    product: product,
                    category: category,
                    brand: brand,
                    detail: detail,
                    product_same_brand: product_same_brand,
                    product_same_category: product_same_category,
                    product_available: product.Quantity - product.Sold,
                    productThumb: productThumb,
                    productThumbMain: productThumbMain,
                    rating: rating, 
                    staraverage: staraverage[0].average, 
                    countstar: countstar[0].NumStar
                };
                res.render('product/detail', vm);
            })
        }
        else {
            res.redirect('error/index');
        }
    });
});

router.post('/addRating', restrict, (req, res) => {
    // var vm = {
    //     layout: 'admin.handlebars',
    //     showAlert: true,
    // };
    // res.render('admin/product/add', vm);

    // var sql = "INSERT INTO rating (point_rating, title_rating, comment, user_id) values ('"+ req.body.ratingPoint + "', '"+ req.body.ratingTitle + "', '"+ req.body.ratingComment + "', '"+ req.session.f_ID + "')";
    // var vm = {
    //     layout: 'admin.handlebars',
    //     showAlert: true,
    // };
    // res.render('admin/product/add', vm);
    // return db.save(sql);
    var add = {
        proID: req.body.ProID,
        star: req.body.ratingPoint,
        title: req.body.ratingTitle,
        description: req.body.ratingComment,
        userID: req.session.user.f_ID
    }
    // res.send(add); 
    productRepo.addRating(add);
    res.redirect('back');
})

module.exports = router;