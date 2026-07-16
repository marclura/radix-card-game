export const CARDS = [
    // POSITIVE
    {
        score: 20,
        skills: {
            strength: 0.,
            speed: 0.0,
            discipline: 0.15,
            strategy: 0.35,
            defense: 0.0,
            luck: 0.0
        },
        message: "Strategia vincente!",
        type: "positive"
    },
    {
        score: 20,
        skills: {
            strength: 0.2,
            speed: 0.0,
            discipline: 0.0,
            strategy: 0.0,
            defense: 0.2,
            luck: 0.0
        },
        message: "Giocata perfetta!",
        type: "positive"
    },
    {
        score: 15,
        skills: {
            strength: 0.0,
            speed: 0.0,
            discipline: 0.0,
            strategy: 0.01,
            defense: 0.3,
            luck: 0.0
        },
        message: "Mossa decisiva!",
        type: "positive"
    },
    {
        score: 15,
        skills: {
            strength: 0.0,
            speed: 0.0,
            discipline: 0.0,
            strategy: 0.15,
            defense: 0.0,
            luck: 0.0
        },
        message: "Calcolo perfetto!",
        type: "positive"
    },
    {
        score: 10,
        skills: {
            strength: 0.0,
            speed: 0.0,
            discipline: 0.0,
            strategy: 0.0,
            defense: 0.0,
            luck: 0.4
        },
        message: "Questo mazzo è fortunato!",
        type: "positive"
    },
    {
        score: 10,
        skills: {
            strength: 0.0,
            speed: 0.0,
            discipline: 0.0,
            strategy: 0.0,
            defense: 0.0,
            luck: 0.45
        },
        message: "Mano fortunata!",
        type: "positive"
    },
    {
        score: 5,
        skills: {
            strength: 0.0,
            speed: 0.0,
            discipline: 0.0,
            strategy: 0.0,
            defense: 0.0,
            luck: 0.3
        },
        message: "Colpo di fortuna!",
        type: "positive"
    },
    {
        score: 5,
        skills: {
            strength: 0.3,
            speed: 0.0,
            discipline: 0.0,
            strategy: 0.0,
            defense: 0.0,
            luck: -0.0
        },
        message: "Non é fortuna ma talento!",
        type: "positive"
    },

    // PENALITÀ
    {
        score: -20,
        skills: {
            strength: 0.0,
            speed: 0.0,
            discipline: 0.0,
            strategy: 0.0,
            defense: 0.0,
            luck: -0.43
        },
        message: "Questo mazzo è sfortunato!",
        type: "negative"
    },
    {
        score: -20,
        skills: {
            strength: -0.03,
            speed: -0.03,
            discipline: -0.03,
            strategy: -0.03,
            defense: -0.03,
            luck: -0.45
        },
        message: "Il mazzo ha deciso!",
        type: "negative"
    },
    {
        score: -20,
        skills: {
            strength: -0.05,
            speed: -0.05,
            discipline: -0.05,
            strategy: -0.05,
            defense: -0.05,
            luck: -0.5
        },
        message: "Imprevisto inaspettato!",
        type: "negative"
    },
    {
        score: -15,
        skills: {
            strength: -0.05,
            speed: -0.05,
            discipline: -0.05,
            strategy: -0.35,
            defense: -0.05,
            luck: -0.05
        },
        message: "Occasione mancata!",
        type: "negative"
    },
    {
        score: -15,
        skills: {
            strength: -0.02,
            speed: -0.02,
            discipline: -0.02,
            strategy: -0.02,
            defense: -0.02,
            luck: -0.35
        },
        message: "Colpo di sfortuna!",
        type: "negative"
    },
    {
        score: -15,
        skills: {
            strength: -0.02,
            speed: -0.02,
            discipline: -0.02,
            strategy: -0.02,
            defense: -0.02,
            luck: -0.3
        },
        message: "Tocco sfortunato!",
        type: "negative"
    },
    {
        score: -10,
        skills: {
            strength: -0.1,
            speed: -0.1,
            discipline: -0.3,
            strategy: -0.1,
            defense: -0.05,
            luck: -0.02
        },
        message: "Scelta sbagliata!",
        type: "negative"
    },
    {
        score: -10,
        skills: {
            strength: -0.05,
            speed: -0.05,
            discipline: -0.05,
            strategy: -0.35,
            defense: -0.05,
            luck: -0.05
        },
        message: "Mossa perdente!",
        type: "negative"
    },
    {
        score: -10,
        skills: {
            strength: -0.05,
            speed: -0.05,
            discipline: -0.05,
            strategy: -0.05,
            defense: -0.05,
            luck: -0.05
        },
        message: "Cambia mazzo!",
        type: "negative"
    },
    {
        score: -5,
        skills: {
            strength: -0.05,
            speed: -0.05,
            discipline: -0.05,
            strategy: -0.05,
            defense: -0.05,
            luck: -0.05
        },
        message: "Riprova!",
        type: "negative"
    },
    {
        score: -5,
        skills: {
            strength: -0.02,
            speed: -0.02,
            discipline: -0.02,
            strategy: -0.02,
            defense: -0.02,
            luck: -0.02
        },
        message: "Giornata no!",
        type: "negative"
    },
    {
        score: -5,
        skills: {
            strength: -0.02,
            speed: -0.02,
            discipline: -0.02,
            strategy: -0.02,
            defense: -0.02,
            luck: -0.02
        },
        message: "La prossima andrà melgio!",
        type: "negative"
    },

    // SPECIALE
    {
        score: 0,
        skills: {
            strength: 0.05,
            speed: 0.05,
            discipline: 0.05,
            strategy: 0.05,
            defense: 0.05,
            luck: 0.1
        },
        message: "Ce l'hai quasi fatta!",
        type: "special"
    },
    {
        score: 0,
        skills: {
            strength: 0.03,
            speed: 0.03,
            discipline: 0.03,
            strategy: 0.03,
            defense: 0.03,
            luck: 0.15
        },
        message: "È il tuo momento!",
        type: "special"
    },
    {
        score: 0,
        skills: {
            strength: 0.02,
            speed: 0.02,
            discipline: 0.02,
            strategy: 0.02,
            defense: 0.02,
            luck: 0.08
        },
        message: "Hai una buona sensazione!",
        type: "special"
    },
    {
        score: 0,
        skills: {
            strength: 0,
            speed: 0,
            discipline: 0,
            strategy: 0,
            defense: 0,
            luck: 0
        },
        message: "Tutto può succedere!",
        type: "special"
    },
    {
        score: 0,
        skills: {
            strength: 0.05,
            speed: 0.05,
            discipline: 0.05,
            strategy: 0.08,
            defense: 0.05,
            luck: -0.1
        },
        message: "La sfida continua!",
        type: "special"
    },
    {
        score: 0,
        skills: {
            strength: 0.08,
            speed: 0.08,
            discipline: 0.05,
            strategy: 0.05,
            defense: 0.05,
            luck: -0.15
        },
        message: "Continua così!",
        type: "special"
    }
]