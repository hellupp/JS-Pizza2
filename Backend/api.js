var Pizza_List = require('./data/Pizza_List');
var crypto = require('crypto');

exports.getPizzaList = function(req, res) {
    res.send(Pizza_List);
};

function base64(str) {
    return new Buffer(str).toString('base64');
}

function sha1(string) {
    var sha1 = crypto.createHash('sha1');
    sha1.update(string);
    return sha1.digest('base64');
}


exports.createOrder = function(req, res) {
    var order_info = req.body;
    //console.log("Creating Order", order_info);

    var LIQPAY_PUBLIC_KEY = "sandbox_i82353120823";
    var LIQPAY_PRIVATE_KEY = "sandbox_C2C7YOyQWs3dnC6aKjzpIpCBtuK2Nj2BoqF3KxOo";

    var transaction_descript = "";
    order_info.pizza.forEach(function(item){
        var size_str = "";
        if(item.size === 'small_size') size_str = '(Мала)'
        else size_str = "(Велика)"
        transaction_descript += item.pizza.title + " " + size_str + ", кількість : "
            + item.quantity + "\n";
    });

    var order = {
        version: 3,
        public_key: LIQPAY_PUBLIC_KEY,
        action: "pay",
        amount: order_info.price,
        currency: "UAH",
        description: "Ім'я : " + order_info.name + "\n" + "Адреса: " + order_info.address + "\n" +
            "Номер телефону: " + order_info.phone + "\n" + "Замовлені піци: " + transaction_descript,
        order_id: Math.random()*100,
        //!!!Важливо щоб було 1, бо інакше візьме гроші!!
        sandbox: 1
    };
    var data = base64(JSON.stringify(order));
    var signature = sha1(LIQPAY_PRIVATE_KEY + data + LIQPAY_PRIVATE_KEY);


    res.send({
        success: true,
        data: data,
        signature: signature
    });
};