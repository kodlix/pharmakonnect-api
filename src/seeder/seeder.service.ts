import { LgaEntity } from 'src/lga/entities/lga.entity';
import { StateEntity } from './../state/entities/state.entity';
import { AccountService } from './../account/account.service';
import { CountryService } from './../country/country.service';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { StateService } from 'src/state/state.service';
import { LgaService } from 'src/lga/lga.service';
import { Country_Seed } from 'src/_common/seeds/country';
import { Account_Seed } from 'src/_common/seeds/account';
import { State_Seed } from 'src/_common/seeds/state';


@Injectable()
export class SeederService implements OnModuleInit {
  /**
   * SEED ENTITIES
   */
  constructor(
    private readonly countryService: CountryService,
    private readonly stateService: StateService,
    private readonly lgaService: LgaService,
    private readonly accountService: AccountService
  ) { }
  
  async onModuleInit() {
    console.log("Implementing seeding of countries, states and LGAs");
    try {
      await this.createCountries();
      await this.registerUser();
      await this.createStates();
    } catch (error) {
      console.log(error);
    }

  }

  public async registerUser(): Promise<void> {
    const data = await this.accountService.find();
    if (data.length <= 0) {
      Account_Seed.forEach(item => {
        this.accountService.register(item)
      })
    }
  }

  public async createCountries(): Promise<string> {
    const data = await this.countryService.find();
    if (data.length <= 0) {
      return await this.countryService.create(Country_Seed[0]);
    }
  }

  public async createStates(): Promise<void> {
    const stateData = await this.stateService.find();
    const lgaData = await this.lgaService.find();

    if (stateData.length <= 0 && lgaData.length <= 0) {

      const lgaArray = new Array<LgaEntity>();
      const stateArray = new Array<StateEntity>();

      State_Seed.forEach(states => {
        const state = states.states;

        states.states.locals.forEach(l => {
          let lga = new LgaEntity();
          lga.id = l.id;
          lga.name = l.name;
          lga.stateId = state.id;

          lgaArray.push(lga);
        });

        let stateObj = new StateEntity();
        stateObj.id = state.id;
        stateObj.name = state.name;
        stateObj.code = state.name.substring(0, 3).toUpperCase();
        stateObj.countryId = Country_Seed[0].id;

        stateArray.push(stateObj);
      })

      this.stateService.addRange(stateArray);
      this.lgaService.addRange(lgaArray);
    }
  }

  private getStates(data: StateEntity[]) {
    //const stateArray = data.filter(x => x.)
  }

}
