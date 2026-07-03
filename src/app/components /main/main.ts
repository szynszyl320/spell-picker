import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms'

import { OpenDndService } from '../../open-dnd-service';

@Component({
  selector: 'app-main',
  imports: [FormsModule],
  templateUrl: './main.html',
  styleUrl: './main.css',
})

export class Main {

  constructor(private apiHandler: OpenDndService, private cdr: ChangeDetectorRef ) {}

  inputType :string = "tag";
  tagSearchTextInput :string = "";
  returnedSpells :any = [];
  pageDisplayIndex :number = 2137;
  specificSpell :any = {};

  spellName :string = "";
  spellClass :string = "";
  spellLevel :number = 2137;

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

  }

 

  changeSearchType(desiredInput :string) :void {
    if (desiredInput != "tag" && desiredInput != "box") {
      console.log("Failed to pick a suitable search");
      return;
    } else {
      this.inputType = desiredInput;
    }
  }

  submitTagSearch() :void {
    this.apiHandler.parseFilters(this.tagSearchTextInput);
  }

  submitBoxSearch() :void {
    this.apiHandler.inputBoxFilters(this.spellName, this.spellClass, this.spellLevel)
  }

  changeDisplayedPage(change :number) :void {
    
    console.log(this.returnedSpells[this.pageDisplayIndex]);
    
    this.pageDisplayIndex += change
    if(this.pageDisplayIndex < 0) {
      this.pageDisplayIndex = 0
    } else if (this.pageDisplayIndex > this.returnedSpells.length) {
      this.pageDisplayIndex = this.returnedSpells.length-1
    }
  }

  async fetchSpecificSpell(spellIndex :string) :Promise<void> {
    await this.apiHandler.getSpecificSpell(spellIndex)
  }

}
