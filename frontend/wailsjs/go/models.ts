export namespace diary {
	
	export class DiaryEntry {
	    date: string;
	    morning: string;
	    afternoon: string;
	    evening: string;
	
	    static createFrom(source: any = {}) {
	        return new DiaryEntry(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.date = source["date"];
	        this.morning = source["morning"];
	        this.afternoon = source["afternoon"];
	        this.evening = source["evening"];
	    }
	}

}

