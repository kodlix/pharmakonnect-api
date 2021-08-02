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

@Injectable()
export class DashboardService {
  private accountRepository: Repository<AccountEntity>;
  private outletRepository: Repository<OutletEntity>;
  private staffRepository: Repository<AccountEntity>;
  private jobRepository: Repository<JobVacancyEntity>;
  private eventRepository: Repository<EventEntity>;
  private advertRepository: Repository<AdvertEntity>;
  private blogRepository: Repository<ArticleEntity>;
  private pollRepository: Repository<PollEntity>;
  private groupRepository: Repository<GroupEntity>;
  private contactRepository: Repository<ContactEntity>;

  asyncconstructor() {
    this.outletRepository = getRepository(OutletEntity);
  }

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
  async getAdminStats(user: any): Promise<any> {
    const totalContacts = await this.getContactCount();
    const totalGroups = await this.getGroupCount();
    const totalBlogs = await this.getBlogCount();
    const totalAdverts = await this.getAdvertCount();
    const totalEvents = await this.getEventCount();
    const totalStaff = await this.getStaffCount();
    const totalPoll = await this.getPollsCount();
    const totalOutlet = await this.getOutletsCount();
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
          indivdual: 90,
          corporate: 99
        }
      }
    }
  }

  // get pending events for admin approval
  async getEvents(user: any): Promise<boolean> {
    return true;
  }

  // get pending Blogs for admin approval
  async getBlogs(user: any): Promise<boolean> {
    return true;
  }

  // get pending adverts for admin approval
  async getAdverts(user: any): Promise<boolean> {
    return true;
  }

  // get pending jobs for admin approval
  async getJobs(user: any): Promise<boolean> {
    return true;
  }

  // get upcomming events by user
  async getFutureEventsByUser(user: any): Promise<boolean> {
    return true;
  }

  // get latest blogs
  async getLatestBlogs(user: any): Promise<boolean> {
    return true;
  }

  // get current jobs
  async getCurrentJobs(user: any): Promise<boolean> {
    return true;
  }

  // get current jobs
  async getUnverifiedStaff(user: any): Promise<boolean> {
    return true;
  }

  private async getContactCount(userId: string): Promise<Number> {
    let total = 0;
    const repo = this.contactRepository.createQueryBuilder('c');
    if (userId) {
      total = await repo.where(`c.creatorId =:userId AND c.disabled = false`, { userId })
        .getCount();
      return total;
    }

    total = await repo.where(`c.disabled = false`)
      .getCount();
    return total;
  }

  private async getGroupCount(userId: string): Promise<Number> {
    let total = 0;
    const repo = this.groupRepository.createQueryBuilder('g');
    if (userId) {
      total = await repo.where(`g.ownerId =:userId AND g.disabled = false`, { userId })
        .getCount();
    }
    total = await repo.where(`g.disabled = false`)
      .getCount();
    return total;
  }

  private async getBlogCount(userId: string): Promise<Number> {
    let total = 0;
    const repo = this.blogRepository.createQueryBuilder('b');
    if (userId) {
      total = await repo.where(`b.accountId =:userId AND b.published = true AND b.disabled = false`, { userId })
        .getCount();
    }
    total = await repo.where(`b.published = true AND b.disabled = false`)
      .getCount();
    return total;
  }

  private async getEventCount(userId: string): Promise<Number> {
    let total = 0;
    const repo = await this.eventRepository.createQueryBuilder('e');
    if (userId) {
      total = await repo.where(`e.accountId =:userId AND e.published = true AND e.disabled = false`, { userId })
        .getCount();
      return total;
    }
    total = await repo.where(`e.published = true AND e.disabled = false`, { userId })
      .getCount();
    return total;
  }

  private async getAdvertCount(userId: string): Promise<Number> {
    let total = 0;
    const repo = this.advertRepository.createQueryBuilder('ad');
    if (userId) {
      total = await repo.where(`ad.accountId =:userId AND ad.published = true AND ad.disabled = false`, { userId })
        .getCount();
      return total;
    }
    total = await repo.where(`ad.published = true AND ad.disabled = false`)
      .getCount();
    return total;
  }

  private async getStaffCount(userId: string): Promise<Number> {
    const total = await this.accountRepository.createQueryBuilder('a')
      .where(`a.organizationId =:userId 
      AND a.accountType = 'individual AND a.disabled = false' 
      AND a.statffStatus = 'verified'`, { userId })
      .getCount();
    return total;
  }

  private async getPollsCount(userId: string): Promise<Number> {
    let total = 0;
    const repo = await this.pollRepository.createQueryBuilder('poll');
    if (userId) {
      total = await repo.where(`poll.accountId =:userId AND poll.published = true AND poll.disabled = false`, { userId })
        .getCount();
      return total;
    }
    total = await repo.where(`poll.published = true AND poll.disabled = false`)
      .getCount();
    return total;
  }

  private async getOutletsCount(userId: string): Promise<Number> {
    let total = 0;
    const repo = await this.outletRepository.createQueryBuilder('out');
    if (userId) {
      total = await repo.where(`out.accountId =:userId AND out.disabled = true AND out.disabled = false`, { userId })
        .getCount();
    }
    total = await repo.where(`out.disabled = true AND out.disabled = false`)
      .getCount();
    return total;
  }

}
