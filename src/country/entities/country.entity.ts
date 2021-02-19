import { StateEntity } from "src/state/entities/state.entity";
import { BaseEntity, Column, Entity, OneToMany } from "typeorm"

@Entity('Country')
export class CountryEntity extends BaseEntity {

    @Column({ primary: true })
    id: number;
    @Column({ unique: true, length: 50 })
    public code: string;
    @Column({ length: 200 })
    public name: string;
    @Column({ length: 200 })
    public capital: string;

    @OneToMany(() => StateEntity, s => s.country)
    states: StateEntity[];
}
