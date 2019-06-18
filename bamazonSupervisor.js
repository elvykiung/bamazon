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
      choices: ['View Product Sales by Department', 'Create New Department']
    })
    .then(function(answer) {
      switch (answer.action) {
        case 'View Product Sales by Department':
          viewProductSales();
          break;

        case 'Create New Department':
          createNewDepartment();
          break;
      }
    });
}

//View Product Sales by Department

function viewProductSales() {
  var query = 'SELECT d.department_id, d.department_name, d.over_head_costs, p.product_sales,p.product_sales - d.over_head_costs AS total_profit FROM  departments d INNER JOIN products p ON (d.department_name = p.department_name ) GROUP BY department_name';

  connection.query(query, function(err, res) {
    if (err) throw err;
    // log list of the products
    console.log(`| department_id | department_name | over_head_costs | product_sales | total_profit |`);

    for (var i = 0; i < res.length; i++) {
      console.log('| ' + res[i].department_id + '             | ' + res[i].department_name + '  | ' + res[i].over_head_costs + '   | ' + res[i].product_sales + '  | ' + res[i].total_profit);
    }
    console.log('-----------------------------------\n');
  });
  connection.end();
}

//Create New Department

function createNewDepartment() {
  inquirer
    .prompt([
      {
        name: 'department_name',
        type: 'input',
        message: 'What is the new department name?',
        validate: function(value) {
          if (isNaN(value) === true) {
            return true;
          }
          return false;
        }
      },
      {
        name: 'over_head_costs',
        type: 'number',
        message: 'What is the new department overhead cost?',
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      }
    ])
    .then(function(inquirerResponse) {
      console.log('=================================');
      console.log('NEW Department Added!');
      console.log('=================================');
      console.log('Department Name: ' + inquirerResponse.department_name);
      console.log('Overhead Cost: $' + inquirerResponse.over_head_costs);

      connection.query(
        'INSERT INTO departments SET ?',
        {
          department_name: inquirerResponse.department_name,
          over_head_costs: inquirerResponse.over_head_costs
        },
        function(err, res) {
          if (err) throw err;
        }
      );
      connection.end();
    });
}
