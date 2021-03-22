import { JwtStrategy } from './jwt.strategy';
import { Test } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { AccountRepository } from './account.repository';
import { AccountEntity } from './entities/account.entity';

const mockAccountRepository = () => ({
    findOne: jest.fn(),
});

describe('JwtStrategy', () => {
    let jwtStrategy: JwtStrategy;
    let accountRepository;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                JwtStrategy,
                { provide: AccountRepository, useFactory: mockAccountRepository },
            ],
        }).compile();

        jwtStrategy = await module.get<JwtStrategy>(JwtStrategy);
        accountRepository = await module.get<AccountRepository>(AccountRepository);
    });

    describe('validate', () => {
        it('validates and returns the user based on JWT payload', async () => {
            const user = new AccountEntity();
            user.email = 'test@netopng.com';

            accountRepository.findOne.mockResolvedValue(user);
            const result = await jwtStrategy.validate({ email: 'test@netopng.com' });
            expect(accountRepository.findOne).toHaveBeenCalledWith({ email: 'test@netopng.com' });
            expect(result).toEqual(user);
        });

        it('throws an unauthorized exception as user cannot be found', () => {
            accountRepository.findOne.mockResolvedValue(null);
            expect(jwtStrategy.validate({ email: 'test@netopng.com' })).rejects.toThrow(UnauthorizedException);
        });
    });
});