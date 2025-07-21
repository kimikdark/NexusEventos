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

---
## Estrutura do Projeto
C:\temp\Nexus Eventos\
├── backend/
│   └── (conteúdo do projeto Strapi)
├── frontend/             # Este é o diretório que a estrutura acima representa
│   └── (conteúdo do projeto Next.js)
└── README.md


.
├── .flowbite-react/          # Possíveis componentes de UI de Flowbite para React
├── .next/                    # Build output do Next.js
├── .vscode/                  # Configurações do VS Code
├── node_modules/             # Dependências do Node.js
├── public/                   # Ficheiros estáticos acessíveis diretamente
│   └── favicon.ico           # Ícone do site
├── src/                      # Código fonte da aplicação
│   ├── app/                  # Diretório do Next.js App Router
│   │   ├── admin/            # Rotas e componentes da área de administração
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx        # Página do Dashboard do Admin
│   │   │   ├── events/             # Gestão de Eventos (Admin)
│   │   │   │   ├── edit/[id]/
│   │   │   │   │   └── page.tsx    # Página de edição de um evento específico
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx    # Página para adicionar novo evento
│   │   │   │   └── page.tsx        # Página de listagem de eventos (Admin)
│   │   │   ├── inscriptions/       # Gestão de Inscrições (Admin)
│   │   │   │   └── page.tsx        # Página de listagem de inscrições (Admin)
│   │   │   ├── login/
│   │   │   │   └── page.tsx        # Página de Login do Admin
│   │   │   ├── messages/           # Gestão de Mensagens (Admin)
│   │   │   │   └── page.tsx        # Página de listagem de mensagens (Admin)
│   │   │   ├── layout.tsx          # Layout específico para as rotas de administração
│   │   │   └── page.tsx            # (Possível) Página inicial de admin ou redirect
│   │   ├── contact/
│   │   │   └── page.tsx            # Página de Contactos (do lado do cliente)
│   │   ├── events/                 # Rotas de eventos para o lado do cliente
│   │   │   ├── [id]/               # Detalhes de um evento específico
│   │   │   │   ├── register/
│   │   │   │   │   └── page.tsx    # Formulário de inscrição para o evento
│   │   │   │   └── page.tsx        # Página de detalhes do evento
│   │   │   └── page.tsx            # Página de listagem de eventos (Cliente)
│   │   ├── page.tsx                # Página inicial (Home) do cliente
│   │   ├── globals.css             # Estilos CSS globais
│   │   └── layout.tsx              # Layout principal da aplicação
│   └── components/           # Componentes React reutilizáveis
│       ├── AdminSidebar.tsx
│       ├── ContactInfo.tsx
│       ├── EventCard.tsx
│       ├── EventForm.tsx
│       ├── Footer.tsx
│       ├── Navbar.tsx
│       └── NavbarClient.tsx
├── .env.local                # Variáveis de ambiente locais (ex: NEXT_PUBLIC_STRAPI_API_URL)
├── .gitignore                # Ficheiro para ignorar pastas e ficheiros no Git
├── del
├── eslint.config.mjs         # Configuração do ESLint
├── middlewares.js            # Ficheiro de middlewares (para o Next.js, se estiver a usar)
├── next-env.d.ts             # Definições de ambiente para Next.js
├── next.config.mjs           # Configuração do Next.js
├── npm
├── package-lock.json         # Bloqueio de dependências do npm
├── package.json              # Metadados do projeto e scripts
├── postcss.config.mjs        # Configuração do PostCSS
├── rd
├── README.md                 # O ficheiro README do projeto
├── tailwind.config.js        # Configuração do Tailwind CSS
└── tsconfig.json             # Configuração do TypeScript
