// Config to create a standalone app
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';


bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));



// Config to create an angular element, used in the obsidian plugin 
// import { createApplication } from '@angular/platform-browser';
// import { createCustomElement } from '@angular/elements';
// import { appConfig } from './app/app.config';
// import { Main } from './app/components /main/main';

// (async () => {
//   const app = await createApplication(appConfig); 
//   const myElement = createCustomElement(Main, { injector: app.injector });
//   customElements.define('obsidian-angular-view', myElement);
// })().catch((err) => console.error(err));