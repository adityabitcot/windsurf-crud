import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import { UserResponseDto } from './dto/user-response.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  // Mock user data
  const mockUser = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    password: 'hashedPassword123',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUserResponse = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    isActive: true,
    createdAt: mockUser.createdAt,
    updatedAt: mockUser.updatedAt,
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
      controllers: [UsersController],
      providers: [{
        provide: UsersService,
        useValue: {
          create: jest.fn().mockResolvedValue(mockUser),
          findAll: jest.fn().mockResolvedValue([mockUser]),
          findOne: jest.fn().mockResolvedValue(mockUser),
          update: jest.fn().mockResolvedValue(mockUser),
          remove: jest.fn().mockResolvedValue(undefined),
        },
      }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      // Arrange
      jest.spyOn(service, 'create').mockResolvedValue(mockUser);
      
      // Act
      const result = await controller.create(createUserDto);
      
      // Assert
      expect(result).toBeInstanceOf(UserResponseDto);
      expect(service.create).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(expect.objectContaining({
        id: mockUser.id,
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
        email: mockUser.email,
      }));
    });

    it('should handle errors when creating a user', async () => {
      // Arrange
      const error = new Error('Test error');
      jest.spyOn(service, 'create').mockRejectedValue(error);
      
      // Act & Assert
      await expect(controller.create(createUserDto)).rejects.toThrow(error);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      // Arrange
      jest.spyOn(service, 'findAll').mockResolvedValue([mockUser]);
      
      // Act
      const result = await controller.findAll();
      
      // Assert
      expect(Array.isArray(result)).toBe(true);
      expect(result[0]).toBeInstanceOf(UserResponseDto);
      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual([expect.objectContaining(mockUserResponse)]);
    });
  });

  describe('findOne', () => {
    it('should return a single user', async () => {
      // Arrange
      jest.spyOn(service, 'findOne').mockResolvedValue(mockUser);
      const id = '1';
      
      // Act
      const result = await controller.findOne(id);
      
      // Assert
      expect(result).toBeInstanceOf(UserResponseDto);
      expect(service.findOne).toHaveBeenCalledWith(+id);
      expect(result).toEqual(expect.objectContaining(mockUserResponse));
    });

    it('should handle errors when finding a user', async () => {
      // Arrange
      const error = new Error('User not found');
      jest.spyOn(service, 'findOne').mockRejectedValue(error);
      const id = '999';
      
      // Act & Assert
      await expect(controller.findOne(id)).rejects.toThrow(error);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      // Arrange
      const updatedUser = { ...mockUser, ...updateUserDto };
      jest.spyOn(service, 'update').mockResolvedValue(updatedUser);
      const id = '1';
      
      // Act
      const result = await controller.update(id, updateUserDto);
      
      // Assert
      expect(result).toBeInstanceOf(UserResponseDto);
      expect(service.update).toHaveBeenCalledWith(+id, updateUserDto);
      expect(result).toEqual(expect.objectContaining({
        id: updatedUser.id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
      }));
    });

    it('should handle errors when updating a user', async () => {
      // Arrange
      const error = new Error('User not found');
      jest.spyOn(service, 'update').mockRejectedValue(error);
      const id = '999';
      
      // Act & Assert
      await expect(controller.update(id, updateUserDto)).rejects.toThrow(error);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      // Arrange
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);
      const id = '1';
      
      // Act
      const result = await controller.remove(id);
      
      // Assert
      expect(result).toBeUndefined();
      expect(service.remove).toHaveBeenCalledWith(+id);
    });

    it('should handle errors when removing a user', async () => {
      // Arrange
      const error = new Error('User not found');
      jest.spyOn(service, 'remove').mockRejectedValue(error);
      const id = '999';
      
      // Act & Assert
      await expect(controller.remove(id)).rejects.toThrow(error);
    });
  });
});
