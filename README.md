# Sistema de Gestão de Eventos (Nexus Eventos)

Este projeto é um sistema web para gerir eventos, com um frontend para clientes e uma área de administração para o negócio.

## Tecnologias Utilizadas

* **Front-end:** Next.js (React com Hooks)
* **Back-end:** Strapi (CMS Headless, API REST)
* **Base de Dados:** SQLite (padrão Strapi)
* **Autenticação:** JWT (JSON Web Token)
* **Estilização:** Tailwind CSS

## Funcionalidades Implementadas

### Para Clientes:
* **Página Inicial:** Logótipo, informação da empresa, botão para contactos e lista de próximos eventos.
* **Página de Eventos:** Mostra detalhes dos eventos e permite a inscrição (a inscrição é registada no Strapi e no admin, mas sem mensagem de confirmação final ao cliente).
* **Página de Contactos:** Formulário para envio de mensagens ao negócio.

### Para Administradores (Área Protegida por Login):
* **Login:** Funcional com autenticação JWT.
* **Dashboard:** Exibe o total de eventos e o número de inscrições pendentes.
* **Eventos:** Lista os eventos existentes (não permite adicionar, editar ou remover).
* **Inscrições:** Lista todas as inscrições. Permite abrir o formulário para alterar o status, mas a alteração atualmente resulta em erro.
* **Mensagens:** Lista as mensagens recebidas (mensagens muito longas são cortadas).

## Como Executar o Projeto Localmente

### Pré-requisitos

* Node.js (LTS)
* npm ou Yarn

### 1. Configurar o Back-end (Strapi)

1.  **Navegue até a pasta do Strapi:**
    ```bash
    cd C:\temp\Nexus Eventos\backend
    ```
2.  **Instale as dependências:**
    ```bash
    npm install # ou yarn install
    ```
3.  **Ajuste o CORS:** No ficheiro `config/middlewares.js`, adicione `'Authorization'` ao array `headers` na configuração `strapi::cors`. Exemplo:
    ```javascript
    // ...
    {
      name: 'strapi::cors',
      config: {
        origin: ['http://localhost:3000'], // Adicione o URL do seu frontend Next.js
        headers: ['Content-Type', 'Authorization', 'Accept'], // <-- Adicionar 'Authorization'
        // ...
      },
    },
    // ...
    ```
4.  **Verifique as Permissões:** No painel de administração do Strapi (`http://localhost:1337/admin`), em **Settings > Roles > Authenticated**, certifique-se que as permissões `find` (e outras ações necessárias) para `Evento`, `Inscricao` e `Mensagem` estão marcadas.
5.  **Inicie o Strapi:**
    ```bash
    npm run develop # ou yarn develop
    ```
    O Strapi estará em `http://localhost:1337`.

### 2. Configurar o Front-end (Next.js)

1.  **Navegue até a pasta do seu projeto Next.js.**
    *Se o seu frontend está na raiz de "Nexus Eventos" ou numa subpasta, ajuste o caminho.*
    ```bash
    # Exemplo: Se o frontend está em C:\temp\Nexus Eventos\frontend
    cd C:\temp\Nexus Eventos\frontend
    ```
2.  **Instale as dependências:**
    ```bash
    npm install # ou yarn install
    ```
3.  **Crie `.env.local`:** Na raiz do seu projeto Next.js, adicione:
    ```
    NEXT_PUBLIC_STRAPI_API_URL=http://localhost:1337
    ```
4.  **Inicie o Next.js:**
    ```bash
    npm run dev # ou yarn dev
    ```
    O frontend estará em `http://localhost:3000`.

## Estrutura do Projeto

O projeto é dividido em duas pastas principais: `backend` para o Strapi e `frontend` para o Next.js.

C:\temp\Nexus Eventos

├── backend/                  # Projeto Strapi
│   └── (conteúdo do projeto Strapi, incluindo config/middlewares.js)
├── frontend/                 # Projeto Next.js (estrutura detalhada abaixo)
│   ├── .flowbite-react/      # Componentes UI de Flowbite para React
│   ├── .next/                # Build output do Next.js
│   ├── .vscode/              # Configurações do VS Code
│   ├── node_modules/         # Dependências do Node.js
│   ├── public/               # Ficheiros estáticos
│   │   └── favicon.ico
│   ├── src/                  # Código fonte da aplicação
│   │   ├── app/              # Next.js App Router
│   │   │   ├── admin/        # Rotas da área de administração
│   │   │   │   ├── dashboard/page.tsx
│   │   │   │   ├── events/
│   │   │   │   │   ├── edit/[id]/page.tsx
│   │   │   │   │   ├── new/page.tsx
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── inscriptions/page.tsx
│   │   │   │   ├── login/page.tsx
│   │   │   │   ├── messages/page.tsx
│   │   │   │   └── layout.tsx
│   │   │   ├── contact/page.tsx
│   │   │   ├── events/       # Rotas de eventos para clientes
│   │   │   │   ├── [id]/
│   │   │   │   │   ├── register/page.tsx
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── page.tsx      # Página inicial (Home)
│   │   │   ├── globals.css
│   │   │   └── layout.tsx    # Layout principal da aplicação
│   │   └── components/       # Componentes React reutilizáveis
│   │       ├── AdminSidebar.tsx
│   │       ├── ContactInfo.tsx
│   │       ├── EventCard.tsx
│   │       ├── EventForm.tsx
│   │       ├── Footer.tsx
│   │       ├── Navbar.tsx
│   │       └── NavbarClient.tsx
│   ├── .env.local            # Variáveis de ambiente locais
│   ├── .gitignore
│   ├── eslint.config.mjs
│   ├── middlewares.js        # Possível ficheiro de middlewares para Next.js
│   ├── next-env.d.ts
│   ├── next.config.mjs
│   ├── package-lock.json
│   ├── package.json
│   ├── postcss.config.mjs
│   ├── README.md             # Este ficheiro
│   ├── tailwind.config.js
│   └── tsconfig.json
