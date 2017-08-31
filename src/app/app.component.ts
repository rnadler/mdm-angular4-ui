import {Component, OnDestroy} from '@angular/core';
import {DataService} from "./data.service";
import {ModelService} from "./model/model.service";
import {RulesService} from "./rules/rules.service";
import {Subject} from "rxjs/Subject";
import 'rxjs/add/operator/takeUntil';

@Component({
  selector: 'app-root',
  styles: [
    `hr {
      border: 1px dashed lightblue;
    }`
  ],
  template: `
    <div class="center">
      <h1>{{title}}</h1>
    </div>
    <strong>Device Therapy Profile: </strong>
    <select (change)="onProfileChange($event.target.value)" [(ngModel)]="defaultProfile">
      <option *ngFor="let profile of profiles"
              [value]="profile"
              [selected]="profile == defaultProfile">
        {{profile}}
      </option>
    </select>
    <hr>
    <xforms *ngIf="fgData && variantData" [fgData]="fgData" [variantData]="variantData"></xforms>
  `
})
export class AppComponent implements OnDestroy {

  title: string = 'Data Driven Angular4 Dynamic Content Demo';
  readonly PROFILE_PATH: string = 'FlowGenerator.SettingProfiles.ActiveProfiles.TherapyProfile';
  defaultProfile: string;
  fgData: any;
  variantData: any;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  profiles = [
    'CpapProfile',
    'AutoSetProfile',
    'AutoSetForHerProfile'
  ];
  private counter: number = 0;

  constructor(private dataService: DataService, private modelService: ModelService,
              private rulesService: RulesService) {
    this.dataService.getJSON('fg-model.json')
      .takeUntil(this.ngUnsubscribe)
      .subscribe(data => {
        this.fgData = data;
        this.defaultProfile = this.modelService.getContextValue(this.fgData, this.PROFILE_PATH);
      });
    this.dataService.getJSON('fg-variant.json')
      .takeUntil(this.ngUnsubscribe)
      .subscribe(data => {
        this.variantData = data;
      });
  }
  onProfileChange(value: string) {
    console.log('active profile change: value=' + value);
    // Update FG data in Model.
    this.modelService.setFgData(this.fgData);
    this.modelService.setValue(this.PROFILE_PATH, value);
    this.setCurrentTherapyMode(value);
    // Change some settings to random values.
    this.modelService.setValue('FlowGenerator.IdentificationProfiles.Software.VariantIdentifier',
        this.counter % 2 == 0 ? this.randomIntFromInterval(1, 15) : undefined);
    this.counter++;
    this.modelService.setValue('FlowGenerator.SettingProfiles.TherapyProfiles.AutoSetProfile.MaxPressure',
      this.randomIntFromInterval(15, 20));
    this.modelService.setValue('FlowGenerator.SettingProfiles.TherapyProfiles.AutoSetForHerProfile.MaxPressure',
      this.randomIntFromInterval(15, 20));
    this.modelService.setValue('FlowGenerator.SettingProfiles.TherapyProfiles.CpapProfile.SetPressure',
      this.randomIntFromInterval(5, 15));
    // Update all components
    this.rulesService.updateDynamicComponents();
  }
  private randomIntFromInterval(min, max)
  {
    return Math.floor(Math.random()*(max-min+1)+min);
  }

  private setCurrentTherapyMode(currentProfile: string) {
    this.modelService.setValue('Internal.TherapyModes.CurrentTherapyMode',
      this.modelService.getValue('FlowGenerator.SettingProfiles.TherapyProfiles.' + currentProfile + '.TherapyMode'));
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
