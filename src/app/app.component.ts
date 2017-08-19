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
    <strong>Therapy Profile: </strong>
    <select (change)="onChange($event.target.value)" [(ngModel)]="defaultProfile">
      <option *ngFor="let profile of profiles"
              [value]="profile"
              [selected]="profile == defaultProfile">
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
  defaultProfile: string;
  fgData: any;
  private subscription: Subscription;
  profiles = [
    'CpapProfile',
    'AutoSetProfile',
    'AutoSetForHerProfile'
  ];
  private counter: number = 0;

  constructor(private dataService: DataService, private modelService: ModelService,
              private rulesService: RulesService) {
    this.subscription = this.dataService.getJSON('fg-model.json')
      .subscribe(data => {
        this.fgData = data;
        this.defaultProfile = this.modelService.getContextValue(this.fgData, this.profilePath)
      });
  }
  onChange(value) {
    console.log('active profile change: value=' + value);
    // Update FG data in Model.
    this.modelService.setFgData(this.fgData);
    this.modelService.setValue(this.profilePath, value);
    // Change some settings to random values.
    this.modelService.setValue('FlowGenerator.IdentificationProfiles.Software.VariantIdentifier',
        this.counter % 2 == 0 ? this.randomIntFromInterval(1, 15) : undefined);
    this.counter++;
    this.modelService.setValue('FlowGenerator.SettingProfiles.TherapyProfiles.AutoSetProfile.MaxPressure',
      this.randomIntFromInterval(20, 30));
    this.modelService.setValue('FlowGenerator.SettingProfiles.TherapyProfiles.AutoSetForHerProfile.MaxPressure',
      this.randomIntFromInterval(20, 30));
    this.modelService.setValue('FlowGenerator.SettingProfiles.TherapyProfiles.CpapProfile.SetPressure',
      this.randomIntFromInterval(8, 20));
    // Update all components
    this.rulesService.updateDynamicComponents();
  }
  private randomIntFromInterval(min, max)
  {
    return Math.floor(Math.random()*(max-min+1)+min);
  }
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
