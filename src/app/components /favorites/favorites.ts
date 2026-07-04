import { Component, ChangeDetectorRef } from '@angular/core';

import { LocalSave } from '../../services/local-save';
import { OpenDndService } from '../../services/open-dnd-service';
import { AssocArray } from '../../assoc-array';

@Component({
  selector: 'app-favorites',
  imports: [],
  templateUrl: './favorites.html',
  styleUrl: './favorites.css',
})

export class Favorites {

  constructor (
    private localSaveHandler: LocalSave,
    private apiHanlder: OpenDndService,  
    private cdr: ChangeDetectorRef, 
  ) {}

  favoritesArray :AssocArray = {}
  favoritesKeys :Array<string> = [];

  ngOnInit() {
    this.localSaveHandler.$Favorites.subscribe((value :AssocArray) => {
      this.favoritesArray = value;
      this.favoritesKeys = Object.keys(value);
      
      this.cdr.detectChanges();
    })
  }

  displaySpell(spellIndex :string) :void {
    this.apiHanlder.getSpecificSpell(spellIndex);
  }

}
