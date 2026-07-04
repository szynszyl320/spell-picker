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
            let finalSpells: any[] = [];

            if (this.filterClass && this.filterLevel !== null) {
                const [classRes, levelRes] = await Promise.all([
                    fetch(`${this.baseUrl}/classes/${this.filterClass}/spells`),
                    fetch(`${this.baseUrl}/spells?level=${this.filterLevel}`)
                ]);

                if (!classRes.ok || !levelRes.ok) throw new Error("Failed to fetch API data");

                const classData = await classRes.json();
                const levelData = await levelRes.json();

                finalSpells = classData.results.filter((classSpell: any) => 
                    levelData.results.some((levelSpell: any) => levelSpell.index === classSpell.index)
                );
            } 
            else if (this.filterClass) {
                const response = await fetch(`${this.baseUrl}/classes/${this.filterClass}/spells`);
                if (!response.ok) throw new Error(`Response status: ${response.status}`);
                const result = await response.json();
                finalSpells = result.results;
            } 
            else if (this.filterLevel !== null) {
                const response = await fetch(`${this.baseUrl}/spells?level=${this.filterLevel}`);
                if (!response.ok) throw new Error(`Response status: ${response.status}`);
                const result = await response.json();
                finalSpells = result.results;
            } 
            else {
                const response = await fetch(`${this.baseUrl}/spells`);
                if (!response.ok) throw new Error(`Response status: ${response.status}`);
                const result = await response.json();
                finalSpells = result.results;
            }

            if (this.filterName) {
                finalSpells = finalSpells.filter((spell: any) => 
                    spell.name.toLowerCase().includes(this.filterName)
                );
            }

            this.$returnedSpells.next(finalSpells);
                
        } catch (error) {
            console.error('Failed to fetch spell list', error);
        }
    }  

    async getSpecificSpell(spellIndex :string) :Promise<void> {
        try {   
            console.log(spellIndex);
        
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
