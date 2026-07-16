export const CARDS = [
    {
        score: 20,
        skills: {
            strength: 0.55,
            speed: 0.4,
            discipline: 0.68,
            strategy: 0.95,
            defense: 0.35,
            luck: 0.2
        },
        message: "Strategia vincente!",
        type: "positive"
    },
    {
        score: 20,
        skills: {
            strength: 0.85,
            speed: 0.8,
            discipline: 0.82,
            strategy: 0.88,
            defense: 0.75,
            luck: 0.3
        },
        message: "Giocata perfetta!",
        type: "positive"
    },
    {
        score: 15,
        skills: {
            strength: 0.65,
            speed: 0.5,
            discipline: 0.7,
            strategy: 0.6,
            defense: 0.9,
            luck: 0.15
        },
        message: "Mossa decisiva!",
        type: "positive"
    },
    {
        score: 15,
        skills: {
            strength: 0.4,
            speed: 0.45,
            discipline: 0.94,
            strategy: 0.72,
            defense: 0.55,
            luck: 0.18
        },
        message: "Calcolo perfetto!",
        type: "positive"
    },
    {
        score: 10,
        skills: {
            strength: 0.25,
            speed: 0.3,
            discipline: 0.28,
            strategy: 0.32,
            defense: 0.22,
            luck: 0.95
        },
        message: "Questo mazzo è fortunato!",
        type: "positive"
    },
    {
        score: 10,
        skills: {
            strength: 0.2,
            speed: 0.27,
            discipline: 0.24,
            strategy: 0.29,
            defense: 0.19,
            luck: 0.97
        },
        message: "Mano fortunata!",
        type: "positive"
    },
    {
        score: 5,
        skills: {
            strength: 0.15,
            speed: 0.18,
            discipline: 0.12,
            strategy: 0.2,
            defense: 0.16,
            luck: 0.9
        },
        message: "Colpo di fortuna!",
        type: "positive"
    },
    {
        score: 5,
        skills: {
            strength: 0.72,
            speed: 0.61,
            discipline: 0.75,
            strategy: 0.68,
            defense: 0.58,
            luck: 0.1
        },
        message: "Non é fortuna ma talento!",
        type: "positive"
    },

    // PENALITÀ
    {
        score: -20,
        skills: {
            strength: 0.3,
            speed: 0.35,
            discipline: 0.25,
            strategy: 0.28,
            defense: 0.32,
            luck: 0.05
        },
        message: "Questo mazzo è sfortunato!",
        type: "negative"
    },
    {
        score: -20,
        skills: {
            strength: 0.22,
            speed: 0.29,
            discipline: 0.31,
            strategy: 0.2,
            defense: 0.24,
            luck: 0.03
        },
        message: "Il mazzo ha deciso!",
        type: "negative"
    },
    {
        score: -20,
        skills: {
            strength: 0.4,
            speed: 0.38,
            discipline: 0.36,
            strategy: 0.33,
            defense: 0.29,
            luck: 0.02
        },
        message: "Imprevisto inaspettato!",
        type: "negative"
    },
    {
        score: -15,
        skills: {
            strength: 0.45,
            speed: 0.4,
            discipline: 0.3,
            strategy: 0.62,
            defense: 0.42,
            luck: 0.25
        },
        message: "Occasione mancata!",
        type: "negative"
    },
    {
        score: -15,
        skills: {
            strength: 0.28,
            speed: 0.33,
            discipline: 0.2,
            strategy: 0.24,
            defense: 0.3,
            luck: 0.07
        },
        message: "Colpo di sfortuna!",
        type: "negative"
    },
    {
        score: -15,
        skills: {
            strength: 0.35,
            speed: 0.28,
            discipline: 0.31,
            strategy: 0.2,
            defense: 0.36,
            luck: 0.09
        },
        message: "Tocco sfortunato!",
        type: "negative"
    },
    {
        score: -10,
        skills: {
            strength: 0.5,
            speed: 0.45,
            discipline: 0.35,
            strategy: 0.28,
            defense: 0.4,
            luck: 0.15
        },
        message: "Scelta sbagliata!",
        type: "negative"
    },
    {
        score: -10,
        skills: {
            strength: 0.42,
            speed: 0.55,
            discipline: 0.38,
            strategy: 0.31,
            defense: 0.33,
            luck: 0.22
        },
        message: "Mossa perdente!",
        type: "negative"
    },
    {
        score: -10,
        skills: {
            strength: 0.38,
            speed: 0.42,
            discipline: 0.29,
            strategy: 0.45,
            defense: 0.35,
            luck: 0.12
        },
        message: "Cambia mazzo!",
        type: "negative"
    },
    {
        score: -5,
        skills: {
            strength: 0.33,
            speed: 0.37,
            discipline: 0.48,
            strategy: 0.4,
            defense: 0.44,
            luck: 0.3
        },
        message: "Riprova!",
        type: "negative"
    },
    {
        score: -5,
        skills: {
            strength: 0.24,
            speed: 0.3,
            discipline: 0.35,
            strategy: 0.26,
            defense: 0.4,
            luck: 0.18
        },
        message: "Giornata no!",
        type: "negative"
    },
    {
        score: -5,
        skills: {
            strength: 0.55,
            speed: 0.48,
            discipline: 0.42,
            strategy: 0.46,
            defense: 0.3,
            luck: 0.4
        },
        message: "La prossima andrà melgio!",
        type: "negative"
    },

    // SPECIALE
    {
        score: 0,
        skills: {
            strength: 0.6,
            speed: 0.58,
            discipline: 0.55,
            strategy: 0.62,
            defense: 0.5,
            luck: 0.65
        },
        message: "Ce l'hai quasi fatta!",
        type: "special"
    },
    {
        score: 0,
        skills: {
            strength: 0.55,
            speed: 0.5,
            discipline: 0.48,
            strategy: 0.52,
            defense: 0.45,
            luck: 0.7
        },
        message: "È il tuo momento!",
        type: "special"
    },
    {
        score: 0,
        skills: {
            strength: 0.45,
            speed: 0.5,
            discipline: 0.52,
            strategy: 0.4,
            defense: 0.48,
            luck: 0.6
        },
        message: "Hai una buona sensazione!",
        type: "special"
    },
    {
        score: 0,
        skills: {
            strength: 0.5,
            speed: 0.5,
            discipline: 0.5,
            strategy: 0.5,
            defense: 0.5,
            luck: 0.5
        },
        message: "Tutto può succedere!",
        type: "special"
    },
    {
        score: 0,
        skills: {
            strength: 0.58,
            speed: 0.55,
            discipline: 0.52,
            strategy: 0.6,
            defense: 0.53,
            luck: 0.35
        },
        message: "La sfida continua!",
        type: "special"
    },
    {
        score: 0,
        skills: {
            strength: 0.62,
            speed: 0.6,
            discipline: 0.58,
            strategy: 0.55,
            defense: 0.57,
            luck: 0.3
        },
        message: "Continua così!",
        type: "special"
    }
]