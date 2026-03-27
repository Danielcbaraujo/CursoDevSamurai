import Contact from "../models/Contact.js";
import * as Yup from "yup";


class  ContactsController {

  async index(req, res) {
    const contact = await Contact.findAll({
      limit: 1000
    });

    return res.json(contact);
  }

  async show(req, res) {
    // ✅ validação do params
    const schema = Yup.object().shape({
      id: Yup.number().required()
    });

    try {
      await schema.validate(req.params, { abortEarly: false });
    } catch (err) {
      return res.status(400).json({ errors: err.errors });
    }

    const { id } = req.params;

    const contact = await Contact.findByPk(id);

    if (!contact) {
      return res.status(404).json({ error: "Customer not found" });
    }

    return res.json(contact);
  }

async create(req, res) {
  const schema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    status: Yup.boolean()
  });

  try {
    await schema.validate(req.body, { abortEarly: false });

    const { name, email, status } = req.body;

    const contact = await Contact.create({
      name,
      email,
      status
    });

    return res.status(201).json(contact);

  } catch (err) {
    console.log(err); // 🔥 MOSTRA O ERRO REAL

    return res.status(500).json({
      error: "Erro ao criar cliente"
    });
  }
}

  async update(req, res) {
    // ✅ valida params
    const paramSchema = Yup.object().shape({
      id: Yup.number().required()
    });

    // ✅ valida body (tudo opcional no update)
    const bodySchema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email("Invalid email"),
      status: Yup.boolean()
    });

    try {
      await paramSchema.validate(req.params, { abortEarly: false });
      await bodySchema.validate(req.body, { abortEarly: false });
    } catch (err) {
      return res.status(400).json({ errors: err.errors });
    }

    const { id } = req.params;

    const contact = await Contact.findByPk(id);

    if (!contact) {
      return res.status(404).json({
        error: "Customer not found"
      });
    }

    const { name, email, status } = req.body;

    await contact.update({
      name,
      email,
      status
    });

    return res.json(contact);
  }

  async destroy(req, res) {
    // ✅ valida params
    const schema = Yup.object().shape({
      id: Yup.number().required()
    });

    try {
      await schema.validate(req.params, { abortEarly: false });
    } catch (err) {
      return res.status(400).json({ errors: err.errors });
    }

    const { id } = req.params;

    const contact = await Contact.findByPk(id);

    if (!contact) {
      return res.status(404).json({
        error: "Customer not found"
      });
    }

    await contact.destroy();

    return res.json({
      message: "Customer deleted successfully"
    });
  }
}

export default new ContactsController();