const Store = {
    currentPhase: 'welcome',
    charactersCount: 0,
    players: [
        {
            character: 0,
            score: 100,
            skills: {
                strength: 0,
                speed: 0,
                discipline: 0,
                strategy: 0,
                defense: 0,
                luck: 0
            },
            bet: 0
        },
        {
            character: 0,
            score: 100,
            skills: {
                strength: 0,
                speed: 0,
                discipline: 0,
                strategy: 0,
                defense: 0,
                luck: 0
            },
            bet: 0
        }
    ]
}

export function resetStore() {
    Store.players.forEach(el => {
        el.character = 0
        el.points = 100
        el.bet = 0
    })
}

export default Store