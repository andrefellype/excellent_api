export const VARIABLES_DATABASE: {
    HOST: { prod: string, dev: string }, PORT: { prod: number, dev: number }, USER: { prod: string, dev: string }, PASSWORD: { prod: string, dev: string },
    DATABASE: { prod: string, dev: string }
} = {
    HOST: { prod: "", dev: "localhost" }, PORT: { prod: 3306, dev: 3306 }, USER: { prod: "", dev: "root" },
    PASSWORD: { prod: "", dev: "123123" }, DATABASE: { prod: "", dev: "excellent_bd" }
}