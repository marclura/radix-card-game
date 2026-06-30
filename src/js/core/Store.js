const Store = {
    currentPhase: 'welcome',
    charactersCount: 0,
    players: [
        {
            character: 0,
            score: 0,
            skills: {
                luck: 0,
                strength: 0,
                discipline: 0,
                strategy: 0
            },
            bet: 0
        },
        {
            character: 0,
            score: 0,
            skills: {
                luck: 0,
                strength: 0,
                discipline: 0,
                strategy: 0
            },
            bet: 0
        }
    ]
}

export function resetStore() {
    Store.players.forEach(el => {
        el.character = 0
        el.points = 0
        el.bet = 0
    })
}

export default Store