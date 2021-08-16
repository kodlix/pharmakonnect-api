import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PollOptionEntity } from '../entities/poll-option.entity';
import { PollQuestionEntity } from '../entities/poll-question.entity';
import { PollVoteEntity } from '../entities/poll-vote.entity';

export class PollSummaryDto {
    id: string;

    title: string;

    slug: string;

    description: string;

    url: string;

    accessCode: string;

    requiresLogin: boolean;

    type: string;

    hint: string;

    published: boolean;

    publishedAt: Date;

    publishedBy: string;

    startDate: Date;

    questions: PollQuestionEntity[];

    options: PollOptionEntity[];

    votes: PollVoteEntity[];

    totalVotes: number;

    endDate: Date;

    accountId: string;

    active: boolean;

    owner: string;
}




