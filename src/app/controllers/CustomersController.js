class CustomersController {
  constructor() {
    this.customers = [
      { id: 1, name: "Dev Samurai", site: "http://devsamurai.com.br" },
      { id: 2, name: "Google", site: "http://google.com" },
      { id: 3, name: "UOL", site: "http://uol.com.br" }
    ];
  }

  index = (req, res) => {
    return res.json(this.customers);
  }

  show = (req, res) => {
    const id = parseInt(req.params.id);
    const customer = this.customers.find(item => item.id === id);

    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    return res.status(200).json(customer);
  }

  create = (req, res) => {
    const { name, site } = req.body;

    if (!name || !site) {
      return res.status(400).json({ error: "Name and site are required" });
    }

    const id = this.customers.length > 0
      ? this.customers[this.customers.length - 1].id + 1
      : 1;

    const newCustomer = { id, name, site };
    this.customers.push(newCustomer);

    return res.status(201).json(newCustomer);
  }

  update = (req, res) => {
    const id = parseInt(req.params.id);
    const { name, site } = req.body;
    const index = this.customers.findIndex(item => item.id === id);

    if (index === -1) {
      return res.status(404).json({ error: "Customer not found" });
    }

    if (!name || !site) {
      return res.status(400).json({ error: "Name and site are required" });
    }

    this.customers[index] = { id, name, site };
    return res.status(200).json(this.customers[index]);
  }

  destroy = (req, res) => {
    const id = parseInt(req.params.id);
    const index = this.customers.findIndex(item => item.id === id);

    if (index === -1) {
      return res.status(404).json({ error: "Customer not found" });
    }

    this.customers.splice(index, 1);
    return res.status(200).json({ message: "Customer deleted successfully" });
  }
}

export default new CustomersController();