import Customer from "../models/Customer.js";
import * as Yup from "yup";

class CustomersController {

  async index(req, res) {
    const { page = 1, limit = 10 } = req.query;

    const customers = await Customer.findAll({
      limit: Number(limit),
      offset: (page - 1) * limit
    });

    return res.json(customers);
  }

  async show(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required()
    });

    try {
      await schema.validate(req.params, { abortEarly: false });

      const { id } = req.params;

      const customer = await Customer.findByPk(id, {
        include: ["contacts"] // 🔥 usando relacionamento
      });

      if (!customer) {
        return res.status(404).json({ error: "Customer not found" });
      }

      return res.json(customer);

    } catch (err) {
      return res.status(400).json({ errors: err.errors });
    }
  }

  async create(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required("Name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      status: Yup.string().oneOf(["ACTIVE", "ARCHIVED"]) // 🔥 corrigido
    });

    try {
      await schema.validate(req.body, { abortEarly: false });

      const { name, email, status } = req.body;

      const customer = await Customer.create({
        name,
        email,
        status
      });

      return res.status(201).json(customer);

    } catch (err) {

      if (err.name === "SequelizeUniqueConstraintError") {
        return res.status(400).json({ error: "Email already exists" });
      }

      return res.status(500).json({
        error: "Error creating customer"
      });
    }
  }

  async update(req, res) {
    const paramSchema = Yup.object().shape({
      id: Yup.number().required()
    });

    const bodySchema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email("Invalid email"),
      status: Yup.string().oneOf(["ACTIVE", "ARCHIVED"]) // 🔥 corrigido
    });

    try {
      await paramSchema.validate(req.params, { abortEarly: false });
      await bodySchema.validate(req.body, { abortEarly: false });

      const { id } = req.params;

      const customer = await Customer.findByPk(id);

      if (!customer) {
        return res.status(404).json({
          error: "Customer not found"
        });
      }

      const { name, email, status } = req.body;

      await customer.update({
        name,
        email,
        status
      });

      return res.json(customer);

    } catch (err) {
      return res.status(400).json({ errors: err.errors });
    }
  }

  async destroy(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required()
    });

    try {
      await schema.validate(req.params, { abortEarly: false });

      const { id } = req.params;

      const customer = await Customer.findByPk(id);

      if (!customer) {
        return res.status(404).json({
          error: "Customer not found"
        });
      }

      await customer.destroy();

      return res.json({
        message: "Customer deleted successfully"
      });

    } catch (err) {
      return res.status(400).json({ errors: err.errors });
    }
  }
}

export default new CustomersController();