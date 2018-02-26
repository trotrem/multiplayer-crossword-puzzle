import { Track } from "./track";

describe("Track", () => {
    let track: Track;
    it("should be instantiable using default constructor", () => {
        track = new Track();
        expect(track).toBeDefined();
    });
});
