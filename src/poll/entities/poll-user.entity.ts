import { AbstractBaseEntity } from 'src/_common/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('PollUser')
export class PollUserEntity extends AbstractBaseEntity {
  @Column({ length: 50 })
  name: string;

  @Column({ length: 50 })
  phonenumber: string;

  @Column({ length: 50 })
  email: string;

  @Column({ length: 128})
  accountId: string;

  @Column({ length: 128 })
  pollId: string;

  @Column({ default: new Date() })
  registeredAt: Date;

  @Column({ default: false })
  voted: boolean;

  @Column({ type: 'bool', default: true })
  active: boolean;
}
