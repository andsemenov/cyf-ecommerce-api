const express = require("express");
const app = express();
app.use(express.json()); //don't forget 

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
    const productNameQuery = req.query.name;
    let query='SELECT products.product_name, suppliers.supplier_name FROM products INNER JOIN suppliers ON products.supplier_id=suppliers.id';
    
    if (productNameQuery){ 
        query=`SELECT products.product_name, suppliers.supplier_name FROM products INNER JOIN suppliers ON products.supplier_id=suppliers.id WHERE products.product_name LIKE '%${productNameQuery}%' order by suppliers.supplier_name desc`;
    }
    pool
    .query(query)
    .then((result) => res.json(result.rows))
    .catch((e) => console.error(e));
});

//it returns a single client
app.get("/customers/:customerId", function (req, res) {
    const customerId = req.params.customerId;
  
    pool
      .query("SELECT * FROM customers WHERE id=$1", [customerId])
      .then((result) => res.json(result.rows))
      .catch((e) => console.error(e));
  });
 
//it creates a new customer
app.post("/customers", function (req, res) {
    const newCustomerName = req.body.name;
    const newCustomerAddress = req.body.address;
    const newCustomerCity = req.body.city;
    const newCustomerCountry = req.body.country;
  
    pool
      .query("SELECT * FROM customers WHERE name=$1", [newCustomerName])
      .then((result) => {
        if (result.rows.length > 0) {
          return res
            .status(400)
            .send("A customer with the same name already exists!");
        } else {
          const query =
            "INSERT INTO customers (name, address, city, country) VALUES ($1, $2, $3, $4)";
          pool
            .query(query, [newCustomerName, newCustomerAddress, newCustomerCity, newCustomerCountry ])
            .then(() => res.send("A customer created!"))
            .catch((e) => console.error(e));
        }
      });
  });

  //it creates a new product
  app.post("/products", function (req, res) {
    const newProductName = req.body.product_name;
    const newProductUnitPrice = req.body.unit_price;
    const newProductSupplierId = req.body.supplier_id;
  
    if (newProductUnitPrice <= 0) {
      return res
        .status(400)
        .send("The price should be a positive integer.");
    }
  
    pool
      .query("SELECT * FROM products WHERE supplier_id=$1", [newProductSupplierId])
      .then((result) => {
        if (result.rows.length > 0) {
            const query =
            "INSERT INTO products (product_name, unit_price, supplier_id) VALUES ($1, $2, $3)";
          pool
            .query(query, [newProductName, newProductUnitPrice, newProductSupplierId])
            .then(() => res.send("A product created!"))
            .catch((e) => console.error(e));

          
        } else {
            return res
            .status(400)
            .send("The supplier doesn't exist in database!");
        }
      });
  });





app.listen(3000, function() {
    console.log("Server is listening on port 3000. Ready to accept requests!");
});



/* 
- *If you don't have it already, add a new GET endpoint `/products` to load all the product names along with their supplier names.

- *Update the previous GET endpoint `/products` to filter the list of products by name using a query parameter, for example `/products?name=Cup`. This endpoint should still work even if you don't use the `name` query parameter!

- *Add a new GET endpoint `/customers/:customerId` to load a single customer by ID.

- *Add a new POST endpoint `/customers` to create a new customer.

- *Add a new POST endpoint `/products` to create a new product (with a product name, a price and a supplier id). Check that the price is a positive integer and that the supplier ID exists in the database, otherwise return an error.

- Add a new POST endpoint `/customers/:customerId/orders` to create a new order (including an order date, and an order reference) for a customer. Check that the customerId corresponds to an existing customer or return an error.

- Add a new PUT endpoint `/customers/:customerId` to update an existing customer (name, address, city and country).

- Add a new DELETE endpoint `/orders/:orderId` to delete an existing order along all the associated order items.

- Add a new DELETE endpoint `/customers/:customerId` to delete an existing customer only if this customer doesn't have orders.

- Add a new GET endpoint `/customers/:customerId/orders` to load all the orders along the items in the orders of a specific customer. Especially, the following information should be returned: order references, order dates, product names, unit prices, suppliers and quantities. */