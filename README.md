# Type Duel

A web quiz to practice Pokémon type strengths and weaknesses. Each match consists of 10 questions, and every answer comes with an explanation of the result.

> Fan project, free, and non-profit. Not affiliated with, sponsored by, or endorsed by Nintendo, Creatures Inc., or GAME FREAK inc. See the [disclaimer](#disclaimer).

### Game Modes

| Mode | What you do |
| --- | --- |
| **Attack** | One type attacks another (or a dual type). Choose the damage multiplier: 0×, ¼×, ½×, 1×, 2×, or 4×. |
| **Weaknesses** | See a Pokémon and select all the types that deal extra damage to it. |
| **Best Move** | Out of four move types, choose the most effective one against the Pokémon. |
| **Mixed Practice** | All three modes shuffled in the same match. |

### Difficulty

- **Easy:** single types only.
- **Medium:** a mix of single and dual types.
- **Hard:** dual types only, featuring 4× and ¼× multipliers.
There is also an option to **hide Pokémon types** in modes that display a Pokémon, testing whether you know what they are.

### Scoring

- Correct answer: 100 points, plus 10 for each consecutive correct answer in your streak (bonus caps at 50).
- In Weaknesses mode, selecting only a portion of the weaknesses awards proportional points. Selecting a wrong type deducts points from the partial score.
- An incorrect answer resets the streak to zero.
- The high score for each combination of mode and difficulty is saved in your browser.

### Keyboard Shortcuts

- `1` through `6` answer in Attack mode, and `1` through `4` in Best Move mode.
- `Enter` advances to the next question and, in Weaknesses mode, submits your answer.

### Study Types

The **Study Types** screen displays what each of the 18 types beats, what beats it, and what doesn't affect it, along with the full effectiveness chart.

## Technical Details

- Pure HTML, CSS, and JavaScript, all in a single file (`index.html`). No frameworks, no build step, and no dependencies.
- The only external request is for the Chakra Petch and Hanken Grotesk fonts via Google Fonts. Offline, the page falls back to system fonts.
- Automatic light and dark themes based on system preferences.
- Responsive layout designed for mobile and desktop.
- Preferences and high scores are saved in the browser's `localStorage`. No data is sent to a server.
- The type chart follows the current generation of the games, featuring all 18 types, including Fairy.

## Contributing

Suggestions and fixes are welcome, especially corrections to the type chart or a Pokémon's types. Open an issue or a pull request.

To add Pokémon, append a line to the `POKE` array inside `index.html` using the format `P(pokedex_number, 'Name', 'type1', 'type2')`.

## Disclaimer

This is a fan-made project, free, and non-profit. It is not affiliated with, sponsored by, approved by, or endorsed by Nintendo, Creatures Inc., or GAME FREAK inc.

Pokémon, Pokémon names, type names, and related elements are trademarks and property of Nintendo, Creatures Inc., and GAME FREAK inc. © Nintendo / Creatures Inc. / GAME FREAK inc. All rights reserved to their respective owners.

This game does not use official images, sprites, logos, music, or other copyrighted materials. Names are cited solely to identify the characters for educational purposes.
