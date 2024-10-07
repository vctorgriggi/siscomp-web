## 🚀 Descrição

Aplicação Front-end desenvolvida com React e Vite para um Sistema de Compras. O projeto permite a interação com a API, facilitando o gerenciamento de fornecedores, produtos, cotações e requisições de compras, além de oferecer controle de usuários. Ademais, também foi implementado um sistema de controle de acesso, com restrição de rotas baseada nos cargos dos usuários.

## 📋 Funcionalidades

- **Gerenciamento de Fornecedores e Contatos:** Interface para visualização, criação, atualização e remoção de fornecedores e seus respectivos contatos.
- **Cadastro e Controle de Produtos:** Interface para gerenciamento de produtos, incluindo cadastro, edição e exclusão.
- **Requisições de Compras:** Ferramenta para criar, acompanhar e gerenciar requisições de compras.
- **Criação e Gestão de Cotações:** Permite a comparação e gestão de cotações de diferentes fornecedores.
- **Controle de Acesso:** As rotas e funcionalidades são restritas com base nos cargos dos usuários.
- **Autenticação de Usuários:** Login e controle de sessão, sincronizados com a API.

## 🛠️ Tecnologias Utilizadas

- React
- Vite
- Material-UI (MUI)
- Axios
- React Router DOM

## 📦 Como Rodar o Projeto

Siga os passos abaixo para rodar a aplicação localmente:

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/vctorgriggi/siscomp-web
   ```

2. **Navegue até o diretório do projeto:**

   ```bash
   cd siscomp-web
   ```

3. **Instale as dependências:**

   ```bash
   npm install
   ```

4. **Configure as variáveis de ambiente:**

   Renomeie o arquivo `.env.example` para `.env` e preencha o valor da URL da API.

5. **Inicie a aplicação:**

   ```bash
   npm run dev
   ```

6. **Acesse a aplicação.**

   A aplicação estará disponível em `http://localhost:5173`.
