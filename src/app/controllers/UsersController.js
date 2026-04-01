import User from "../models/User.js";
import * as Yup from "yup";

class UserController {

  // 📌 LISTAR USUÁRIOS
  async index(req, res) {
    const users = await User.findAll({
      attributes: ["id", "name", "email", "provider"]
    });

    return res.json(users);
  }

  // 📌 MOSTRAR UM USUÁRIO
  async show(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required(),
    });

    try {
      await schema.validate(req.params, { abortEarly: false });

      const { id } = req.params;

      const user = await User.findByPk(id, {
        attributes: ["id", "name", "email", "provider"]
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.json(user);

    } catch (err) {
      return res.status(400).json({ errors: err.errors });
    }
  }

  // 📌 CRIAR USUÁRIO
  async create(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().min(6).required(),
      provider: Yup.boolean(),
    });

    try {
      await schema.validate(req.body, { abortEarly: false });

      const { name, email, password, provider } = req.body;

      // ⚠️ TEMPORÁRIO (sem bcrypt ainda)
      const user = await User.create({
        name,
        email,
        password_hash: password, // depois vamos criptografar
        provider,
      });

      return res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        provider: user.provider,
      });

    } catch (err) {
      return res.status(400).json({
        errors: err.errors || "Error creating user",
      });
    }
  }

  // 📌 ATUALIZAR USUÁRIO
  async update(req, res) {
    const paramSchema = Yup.object().shape({
      id: Yup.number().required(),
    });

    const bodySchema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      password: Yup.string().min(6),
      provider: Yup.boolean(),
    });

    try {
      await paramSchema.validate(req.params, { abortEarly: false });
      await bodySchema.validate(req.body, { abortEarly: false });

      const { id } = req.params;

      const user = await User.findByPk(id);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const { name, email, password, provider } = req.body;

      await user.update({
        name,
        email,
        provider,
        ...(password && { password_hash: password }) // atualiza senha se vier
      });

      return res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        provider: user.provider,
      });

    } catch (err) {
      return res.status(400).json({ errors: err.errors });
    }
  }

  // 📌 DELETAR USUÁRIO
  async destroy(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required(),
    });

    try {
      await schema.validate(req.params, { abortEarly: false });

      const { id } = req.params;

      const user = await User.findByPk(id);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      await user.destroy();

      return res.json({ message: "User deleted successfully" });

    } catch (err) {
      return res.status(400).json({ errors: err.errors });
    }
  }
}

export default new UserController();