# Order Management System

## Sobre o projeto:

Este projeto foi desenvolvido como uma PoC (Prova de Conceito) para aprimorar minhas habilidades nas tecnologias utilizadas. O sistema oferece gerenciamento completo de clientes e produtos, permitindo criar, editar, listar e excluir registros. Com esses dados, é possível gerar e acompanhar pedidos, cuja listagem ocorre em tempo real. Para atualização de status, o sistema utiliza o Azure Service Bus, garantindo sincronização ágil e precisa.

## O sistema:

O sistema é desenvolvido com APIs em _.NET_ integradas a um banco de dados _PostgreSQL_, que fornecem dados para interfaces responsivas criadas em _React_ e _TailwindCSS_. Para atualização de status dos pedidos, utiliza-se o _Azure Service Bus_ como mensageria, garantindo comunicação eficiente entre os serviços. No Front-end, as mudanças são exibidas em tempo real por meio do _SignalR_ e _WebSockets_, proporcionando uma experiência ágil e interativa ao usuário.

## Partes a melhorar/desenvolver:

- [ ] Implementar um sistema de segurança entre o front-end e o back-end.
- [ ] Implementar features de busca e filtragem nas telas de listagem; e
- [ ] Incluir Style Guides e Componentização por parte do front-end.

## Ilustrações do sistema:

- Listagem de Pedidos:
<img width="1920" height="1032" alt="image" src="https://github.com/user-attachments/assets/b25b5049-7a6e-4658-8c0d-7d0cfa41ca0d" />


- Modal de Cadastro e Edição de Clientes:
<img width="1920" height="1032" alt="image" src="https://github.com/user-attachments/assets/3abc82b3-a929-4408-ac1a-d36ee08b3f59" />


- Swagger completo da Aplicação:
<img width="1920" height="1032" alt="image" src="https://github.com/user-attachments/assets/b34772f0-b046-40e1-91be-248239eb1035" />

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
