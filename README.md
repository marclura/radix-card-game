# radix-card-game

Card game locale per 2 giocatori su unico schermo. Ogni giocatore usa il proprio controller (P1 a sinistra, P2 a destra) per scegliere un personaggio, puntare fiches e pescare carte fino allo scadere del tempo.

**Demo:** https://marclura.github.io/radix-card-game/

## Regole

- **Obiettivo:** ottenere il punteggio più alto entro il tempo limite (90 secondi).
- **Punteggio:** si parte da 100 punti. Le carte positive aggiungono punti (+5/+10/+15/+20), quelle negative li sottraggono (−5/−10/−15/−20), quelle speciali danno 0 punti ma modificano le abilità.
- **Puntata:** da 2 a 12 fiches. Il vincitore riceve il doppio della propria puntata in gettoni.
- **Personaggi:** 6 squadre, ognuna con 4 abilità (forza, disciplina, strategia, fortuna) che evolvono durante la partita in base alle carte pescate.
- **Turni:** i giocatori pescano a turno da uno dei 3 mazzi del proprio controller.

## Fasi di gioco

1. **Welcome** — Entrambi i giocatori premono "Inizia" per cominciare una nuova partita.
2. **Character Select** — Ogni giocatore sfoglia e sceglie un personaggio dalla lista condivisa.
3. **Bet** — I giocatori impostano la propria puntata (2–12) e confermano.
4. **Game Play** — A turni si pesca dal mazzo: le carte rivelano punti e messaggi, il punteggio e le abilità si aggiornano in tempo reale. Un timer countdown chiude la fase.
5. **Winner** — Chi ha il punteggio più alto vince e guadagna il doppio della puntata in gettoni; pareggio possibile. Da qui si ricomincia.

## Architettura JavaScript

L'app è un modulo ES6 vanilla (nessun framework) avviato da `src/js/main.js`, che popola i personaggi nel DOM e avvia la prima scena via `SceneManager`.

### Core (`src/js/core/`)

- **`EventBus.js`** — sistema pub/sub disaccoppiato. Le scene emettono eventi `scene:*` (es. `scene:bet`, `scene:gamePlay`) per richiedere il cambio scena.
- **`SceneManager.js`** — gestisce il ciclo di vita delle scene. Sottoscrive gli eventi `scene:*`, esegue una transizione animata (fade overlay + titolo di fase), chiama `onExit()` della scena corrente e `onEnter()` della nuova. Ogni scena espone `el`, `onEnter()`, `onExit()`.
- **`Store.js`** — stato globale singleton con `players[]` (personaggio, punteggio, abilità, puntata) e `charactersCount`. `resetStore()` riporta i valori ai default.
- **`Utils.js`** — helper condivisi: `populateCharacters()` (genera thumbnail e card dei personaggi nel DOM), `generateCharacterCard()`, `translateSkillKey()`, `formatSeconds()`, `playSound()` (audio cached).

### Scene (`src/js/scenes/`)

Ogni scena è un modulo con `el`, `onEnter()`, `onExit()`. Gli event listener vengono registrati con `AbortController` e rimossi pulitamente in `onExit()`.

- **`welcome.js`** — reset dello Store, entrambi i giocatori devono premere "Inizia".
- **`characterSelect.js`** — navigazione personaggi (btn A/B su/giù), conferma con "select"; al conferimento le abilità del personaggio vengono copiate nel `Store`.
- **`bet.js`** — incremento/decremento puntata con vincoli min/max, stato "ready" per giocatore; quando entrambi sono pronti emette `scene:gamePlay`.
- **`gamePlay.js`** — cuore del gameplay: timer countdown, turni alternati, pesca carta casuale dal `CARDS` array, aggiornamento punteggio (con animazione `requestAnimationFrame`) e barre abilità, stack visivo delle carte rivelate. A tempo scaduto emette `scene:winner`.
- **`winner.js`** — confronta i punteggi, mostra il messaggio vincitore/pareggio, permette il restart emettendo `scene:welcome`.

### Dati (`data/`)

- **`cards.js`** — array `CARDS`: carte positive, negative e speciali, ognuna con `score`, `skills` (delta su forza/disciplina/strategia/fortuna), `message` e `type`.
- **`characters.js`** — array `CHARACTERS`: 6 personaggi con `name`, `color` e `skills` base.
- **`scenes.js`** — `SCENE_TITLES`: titoli mostrati durante le transizioni.
- **`settings.js`** — `SETTINGS`: `gameMaxPoints`, `gameMinPoints`, `gameMaxBet`, `gameMinBet`, `gamePlayDuration` (90s).

### Flusso

```
main.js → populateCharacters() → SceneManager.goToScene('welcome')
                                              ↓
        EventBus.on('scene:*') ← scene emettono eventi ← Store (stato condiviso)
                                              ↓
        SceneManager: fade overlay → onExit() vecchia → onEnter() nuova → fade out
```

## Build / Dev

Stili scritti in Stylus, compilati con Gulp:

```
npx gulp
```

Compila `src/stylus/main.styl` → `src/css/main.css` con sourcemaps e resta in watch. Il JS viene servito direttamente come modulo ES6 da `index.html`.