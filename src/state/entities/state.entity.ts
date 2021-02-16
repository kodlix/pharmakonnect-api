import { CountryEntity } from "src/country/entities/country.entity";
import { LgaEntity } from "src/lga/entities/lga.entity";
import { AbstractBaseEntity } from "src/_common/base.entity";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";

@Entity('State')
export class StateEntity extends AbstractBaseEntity {

    @Column({ unique: true, length: 50 })
    public code: string;
    @Column({ length: 200 })
    public name: string;
    @Column({ length: 200 })
    public capital: string;

    @ManyToOne(() => CountryEntity, s => s.states)
    country: CountryEntity;

    @Column('uuid')
    countryId: string;

    @OneToMany(() => LgaEntity, s => s.state)
    lgas: LgaEntity[];

}
