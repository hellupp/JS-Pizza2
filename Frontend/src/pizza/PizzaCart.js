/* eslint-env jquery */
/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');

//Перелік розмірів піци
var PizzaSize = {
    Big: "big_size",
    Small: "small_size"
};

//Змінна в якій зберігаються перелік піц в кошику
var Cart = [];

//HTML едемент куди будуть додаватися піци
var $cart = $(".items");
var $main_cart = $cart.parent().find("#cart-price").find("#cart-price-num");
var $clear_all = $(".clear");
var $pizza_amount = $cart.parent().find('.inf-amount');
$clear_all.click(function () {
    $cart.html("");
    $main_cart.text(0);
    $pizza_amount.text(0);
    Cart = [];
});
$(".pizza-type ul li").click(function () {
    if (!$(this).children().hasClass("active")) {
        $(this).parent().find(".active").removeClass("active");
        $(this).find("a").addClass("active");
        //change fiter's header
        var header = $(this).children().text();
        console.log(header);
        switch (header) {
            case "Усі":
                $(".title #type-title").text(header);
                hide_pizzas('show_all')
                break;
            case "М'ясні":
                $(".title #type-title").text("М'ясні піци");
                hide_pizzas('meat');
                break;
            case "З ананасом":
                header = "Піци " + header.toLowerCase();
                $(".title #type-title").text(header);
                hide_pizzas('pineapple');
                break;
            case "З грибами":
                header = "Піци " + header.toLowerCase();
                $(".title #type-title").text(header);
                hide_pizzas('mushrooms');
                break;
            case "З морепродуктами":
                header = "Піци " + header.toLowerCase();
                $(".title #type-title").text(header);
                hide_pizzas('fish');
                break;
            case "Вега" :
                header = "Вега піци";
                $(".title #type-title").text(header);
                hide_pizzas('vega');
                break;
        }
    }
});

function hide_pizzas(hider) {
    $counter = $(".main").find("#badge");
    var count = 8;
    $list = $(".row");
    $list.html("");
    var pizzas = [];
    switch (hider) {
        case 'meat':
            for (var i = 0; i < pizza_info.length; i++) {
                if (pizza_info[i].content['meat'] || pizza_info[i].content['chicken']) {
                    console.log(JSON.stringify(pizza_info[i]));
                    pizzas.push(pizza_info[i]);
                    count -= 1;
                }
            }
            break;
        case 'fish':
            for (var i = 0; i < pizza_info.length; i++) {
                if (pizza_info[i].content['ocean']) {
                    pizzas.push(pizza_info[i]);
                    count -= 1;
                }
            }
            break;
        case "mushrooms":
            for (var i = 0; i < pizza_info.length; i++) {
                if (pizza_info[i].content['mushroom']) {
                    pizzas.push(pizza_info[i]);
                    count -= 1;
                }
            }
            break;
        case "ananas":
            for (var i = 0; i < pizza_info.length; i++) {
                if (pizza_info[i].content['pineapple']) {
                    pizzas.push(pizza_info[i]);
                    count -= 1;
                }
            }
            break;
        case "vega":
            for (var i = 0; i < pizza_info.length; i++) {
                if (pizza_info[i].content['ocean'] || pizza_info[i].content['meat'] || pizza_info[i].content['chicken']) {
                } else {
                    pizzas.push(pizza_info[i]);
                    count -= 1;
                }
            }
            break;
        case "show_all":
            for (var i = 0; i < pizza_info.length; i++) {
                pizzas.push(pizza_info[i]);
            }
    }

    //Онволення однієї піци
    function showOnePizzaInMenu(pizza) {
        var html_code = Templates.PizzaMenu_OneItem(pizza);
        var $node = $(html_code);
        $list.append($node);
    }

    pizzas.forEach(showOnePizzaInMenu);
}

var price = 0;
var p_amount = 0;

function addToCart(pizza, size) {
    var status = 0;
    //Додавання однієї піци в кошик покупок
    for (var i = 0; i < Cart.length; i++) {
        if (Cart[i].pizza === pizza && Cart[i].size === size) {
            Cart[i].quantity += 1;
            Cart[i].price_all += pizza[size].price;
            status = 1;
            price += pizza[size].price;
            updateCart();
        }
    }
    if (status == 0) {
        Cart.push({
            pizza: pizza,
            size: size,
            quantity: 1,
            price_all: pizza[size].price,
            price_const: pizza[size].price,
            is_only_one: pizza[size].is_only_one
        });
        price += pizza[size].price;
        p_amount += 1;
        //Оновити вміст кошика на сторінці
        updateCart();
    }
}

function removeFromCart(cart_item) {
    //Видалити піцу з кошика
    //TODO: треба зробити

    //Після видалення оновити відображення
    updateCart();
}

function initialiseCart() {
    //Фукнція віпрацьвуватиме при завантаженні сторінки
    if (JSON.parse(sessionStorage.getItem('cart'))) {
        Cart = JSON.parse(sessionStorage.getItem('cart'));
        price = parseInt(sessionStorage.getItem('price'));
        p_amount = parseInt(sessionStorage.getItem('p_amount'));
    }

    updateCart();
}

function getPizzaInCart() {
    //Повертає піци які зберігаються в кошику
    return Cart;
}

function updateCart() {
    //Функція викликається при зміні вмісту кошика
    //Тут можна наприклад показати оновлений кошик на екрані та зберегти вміт кошика в Local Storage
    $main_cart.text(price);
    $pizza_amount.text(p_amount);
    //Очищаємо старі піци в кошику
    $cart.html("")


    //Онволення однієї піци
    function showOnePizzaInCart(cart_item) {
        var html_code = Templates.PizzaCart_OneItem(cart_item);
        var $node = $(html_code);
        $node.find('#plus').click(function () {
            cart_item.quantity += 1;
            cart_item.price_all += cart_item.price_const;
            price += cart_item.price_const;
            //Оновлюємо відображення
            updateCart();
        });
        $node.find('#minus').click(function () {
            if (cart_item.quantity === 1) {
                price -= cart_item.price_all;
                p_amount -= 1;
                Cart.splice(Cart.indexOf(cart_item), 1);
            } else if (cart_item.quantity > 1) {
                cart_item.quantity -= 1;
                cart_item.price_all -= cart_item.price_const;
                price -= cart_item.price_const;
            }
            //Оновлюємо відображення
            updateCart();
        });
        $node.find('#del').click(function () {
            price -= cart_item.price_all;
            p_amount -= 1;
            Cart.splice(Cart.indexOf(cart_item), 1);
            updateCart();
        });

        $cart.append($node);
    }

    Cart.forEach(showOnePizzaInCart);
    sessionStorage.setItem('cart', JSON.stringify(Cart));
    sessionStorage.setItem('p_amount', p_amount);
    sessionStorage.setItem('price', price);
}

exports.removeFromCart = removeFromCart;
exports.addToCart = addToCart;

exports.getPizzaInCart = getPizzaInCart;
exports.initialiseCart = initialiseCart;

exports.PizzaSize = PizzaSize;