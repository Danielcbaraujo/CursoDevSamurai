import Contact from "../models/Contact.js";
import Customer from "../models/Customer.js";
import * as Yup from "yup";

class ContactsController {

  // 📌 LISTAR CONTATOS
  async index(req, res) {
    const { page = 1, limit = 10, customer_id } = req.query;

    const where = {};

    if (customer_id) {
      where.customer_id = customer_id;
    }

    const limitNumber = Number(limit);
    const pageNumber = Number(page);

    const contacts = await Contact.findAll({
      where,
      limit: limitNumber,
      offset: (pageNumber - 1) * limitNumber,
      include: [
        {
          model: Customer,
          as: "customer",
          attributes: ["id", "name", "email"],
        },
      ],
    });

    return res.json(contacts);
  }

  // 📌 MOSTRAR UM CONTATO
  async show(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required(),
    });

    try {
      await schema.validate(req.params, { abortEarly: false });

      const { id } = req.params;

      const contact = await Contact.findByPk(id, {
        include: [
          {
            model: Customer,
            as: "customer",
            attributes: ["id", "name", "email"],
          },
        ],
      });

      if (!contact) {
        return res.status(404).json({ error: "Contact not found" });
      }

      return res.json(contact);

    } catch (err) {
      return res.status(400).json({ errors: err.errors });
    }
  }

  // 📌 CRIAR CONTATO (🔥 CORRIGIDO)
 async create(req, res) {
  const paramSchema = Yup.object().shape({
    customerId: Yup.number().required("Customer ID is required"),
  });

  const bodySchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    status: Yup.string().oneOf(["ACTIVE", "INACTIVE", "ARCHIVED"]),
  });

  try {
    // ✅ valida params (vem da URL)
    await paramSchema.validate(req.params, { abortEarly: false });

    // ✅ valida body
    await bodySchema.validate(req.body, { abortEarly: false });

    const { customerId } = req.params;

    // 🔥 verifica se o cliente existe
    const customer = await Customer.findByPk(customerId);

    if (!customer) {
      return res.status(404).json({
        error: "Customer not found",
      });
    }

    // 🔥 cria contato com o customerId da URL
    const contact = await Contact.create({
      ...req.body,
      customer_id: customerId,
    });

    return res.status(201).json(contact);

  } catch (err) {
    return res.status(400).json({
      errors: err.errors || "Error creating contact",
    });
  }
}

  // 📌 ATUALIZAR CONTATO
  async update(req, res) {
    const paramSchema = Yup.object().shape({
      id: Yup.number().required(),
    });

    const bodySchema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email("Invalid email"),
      status: Yup.string().oneOf(["ACTIVE", "INACTIVE", "ARCHIVED"]),
    });

    try {
      await paramSchema.validate(req.params, { abortEarly: false });
      await bodySchema.validate(req.body, { abortEarly: false });

      const { id } = req.params;

      const contact = await Contact.findByPk(id);

      if (!contact) {
        return res.status(404).json({
          error: "Contact not found",
        });
      }

      await contact.update(req.body);

      return res.json(contact);

    } catch (err) {
      return res.status(400).json({ errors: err.errors });
    }
  }

  // 📌 DELETAR CONTATO
  async destroy(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required(),
    });

    try {
      await schema.validate(req.params, { abortEarly: false });

      const { id } = req.params;

      const contact = await Contact.findByPk(id);

      if (!contact) {
        return res.status(404).json({
          error: "Contact not found",
        });
      }

      await contact.destroy();

      return res.json({
        message: "Contact deleted successfully",
      });

    } catch (err) {
      return res.status(400).json({ errors: err.errors });
    }
  }
}

export default new ContactsController();