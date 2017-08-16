import {Component, OnDestroy} from '@angular/core';
import {DataService} from "./data.service";
import {ModelService} from "./model/model.service";
import {RulesService} from "./rules/rules.service";
import {Subscription} from "rxjs/Subscription";

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
    <xforms *ngIf="fgData" [fgData]="fgData"></xforms>
  `
})
export class AppComponent implements OnDestroy {
  title: string = 'Data Driven Angular4 Dynamic Content Demo';
  readonly profilePath: string = 'FlowGenerator.SettingProfiles.ActiveProfiles.TherapyProfile';
  private defaultProfile: string;
  private fgData: any;
  private sub: Subscription;
  private profiles = [
    'CpapProfile',
    'AutoSetProfile',
    'AutoSetForHerProfile'
  ];

  constructor(private dataService: DataService, private modelService: ModelService,
              private rulesService: RulesService) {
    this.sub = this.dataService.getJSON('fg-model.json')
      .subscribe(data => {
        this.fgData = data;
        this.defaultProfile = this.modelService.getContextValue(this.fgData, this.profilePath)
      });
  }
  onChange(value) {
    console.log('active profile change: value=' + value);
    this.modelService.setContextValue(this.fgData, this.profilePath, value);
    this.modelService.setContextValue(this.fgData, 'FlowGenerator.SettingProfiles.TherapyProfiles.AutoSetProfile.MaxPressure',
      this.randomIntFromInterval(20, 30));
    this.modelService.setContextValue(this.fgData, 'FlowGenerator.SettingProfiles.TherapyProfiles.AutoSetForHerProfile.MaxPressure',
      this.randomIntFromInterval(20, 30));
    // Update FG data in Model.
    this.modelService.setFgData(this.fgData);
    this.rulesService.updateDynamicComponents();
  }
  randomIntFromInterval(min, max)
  {
    return Math.floor(Math.random()*(max-min+1)+min);
  }
  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
