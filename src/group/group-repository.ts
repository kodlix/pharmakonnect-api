import { Repository, EntityRepository, getRepository, getManager } from 'typeorm';
import { GroupMemeberView } from './entities/group-member.view';
import { GroupEntity } from './entities/group.entity';

@EntityRepository(GroupEntity)
export class GroupRepository extends Repository<GroupEntity> {
  constructor() {
    super();
  }

  async getGroupbyId(id: string) {
    const group = await getRepository(GroupEntity).findOne({ where: { id: id } });

    const entityManager = getManager();
    const groups = await entityManager.find(GroupMemeberView, {
      where: { groupId: id }, order: { firstName: 'ASC' }
    });
    return {
      name: group.name,
      description: group.description,
      logo: group.logo,
      groupId: group.id,
      createdAt: group.createdAt,
      members: groups,
      ownerId: group.ownerId,
      ownerName: group.ownerName
    };
  }


  async memberExistsInGroup(groupId: string, accountId: string): Promise<boolean> {
    const group = await this.getGroupbyId(groupId);
    let members: GroupMemeberView[];
    if (group) {
      members = group.members;
      let member = members?.find(x => x.id === accountId);
      return !!member;
    }
    return false;
  }
}
