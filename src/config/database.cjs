// aqui vai ter as credencias e o dialeto que vamos comunicar com o banco de dados
module.exports = {
  dialect: "postgres",     // Define que o banco usado é PostgreSQL
  host: "localhost",        // O endereço do servidor do banco (aqui está local)
  username: "postgres",     // Usuário do banco
  password: "123",       // Senha do usuário
  database: "teste-dominando-nodejs",  // Nome do banco de dados
  define: {
    timestamps: true,        // ⚠️ aqui tem um pequeno erro: o correto é 'timestamps' (plural)
                             // Cria automaticamente as colunas createdAt e updatedAt
    underscored: true,      // Converte nomes de colunas camelCase para snake_case (ex: created_at)
    underscoredAll: true,   // Faz o mesmo para nomes de tabelas
  },
};