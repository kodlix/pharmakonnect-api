/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { getRepository, Repository } from 'typeorm';
import { AccountEntity } from 'src/account/entities/account.entity';
import { OutletEntity } from 'src/outlet/entity/outlet.entity';
import { JobVacancyEntity } from 'src/jobvacancy/entities/jobvacancy.entity';
import { EventEntity } from 'src/events/event/entities/event.entity';
import { AdvertEntity } from 'src/advert/entity/advert.entity';
import { ArticleEntity } from 'src/blog/article/entities/article.entity';
import { PollEntity } from 'src/poll/entities/poll.entity';
import { ContactEntity } from 'src/contact/entities/contact.entity';
import { GroupEntity } from 'src/group/entities/group.entity';
import { plainToClass } from 'class-transformer';

@Injectable()
export class DashboardService {


  // get individual account statistics: contact, group and blogs
  async getIndividualStats(user: AccountEntity): Promise<any> {
    const totalContacts = await this.getContactCount(user.id);
    const totalGroups = await this.getGroupCount(user.id);
    const totalBlogs = await this.getBlogCount(user.id);
    return {
      stat: {
        contact: totalContacts,
        group: totalGroups,
        blog: totalBlogs
      }
    }
  }

  // get corporate  account statistics: blogs, events, adverts, staff, polls and outlets
  async getCorporateStats(user: any): Promise<any> {
    const totalContacts = await this.getContactCount(user.id);
    const totalGroups = await this.getGroupCount(user.id);
    const totalBlogs = await this.getBlogCount(user.id);
    const totalAdverts = await this.getAdvertCount(user.id);
    const totalEvents = await this.getEventCount(user.id);
    const totalStaff = await this.getStaffCount(user.id);
    const totalPoll = await this.getPollsCount(user.id);
    const totalOutlet = await this.getOutletsCount(user.id);


    return {
      stat: {
        contact: totalContacts,
        group: totalGroups,
        blog: totalBlogs,
        advert: totalAdverts,
        event: totalEvents,
        staff: totalStaff,
        poll: totalPoll,
        outlet: totalOutlet
      }
    }
  }

  // get admin account statistics: groups, accounts, blogs, events, adverts, staff, polls and outlets
  async getAdminStats(): Promise<any> {
    const totalContacts = await this.getContactCount();
    const totalGroups = await this.getGroupCount();
    const totalBlogs = await this.getBlogCount();
    const totalAdverts = await this.getAdvertCount();
    const totalEvents = await this.getEventCount();
    const totalStaff = await this.getStaffCount();
    const totalPoll = await this.getPollsCount();
    const totalOutlet = await this.getOutletsCount();
    const totalIndividualAccount = await this.getIndividualTotal();
    const totalCorporateAccount = await this.getCorporateTotal()

    return {
      stat: {
        contact: totalContacts,
        group: totalGroups,
        blog: totalBlogs,
        advert: totalAdverts,
        event: totalEvents,
        staff: totalStaff,
        poll: totalPoll,
        outlet: totalOutlet,
        account: {
          indivdual: totalIndividualAccount,
          corporate: totalCorporateAccount
        }
      }
    }
  }
 
  // get pending events for admin approval
  async getEvents(): Promise<EventEntity[]> {
    const events = await getRepository(EventEntity).createQueryBuilder('e')
      .where(`e.published = false AND e.disabled = false AND e.endDate >= NOW()`)
      .orderBy('e.createdBy', 'ASC')
      .take(10)
      .getMany()
    return plainToClass(EventEntity, events);
  }

  // get pending Blogs for admin approval
  async getBlogs(): Promise<ArticleEntity[]> {
    const blogs = await getRepository(ArticleEntity).createQueryBuilder('b')
      .where(`b.published = false AND b.disabled = false AND b.endDate >= NOW()`)
      .orderBy('b.createdBy', 'ASC')
      .take(10)
      .getMany()
    return plainToClass(ArticleEntity, blogs);
  }

  // get pending adverts for admin approval
  async getAdverts(): Promise<AdvertEntity[]> {
    const adverts = await getRepository(AdvertEntity).createQueryBuilder('ad')
      .where(`ad.approved = false AND ad.disabled = false AND ad.endDate >= NOW()`)
      .orderBy('ad.createdBy', 'ASC')
      .take(10)
      .getMany()
    return plainToClass(AdvertEntity, adverts);
  }

  // get pending jobs for admin approval
  async getJobs(): Promise<JobVacancyEntity[]> {
    const jobs = await getRepository(JobVacancyEntity).createQueryBuilder('job')
    .where(`job.published = false AND job.disabled = false AND job.endDate >= NOW()`)
    .orderBy('ad.createdBy', 'ASC')
    .take(10)
    .getMany()
  return plainToClass(JobVacancyEntity, jobs);
  }

  // get upcomming events a  user registered for
  async getFutureEventsByUser(user: AccountEntity): Promise<EventEntity[]> {
    const events = await getRepository(AccountEntity).createQueryBuilder('e')
    .where(`e.published = true AND e.disabled = false AND e.endDate >= NOW()`)
    .orderBy('e.createdBy', 'ASC')
    .take(10)
    .getMany()
  return plainToClass(EventEntity, events); 
  }

  // get latest blogs
  async getLatestBlogs(): Promise<ArticleEntity[]> {
    const blogs = await getRepository(ArticleEntity).createQueryBuilder('b')
    .where(`b.published = true AND b.disabled = false`)
    .orderBy('e.createdBy', 'ASC')
    .take(10)
    .getMany()

    return plainToClass(ArticleEntity, blogs); 
  }

  // get current jobs
  async getCurrentJobs(): Promise<JobVacancyEntity[]> {
    const jobs = await getRepository(JobVacancyEntity).createQueryBuilder('e')
    .where(`e.published = true AND e.disabled = false AND e.endDate >= NOW()`)
    .orderBy('e.createdBy', 'ASC')
    .take(10)
    .getMany()

    return plainToClass(JobVacancyEntity, jobs);
  }

  // get current jobs
  async getUnverifiedStaff(user: AccountEntity): Promise<AccountEntity[]> {
    const staff = await getRepository(AccountEntity).createQueryBuilder('acc')
    .where(`acc.staffStatus = 'pending' AND acc.disabled = false AND a.organizationId =:userId`, 
    {
      userId: user.id
    })
    .orderBy('e.firstName', 'ASC')
    .take(10)
    .getMany()

    return plainToClass(AccountEntity, staff);
  }

  private async getContactCount(userId?: string): Promise<Number> {
    let total = 0;
    const repo = getRepository(ContactEntity).createQueryBuilder('c');
    if (userId) {
      total = await repo.where(`c.creatorId =:userId AND c.disabled = false`, { userId })
        .getCount();
      return total;
    }

    total = await repo.where(`c.disabled = false`)
      .getCount();
    return total;
  }

  private async getGroupCount(userId?: string): Promise<Number> {
    let total = 0;
    const repo = getRepository(GroupEntity).createQueryBuilder('g');
    if (userId) {
      total = await repo.where(`g.ownerId =:userId AND g.disabled = false`, { userId })
        .getCount();
    }
    total = await repo.where(`g.disabled = false`)
      .getCount();
    return total;
  }

  private async getBlogCount(userId?: string): Promise<Number> {
    let total = 0;
    const repo = getRepository(ArticleEntity).createQueryBuilder('b');
    if (userId) {
      total = await repo.where(`b.accountId =:userId AND b.published = true AND b.disabled = false`, { userId })
        .getCount();
    }
    total = await repo.where(`b.published = true AND b.disabled = false`)
      .getCount();
    return total;
  }

  private async getEventCount(userId?: string): Promise<Number> {
    let total = 0;
    const repo = await getRepository(EventEntity).createQueryBuilder('e');
    if (userId) {
      total = await repo.where(`e.accountId =:userId AND e.published = true AND e.disabled = false`, { userId })
        .getCount();
      return total;
    }
    total = await repo.where(`e.published = true AND e.disabled = false`, { userId })
      .getCount();
    return total;
  }

  private async getAdvertCount(userId?: string): Promise<Number> {
    let total = 0;
    const repo = getRepository(AdvertEntity).createQueryBuilder('ad');
    if (userId) {
      total = await repo.where(`ad.accountId =:userId AND ad.approved = true AND ad.disabled = false`, { userId })
        .getCount();
      return total;
    }
    total = await repo.where(`ad.published = true AND ad.disabled = false`)
      .getCount();
    return total;
  }

  private async getStaffCount(userId?: string): Promise<Number> {
    const total = await getRepository(AccountEntity).createQueryBuilder('a')
      .where(`a.organizationId =:userId 
      AND a.accountType = 'individual' AND a.disabled = false' 
      AND a.statffStatus = 'verified'`, { userId })
      .getCount();
    return total;
  }

  private async getPollsCount(userId?: string): Promise<Number> {
    let total = 0;
    const repo = await getRepository(PollEntity).createQueryBuilder('poll');
    if (userId) {
      total = await repo.where(`poll.accountId =:userId AND poll.published = true AND poll.disabled = false`, { userId })
        .getCount();
      return total;
    }
    total = await repo.where(`poll.published = true AND poll.disabled = false`)
      .getCount();
    return total;
  }

  private async getOutletsCount(userId?: string): Promise<Number> {
    let total = 0;
    const repo = await getRepository(OutletEntity).createQueryBuilder('out');
    if (userId) {
      total = await repo.where(`out.accountId =:userId AND out.disabled = true AND out.disabled = false`, { userId })
        .getCount();
    }
    total = await repo.where(`out.disabled = true AND out.disabled = false`)
      .getCount();
    return total;
  }

  private async getCorporateTotal() {
    const total = await getRepository(AccountEntity).createQueryBuilder('a')
      .where(`a.accountType = 'corporate' AND a.disabled = false' 
      AND a.statffStatus = 'verified'`)
      .getCount();
    return total;
  }
  private async getIndividualTotal() {
    throw new Error('Method not implemented.');
  }

}
