# Como executar o projeto
- Clonar o projeto em sua máquina
- Na pasta raiz do projeto executar 'docker-compose up'
- Caso não queira executar o projeto com docker-compose:
  1) executar: docker run --name redis -p 6379:6379 -d -t redis:alpine
  2) executar: sudo docker run --name mongodb -p 27017:27017 -d -t mongo
  3) configurar o .env conforme .env.example
    obs1: não precisa configurar as chaves de AWS, elas foram criadas somente para
      simular como funcionaria a configuração do envio de email pelo S3
    obs2: ja deixei o .env.example configurado com os dados necessários
  4) configurar o .ormconfig.json conforme .ormconfig.example.json
    obs3: ja deixei o .env.example configurado com os dados necessários
  5) executar na pasta raiz do projeto para instalar as dependencias: yarn
  6) executar na pasta raiz do projeto para executar o projeto: yarn dev:server
  7) as rotas que precisam de autenticação deve enviar no Authorization um token Bearer (esse token é retornado no endpoint post /sessions)

# Principais Tecnologias

- Express: rotas
- Mongo: banco de dados
- TypeORM: manipulação do banco de dados
- Redis: cacheamento - foi utilizado para gerar cache na rota de historico de uma placa
- DateFns: manipulação de datas
- Celebrate: validação de parametros dos enpoints
- Bcryptjs: criptografia
- Rate-limiter-flexible: prevenção de ataques DDOS
- swagger-ui-express: documentação da API
- tsyringe: injeção de dependencias
- ethereal: simulação de envio de email local (nas rotas que possuem envio de email, ele imprime uma url no console como se fosse um email)

# Documentação

- Foi criada uma documentação da API. A mesma pode ser acessada em localhost:3333/api-docs
- Na pasta raiz do projeto, contém um arquivo com nome parking-insomnia.json que serve para importação de todas as rotas no Insomnia.

# Testes

- Para executar os testes rodar o seguinte comando na pasta raiz do projeto: yarn test


# Requisitos Funcionais / Requisitos Não Funcionais / Regras de Negócio
## Recuperação de senha

**Requisitos Funcionais**

- O usuário deve poder recuperar sua senha informando o seu e-mail;
- O usuário deve receber um e-mail com instruções de recuperação de senha;
- O usuário deve poder resetar sua senha;

**Requisitos Não Funcionais**

- Utilizar MailTrap para testar envios em ambiente de desenvolvimento;
- Utilizar o Amazon SES para envios em produção;
- O envio de e-mails deve acontecer em segundo plano (background job);

**Regras de Negócio**

- O link enviado por email para resetar senha, deve expirar em 2h;
- O usuário precisa confirmar a nova senha para resetar sua senha;

## Atualização do perfil

**Requisitos Funcionais**

- O usuário deve poder atualizar seu nome, email e senha;

**Regras de Negócio**

- O usuário não pode alterar seu email para um email já utilizado;
- Para atualizar sua senha, o usuário deve informar a senha antiga;
- Para atualizar sua senha, o usuário precisa confirmar a nova senha;

## Parking

**Requisitos Funcionais**

- O usuário deve poder cadastrar uma placa no estacionamento
- O usuário deve poder pagar pelo estacionamento
- O usuário deve poder dar saida do veiculo do estacionamento
- O usuário deve poder listar o historico de estacionamento de determinado veiculo
- Caso o usuário escolha, o mesmo deve receber um e-mail com informações sobre o estacionamento.

**Regras de Negócio**

- O usuário não pode estacionar um veiculo que já está estacionado
- O usuário não pode pagar um veiculo que já está pago
- O usuário não pode dar saida em um veiculo que já saiu do estacionamento
- O usuário não pode dar saida em um veiculo que ainda não efetuou o pagamento


# Considerações
- Decidi não colocar na tabela parking o atributo left, pois coloquei o exitDate, que era necessário para calculo do tempo de estacionamento, e com isso, caso o exitDate seja null significa que o veiculo ainda não saiu do estacionamento.
- No endpoint de out, caso o usuário passe um email no body da requisição, será enviado um comprovante para o email informado.
