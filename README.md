# radix-card-game
2026

## Dev

https://marclura.github.io/radix-card-game/

### Stylus / Gulp

`npx gulp`


## Structure

**old!**
```
project/
├── index.html
├── package.json
├── gulpfile.js
│
├── css/
│   ├── main.styl              ← entry point, importa tutto
│   ├── base/
│   │   ├── reset.styl
│   │   ├── variables.styl     ← colori, font, sizing, breakpoints
│   │   └── typography.styl
│   ├── layout/
│   │   ├── app.styl           ← struttura tre colonne
│   │   ├── controller.styl    ← layout base controller (condiviso P1/P2)
│   │   └── game-screen.styl
│   ├── scenes/
│   │   ├── welcome.styl
│   │   ├── character-select.styl
│   │   ├── tutorial.styl
│   │   ├── game.styl
│   │   └── winner.styl
│   └── components/
│       ├── card.styl
│       ├── deck.styl
│       ├── stats-bar.styl
│       ├── timer.styl
│       ├── character-card.styl
│       └── btn.styl
│
├── js/
│   ├── main.js                ← entry point, init
│   ├── core/
│   │   ├── StateMachine.js    ← gestisce le transizioni di scena
│   │   ├── EventBus.js        ← comunicazione disaccoppiata
│   │   ├── GameLoop.js        ← timer countdown + turn logic
│   │   └── Store.js           ← stato globale del gioco
│   ├── data/
│   │   ├── characters.js      ← definizione 8 personaggi
│   │   └── cards.js           ← definizione carte (positive/negative/special)
│   ├── scenes/
│   │   ├── Welcome.js
│   │   ├── CharacterSelect.js
│   │   ├── Tutorial.js
│   │   ├── Game.js
│   │   └── Winner.js
│   ├── screens/
│   │   ├── ControllerScreen.js  ← logica condivisa dei due controller
│   │   └── GameScreen.js        ← logica schermo centrale
│   └── components/
│       ├── Timer.js
│       ├── Deck.js
│       ├── Card.js
│       ├── StatsBar.js
│       └── CharacterCard.js
│
└── assets/
    ├── characters/            ← 8x PNG/SVG per select + in-game
    ├── cards/                 ← PNG/SVG per i dorsi e i tipi
    └── ui/                    ← loghi, sfondi, decorazioni
```