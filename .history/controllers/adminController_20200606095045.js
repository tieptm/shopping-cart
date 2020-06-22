var express = require('express');
var productRepo = require('../repos/productRepo');
var categoryRepo = require('../repos/categoryRepo');
var brandRepo = require('../repos/brandRepo');

var db = require('../fn/db');
var config = require('../config/config');

var fileUpload = require('express-fileupload');

var multer  = require('multer');
var path = require('path');
// var upload = multer({ dest: './public/uploads/' });

var router = express.Router();
var restrict = require('../middle-wares/restrict');

var storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, './public/uploads');
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

var upload = multer({storage: storage});

router.get('/', restrict, (req, res) => {
    if (req.session.user.f_Permission === 0) {
        res.redirect('/error/index');
    }
    else {
        
        var rowCountBrand = brandRepo.count();
        var rowCountCategory = categoryRepo.count();
        var rowCountProduct = productRepo.count();
        Promise.all([rowCountProduct,rowCountBrand,rowCountCategory]).then(([rowProduct, rowBrand, rowCategory]) => {
            var vm = {
                layout: 'admin.handlebars',
                countProduct: rowProduct[0].soluong,
                countBrand: rowBrand[0].soluongth,
                countCategory: rowCategory[0].soluongtl
            }
            res.render('admin/index', vm);
        }); 
    }
})

router.get('/category', restrict, (req, res) => {
        categoryRepo.loadAll().then(rows => {
            var vm = {
                layout: 'admin.handlebars',
                categories: rows
            };
            res.render('admin/category/index', vm);
        });
    });
    
    router.get('/category/edit', restrict, (req, res) => {
        categoryRepo.single(req.query.id).then(c => {
            var vm = {
                Category: c,
                layout: 'admin.handlebars',
            };
            res.render('admin/category/edit', vm);
        });
    });
    
    router.post('/category/edit', restrict, (req, res) => {
        categoryRepo.update(req.body).then(value => {
            res.redirect('/admin/category');
        });
    });
    
    router.get('/category/delete', restrict, (req, res) => {
        var vm = {
            layout: 'admin.handlebars',
            CatId: req.query.id
        }
        res.render('admin/category/delete', vm);
    });
    
    router.post('/category/delete', restrict, (req, res) => {
        categoryRepo.delete(req.body.CatId).then(value => {
            res.redirect('/admin/category');
        });
    });
    
    router.get('/category/add', restrict, (req, res) => {
        var vm = {
            layout: 'admin.handlebars',
            showAlert: false
        }
        res.render('admin/category/add', vm);
    });
    
    router.post('/category/add', restrict, (req, res) => {
        console.log(req.body);
        categoryRepo.add(req.body).then(value => {
            var vm = {
                layout: 'admin.handlebars',
                showAlert: true
            };
            res.render('admin/category/add', vm);
        }).catch(err => {
            res.end('fail');
        });
    });

router.get('/brand', restrict, (req, res) => {
    brandRepo.loadAll().then(rows => {
        var vm = {
            layout: 'admin.handlebars',
            brands: rows
        };
        res.render('admin/brand/index', vm);
    });
});

router.get('/brand/edit', restrict, (req, res) => {
    brandRepo.single(req.query.id).then(b => {
        var vm = {
            Brand: b,
            layout: 'admin.handlebars',
        };
        res.render('admin/brand/edit', vm);
    });
});

router.post('/brand/edit', restrict, (req, res) => {
    console.log(req.body);
    brandRepo.update(req.body).then(value => {
        res.redirect('/admin/brand');
    });
});


router.get('/brand/delete', restrict, (req, res) => {
    var vm = {
        layout: 'admin.handlebars',
        BrandID: req.query.id
    }
    res.render('admin/brand/delete', vm);
});

router.post('/brand/delete', restrict, (req, res) => {
    brandRepo.delete(req.body.BrandID).then(value => {
        res.redirect('/admin/brand');
    });
});
router.get('/brand/add', restrict, (req, res) => {
    var vm = {
        layout: 'admin.handlebars',
        showAlert: false
    }
    res.render('admin/brand/add', vm);
});
router.post('/brand/add', restrict, (req, res) => {
    brandRepo.add(req.body).then(value => {
        var vm = {
            layout: 'admin.handlebars',
            showAlert: true
        };
        res.render('admin/brand/add', vm);
    }).catch(err => {
        res.end('fail');
    });
});

router.get('/product', restrict, (req, res) => {
    productRepo.loadAllProduct().then(rows => {
        var vm = {
            layout: 'admin.handlebars',
            product: rows
        };
        res.render('admin/product/index', vm);
    })
});

router.get('/product/add', restrict, (req, res) => {
    var vm = {
        layout: 'admin.handlebars',
        showAlert: false
    }
    res.render('admin/product/add', vm);
});

router.post('/product/add', restrict, upload.single('ProImage'), (req, res) => {
    // productRepo.add(req.body, req.file.path).then(value => {
    //     var vm = {
    //         layout: 'admin.handlebars',
    //         showAlert: true,
    //     };
    //     res.render('admin/product/add', vm);
    // })
    // .catch(err => {
    //     res.end('fail');
    // });
    // res.send(req.body);
    // res.send(req.file.path.split('\\').join('\/'));

    
    var sql = "INSERT INTO products (ProName, Image, Price, Description, CatID, BrandID, Xuatxu, Color, Loaimay, Loaikinh, Loaivo, Loaiday, Baohanh) values ('"+ req.body.ProName + "', '"+ req.file.path.split('\\').slice(1).join('\/') + "', '"+ req.body.Price + "', '"+ req.body.Description + "', '"+ req.body.category + "', '"+ req.body.brand + "', '"+ req.body.xuatxu + "', '"+ req.body.mausac + "', '"+ req.body.loaimay + "', '"+ req.body.loaikinh + "', '"+ req.body.loaivo + "', '"+ req.body.loaiday + "', '"+ req.body.baohanh + "')";
    var vm = {
        layout: 'admin.handlebars',
        showAlert: true,
    };
    res.render('admin/product/add', vm);
    return db.save(sql);

    // productRepo.add(req.body).then(value => {
    //     var vm = {
    //         layout: 'admin.handlebars',
    //         showAlert: true,
    //     };
    //     res.render('admin/product/add', vm);
    // })
    // .catch(err => {
    //     res.end('fail');
    // });

    // res.send(req.file);

    // var sql = "INSERT INTO products (ProName, Image) values ('"+ req.body.ProName + "', '"+ req.files.path + "')";
    // // var vm = {
    // //             layout: 'admin.handlebars',
    // //             showAlert: true,
    // //         };
    // // res.render('admin/product/add', vm);
    // return db.save(sql);
});

// router.post('/product/add', restrict, (req, res) => {
//     if(req.method == "POST"){ 
//         var file = req.files.ProImage;
//         console.log(file);
//     }
// });

router.get('/product/edit', restrict, (req, res) => {
    productRepo.single(req.query.id).then(b => {
        var vm = {
            Brand: b,
            layout: 'admin.handlebars',
        };
        res.render('admin/brand/edit', vm);
    });
});

// router.post('/brand/edit', restrict, (req, res) => {
//     console.log(req.body);
//     brandRepo.update(req.body).then(value => {
//         res.redirect('/admin/brand');
//     });
// });

router.get('/product/delete', restrict, (req, res) => {
    var vm = {
        layout: 'admin.handlebars',
        ProID: req.query.id
    }
    res.render('admin/product/delete', vm);
});

router.post('/product/delete', restrict, (req, res) => {
    productRepo.delete(req.body.ProID).then(value => {
        res.redirect('/admin/product');
    });
});

module.exports = router;
