readme_content = """
# 📊 CRM React Project

## 📌 Descrição do Projeto e Integrantes

Este é um sistema CRM (Customer Relationship Management) desenvolvido em React, com o objetivo de permitir o gerenciamento de clientes, produtos, vendas e categorias. O projeto foi desenvolvido como trabalho final da disciplina de Programação Web.

### 👥 Integrantes do grupo:

- *Bernarda*
- *Bruno Monteiro Bonifácio*
- *Leticia Vociekoski*

## ❓ Descrição do Problema

Empresas frequentemente enfrentam dificuldades em gerenciar seus clientes, produtos e vendas de maneira eficiente. Esse sistema CRM busca solucionar isso oferecendo:

- Cadastro e edição de clientes;
- Gerenciamento de categorias e produtos;
- Registro e visualização de vendas;
- Controle de autenticação (login/cadastro);
- Visualização de métricas via gráficos (em ChartsPage.jsx).

## 🛠 Tecnologias Utilizadas

- *React* (biblioteca principal da UI)
- *React Router* (gerenciamento de rotas)
- *Context API* (gerenciamento de autenticação e estado)
- *CSS Modules / SCSS* (estilização)
- *JavaScript (ES6+)*
- *Bibliotecas auxiliares*:
  - format-utils.js – formatação de dados (moeda, datas, etc.)
  - notification-utils.js – gerenciamento de notificações

## 🚫 Limitações do Projeto

- Falta de persistência de dados (sem backend ou banco de dados conectado).
- Autenticação básica (sem criptografia, OAuth, etc).
- Ausência de testes automatizados.
- Sem integração com APIs externas.

## 🧩 Descrição das Entidades e Propriedades

### 🧍 Cliente

- id: identificador único
- nome: nome do cliente
- email: contato
- telefone: número de telefone
- empresa: empresa vinculada

### 📦 Produto

- id: identificador único
- nome: nome do produto
- preço: valor monetário
- categoriaId: vínculo com categoria

### 🗂 Categoria de Produto

- id: identificador
- nome: nome da categoria

### 💰 Venda

- id: identificador único
- clienteId: referência ao cliente
- produtoId: produto vendido
- quantidade: total adquirido
- data: data da venda

## ▶ Como Executar o Projeto Localmente

1. *Clone o repositório:*

bash
git clone https://github.com/BettBernarda/CRM-React-project.git
cd CRM-React-project


2. *Instale as dependências:*

bash
npm install


3. *Execute o projeto:*

bash
npm start


4. Acesse o projeto no navegador via: http://localhost:3000

## 📚 Outros Conteúdos Relevantes

- *Proteção de rotas:* implementada via componentes como RequireLogin.
- *Sistema de autenticação:* com páginas de Login e Signup.
- *Fallback 404:* página PageNotFound.jsx exibida para rotas inválidas.
- *Layouts:* uso de DefaultLayout.jsx para padronizar visual.
- *Gráficos e métricas:* exibidos na ChartsPage.jsx.

---

Este projeto representa uma base sólida para futuras melhorias, como conexão com banco de dados, autenticação robusta e relatórios avançados.
"""

# Salvando o conteúdo em um arquivo README.md
file_path = "/mnt/data/README.md"
with open(file_path, "w", encoding="utf-8") as f:
    f.write(readme_content)

file_path