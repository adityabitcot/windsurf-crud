import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let controller: AppController;
  let service: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [{
        provide: AppService,
        useValue: {
          getHello: jest.fn().mockReturnValue('Hello World!'),
        },
      }],
    }).compile();

    controller = module.get<AppController>(AppController);
    service = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getHello', () => {
    it('should call service method and return result', () => {
      // Arrange
      const expectedResult = 'Hello World!';
      jest.spyOn(service, 'getHello').mockReturnValue(expectedResult);
      
      // Act
      const result = controller.getHello();
      
      // Assert
      expect(result).toEqual(expectedResult);
      expect(service.getHello).toHaveBeenCalled();
    });
  });
});
