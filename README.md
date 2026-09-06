# Estoque — Livro de Controle

Site simples em HTML, CSS e JavaScript puro para cadastrar, editar e remover produtos do estoque. Os dados ficam salvos no navegador (localStorage), então não precisa de servidor nem banco de dados.

## Como abrir no Visual Studio Code

1. Extraia/copie a pasta `estoque-app` para o seu computador.
2. Abra o VS Code e escolha **File > Open Folder...**, selecionando a pasta `estoque-app`.
3. Clique com o botão direito em `index.html` e escolha **Open with Live Server** (se tiver essa extensão instalada), ou simplesmente dê duplo clique em `index.html` para abrir direto no navegador.

## Estrutura do projeto

```
estoque-app/
├── index.html   → estrutura da página (formulário + tabela)
├── style.css    → visual do sistema
├── script.js    → lógica de cadastrar, editar, remover e buscar produtos
└── README.md    → este arquivo
```

## Funcionalidades

- Cadastrar produto (nome, código/SKU, quantidade, estoque mínimo, preço unitário)
- Editar produto existente
- Remover produto (com confirmação)
- Buscar por nome ou código
- Cálculo automático de valor total em estoque e alerta de "estoque baixo"

## Próximos passos possíveis

- Controle de entradas e saídas de quantidade (histórico de movimentação)
- Exportar a lista para CSV/Excel
- Trocar o armazenamento local por um backend (Node.js + banco de dados) para acessar de vários dispositivos
