var db = require('../fn/db');
var config = require('../config/config');

exports.loadAll = () => {
    var sql = 'select * from products';
    return db.load(sql);
}

exports.loadAllProduct = () => {
    var sql = 'select * from products INNER JOIN categories ON products.CatID = categories.CatID INNER JOIN brands ON products.BrandID = brands.BrandID';
    return db.load(sql);
}

exports.loadAllByCat = (catId, offset) => {
    var sql = `select * from products where CatID = ${catId} limit ${config.PRODUCTS_PER_PAGE} offset ${offset}`;
    return db.load(sql);
}

exports.loadAllByCatMen = (limit) => {
    var sql = `select * from products where CatID = 1 order by Date DESC limit ${limit}`;
    return db.load(sql);
}

exports.loadAllByCatWoMen = (limit) => {
    var sql = `select * from products where CatID = 2 order by Date DESC limit ${limit}`;
    return db.load(sql);
}

exports.loadAllByBrand = (brandId, offset) => {
    var sql = `select * from products where BrandID = ${brandId} limit ${config.PRODUCTS_PER_PAGE} offset ${offset}`;
    return db.load(sql);
}

exports.countByCat = catId => {
    var sql = `select count(*) as total from products where CatID = ${catId}`;
    return db.load(sql);
}

exports.countByBrand = brandId => {
    var sql = `select count(*) as total from products where BrandID = ${brandId}`;
    return db.load(sql);
}

exports.loadByNewestOption = (limit) => {
    var sql = `select * from products order by Date DESC limit ${limit}`;
    return db.load(sql);
}

exports.loadByViewOption = (limit) => {
    var sql = `select * from products order by Viewer DESC limit ${limit}`;
    return db.load(sql);
}

exports.loadBySoldOption = (limit) => {
    var sql = `select * from products order by Sold DESC limit ${limit}`;
    return db.load(sql);
}

exports.single = (proID) => {
    return new Promise((resolve, reject) => {
        var sql = `select * from products where ProID = ${proID}`;
        db.load(sql).then(rows => {
            if (rows.length === 0) {
                resolve(null);
            }
            else {
                resolve(rows[0]);
                console.log(resolve(rows[0]));
            }
        }).catch(err => {
            reject(err);
        });
    });
}

exports.add = (c) => {
    var sql = `insert into products (ProName, Image) values('${c.ProName}', '${c.ProImage}')`;
    // var sql = `insert into products (Image) values('${c.ProImage}')`;
    return db.save(sql);
}

exports.delete = (id) => {
    var sql = `delete from products where ProID = ${id}`;
    return db.save(sql);
}

exports.get = (proID) => {
    var sql = `select * from products where ProID = ${proID}`;
    return db.load(sql);
}

exports.randomSameCategory = catID => {
    var sql = `select * from products where CatID = ${catID} order by RAND() LIMIT ${config.LIMIT_SAME}`;
    return db.load(sql);
}

exports.randomSameBrand = brandID => {
    var sql = `select * from products where BrandID = ${brandID} order by RAND() LIMIT ${config.LIMIT_SAME}`;
    return db.load(sql);
}

exports.search = (key) => {
    var sql = "select * from products where ProName like '%" + `${key}` + "%'";
    return db.load(sql);
}

exports.count = () => {
    var sql = "select count(*) as soluong from products";
    return db.load(sql);
}

exports.addRating = (c) => {
    var sql = `insert into rating (point_rating, title_rating, comment, user_id, pro_id) values('${c.star}', '${c.title}',  '${c.description}', '${c.userID}', '${c.proID}')`;
    // var sql = `insert into products (Image) values('${c.ProImage}')`;
    return db.save(sql);
}

exports.loadAllrating = (c) => {
    var sql = `select * from rating left JOIN users on rating.user_id = users.f_ID where pro_id ='${c}'` ;
    return db.load(sql);
}

exports.staraverage = (ProID) => {
    var sql = `SELECT AVG(point_rating) 'average' FROM rating WHERE pro_id = ${ProID}`;
    return db.load(sql);
}

exports.countstar = (ProID) => {
    var sql = `SELECT COUNT(point_rating) AS NumStar FROM rating WHERE pro_id =${ProID}`;
    return db.load(sql);
}