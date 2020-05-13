const Queries = require('./function');

describe("unit tests", () => {

    test('Test for valid URL', async () => {
        const data = await Queries('');
        expect(data).toBe({ message: "invalid url" });
    });

    test('Test for invalid response', async () => {

        const data = await Queries(['https://google.com']);
        const res = {
            title: "Unable to reach server",
            authors: []
        }
        expect(data).toBe(res);
    });
});