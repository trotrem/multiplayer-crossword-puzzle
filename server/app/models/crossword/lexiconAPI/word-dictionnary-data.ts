const UNCOMMON_TRESHOLD: number = 15;

export class WordDictionaryData {
	constructor(
		public word: string,
		public definitions: string[],
		public frequency: number,
	) { }

	get isCommon(): boolean {
		return this.frequency > UNCOMMON_TRESHOLD ? true : false;
	}
}
