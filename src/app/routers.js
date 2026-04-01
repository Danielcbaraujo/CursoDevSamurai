import { Router } from "express";

import CustomersController from "./controllers/CustomersController.js";
import ContactsController from "./controllers/ContactsController.js";
import UsersController from "./controllers/UsersController.js";

const routes = new Router();


// =========================
// 📌 CUSTOMERS
// =========================
routes.get("/customers", CustomersController.index);
routes.get("/customers/:id", CustomersController.show);
routes.post("/customers", CustomersController.create);
routes.put("/customers/:id", CustomersController.update);
routes.delete("/customers/:id", CustomersController.destroy);


// =========================
// 📌 CONTACTS (NESTED)
// =========================
routes.get("/customers/:customerId/contacts", ContactsController.index);
routes.get("/customers/:customerId/contacts/:id", ContactsController.show);
routes.post("/customers/:customerId/contacts", ContactsController.create);
routes.put("/customers/:customerId/contacts/:id", ContactsController.update);
routes.delete("/customers/:customerId/contacts/:id", ContactsController.destroy);


// =========================
// 📌 USERS
// =========================
routes.get("/users", UsersController.index);
routes.get("/users/:id", UsersController.show);
routes.post("/users", UsersController.create);
routes.put("/users/:id", UsersController.update);
routes.delete("/users/:id", UsersController.destroy);


export default routes;