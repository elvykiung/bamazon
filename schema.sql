DROP DATABASE IF EXISTS  bamazonDB;

CREATE DATABASE bamazonDB;

USE bamazonDB;

CREATE TABLE products(
  item_id INTEGER(10) AUTO_INCREMENT NOT NULL,
  product_name VARCHAR(45) NOT NULL,
  department_name VARCHAR(45) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INTEGER(10) NULL,
  PRIMARY KEY(item_id)

);
INSERT INTO products(product_name,department_name,price,stock_quantity)
VALUES ("Organic Baby Spinach", "Whole Foods", 1.99,400);

INSERT INTO products(product_name,department_name,price,stock_quantity)
VALUES ("Banana", "Whole Foods", 0.49,5000);

INSERT INTO products(product_name,department_name,price,stock_quantity)
VALUES ("Women's Block Heel","Shoes",28.99,15);

INSERT INTO products(product_name,department_name,price,stock_quantity)
VALUE ("Egyptian Cotton 6-Piece Towel Set","Home & Kitchen", 21.99, 40);

INSERT INTO products(product_name,department_name,price,stock_quantity)
VALUES ("Heavyweight Luxury 820-Gram Bath Towel", "Home & Kitchen", 20.99, 15);

INSERT INTO products(product_name,department_name,price,stock_quantity)
VALUES ("Eloquent JavaScript","Books", 25.31,60);

INSERT INTO products(product_name,department_name,price,stock_quantity)
VALUES ("JavaScript: The Good Parts", "Books", 11.29, 30);

INSERT INTO products(product_name,department_name,price,stock_quantity)
VALUES ("Basepaws Cat DNA Test Kit", "Pet Supplies",95.00,20);

INSERT INTO products(product_name,department_name,price,stock_quantity)
VALUES (" 24 Cat Toys Kitten Toys Assortments", "Pet Supplies", 11.95, 80);