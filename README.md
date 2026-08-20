# radix-card-game

Local 2-player card game on a single screen. Each player uses their own controller (P1 on the left, P2 on the right) to pick a character, place a bet, and draw cards until time runs out.

**Demo:** https://marclura.github.io/radix-card-game/

## Rules

- **Goal:** achieve the highest score within the time limit (90 seconds).
- **Score:** players start at 100 points. Positive cards add points (+5/+10/+15/+20), negative cards subtract them (−5/−10/−15/−20), and special cards give 0 points but modify skills.
- **Bet:** from 2 to 12 chips. The winner receives double their bet in tokens.
- **Characters:** 6 teams, each with 4 skills (strength, discipline, strategy, luck) that evolve during the match based on the cards drawn.
- **Turns:** players take turns drawing from one of the 3 decks on their controller.

## Game Phases

1. **Welcome** — Both players press "Start" to begin a new match.
2. **Character Select** — Each player browses and picks a character from the shared roster.
3. **Bet** — Players set their bet (2–12) and confirm.
4. **Game Play** — Players take turns drawing from the deck: cards reveal points and messages, while score and skills update in real time. A countdown timer ends the phase.
5. **Winner** — The player with the highest score wins and earns double their bet in tokens; ties are possible. From here the game restarts.

## JavaScript Architecture

The app is a vanilla ES6 module (no framework) bootstrapped from `src/js/main.js`, which populates characters into the DOM and launches the first scene via `SceneManager`.

### Core (`src/js/core/`)

- **`EventBus.js`** — decoupled pub/sub system. Scenes emit `scene:*` events (e.g. `scene:bet`, `scene:gamePlay`) to request scene changes.
- **`SceneManager.js`** — manages the scene lifecycle. Subscribes to `scene:*` events, runs an animated transition (fade overlay + phase title), calls `onExit()` on the current scene and `onEnter()` on the new one. Each scene exposes `el`, `onEnter()`, `onExit()`.
- **`Store.js`** — global state singleton holding `players[]` (character, score, skills, bet) and `charactersCount`. `resetStore()` resets values to defaults.
- **`Utils.js`** — shared helpers: `populateCharacters()` (generates thumbnails and character cards in the DOM), `generateCharacterCard()`, `translateSkillKey()`, `formatSeconds()`, `playSound()` (cached audio).

### Scenes (`src/js/scenes/`)

Each scene is a module with `el`, `onEnter()`, `onExit()`. Event listeners are registered with `AbortController` and cleanly removed in `onExit()`.

- **`welcome.js`** — resets the Store; both players must press "Start".
- **`characterSelect.js`** — character navigation (btn A/B up/down), confirm with "select"; on confirm the character's skills are copied into the `Store`.
- **`bet.js`** — increment/decrement bet with min/max constraints, per-player "ready" state; when both are ready it emits `scene:gamePlay`.
- **`gamePlay.js`** — core gameplay: countdown timer, alternating turns, random card draw from the `CARDS` array, score update (with `requestAnimationFrame` animation) and skill bars, visual stack of revealed cards. When time expires it emits `scene:winner`.
- **`winner.js`** — compares scores, displays winner/tie message, allows restart by emitting `scene:welcome`.

### Data (`data/`)

- **`cards.js`** — `CARDS` array: positive, negative, and special cards, each with `score`, `skills` (delta on strength/discipline/strategy/luck), `message`, and `type`.
- **`characters.js`** — `CHARACTERS` array: 6 characters with `name`, `color`, and base `skills`.
- **`scenes.js`** — `SCENE_TITLES`: titles shown during scene transitions.
- **`settings.js`** — `SETTINGS`: `gameMaxPoints`, `gameMinPoints`, `gameMaxBet`, `gameMinBet`, `gamePlayDuration` (90s).

### Flow

```
main.js → populateCharacters() → SceneManager.goToScene('welcome')
                                              ↓
        EventBus.on('scene:*') ← scenes emit events ← Store (shared state)
                                              ↓
        SceneManager: fade overlay → onExit() old → onEnter() new → fade out
```

## Build / Dev

Styles are written in Stylus and compiled with Gulp:

```
npx gulp
```

Compiles `src/stylus/main.styl` → `src/css/main.css` with sourcemaps and stays in watch mode. JS is served directly as ES6 modules from `index.html`.