export const CONVERT_DATE_TIME_BY_DATE_STR = (date: Date = new Date()): string => { return `${date.toISOString().split('T')[0]} ${date.toTimeString().split(' ')[0]}` }