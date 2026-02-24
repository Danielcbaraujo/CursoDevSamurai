const nome = 'Daniel';
const idade = 25;

function apresentar(nome, idade) {
  if (nome === 'Daniel') {
    console.log('Olá ' + nome + ' você tem ' + idade + ' anos');
  } else {
    console.log('Usuário diferente');
  }
}

apresentar(nome, idade);
