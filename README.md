# Duelo de Tipos

Quiz web para treinar vantagens e fraquezas dos tipos Pokémon. Cada partida tem 10 perguntas, e cada resposta vem com a explicação do resultado.

> Projeto de fãs, gratuito e sem fins lucrativos. Não é afiliado, patrocinado nem endossado pela Nintendo, pela Creatures Inc. ou pela GAME FREAK inc. Veja o [aviso legal](#aviso-legal).

## Como jogar

Abra o `index.html` no navegador. Não precisa instalar nada nem rodar servidor.

### Modos de jogo

| Modo | O que você faz |
| --- | --- |
| **Ataque** | Um tipo ataca outro (ou um tipo duplo). Escolha o multiplicador de dano: 0×, ¼×, ½×, 1×, 2× ou 4×. |
| **Fraquezas** | Veja um Pokémon e marque todos os tipos que causam dano extra nele. |
| **Melhor golpe** | Entre quatro tipos de golpe, escolha o mais efetivo contra o Pokémon. |
| **Treino misto** | Os três modos embaralhados na mesma partida. |

### Dificuldade

- **Fácil:** só tipos únicos.
- **Médio:** mistura tipos únicos e duplos.
- **Difícil:** só tipos duplos, com multiplicadores 4× e ¼×.

Há também a opção de **ocultar os tipos do Pokémon** nos modos que mostram um Pokémon, para testar se você sabe quais são.

### Pontuação

- Acerto: 100 pontos, mais 10 por cada acerto seguido na sequência (o bônus para em 50).
- No modo Fraquezas, acertar só parte das fraquezas dá pontos proporcionais. Marcar um tipo errado desconta do acerto parcial.
- Errar zera a sequência.
- O melhor placar de cada combinação de modo e dificuldade fica salvo no navegador.

### Atalhos de teclado

- `1` a `6` respondem no modo Ataque, e `1` a `4` no modo Melhor golpe.
- `Enter` avança para a próxima pergunta e, no modo Fraquezas, verifica a resposta.

### Idioma

O jogo está disponível em **português (Brasil)** e **inglês**. Troque a qualquer momento pelo seletor **PT | EN** no topo da página, inclusive no meio de uma partida, sem perder o progresso.

A escolha fica salva no navegador do jogador e é lembrada nas próximas visitas. Na primeira visita, o jogo abre em inglês se o navegador estiver em inglês, e em português nos demais casos.

### Estudar tipos

A tela **Estudar tipos** mostra, para cada um dos 18 tipos, o que ele vence, o que o vence e o que não o afeta, além da tabela completa de efetividade.

## Detalhes técnicos

- HTML, CSS e JavaScript puros, em três arquivos (`index.html`, `css/style.css` e `js/app.js`). Sem framework, sem build e sem dependências.
- A única requisição externa é a das fontes Chakra Petch e Hanken Grotesk, pelo Google Fonts. Sem conexão, a página usa as fontes do sistema.
- Tema claro e escuro automáticos, conforme a preferência do sistema.
- Layout responsivo, pensado para celular e computador.
- Preferências, idioma e recordes ficam no `localStorage` do navegador. Nenhum dado é enviado a servidor.
- A tabela de tipos segue a geração atual dos jogos, com os 18 tipos, incluindo Fada.

## Hospedagem

Por ser uma página estática, funciona em qualquer hospedagem gratuita:

- **GitHub Pages:** em *Settings → Pages*, escolha a branch `main` e a pasta raiz.
- **Cloudflare Pages**, **Netlify** ou **Vercel:** envie o projeto inteiro, mantendo as pastas `css/` e `js/` ao lado do `index.html`.

A página principal precisa se chamar `index.html`, e os caminhos de `css/` e `js/` são relativos a ela.

As meta tags de compartilhamento (título, descrição e imagem de preview) são estáticas e ficam em português, porque os apps de mensagem não executam JavaScript.

## Estrutura

```
.
├── index.html        # estrutura da página e meta tags de compartilhamento
├── css/
│   └── style.css     # tokens de cor, tema claro e escuro, layout e componentes
├── js/
│   └── app.js        # dados, idiomas, regras do jogo, telas e eventos
├── og-image.png      # imagem de preview ao compartilhar o link (1200×630)
└── README.md
```

### Organização do `js/app.js`

O arquivo segue esta ordem: dados e tabela de tipos, idioma (dicionários `NAMES` e `D`), utilidades, geradores de perguntas, estado e armazenamento, regras do jogo, telas e eventos.

## Contribuindo

Sugestões e correções são bem-vindas, principalmente erros na tabela de tipos ou nos tipos de algum Pokémon. Abra uma issue ou um pull request.

Para adicionar ou corrigir textos, edite o dicionário `D` (chaves `pt` e `en`) dentro do `js/app.js`. Os nomes dos tipos ficam em `NAMES`. Para incluir um novo idioma, adicione uma entrada em `D` e em `NAMES`, e inclua o código na lista `LANGS`.

Para adicionar Pokémon, inclua uma linha na lista `POKE` dentro do `js/app.js`, no formato `P(número_da_pokédex, 'Nome', 'tipo1', 'tipo2')`.

## Aviso legal

Este é um projeto de fãs, gratuito e sem fins lucrativos. Não é afiliado, patrocinado, aprovado nem endossado pela Nintendo, pela Creatures Inc. ou pela GAME FREAK inc.

Pokémon, os nomes dos Pokémon e dos tipos e os demais elementos relacionados são marcas registradas e propriedade da Nintendo, Creatures Inc. e GAME FREAK inc. © Nintendo / Creatures Inc. / GAME FREAK inc. Todos os direitos reservados aos seus respectivos titulares.

Este jogo não usa imagens, sprites, logotipos, músicas nem outros materiais oficiais. Os nomes são citados apenas para identificar os personagens, com finalidade educativa.

## Licença

O código deste repositório pode ser licenciado como você preferir (por exemplo, MIT). A licença do código não abrange as marcas, os nomes e a propriedade intelectual da Nintendo, da Creatures Inc. e da GAME FREAK inc.
