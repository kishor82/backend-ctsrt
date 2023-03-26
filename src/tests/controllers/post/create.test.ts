import createPost from '../../../controllers/post/create';
import { generateCustomError, wrapError } from '../../../utils';

describe('createUserMethod', () => {
  let mockPostCollection: any;
  let request: any;
  let h: any;

  beforeAll(() => {
    mockPostCollection = {
      createPost: jest.fn(),
    };
  });

  beforeEach(() => {
    request = {
      payload: { title: 'Test Post', body: 'This is a test post.' },
      auth: { credentials: { id: 1 } },
    };
    h = {
      response: jest.fn().mockReturnThis(),
      code: jest.fn().mockReturnThis(),
    };
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should create a new post if the input data is valid', async () => {
    // Mock the createPost method of the post collection
    mockPostCollection.createPost.mockReturnValueOnce({ _id: 1, title: 'Test Post', body: 'This is a test post.' });

    const response: any = await createPost({ postCollection: mockPostCollection })(request, h);

    expect(mockPostCollection.createPost).toHaveBeenCalledWith({
      title: 'Test Post',
      body: 'This is a test post.',
      userId: 1,
    });
    expect(h.response).toHaveBeenCalledWith({
      statusCode: 201,
      data: {
        message: 'Post created successfully!',
      },
    });
    expect(h.code).toHaveBeenCalledWith(201);
    expect(response).toEqual(h);
  });

  it('should throw an error if the input data is invalid', async () => {
    // Mock the createPost method of the post collection
    mockPostCollection.createPost.mockReturnValueOnce(null);

    await expect(createPost({ postCollection: mockPostCollection })(request, h)).rejects.toThrow(generateCustomError('Invalid input data.', 400));
  });

  it('should throw an error if an exception is thrown', async () => {
    // Mock the createPost method of the post collection to throw an error
    mockPostCollection.createPost.mockRejectedValueOnce(new Error('Database connection error'));

    await expect(createPost({ postCollection: mockPostCollection })(request, h)).rejects.toThrow(wrapError(new Error('Database connection error')));
  });
});
