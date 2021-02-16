import { StateEntity } from "src/state/entities/state.entity";
import { AbstractBaseEntity } from "src/_common/base.entity"
import { Column, Entity, OneToMany } from "typeorm"

@Entity('Country')
export class CountryEntity extends AbstractBaseEntity {

    @Column({ unique: true, length: 50 })
    public code: string;
    @Column({ length: 200 })
    public name: string;
    @Column({ length: 200 })
    public capital: string;

    @OneToMany(() => StateEntity, s => s.country)
    states: StateEntity[];
}
