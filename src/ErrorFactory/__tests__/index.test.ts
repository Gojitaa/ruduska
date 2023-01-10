import errorFactory from "../index"

describe("ErrorFactory", () => {
    describe("constructor", () => {
        it("should return an error class with correct internal state (name, message, stack)", () => {
            const NetworkError = errorFactory("NetworkError", {
                logger: jest.fn()
            })

            expect(new NetworkError("404").name).toBe("NetworkError")
            expect(new NetworkError("404").message).toBe("404")
            expect(new NetworkError("404").toString()).toBe("NetworkError: 404")
            expect(new NetworkError("404").stack).toBeTruthy()
        })
    })
})
