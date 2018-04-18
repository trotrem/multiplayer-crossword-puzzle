import { CrosswordGamesCache } from "./crosswordGamesCache";
import { IPlayer, IGrid, IWordContainer, WordDictionaryData, IValidationWord, ICacheGame } from "../dataStructures";
import { IGridData } from "../../../../common/communication/events";
import { IWordInfo, Difficulty } from "../../../../common/communication/types";
import { GridUtils } from "../models/grid/gridUtils";

export class CacheUtils {

    public static joinGame(id: string, player: IPlayer): void {
        CrosswordGamesCache.Instance.getGame(id).players.push(player);
    }
    public static validateWord(gridId: string, wordIndex: number, playerSocketId: string): void {
        const game: ICacheGame = CrosswordGamesCache.Instance.getGame(gridId);
        game.words[wordIndex].validatedBy = playerSocketId;
    }
    public static createGame(creator: IPlayer, difficulty: Difficulty, nbPlayers: number): string {
        const id: string = this.gridUniqueKey();
        CrosswordGamesCache.Instance.grids[difficulty][id] = {
            gridData: null,
            words: null,
            players: [creator],
            maxPlayers: nbPlayers
        };

        return id;
    }
    public static addGrid(grid: IGrid, id: string): IGridData {
        const cacheGrid: ICacheGame = CrosswordGamesCache.Instance.getGame(id);
        cacheGrid.gridData = this.convertIGridToGridData(grid, id);
        cacheGrid.words = grid.words.map((w: IWordContainer): IValidationWord => {
            return {
                word: GridUtils.getText(w.gridSquares, grid).toUpperCase(),
                validatedBy: undefined
            };
        });

        return cacheGrid.gridData;
    }
    private static gridUniqueKey(): string {
        let key: number;
        do {
            key = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
        } while (key in CrosswordGamesCache.Instance.grids[Difficulty.Easy] ||
        key in CrosswordGamesCache.Instance.grids[Difficulty.Medium] ||
            key in CrosswordGamesCache.Instance.grids[Difficulty.Hard]);

        return key.toString();
    }
    private static convertIGridToGridData(grid: IGrid, id: string): IGridData {
        const sortedWords: IWordContainer[] = grid.words.sort(
            (w1: IWordContainer, w2: IWordContainer) => w1.id - w2.id
        );

        return {
            gameId: id,
            blackCells: grid.blackCells,
            wordInfos: sortedWords.map((word: IWordContainer): IWordInfo => {
                return {
                    id: word.id,
                    direction: word.direction,
                    x: word.gridSquares[0].x,
                    y: word.gridSquares[0].y,
                    definition: (word.data as WordDictionaryData).definitions[0],
                    length: word.gridSquares.length
                };
            })
        };
    }
}
