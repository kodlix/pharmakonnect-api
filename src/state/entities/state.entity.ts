import { CountryEntity } from "src/country/entities/country.entity";
import { LgaEntity } from "src/lga/entities/lga.entity";
import { BaseEntity, Column, Entity, ManyToOne, OneToMany } from "typeorm";

@Entity('State')
export class StateEntity extends BaseEntity {
    
    @Column({primary:true})
    public id: number;
    @Column({ unique: true, length: 50 })
    public code: string;
    @Column({ length: 200 })
    public name: string;

    @ManyToOne(() => CountryEntity, s => s.states)
    country: CountryEntity;

    @Column('int')
    countryId: number;

    @OneToMany(() => LgaEntity, s => s.state)
    lgas: LgaEntity[];

}
