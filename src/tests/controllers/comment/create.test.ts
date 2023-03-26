import createComment from '../../../controllers/comment/create';
import { generateCustomError, wrapError } from '../../../utils';

describe('createCommentMethod', () => {
  let mockCommentCollection: any;
  let request: any;
  let h: any;

  beforeAll(() => {
    mockCommentCollection = {
      createComment: jest.fn(),
    };
  });

  beforeEach(() => {
    request = {
      params: {
        post_id: 1,
      },
      payload: { body: 'This is a test comment.' },
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

  it('should create a new comment successfully', async () => {
    mockCommentCollection.createComment.mockReturnValueOnce({ _id: 1, body: 'This is a test comment.' });

    const response: any = await createComment({ commentCollection: mockCommentCollection })(request, h);

    expect(mockCommentCollection.createComment).toHaveBeenCalledWith({
      body: 'This is a test comment.',
      postId: 1,
      userId: 1,
    });
    expect(h.response).toHaveBeenCalledWith({
      statusCode: 201,
      data: {
        message: 'Comment created successfully!',
      },
    });
    expect(h.code).toHaveBeenCalledWith(201);
    expect(response).toEqual(h);
  });


  it('should throw an error if the input data is invalid', async () => {
    // Mock the createComment method of the post collection
    mockCommentCollection.createComment.mockReturnValueOnce(null);

    await expect(createComment({ commentCollection: mockCommentCollection })(request, h)).rejects.toThrow(generateCustomError('Invalid input data.', 400));
  });

  it('should throw an error if an exception is thrown', async () => {
    // Mock the createComment method of the post collection to throw an error
    mockCommentCollection.createComment.mockRejectedValueOnce(new Error('Database connection error'));

    await expect(createComment({ commentCollection: mockCommentCollection })(request, h)).rejects.toThrow(wrapError(new Error('Database connection error')));
  });
});
