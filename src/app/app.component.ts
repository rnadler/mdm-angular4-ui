import { Component } from '@angular/core';
import {DataService} from "./data.service";
import {ModelService} from "./model/model.service";
import {RulesService} from "./rules/rules.service";

@Component({
  selector: 'app-root',
  template: `
    <div class="center">
      <h1>{{title}}</h1>
    </div>
    <strong>Active Profile: </strong>
    <select (change)="onChange($event.target.value)" [(ngModel)]="defaultProfile">
      <option *ngFor="let profile of profiles"
              [value]="profile"
              [selected]="value == defaultProfile">
        {{profile}}
      </option>
    </select>
    <br><br>
    <xforms></xforms>
  `
})
export class AppComponent {
  title: string = 'Data Driven Angular4 Dynamic Content Demo';
  readonly profilePath: string = 'FlowGenerator.SettingProfiles.ActiveProfiles.TherapyProfile';
  private defaultProfile: string;
  private fgData: any;
  private profiles = [
    'CpapProfile',
    'AutoSetProfile',
    'AutoSetForHerProfile'
  ];


  constructor(private dataService: DataService, private modelService: ModelService,
              private rulesService: RulesService) {
    this.dataService.getJSON('fg-model.json')
      .subscribe(data => {
        this.fgData = data;
        this.defaultProfile = this.modelService.getContextValue(this.fgData, this.profilePath)
      });
  }
  onChange(value) {
    console.log('active profile change: value=' + value);
    // TODO: Replace
    this.modelService.setValue(this.profilePath, value);
    this.rulesService.updateDynamicComponents();
  }
}
