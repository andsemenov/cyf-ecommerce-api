const express = require("express");
const app = express();

const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'cyf_ecommerce',
    password: 'postgres',
    port: 5432
});

//it returns info about customers
app.get("/customers", function(req, res) {
    pool.query('SELECT * FROM customers', (error, result) => {
  
        res.json(result.rows);
    });
});
//it returns info about suppliers
app.get("/suppliers", function(req, res) {
    pool.query('SELECT * FROM suppliers', (error, result) => {

        res.json(result.rows);
    });
});
//it returns product names and supplier names.
app.get("/products", function(req, res) {
    pool.query('SELECT products.product_name, suppliers.supplier_name FROM products INNER JOIN suppliers ON products.supplier_id=suppliers.id', (error, result) => {
  
        res.json(result.rows);
    });
});
app.listen(3000, function() {
    console.log("Server is listening on port 3000. Ready to accept requests!");
});

