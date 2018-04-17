import { TestBed, inject } from "@angular/core/testing";

import { PlayManagerService } from "./play-manager.service";

describe("PlayManagerService", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [PlayManagerService]
        });
    });

    it("should be created", inject([PlayManagerService], (service: PlayManagerService) => {
        expect(service).toBeTruthy();
    }));
});
