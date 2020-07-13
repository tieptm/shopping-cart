var db = require('../fn/db');

exports.loadAll = () => {
    var sql = 'SELECT * FROM `orders` LEFT JOIN users ON orders.UserID = users.f_ID ORDER BY OrderDate DESC';
    // var sql = 'SELECT * FROM `orders` RIGHT JOIN orderdetails on orders.OrderID = orderdetails.OrderID left JOIN products ON orderdetails.ProID = products.ProID WHERE orders.UserID = users.f_ID';
    return db.load(sql);
}

exports.single = (OrderId) => {
    return new Promise((resolve, reject) => {
        var sql = `select * from orders where OrderID = ${OrderId}`;
        db.load(sql).then(rows => {
            if (rows.length === 0) {
                resolve(null);
            }
            else {
                resolve(rows[0]);
            }
        }).catch(err => {
            reject(err);
        });
    });
}
 exports.addbill =(Order)=>{
    var sql = `INSERT INTO orders(OrderDate, UserID,Address,Total,Phone) VALUES(NOW(),'${Order.userID}','${Order.address}','${Order.total}','${Order.phone}')`;
     return db.save(sql);

}
exports.upquantity =(Order)=>{
    var sql= `UPDATE products SET Quantity = ${Order.avai} WHERE ProID ='${Order.proId}'`;
    return db.save(sql);
}

exports.upsold =(Order)=>{
    var sql= `UPDATE products SET Sold = ${Order.soldup} WHERE ProID ='${Order.proId}'`;
    return db.save(sql);
}
exports.addbilldetail = detail => {
    var sql = `INSERT INTO orderdetails(OrderID,ProID,O_Quantity,Price,Amount) VALUES('${detail.orderId}','${detail.proId}', '${detail.quantity}', '${detail.price}','${detail.sum}')`;
    return db.save(sql);
}

exports.getIDBill = userID =>{
    var sql=`SELECT orders.OrderID as ID FROM orders where UserID = '${userID}' `;
    return db.load(sql);

}


exports.removeall = (cart) => {
    for (var i = cart.length - 1; i >= 0; i--) {
            cart.splice(i, 1);
    }
    return;
}

exports.add = (cart, item) => {
    for (i = cart.length - 1; i >= 0; i--) {
        if (cart[i].proId === item.proId) {
            cart[i].quantity += item.quantity;
            return;
        }
       
    }
    cart.push(item);
}

exports.loadByUser = userID => {
    var sql = `select * from orders where UserID = ${userID} ORDER BY OrderDate DESC`;
    // var sql = `SELECT * FROM orders RIGHT JOIN orderdetails on orders.OrderID = orderdetails.OrderID left JOIN products ON orderdetails.ProID = products.ProID WHERE orders.UserID = ${userID}`;
    // var sql = `SELECT * FROM orderdetails INNER JOIN orders ON orderdetails.OrderID = orders.OrderID left JOIN products ON orderdetails.ProID = products.ProID WHERE orders.UserID = ${userID}`;
    return db.load(sql);
}

exports.count = () => {
    var sql = "select count(*) as soluongdh from orders";
    return db.load(sql);
}

exports.delete = (id) => {
    var sql = `delete from orders where OrderID = ${id}`;
    return db.save(sql);
}