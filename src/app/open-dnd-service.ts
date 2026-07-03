import { Service } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Service()
export class OpenDndService {
    private baseUrl :string = "https://www.dnd5eapi.co/api/2014"
    filterName: string = "";
    filterClass: string = "";
    filterLevel: number | null = null;

    public $returnedSpells :BehaviorSubject<Array<any>> = new BehaviorSubject<Array<any>>([]);
    public $specificSpell :BehaviorSubject<any> = new BehaviorSubject<any>(null);

    parseFilters(filterText: string): void {
        try {
            // Reset filters before parsing
            this.filterName = "";
            this.filterClass = "";
            this.filterLevel = null;
            
            let splitFilters = filterText.split(" ");

            splitFilters.forEach(filter => {
                if (/name:/.test(filter)) {
                    this.filterName = filter.split(":")[1].toLowerCase();
                } else if (/class:/.test(filter)) {
                    this.filterClass = filter.split(":")[1].toLowerCase();
                } else if (/level:/.test(filter)) {
                    this.filterLevel = parseInt(filter.split(":")[1]);
                }   
            });

            this.getSpells();
        } catch (error) {
            console.error('Failed to parse filters', error);
        }
        }

        inputBoxFilters(spellName: string, spellClass: string, spellLevel: number): void {
        try {
            this.filterName = spellName.toLowerCase();
            this.filterClass = spellClass.toLowerCase();
            // Assuming 2137 is your "Any Level" fallback value
            this.filterLevel = spellLevel !== 2137 ? spellLevel : null; 
            
            this.getSpells();
        } catch (error) {
            console.error('Failed to load box filters', error);
        }
        }

    async getSpells(): Promise<void> {
    try {
        let fetchUrl = "";

        // 1. Build the correct API path based on Class and Level
        if (this.filterClass && this.filterLevel !== null) {
            fetchUrl = `${this.baseUrl}/classes/${this.filterClass}/levels/${this.filterLevel}/spells`;
        } else if (this.filterClass) {
            fetchUrl = `${this.baseUrl}/classes/${this.filterClass}/spells`;
        } else if (this.filterLevel !== null) {
            fetchUrl = `${this.baseUrl}/spells?level=${this.filterLevel}`;
        } else {
            fetchUrl = `${this.baseUrl}/spells`;
        }

        // 2. Fetch the data
        const response = await fetch(fetchUrl);
        
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const result = await response.json();
        let finalSpells = result.results;

        // 3. Client-side filter for the spell name
        // (Because class-specific endpoints do not support ?name= query params)
        if (this.filterName) {
            finalSpells = finalSpells.filter((spell: any) => 
                spell.name.toLowerCase().includes(this.filterName)
            );
        }

        // 4. Push to your RxJS Subject
        this.$returnedSpells.next(finalSpells);
        
    } catch (error) {
        console.error('Failed to fetch spell list', error);
    }
}

    async getSpecificSpell(spellIndex :string) :Promise<void> {
        try {   
            const response = await fetch(this.baseUrl+`/spells/${spellIndex}`);

            if(!response.ok) {
                throw new Error(`Reponse status: ${response.status}`);
            }

            const result = await response.json();

            this.$specificSpell.next(result)
            
            console.log(result);

        } catch (error) {
            console.error("Failed to get specific spell", error);
        }
    }

}
