import { Component, ChangeDetectorRef } from '@angular/core';
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
  
    this.apiHandler.$returnedSpells.subscribe((value :any) => {
      this.returnedSpells = value;
      this.cdr.detectChanges();
    })

    this.apiHandler.$specificSpell.subscribe((value :any) => {
      this.specificSpell = value;
      this.cdr.detectChanges();
    })

    this.localSaveHandler.$Favorites.subscribe((value :AssocArray) => {
      this.favoritesArray = value;
    })

    this.localSaveHandler.$InputType.subscribe((value :string) => {
      this.inputType = value;
    })
  }

  changeSearchType(desiredInput :string) :void {
    if (desiredInput != "tag" && desiredInput != "box") {
      console.log("Failed to pick a suitable search");
      return;
    } else {
      this.localSaveHandler.changeInputType(desiredInput);

      this.localSaveHandler.saveDataToLocalStorage();
    }
  }

  submitTagSearch() :void {
    this.apiHandler.parseFilters(this.tagSearchTextInput);
  }

  submitBoxSearch() :void {
    this.apiHandler.inputBoxFilters(this.spellName, this.spellClass, this.spellLevel)
  }

  async fetchSpecificSpell(spellIndex :string) :Promise<void> {
    await this.apiHandler.getSpecificSpell(spellIndex)
  }

  addToFavorites(spell :any) :void {
    this.localSaveHandler.addToFavorites(spell);

    this.localSaveHandler.saveDataToLocalStorage();
  }

  removeFromFavorites(spellIndex :string) :void {
    this.localSaveHandler.removeFromFavorites(spellIndex);

    this.localSaveHandler.saveDataToLocalStorage();
  }

  switchFavoritesDisplay() :void {
    this.ifFavoritesDisplayed = !this.ifFavoritesDisplayed;
  }

  switchHintsDisplayed() :void {
    this.areHintsDisplayed = !this.areHintsDisplayed;
  }

}
