import { Service } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AssocArray } from '../assoc-array';


@Service()
export class LocalSave {

    public $Favorites :BehaviorSubject<AssocArray> = new BehaviorSubject<AssocArray>({});
    public $InputType :BehaviorSubject<string> = new BehaviorSubject<string>('tag');

    constructor () {
        this.loadDataFromLocalStorage();
    }

    loadDataFromLocalStorage() :void {
        try {
            const localStorageItem = localStorage.getItem("SpellPickerMainData");
            if(localStorageItem) {
                let Data = JSON.parse(localStorageItem);
                this.$Favorites.next(Data.favorites);
                this.$InputType.next(Data.inputType)

            } else {
                throw new Error("No previous data was saved to localstorage")
            }

        } catch (error) {
            console.error("Failed to retrive data from localstorage", error);
        }
    }

    saveDataToLocalStorage() :void {
        try {
            const DataToBeSaved = {
                favorites: this.$Favorites.getValue() || {},
                inputType: this.$InputType.getValue() || "tag"
            };

            localStorage.setItem('SpellPickerMainData', JSON.stringify(DataToBeSaved));


        } catch (error) {
            console.error("Failed to save data to localstorage", error);
        }
    }

    addToFavorites(spell :any) :void {
        try {
            let oldArray :AssocArray = this.$Favorites.getValue();
        
            if(!spell) {
                throw new Error("The Spell is empty") 
            } 
            
            oldArray[spell.index] = spell;

            this.$Favorites.next(oldArray);            

        } catch (error) {
            console.error("Failed to add a new spell to Favorites Array", error);
        }
    }

    removeFromFavorites(spellIndex :string) :void {
        try {
            let oldArray :AssocArray = this.$Favorites.getValue();

    
            if(!(spellIndex in oldArray)) {
                throw new Error("Index doesn't exist in the Favorites array");
            } 

            delete oldArray[spellIndex]
            this.$Favorites.next(oldArray);

        } catch (error) {
            console.error("Failed to remove a spell from Favorites Array", error);
        }
    }

    changeInputType(inputType :string) :void {
        try {
            if (inputType) {
                this.$InputType.next(inputType);
            } else {
                throw new Error("inputType is empty")
            }
        } catch (error) {
            console.error("Failed to change input type");
        }
    } 

}


