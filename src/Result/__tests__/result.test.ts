import fs from "fs"
import Result, { tryCatch, async } from "../index"

class MathError extends Error {
    constructor(msg?: string) {
        super(msg)
        this.name = new.target.name
    }
}

class NetworkError extends Error {
    constructor(msg?: string) {
        super(msg)
        this.name = new.target.name
    }
}

describe("Result", () => {
    describe("unwrapOr", () => {
        it("should unwrap the value of Ok variant properly", () => {
            const result = Result.Ok(29)

            expect(result.unwrapOrElse(() => "Error")).toBe(29)
        })

        it("should unwrap the error of Err variant properly", () => {
            const result = Result.Err(Error("29"))

            expect(
                result.unwrapOrElse(
                    (num) =>
                        `Some Error happened when processing: ${num.message}`
                )
            ).toBe("Some Error happened when processing: 29")
        })
    })

    describe("andThen", () => {
        it("should unwrap the first error that happens", () => {
            const num = Result.Ok({ name: 8 })
                .andThen((num) => Result.Ok(num.name - 8))
                .andThen((num) =>
                    num === 0
                        ? Result.Err(new MathError("Division by 0"))
                        : Result.Ok(num)
                )
                .andThen((num) => Result.Ok(`${num}`))
                .andThen((num) => Result.Err(Error(num)))

            expect(num.unwrapOrElse((err) => err.name)).toBe("MathError")
        })

        it("should unwrap the first error that happens", () => {
            const num = Result.Ok({ name: 8 })
                .andThen((num) => Result.Ok(num.name - 8))
                .andThen((num) =>
                    num === 1
                        ? Result.Err(new MathError("Division by 0"))
                        : Result.Ok(num)
                )
                .andThen((num) => Result.Ok(`${num}`))

            expect(num.unwrapOrElse((err) => err.name)).toBe("0")
        })
    })

    describe("map", () => {
        it("should map Ok variant properly", () => {
            const sum = Result.Ok([1, 3, 4])
                .map((arr) =>
                    arr.reduce((total, current) => total + current, 0)
                )
                .map((num) => num + 2)

            expect(sum.unwrapOrElse(() => "Calc error")).toBe(10)
        })

        it("should leave Err variant untouched", () => {
            const err = new Error("CalculationError")
            const sum = Result.Err(err)
                .map((num) => num + 2)
                .map((num) => `Result is ${num}`)

            expect(sum.unwrapOrElse((err) => err)).toBe(err)
        })
    })

    // TODO: mapErr

    describe("tryCatch", () => {
        it("should return Ok is parsing succeeded", () => {
            const res = tryCatch(() => JSON.parse("{}"))

            expect(res.unwrapOrElse(() => "Err happened")).toEqual({})
        })

        it("should return Err is parsing failed", () => {
            const res = tryCatch(() => JSON.parse("{"))

            expect(res.unwrapOrElse((err) => err.name)).toBe("SyntaxError")
        })

        it("should return the correct value when working with the result", () => {
            const getPkgInput = () =>
                tryCatch(() => fs.readFileSync("./package.json", "utf-8"))

            const parsePkg = (pkgStr: string) =>
                tryCatch(() => JSON.parse(pkgStr))

            const pkgName = getPkgInput()
                .andThen(parsePkg)
                .andThen((pkg) => Result.Ok(pkg.name as string))
                .unwrapOrElse((err) => err)

            expect(pkgName).toBe("ruduska")
        })
    })

    describe("async", () => {
        it("should return Ok if Promise resolves", async () => {
            const result = await async(() => Promise.resolve({ ok: true }))
            const resp = result.unwrapOrElse(() => "Something went wrong!")
            expect(resp).toEqual({ ok: true })
        })

        it("should return Err if Promise rejects", async () => {
            // simulate fetch
            const getMovies = (id: string) =>
                id === "1"
                    ? Promise.reject(new NetworkError("Something is wrong"))
                    : Promise.resolve(["Batman", "Spiderman"])

            // use async wrapper
            const batman = (await async(() => getMovies("1")))
                .andThen((movies) => {
                    const batman = movies.find((title) => title === "batman")
                    return batman
                        ? Result.Ok(batman)
                        : Result.Err(Error("Not Found"))
                })
                .andThen((batman) =>
                    Result.Ok(`${batman} is weaker than superman`)
                )

            expect(batman.unwrapOrElse((err) => err.name)).toBe("NetworkError")
        })
    })
})
