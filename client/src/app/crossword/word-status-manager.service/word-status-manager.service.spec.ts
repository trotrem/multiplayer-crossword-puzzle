import { TestBed, inject } from "@angular/core/testing";

import { WordStatusManagerService } from "./word-status-manager.service";

describe("WordStatusManagerService", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [WordStatusManagerService]
        });
    });

    it("should be created", inject([WordStatusManagerService], (service: WordStatusManagerService) => {
        expect(service).toBeTruthy();
    }));
});
