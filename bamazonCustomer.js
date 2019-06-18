// import mysql and inquirer package
var mysql = require('mysql');
var inquirer = require('inquirer');

//set up mysql connection
var connection = mysql.createConnection({
  host: 'localhost',

  port: 3306,

  user: 'root',

  password: '0815',
  database: 'bamazonDB'
});

// once it connect
connection.connect(function(err) {
  if (err) throw err;
  console.log('connected as id ' + connection.threadId);
  // run all available products
  afterConnection();
});

//function for available products
function afterConnection() {
  connection.query('SELECT * FROM products', function(err, res) {
    if (err) throw err;
    // log list of the products

    for (var i = 0; i < res.length; i++) {
      console.log(res[i].item_id + ' | ' + res[i].product_name + ' | ' + res[i].department_name + ' | ' + res[i].price);
    }
    console.log('-----------------------------------\n');
    //prompt customer to order
    customerOrder();
  });
}

//customer order function
function customerOrder() {
  inquirer
    .prompt([
      {
        name: 'product_id',
        type: 'input',
        message: 'Which product ID number would you like to purchase?'
      },
      {
        name: 'stock_quantity',
        type: 'input',
        message: 'How many unit would you like to purchase?'
      }
    ])
    .then(function(inquirerResponse) {
      var query = 'SELECT * FROM products WHERE ?';
      var stockQuantity = 0;
      var itemID;
      var totalPrice = 0;

      connection.query(query, { item_id: inquirerResponse.product_id }, function(err, res) {
        if (err) throw err;

        for (var i = 0; i < res.length; i++) {
          if (res[i].stock_quantity == 0) {
            console.log('Insufficient quantity');
          } else {
            //update the variable
            itemID = res[i].item_id;

            stockQuantity = res[i].stock_quantity - inquirerResponse.stock_quantity;

            totalPrice = inquirerResponse.stock_quantity * res[i].price;
          }
        }
        // update the database
        updateUnit(stockQuantity, itemID);
        // log the total price for user order
        console.log('Your total price of purchase is $' + totalPrice);
      });
    });
}

//update database function
function updateUnit(stockQuantity, itemID) {
  connection.query(
    'UPDATE products SET ? WHERE ?',
    [
      {
        stock_quantity: stockQuantity
      },
      {
        item_id: itemID
      }
    ],
    function(err, res) {
      if (err) throw err;
    }
  );
  //end connection
  connection.end();
}
