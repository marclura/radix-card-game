const Store = {
    currentPhase: 'welcome',
    charactersCount: 0,
    players: [
        {
            character: 0,
            score: 100,
            skills: {
                strength: 0,
                discipline: 0,
                strategy: 0,
                luck: 0
            },
            bet: 0
        },
        {
            character: 1,
            score: 100,
            skills: {
                strength: 0,
                discipline: 0,
                strategy: 0,
                luck: 0
            },
            bet: 0
        }
    ]
}

export function resetStore() {
    Store.players.forEach((el, i) => {
        el.character = i // P1 starts on 0, P2 starts on 1
        el.score = 100
        el.bet = 0
        el.skills = {
            strength: 0,
            discipline: 0,
            strategy: 0,
            luck: 0
        }
    })
}

export default Store