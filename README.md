# Plano-de-Treino

Este projeto é um plano de treino interativo e dinâmico, desenvolvido para ajudar usuários a criar e gerenciar suas rotinas de exercícios. Utiliza NextJS no frontend e Firebase como backend para armazenamento e autenticação. O objetivo é fornecer uma plataforma completa para acompanhamento de treinos, incluindo descrições de exercícios, geração de treinas e visualização de progresso.

## Recursos

*   Criação e gerenciamento de rotinas de exercícios personalizadas.
*   Descrições detalhadas de uma variedade de exercícios.
*   Geração de planos de treino com base em objetivos e disponibilidade.
*   Visualização de progresso ao longo do tempo.
*   Autenticação de usuário para salvar e acessar dados de treino de forma segura.

## Ferramentas Utilizadas

*   **Frontend:** NextJS
*   **Backend:** Firebase
*   **Linguagem:** TypeScript
*   **Estilização:** Tailwind CSS
*   **Geração de IA:** Genkit (para o gerador de planos de treino)

## Como Rodar o Projeto

Para rodar este projeto localmente, siga os passos abaixo:

1.  **Clone o repositório:**

    ```bash
    git clone https://github.com/RobertoAbrao/Plano-de-Treino.git
    ```

2.  **Navegue até o diretório do projeto:**

    ```bash
    cd Plano-de-Treino
    ```

3.  **Instale as dependências:**

    ```bash
    npm install
    ```

4.  **Configure o Firebase:**

    *   Crie um projeto no Firebase console.
    *   Configure a autenticação e o banco de dados (Firestore ou Realtime Database).
    *   Crie um arquivo `.env.local` na raiz do projeto com suas chaves de API e configuração do Firebase (veja o arquivo `.env.example` para um exemplo).

5.  **Rode o servidor de desenvolvimento:**

    ```bash
    npm run dev
    ```

O projeto estará disponível em `http://localhost:3000`.