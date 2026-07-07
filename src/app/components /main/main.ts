import { Component, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms'


import { OpenDndService } from '../../services/open-dnd-service';
import { LocalSave } from '../../services/local-save';
import { AssocArray } from '../../assoc-array';

import { Favorites } from '../favorites/favorites';

@Component({
  selector: 'app-main',
  imports: [FormsModule, Favorites],
  templateUrl: './main.html',
  styleUrl: './main.css',
  encapsulation: ViewEncapsulation.ShadowDom
})

export class Main {

  constructor(
    private apiHandler: OpenDndService, 
    private cdr: ChangeDetectorRef, 
    private localSaveHandler: LocalSave
  ) {}

  inputType :string = "tag";
  tagSearchTextInput :string = "";
  returnedSpells :any = [];
  specificSpell :any = {};

  spellName :string = "";
  spellClass :string = "";
  spellLevel :number = 2137;

  favoritesArray :AssocArray = {};

  ifFavoritesDisplayed :boolean = false;

  areHintsDisplayed :boolean = false;

  ngOnInit() {  
    this.apiHandler.getSpells();
  
    //Cdr is used to avoid issues with using BehaviourSubjects with async data 

    //Subscribes to the data from all the spells
    this.apiHandler.$returnedSpells.subscribe((value :any) => {
      this.returnedSpells = value;
      this.cdr.detectChanges();
    })

    //Subscribes to the data from the specific spell
    this.apiHandler.$specificSpell.subscribe((value :any) => {
      this.specificSpell = value;
      this.cdr.detectChanges();
    })

    //Subscribes to the favorites assoc aray 
    this.localSaveHandler.$Favorites.subscribe((value :AssocArray) => {
      this.favoritesArray = value;
    })

    //Subscribes to the input type chosen by the user
    this.localSaveHandler.$InputType.subscribe((value :string) => {
      this.inputType = value;
    })
  }

  //Switches the input type 
  changeSearchType(desiredInput :string) :void {
    if (desiredInput != "tag" && desiredInput != "box") {
      console.log("Failed to pick a suitable search");
      return;
    } else {
      this.localSaveHandler.changeInputType(desiredInput);

      this.localSaveHandler.saveDataToLocalStorage();
    }
  }

  //Triggers the search through the tag opion
  submitTagSearch() :void {
    this.apiHandler.parseFilters(this.tagSearchTextInput);
  }

  //Triggers the search through the box option 
  submitBoxSearch() :void {
    this.apiHandler.inputBoxFilters(this.spellName, this.spellClass, this.spellLevel)
  }

  //Tiggers the fetch for a specific spell
  async fetchSpecificSpell(spellIndex :string) :Promise<void> {
    await this.apiHandler.getSpecificSpell(spellIndex)
  }

  //Attempts to push the currently displayed spell into favorites
  addToFavorites(spell :any) :void {
    this.localSaveHandler.addToFavorites(spell);

    this.localSaveHandler.saveDataToLocalStorage();
  }

  //Attempts to remove the currently displayed spell from favorites 
  removeFromFavorites(spellIndex :string) :void {
    this.localSaveHandler.removeFromFavorites(spellIndex);

    this.localSaveHandler.saveDataToLocalStorage();
  }

  //Swtiches the list of favorite spells
  switchFavoritesDisplay() :void {
    this.ifFavoritesDisplayed = !this.ifFavoritesDisplayed;
  }

  //Switches the hints to be on, or off 
  switchHintsDisplayed() :void {
    this.areHintsDisplayed = !this.areHintsDisplayed;
  }

}
