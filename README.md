# Order Management System

## Sobre o projeto:

O projeto em questão foi desenvolvido como uma PoC (Prova de Conceito), com o intuito de desenvolver e melhorar as minhas habilidades com as técnologias envolvidas. O sistema conta com o gerenciamento completo de Clientes e Produtos dentro do sistema, permitindo criar, editar, listar e excluir essas informações.

Com essas informações, é possivel criar e listar pedidos de clientes em relação a um produto no sistema. A listagem desses pedidos são em tempo real e conta com a utilização do Azure Service Bus para a atualização dos status desses pedidos.

## O sistema:

O sistema funciona através de API's feitas em  _.NET_ com _PostgreSQL_, que alimentam as telas responsivas feitas em _React_ e _TailwindCSS_ para a interação com o usuário. Dentro do sistema, também é utilizado o _Azure Service Bus_ como mensageiro para a atualização dos status dos pedidos, que são listados em tempo real no Front-end com a tecnologia _SignalR_ e _WebSockets_.

## Partes a melhorar/desenvolver:

- [ ] Implementar um sistema de segurança entre o front-end e o back-end.
- [ ] Implementar features de busca e filtragem nas telas de listagem; e
- [ ] Incluir Style Guides e Componentização por parte do front-end.

## Ilustrações do sistema:

- Listagem de Pedidos:

- Modal de Cadastro e Edição de Clientes:

- Swagger completo da Aplicação:

## Como rodar:

1. Com o repositório clonado em seu computador, verifique se tem o Docker instalado em sua máquina.


2. Inclua a chave de integração e o nome da queue do __Azure Service Bus__ em "Backend/appsettings.json", dentro da chave "AzureServiceBus".


3. Rode o comando abaixo subir a aplicação:
```sh
docker compose up --build
```

4. Acesse a URL abaixo para ter acesso ao Swagger do .NET:
```
http://localhost:5000/swagger/index.html
```

5Acesse a URL abaixo para ter acesso a aplicação:
```
http://localhost:3000
```
