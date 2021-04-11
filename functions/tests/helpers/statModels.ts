export const initialOverallStat = {
    daysOfWeek: { mo: 0, tu: 0, we: 0, th: 1, fr: 0, sa: 0, su: 0 },
    periodOfDay: {
        earlyMorning: 0,
        morning: 0,
        afternoon: 1,
        evening: 0,
        night: 0,
    },
    total_distance: 8623.8,
    average_distance: 8623.8,
    total_elev_gain: 64.1,
    average_elev_gain: 64.1,
    total_moving_time: 2385,
    average_moving_time: 2385,
    count: 1,
    average_speed: 3.615849056603773,
    year: null,
    month: null,
};

export const initialYearStat = {
    ...initialOverallStat,
    year: 2021,
    month: null,
};

export const initialMonthStat = {
    ...initialOverallStat,
    year: 2021,
    month: 4,
};