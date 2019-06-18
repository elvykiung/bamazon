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

  runMenu();
});

function runMenu() {
  inquirer
    .prompt({
      name: 'action',
      type: 'rawlist',
      message: 'What would you like to do?',
      choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product']
    })
    .then(function(answer) {
      switch (answer.action) {
        case 'View Products for Sale':
          availableInventory();
          break;

        case 'View Low Inventory':
          viewLowInventory();
          break;

        case 'Add to Inventory':
          addInventory();
          break;

        case 'Add New Product':
          addNewItem();
          break;
      }
    });
}

function availableInventory() {
  connection.query('SELECT * FROM products', function(err, res) {
    if (err) throw err;
    // log list of the products
    console.log(`Item ID  | Name | Price ($) | Units`);
    for (var i = 0; i < res.length; i++) {
      console.log('    ' + res[i].item_id + '    | ' + res[i].product_name + ' | ' + res[i].price + ' | ' + res[i].stock_quantity);
    }
    console.log('-----------------------------------\n');
  });
  connection.end();
}

function viewLowInventory() {
  connection.query('SELECT * FROM products WHERE	stock_quantity <= 5', function(err, res) {
    if (err) throw err;
    // log list of the products

    console.log(`Item ID  | Name | Price ($) | Units`);
    for (var i = 0; i < res.length; i++) {
      console.log('    ' + res[i].item_id + '    | ' + res[i].product_name + ' | ' + res[i].price + ' | ' + res[i].stock_quantity);
    }
    console.log('-----------------------------------\n');
  });
  connection.end();
}

function addInventory() {
  inquirer
    .prompt([
      {
        name: 'product_id',
        type: 'input',
        message: 'Which product ID number would you like to add?',
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      },
      {
        name: 'stock_quantity',
        type: 'number',
        message: 'How many unit would you like to add?',
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      }
    ])
    .then(function(inquirerResponse) {
      var query = 'SELECT * FROM products WHERE ?';
      var stockQuantity = 0;
      var itemID;
      var itemName;

      connection.query(query, { item_id: inquirerResponse.product_id }, function(err, res) {
        if (err) throw err;

        for (var i = 0; i < res.length; i++) {
          if (res.stock_quantity <= 0) {
            console.log('Wrong entry, please retype positive value');
          } else {
            //update the variable
            itemID = res[i].item_id;

            stockQuantity = res[i].stock_quantity + inquirerResponse.stock_quantity;

            itemName = res[i].product_name;
          }
        }

        // update the database
        updateUnit(stockQuantity, itemID);
        console.log(`${itemName} now have ${stockQuantity} units`);
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
  connection.end();
}

function addNewItem() {
  inquirer
    .prompt([
      {
        name: 'product_name',
        type: 'input',
        message: 'What is the new product name?',
        validate: function(value) {
          if (isNaN(value) === true) {
            return true;
          }
          return false;
        }
      },
      {
        name: 'department_name',
        type: 'input',
        message: 'What is the new products department name?',
        validate: function(value) {
          if (isNaN(value) === true) {
            return true;
          }
          return false;
        }
      },
      {
        name: 'product_price',
        type: 'number',
        message: 'What is the new product price?'
      },
      {
        name: 'stock_quantity',
        type: 'number',
        message: 'How many unit would you like to add?'
      }
    ])
    .then(function(inquirerResponse) {
      console.log('=================================');
      console.log('NEW Product added!');
      console.log('=================================');
      console.log('Product Name: ' + inquirerResponse.product_name);
      console.log('Deparement Name: ' + inquirerResponse.department_name);
      console.log('Price: $' + inquirerResponse.product_price);
      console.log('Unit added: ' + inquirerResponse.stock_quantity);

      connection.query(
        'INSERT INTO products SET ?',
        {
          product_name: inquirerResponse.product_name,
          department_name: inquirerResponse.department_name,
          price: inquirerResponse.product_price,
          stock_quantity: inquirerResponse.stock_quantity
        },
        function(err, res) {
          if (err) throw err;
        }
      );
      connection.end();
    });
}
