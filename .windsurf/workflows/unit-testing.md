---
description: Unit Testing and E2E Testing Workflow
---

# Unit Testing and E2E Testing Workflow

## Objective
This workflow guides the implementation of unit tests for controllers, services, and resolvers (if available) in the application, followed by end-to-end (E2E) testing after all unit tests are completed and passing. Tests should be comprehensive and updated whenever controller, service, resolver files, or application features change.

## Workflow Steps

### 1. Run All Existing Unit Tests First
// turbo-all
```bash
# Run all existing tests to identify any current issues
npm test
```

### 2. Fix Failing Tests One File At A Time
Focus on fixing existing failing tests before creating new ones, working on one file at a time:

1. Identify a single failing test file to work on first
2. Examine the error output to understand what's failing in this specific file
3. Make necessary code changes to fix the failing tests in this file
4. Re-run ONLY this specific test file to confirm your changes fixed the issues:
   ```bash
   # Test a single file after making changes
   npm test -- path/to/specific/file.spec.ts
   ```
5. If the test is still failing, repeat steps 2-4 until the specific file's tests pass 100%
6. Only after the current file passes completely, move on to the next failing file
7. After all individual files are fixed, run the complete test suite again to verify everything passes together
8. Commit your fixes

### 3. List All Controller, Service, and Resolver Files
// turbo-all
```bash
# List all controllers, services, and resolvers in the project
find src/modules -name "*.controller.ts" -o -name "*.service.ts" -o -name "*.resolver.ts" | sort
```

### 4. Check for Existing Test Files
// turbo-all
```bash
# List existing test files
find src/modules -name "*.spec.ts" | sort
```

### 5. Identify Missing Tests
Compare the lists from steps 3 and 4 to identify controllers, services, and resolvers that don't have corresponding test files.

### 6. Create or Update Controller Tests
For each controller that needs testing:

1. Create a `.spec.ts` file next to the controller file if it doesn't exist
2. Follow this testing pattern for controllers:
   ```typescript
   import { Test, TestingModule } from '@nestjs/testing';
   import { ControllerName } from './controller-name.controller';
   import { ServiceName } from './service-name.service';
   
   describe('ControllerName', () => {
     let controller: ControllerName;
     let service: ServiceName;
   
     beforeEach(async () => {
       const module: TestingModule = await Test.createTestingModule({
         controllers: [ControllerName],
         providers: [{
           provide: ServiceName,
           useValue: {
             // Mock all service methods used by the controller
             methodName: jest.fn().mockResolvedValue(/* expected return value */),
           },
         }],
       }).compile();
   
       controller = module.get<ControllerName>(ControllerName);
       service = module.get<ServiceName>(ServiceName);
     });
   
     it('should be defined', () => {
       expect(controller).toBeDefined();
     });
   
     describe('methodName', () => {
       it('should call service method and return result', async () => {
         // Arrange
         const dto = { /* test data */ };
         const expectedResult = { /* expected result */ };
         jest.spyOn(service, 'methodName').mockResolvedValue(expectedResult);
         
         // Act
         const result = await controller.methodName(dto);
         
         // Assert
         expect(result).toEqual(expectedResult);
         expect(service.methodName).toHaveBeenCalledWith(dto);
       });
       
       it('should handle errors', async () => {
         // Arrange
         const dto = { /* test data */ };
         const error = new Error('Test error');
         jest.spyOn(service, 'methodName').mockRejectedValue(error);
         
         // Act & Assert
         await expect(controller.methodName(dto)).rejects.toThrow(error);
       });
     });
   });
   ```

### 7. Create or Update Service Tests
For each service that needs testing:

1. Create a `.spec.ts` file next to the service file if it doesn't exist
2. Follow this testing pattern for services:
   ```typescript
   import { Test, TestingModule } from '@nestjs/testing';
   import { ServiceName } from './service-name.service';
   import { getRepositoryToken } from '@nestjs/typeorm';
   import { EntityName } from '../../entities/entity-name.entity';
   
   describe('ServiceName', () => {
     let service: ServiceName;
     let repository: any;
   
     beforeEach(async () => {
       const module: TestingModule = await Test.createTestingModule({
         providers: [
           ServiceName,
           {
             provide: getRepositoryToken(EntityName),
             useValue: {
               // Mock repository methods
               find: jest.fn(),
               findOne: jest.fn(),
               save: jest.fn(),
               update: jest.fn(),
               delete: jest.fn(),
               createQueryBuilder: jest.fn(() => ({
                 where: jest.fn().mockReturnThis(),
                 andWhere: jest.fn().mockReturnThis(),
                 leftJoinAndSelect: jest.fn().mockReturnThis(),
                 getOne: jest.fn(),
                 getMany: jest.fn(),
               })),
             },
           },
           // Mock other services or providers used by this service
         ],
       }).compile();
   
       service = module.get<ServiceName>(ServiceName);
       repository = module.get(getRepositoryToken(EntityName));
     });
   
     it('should be defined', () => {
       expect(service).toBeDefined();
     });
   
     describe('methodName', () => {
       it('should return data correctly', async () => {
         // Arrange
         const mockData = [{ /* test data */ }];
         repository.find.mockResolvedValue(mockData);
         
         // Act
         const result = await service.methodName();
         
         // Assert
         expect(result).toEqual(mockData);
         expect(repository.find).toHaveBeenCalled();
       });
       
       it('should handle edge cases', async () => {
         // Arrange
         repository.find.mockResolvedValue([]);
         
         // Act
         const result = await service.methodName();
         
         // Assert
         expect(result).toEqual([]);
       });
       
       it('should handle errors', async () => {
         // Arrange
         const error = new Error('Database error');
         repository.find.mockRejectedValue(error);
         
         // Act & Assert
         await expect(service.methodName()).rejects.toThrow(error);
       });
     });
   });
   ```

### 8. Create or Update Resolver Tests (if applicable)
// turbo-all
```bash
# Check if any resolver files exist in the project
find src/modules -name "*.resolver.ts" | wc -l
```

For each resolver that needs testing (if any resolvers exist in the project):

1. Create a `.spec.ts` file next to the resolver file if it doesn't exist
2. Follow this testing pattern for resolvers:
   ```typescript
   import { Test, TestingModule } from '@nestjs/testing';
   import { ResolverName } from './resolver-name.resolver';
   import { ServiceName } from './service-name.service';
   
   describe('ResolverName', () => {
     let resolver: ResolverName;
     let service: ServiceName;
   
     beforeEach(async () => {
       const module: TestingModule = await Test.createTestingModule({
         providers: [
           ResolverName,
           {
             provide: ServiceName,
             useValue: {
               // Mock all service methods used by the resolver
               methodName: jest.fn().mockResolvedValue(/* expected return value */),
             },
           },
         ],
       }).compile();
   
       resolver = module.get<ResolverName>(ResolverName);
       service = module.get<ServiceName>(ServiceName);
     });
   
     it('should be defined', () => {
       expect(resolver).toBeDefined();
     });
   
     describe('query', () => {
       it('should call service method and return result', async () => {
         // Arrange
         const args = { /* test args */ };
         const expectedResult = { /* expected result */ };
         jest.spyOn(service, 'methodName').mockResolvedValue(expectedResult);
         
         // Act
         const result = await resolver.query(args);
         
         // Assert
         expect(result).toEqual(expectedResult);
         expect(service.methodName).toHaveBeenCalledWith(args);
       });
     });
   
     describe('mutation', () => {
       it('should call service method and return result', async () => {
         // Arrange
         const args = { /* test args */ };
         const expectedResult = { /* expected result */ };
         jest.spyOn(service, 'methodName').mockResolvedValue(expectedResult);
         
         // Act
         const result = await resolver.mutation(args);
         
         // Assert
         expect(result).toEqual(expectedResult);
         expect(service.methodName).toHaveBeenCalledWith(args);
       });
     });
   
     describe('field resolver', () => {
       it('should resolve field correctly', async () => {
         // Arrange
         const parent = { /* parent object */ };
         const expectedResult = { /* expected result */ };
         jest.spyOn(service, 'methodName').mockResolvedValue(expectedResult);
         
         // Act
         const result = await resolver.fieldName(parent);
         
         // Assert
         expect(result).toEqual(expectedResult);
       });
     });
   });
   ```

### 9. Verify All Unit Tests Pass
// turbo-all
```bash
# Run all tests after creating/updating to ensure everything passes
npm test -- --coverage
```

### 10. Verify Unit Test Coverage
// turbo-all
```bash
# Open coverage report
open coverage/lcov-report/index.html
```

### 11. Commit All Unit Test Changes
Once all unit tests are passing with good coverage, commit your changes.
// turbo-all
```bash
git add .
git commit -m "Complete unit test coverage for all controllers, services, and resolvers"
```

## End-to-End (E2E) Testing

This section should only be executed after all unit tests have been successfully completed and pass.

### 1. Check for Existing E2E Test Files
// turbo-all
```bash
# List existing E2E test files
find test -name "*.e2e-spec.ts" | sort
```

### 2. Create or Update E2E Tests
For each feature that needs E2E testing:

1. Create a `.e2e-spec.ts` file in the test directory if it doesn't exist
2. Follow this testing pattern for E2E tests:
   ```typescript
   import { Test, TestingModule } from '@nestjs/testing';
   import { INestApplication } from '@nestjs/common';
   import * as request from 'supertest';
   import { AppModule } from '../src/app.module';
   
   describe('FeatureName (e2e)', () => {
     let app: INestApplication;
   
     beforeAll(async () => {
       const moduleFixture: TestingModule = await Test.createTestingModule({
         imports: [AppModule],
       }).compile();
   
       app = moduleFixture.createNestApplication();
       // Apply any necessary app configurations here, like:
       // app.useGlobalPipes(new ValidationPipe());
       await app.init();
     });
   
     afterAll(async () => {
       await app.close();
     });
   
     describe('EndpointPath (HTTP Method)', () => {
       it('should perform expected action', () => {
         return request(app.getHttpServer())
           .method('/endpoint-path') // Replace 'method' with get, post, put, delete, etc.
           .send(/* request body if needed */)
           .set('Authorization', 'Bearer token-if-needed')
           .expect(/* expected status code */)
           .expect(/* expected response body */);
       });
       
       it('should handle errors properly', () => {
         return request(app.getHttpServer())
           .method('/endpoint-path')
           .send(/* invalid request body */)
           .expect(/* expected error status code */)
           .expect(/* expected error response */);
       });
     });
   });
   ```

### 3. Create Test Database Setup Script (if needed)
If your E2E tests require a test database:

```typescript
// test/setup-test-db.ts
import { getConnection } from 'typeorm';

export async function setupTestDatabase() {
  const connection = getConnection();
  
  // Clear all data from tables
  const entities = connection.entityMetadatas;
  
  for (const entity of entities) {
    const repository = connection.getRepository(entity.name);
    await repository.query(`TRUNCATE "${entity.tableName}" CASCADE;`);
  }
  
  // Add seed data if needed
  // await connection.getRepository(Entity).save([...seed data...]);
}
```

### 4. Run E2E Tests
// turbo-all
```bash
# Run all E2E tests
npm run test:e2e

# Run specific E2E tests
npm run test:e2e -- test/feature-name.e2e-spec.ts
```

### 5. Verify E2E Test Results
Check the console output for E2E test results. Ensure all tests are passing.

## Best Practices for Unit Testing

1. **Test Isolation**: Each test should be independent and not rely on other tests.
2. **Mock External Dependencies**: Always mock repositories, other services, and external APIs.
3. **Test Coverage**: Aim for high test coverage, especially for complex business logic.
4. **Error Handling**: Test both success and error scenarios.
5. **Edge Cases**: Include tests for edge cases and boundary conditions.
6. **Keep Tests Updated**: When controllers, services, or resolvers change, immediately update the corresponding tests.
7. **Test Organization**: Group tests logically using `describe` blocks.
8. **Test Naming**: Use descriptive test names that explain what is being tested.

## Best Practices for E2E Testing

1. **Independent Tests**: Ensure each E2E test is independent and doesn't rely on state from other tests.
2. **Test Environment**: Use a separate test database or mock external services.
3. **Clean Up**: Always clean up any test data created during the test.
4. **Authentication**: Test both authenticated and unauthenticated scenarios.
5. **Error Handling**: Test both success and error scenarios, including validation errors.
6. **API Coverage**: Ensure all API endpoints are covered by E2E tests.
7. **Keep Tests Updated**: When APIs or features change, immediately update the corresponding E2E tests.

## Common Mistakes and Solutions

### Common Mistakes

1. **Incomplete Query Builder Mocks**: Missing methods in query builder chains (like `innerJoin`, `withDeleted`, etc.)
2. **Missing Nested Properties**: Not providing complete mock data with nested properties (e.g., `role.name` in `userRoles`)
3. **Incorrect DTO Types**: Using properties in DTOs that don't match the actual DTO definition
4. **Improper Exception Testing**: Not correctly mocking exceptions to be thrown
5. **Incomplete Transaction Mocks**: Not properly mocking transaction callbacks and entity manager methods
6. **Missing Relations in Repository Mocks**: Not including relations in repository method mocks
7. **Inconsistent Mock Returns**: Mock return values not matching what the service expects
8. **Not Mocking Private Methods**: Failing to mock private methods used by the tested method
9. **Duplicate Test Setups**: Repeating the same mock setup code across multiple tests
10. **Missing TypeORM Method Mocks**: Forgetting to mock methods like `createQueryBuilder`, `save`, `findOne`, etc.
11. **Incomplete GraphQL Context**: Not properly mocking GraphQL context for resolver tests

### Solution Prompts

#### Complete Query Builder Mock Template
```typescript
const mockQueryBuilder = {
  withDeleted: jest.fn().mockReturnThis(),
  leftJoinAndSelect: jest.fn().mockReturnThis(),
  innerJoin: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  andWhere: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  addOrderBy: jest.fn().mockReturnThis(),
  skip: jest.fn().mockReturnThis(),
  take: jest.fn().mockReturnThis(),
  getOne: jest.fn().mockResolvedValue(/* mock result */),
  getMany: jest.fn().mockResolvedValue(/* mock result */),
  getManyAndCount: jest.fn().mockResolvedValue([/* mock results */, /* count */]),
  update: jest.fn().mockReturnThis(),
  set: jest.fn().mockReturnThis(),
  execute: jest.fn().mockResolvedValue({ affected: 1 }),
  delete: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  addSelect: jest.fn().mockReturnThis(),
  groupBy: jest.fn().mockReturnThis(),
  having: jest.fn().mockReturnThis(),
  query: jest.fn().mockResolvedValue(/* mock result */)
};
```

#### Transaction Mock Template
```typescript
// Mock DataSource transaction
dataSource.transaction.mockImplementation(async (callback) => {
  return callback(mockTransactionalEntityManager);
});

// Mock TransactionalEntityManager with all required methods
const mockTransactionalEntityManager = {
  findOne: jest.fn(),
  findOneBy: jest.fn(),
  find: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  remove: jest.fn(),
  createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
  query: jest.fn()
};
```

#### Testing Exceptions Properly
```typescript
// For synchronous functions
expect(() => service.methodName(invalidArgs)).toThrow(ExpectedException);

// For asynchronous functions
await expect(service.methodName(invalidArgs)).rejects.toThrow(ExpectedException);

// For transaction errors
dataSource.transaction.mockImplementation(async () => {
  throw new ExpectedException('Error message');
});
await expect(service.methodName(args)).rejects.toThrow(ExpectedException);
```

#### Mocking Private Methods
```typescript
// Mock a private method in a service
jest.spyOn(service as any, 'privateMethodName').mockImplementation(() => {
  // Mock implementation
  return expectedResult;
});

// Or to make it throw an exception
jest.spyOn(service as any, 'privateMethodName').mockImplementation(() => {
  throw new ExpectedException('Error message');
});
```

#### Complete Entity with Nested Relations
```typescript
// Mock a user with complete nested relations
const mockUser = {
  id: 1,
  first_name: 'Test',
  last_name: 'User',
  email: 'test@example.com',
  userRoles: [
    {
      id: 1,
      role: {
        id: 2,
        name: 'Admin' // Don't forget nested properties like role.name
      }
    }
  ],
  projectUsers: [
    {
      id: 1,
      project: { id: 1, name: 'Project 1' },
      projectUserSites: [
        {
          id: 1,
          site: { id: 1, name: 'Site 1' },
          projectUserSiteSubjects: [
            { id: 1, subject: { id: 1, name: 'Subject 1' } }
          ]
        }
      ]
    }
  ]
};
```

#### GraphQL Context Mock for Resolver Tests
```typescript
// Mock GraphQL context with user information
const mockGqlContext = {
  req: {
    user: {
      id: 1,
      email: 'test@example.com',
      roles: ['admin']
    }
  }
};

// Use in resolver tests
it('should use context data correctly', async () => {
  const result = await resolver.protectedQuery({}, {}, mockGqlContext);
  expect(service.methodName).toHaveBeenCalledWith(expect.objectContaining({
    userId: 1
  }));
});
```

#### Checklist Before Running Tests
1. ✅ All repository methods used by the service are mocked
2. ✅ All query builder methods in chains are mocked
3. ✅ All DTOs match the actual DTO structure
4. ✅ All nested properties in mock data are provided
5. ✅ All private methods called by tested methods are mocked
6. ✅ All transactions and entity manager methods are mocked
7. ✅ Exception tests use rejects.toThrow for async methods
8. ✅ Mock data types match expected return types
9. ✅ GraphQL context is properly mocked for resolver tests (if applicable)
10. **Arrange-Act-Assert**: Structure tests with clear sections for setup, execution, and verification.
11. **No Helper Files**: Avoid creating helper files; keep testing logic within the spec files.

## Workflow Completion Checklist

- [ ] All existing unit tests have been fixed and are passing
- [ ] New unit tests created for untested controllers, services, and resolvers
- [ ] All unit tests pass with the desired coverage percentage (e.g., >80%)
- [ ] Unit test changes have been committed
- [ ] E2E tests implemented for critical paths
- [ ] All E2E tests passing
- [ ] Test documentation updated
