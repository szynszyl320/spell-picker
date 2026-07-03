import { Service } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Service()
export class OpenDndService {
    private url :string = "https://www.dnd5eapi.co/api/2014/spells"

    private urlFilters :string = "";

    public $returnedSpells :BehaviorSubject<Array<any>> = new BehaviorSubject<Array<any>>([]);
    public $specificSpell :BehaviorSubject<any> = new BehaviorSubject<any>({});

    parseFilters(filterText :string) :void {
        try {
            this.urlFilters = "?";
            
            let splitFilters = filterText.split(" ");

            splitFilters.forEach(filter => {
                
                if (/name:/.test(filter)) {
                    this.urlFilters += `name=${filter.split(":")[1]}&`; 
                } else if (/class:/.test(filter)) {
                    this.urlFilters += `class=${filter.split(':')[1]}&`
                } else if (/level:/.test(filter)) {
                    this.urlFilters += `level=${filter.split(':')[1]}&`
                }   
            
            });

            if(this.urlFilters[this.urlFilters.length-1] == '&') {
                this.urlFilters = this.urlFilters.substring(0,this.urlFilters.length-1)
            }

            this.getSpells();
            
        } catch (error) {
            console.error('Failed to parse filters', error);
        }
    }

    inputBoxFilters(spellName :string, spellClass :string, spellLevel :number) :void {
        try {
            this.urlFilters = "?"

            if(spellName != "") {
                this.urlFilters += `name=${spellName}&`
            } 
            
            if (spellLevel != 2137) {
                this.urlFilters += `level=${spellLevel}&`
            }
            
            if (spellClass != "") {
                this.urlFilters != `class=${spellClass}&`
            }

            if(this.urlFilters[this.urlFilters.length-1] == '&') {
                this.urlFilters = this.urlFilters.substring(0,this.urlFilters.length-1)
            }
            
            this.getSpells();

        } catch (error) {
            console.error('Failed to load box filters', error);
        }
    }

    async getSpells() :Promise<void> {
        try {
            const response = await fetch(this.url+this.urlFilters);
            
            if(!response.ok) {
                throw new Error(`Reponse status: ${response.status}`);
            }

            const result = await response.json();

            console.log(result);
            

            this.$returnedSpells.next(result.results)

            console.log(this.$returnedSpells.getValue());
            
            
        } catch (error) {
            console.error('Failed to fetch spell list', error);
        }
    }

    async getSpecificSpell(spellIndex :string) :Promise<void> {
        try {   
            const response = await fetch(this.url+`/${spellIndex}`);

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
