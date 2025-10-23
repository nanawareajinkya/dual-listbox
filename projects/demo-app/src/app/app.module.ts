
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';

// For local dev import the component directly (not from npm)
import { DualListboxComponent } from '../../../projects/dual-listbox/src/lib/dual-listbox.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, FormsModule, DualListboxComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
