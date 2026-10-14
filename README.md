# 💰 WealthFlow

App de finanças pessoais com IA: orçamentos, extrato de transações e um plano de recuperação de dívidas gerado pelo Gemini.

🔗 **Demo:** https://wealthflow-david-355653209045.us-east1.run.app

## Funcionalidades

- **Dashboard** com saldo, receitas, despesas e gráficos de gastos por categoria
- **Orçamentos** por categoria com acompanhamento do quanto já foi usado
- **Extrato** de transações com filtros
- **Recuperação de dívidas com IA**: o Gemini analisa a situação e sugere um plano de pagamento (com resposta de fallback quando não há chave de API)

## Tecnologias

- React + TypeScript + Vite
- Tailwind CSS
- Node.js + Express (API `/api/ai-recovery`)
- Google Gemini API
- Deploy no Google Cloud Run
- Criado com **Google AI Studio** e **Stitch** (design)

## Como rodar localmente

Pré-requisito: Node.js 18+

```bash
npm install
cp .env.example .env   # e preencha GEMINI_API_KEY
npm run dev
```

Build de produção:

```bash
npm run build
npm start
```

## Autor

David Oliveira — [LinkedIn](https://www.linkedin.com/in/david-montalvao) · [GitHub](https://github.com/wdavixx)
