import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  // Mock user data
  const mockUser: User = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    password: 'hashedPassword123',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const createUserDto: CreateUserDto = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    password: 'password123',
  };

  const updateUserDto: UpdateUserDto = {
    firstName: 'John Updated',
    lastName: 'Doe Updated',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            create: jest.fn().mockReturnValue(mockUser),
            save: jest.fn().mockResolvedValue(mockUser),
            find: jest.fn().mockResolvedValue([mockUser]),
            findOneBy: jest.fn().mockResolvedValue(mockUser),
            remove: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      // Arrange
      jest.spyOn(repository, 'create').mockReturnValue(mockUser);
      jest.spyOn(repository, 'save').mockResolvedValue(mockUser);
      
      // Act
      const result = await service.create(createUserDto);
      
      // Assert
      expect(repository.create).toHaveBeenCalledWith({
        ...createUserDto,
        password: createUserDto.password, // In a real scenario, this would be hashed
      });
      expect(repository.save).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockUser);
    });

    it('should throw ConflictException when email already exists', async () => {
      // Arrange
      const duplicateEmailError = { code: '23505' }; // PostgreSQL unique violation code
      jest.spyOn(repository, 'save').mockRejectedValue(duplicateEmailError);
      
      // Act & Assert
      await expect(service.create(createUserDto)).rejects.toThrow(ConflictException);
    });

    it('should throw InternalServerErrorException for other errors', async () => {
      // Arrange
      jest.spyOn(repository, 'save').mockRejectedValue(new Error('Some other error'));
      
      // Act & Assert
      await expect(service.create(createUserDto)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      // Arrange
      jest.spyOn(repository, 'find').mockResolvedValue([mockUser]);
      
      // Act
      const result = await service.findAll();
      
      // Assert
      expect(repository.find).toHaveBeenCalled();
      expect(result).toEqual([mockUser]);
    });

    it('should return an empty array if no users are found', async () => {
      // Arrange
      jest.spyOn(repository, 'find').mockResolvedValue([]);
      
      // Act
      const result = await service.findAll();
      
      // Assert
      expect(repository.find).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a user when found', async () => {
      // Arrange
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(mockUser);
      
      // Act
      const result = await service.findOne(1);
      
      // Assert
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException when user is not found', async () => {
      // Arrange
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);
      
      // Act & Assert
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update and return a user', async () => {
      // Arrange
      const updatedUser = {
        ...mockUser,
        firstName: 'John Updated',
        lastName: 'Doe Updated',
      };
      
      jest.spyOn(service, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(repository, 'save').mockResolvedValue(updatedUser);
      
      // Act
      const result = await service.update(1, updateUserDto);
      
      // Assert
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(repository.save).toHaveBeenCalled();
      expect(result).toEqual(updatedUser);
    });

    it('should throw ConflictException when email already exists', async () => {
      // Arrange
      const duplicateEmailError = { code: '23505' }; // PostgreSQL unique violation code
      jest.spyOn(service, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(repository, 'save').mockRejectedValue(duplicateEmailError);
      
      // Act & Assert
      await expect(service.update(1, { email: 'existing@example.com' })).rejects.toThrow(ConflictException);
    });

    it('should throw InternalServerErrorException for other errors', async () => {
      // Arrange
      jest.spyOn(service, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(repository, 'save').mockRejectedValue(new Error('Some other error'));
      
      // Act & Assert
      await expect(service.update(1, updateUserDto)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      // Arrange
      jest.spyOn(service, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(repository, 'remove').mockResolvedValue(undefined);
      
      // Act
      await service.remove(1);
      
      // Assert
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(repository.remove).toHaveBeenCalledWith(mockUser);
    });

    it('should throw NotFoundException when user does not exist', async () => {
      // Arrange
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());
      
      // Act & Assert
      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
