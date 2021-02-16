import { StateEntity } from 'src/state/entities/state.entity';
import { AbstractBaseEntity } from "src/_common/base.entity";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity('lga')
export class LgaEntity extends AbstractBaseEntity {

    @Column({ unique: true, length: 50 })
    public code: string;
    @Column({ length: 200 })
    public name: string;

    @ManyToOne(() => StateEntity, s => s.lgas)
    state: StateEntity;

    @Column('uuid')
    stateId: string;

}
