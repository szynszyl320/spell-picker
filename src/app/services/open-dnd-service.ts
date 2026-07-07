import { Service } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Service()
export class OpenDndService {
    //Url to the API service used to make the whole application work
    private baseUrl :string = "https://www.dnd5eapi.co/api/2014"
    
    //Filter variables
    filterName: string = "";
    filterClass: string = "";
    filterLevel: number | null = null;

    //List of all available spells, with filters applied
    public $returnedSpells :BehaviorSubject<Array<any>> = new BehaviorSubject<Array<any>>([]);
    
    //A specific spell, described in more detail
    public $specificSpell :BehaviorSubject<any> = new BehaviorSubject<any>(null);

    //Parses all filters, from the tag search function
    parseFilters(filterText: string): void {
        try {
            //Resets all filtres
            this.filterName = "";
            this.filterClass = "";
            this.filterLevel = null;
            
            let splitFilters = filterText.split(" ");

            //Checks all the words contained in the array against a list of regex's 
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

    //Applies all the filters from the box search function
    inputBoxFilters(spellName: string, spellClass: string, spellLevel: number): void {
        try {
            this.filterName = spellName.toLowerCase();
            this.filterClass = spellClass.toLowerCase();
            this.filterLevel = spellLevel !== 2137 ? spellLevel : null; //2137 is a fallback value, used if the user doesn't want to set a level filter.  
            
            this.getSpells();
        } catch (error) {
            console.error('Failed to load box filters', error);
        }
    }

    //Fetches a list of all spell, checked against the user filters 
    async getSpells(): Promise<void> {
        try {
            let finalSpells: any[] = [];

            //Trigered only when the user filters by both, the class and level  
            if (this.filterClass && this.filterLevel !== null) {
                const [classRes, levelRes] = await Promise.all([
                    fetch(`${this.baseUrl}/classes/${this.filterClass}/spells`),
                    fetch(`${this.baseUrl}/spells?level=${this.filterLevel}`)
                ]);

                if (!classRes.ok || !levelRes.ok) throw new Error("Failed to fetch API data");

                //Parses the data into JSON 
                const classData = await classRes.json();
                const levelData = await levelRes.json();

                //Cross checks the spells returned by both calls, to display only the spells of the desired level
                finalSpells = classData.results.filter((classSpell: any) => 
                    levelData.results.some((levelSpell: any) => levelSpell.index === classSpell.index)
                );
            } 
            //Triggered when the user only filters through the class
            else if (this.filterClass) {
                const response = await fetch(`${this.baseUrl}/classes/${this.filterClass}/spells`);
                
                if (!response.ok) throw new Error(`Response status: ${response.status}`);
                
                const result = await response.json();
                finalSpells = result.results;
            } 
            //Triggered when the user only filters through level
            else if (this.filterLevel !== null) {
                const response = await fetch(`${this.baseUrl}/spells?level=${this.filterLevel}`);

                if (!response.ok) throw new Error(`Response status: ${response.status}`);

                const result = await response.json();
                finalSpells = result.results;
            } 
            //Trigered when none of the two aformentioned filters were applied
            else {
                const response = await fetch(`${this.baseUrl}/spells`);
                
                if (!response.ok) throw new Error(`Response status: ${response.status}`);
                
                const result = await response.json();
                finalSpells = result.results;
            }

            //Filters the returned spells through their name, if the user set a name filter
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

    //Fetches a specific spell picked by the user;
    async getSpecificSpell(spellIndex :string) :Promise<void> {
        try {   
            const response = await fetch(this.baseUrl+`/spells/${spellIndex}`);

            if(!response.ok) throw new Error(`Reponse status: ${response.status}`);
            
            const result = await response.json();

            this.$specificSpell.next(result)
            
            console.log(result);

        } catch (error) {
            console.error("Failed to get specific spell", error);
        }
    }

}
