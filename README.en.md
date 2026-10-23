# Duelo de Tipos (Type Duel)

[Leia em português](README.md)

A web quiz for practicing Pokémon type matchups and weaknesses. Each round has 10 questions, and every answer comes with an explanation of the result.

> A free, non-profit fan project with no official ties. See the [legal notice](#legal-notice).

### Game modes

| Mode | What you do |
| --- | --- |
| **Attack** | One type attacks another (or a dual type). Pick the damage multiplier: 0×, ¼×, ½×, 1×, 2× or 4×. |
| **Weaknesses** | See a Pokémon and mark every type that deals extra damage to it. |
| **Best move** | Among four move types, pick the most effective one against the Pokémon. |
| **Mixed training** | All three modes shuffled into the same round. |

### Difficulty

- **Easy:** single types only.
- **Medium:** a mix of single and dual types.
- **Hard:** dual types only, with 4× and ¼× multipliers.

There is also an option to **hide the Pokémon's types** in the modes that show a Pokémon, so you can test whether you know them.

### Scoring

- Correct answer: 100 points, plus 10 for each correct answer in a row (the bonus stops at 50).
- In Weaknesses mode, getting only some of the weaknesses gives proportional points. Marking a wrong type reduces the partial score.
- A wrong answer resets the streak.
- The best score for each mode and difficulty combination is saved in the browser.

### Keyboard shortcuts

- `1` to `6` answer in Attack mode, and `1` to `4` in Best move mode.
- `Enter` moves to the next question and, in Weaknesses mode, checks your answer.

### Language

The game is available in **Brazilian Portuguese** and **English**. Switch at any time with the **PT | EN** selector at the top of the page, even in the middle of a round, without losing your progress.

Your choice is saved in the player's browser and remembered on later visits. On the first visit, the game opens in English if the browser is set to English, and in Portuguese otherwise.

### Study types

The **Study types** screen shows, for each of the 18 types, what it beats, what beats it and what it does not affect, along with the full effectiveness chart.

## Technical details

- Plain HTML, CSS and JavaScript, in three files (`index.html`, `css/style.css` and `js/app.js`). No framework, no build step and no dependencies.
- The only external request is for the Chakra Petch and Hanken Grotesk fonts from Google Fonts. Without a connection, the page falls back to system fonts.
- Automatic light and dark themes, following the system preference.
- Responsive layout, designed for phones and desktops.
- Preferences, language and best scores are stored in the browser's `localStorage`. No data is sent to any server.
- The type chart follows the current generation of the games, with all 18 types, including Fairy.

## Contributing

Suggestions and fixes are welcome, especially mistakes in the type chart or in a Pokémon's types. Open an issue or a pull request.

To add or fix texts, edit the `D` dictionary (keys `pt` and `en`) inside `js/app.js`. Type names live in `NAMES`. To add a new language, add an entry to `D` and to `NAMES`, and include the code in the `LANGS` list.

To change colors, spacing or themes, edit `css/style.css`.

To add Pokémon, add a line to the `POKE` list inside `js/app.js`, in the format `P(pokedex_number, 'Name', 'type1', 'type2')`. Type keys are written in Portuguese (for example `'fogo'` for Fire and `'agua'` for Water). You can find them in the `NAMES` dictionary.

## Legal notice

This is a free, non-profit fan project. It is not affiliated with, sponsored by, approved by or endorsed by Nintendo, Creatures Inc. or GAME FREAK inc.

Pokémon, the names of Pokémon and types, and all related elements are trademarks and property of Nintendo, Creatures Inc. and GAME FREAK inc. © Nintendo / Creatures Inc. / GAME FREAK inc. All rights reserved to their respective owners.

This game uses no official images, sprites, logos, music or other materials. Names are used only to identify the characters, for educational purposes.
