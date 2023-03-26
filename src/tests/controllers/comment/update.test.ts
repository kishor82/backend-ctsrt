import updateComments from '../../../controllers/comment/update';

describe('updateCommentMethod', () => {
  let mockCommentCollection: any;
  let request: any;
  let h: any;
  const mockComment = {
    id: 1,
    userId: 1,
    body: 'Mock comment body',
  };
  const commentId = 1;

  beforeAll(() => {
    mockCommentCollection = {
      updateCommentById: jest.fn(),
      getComment: jest.fn(),
    };
  });

  beforeEach(() => {
    request = {
      query: {},
      params: { id: commentId },
      payload: {
        body: 'Updated comment body',
      },
      auth: { credentials: { id: commentId, scope: 'USER' } },
    };
    h = {
      response: jest.fn().mockReturnThis(),
      code: jest.fn().mockReturnThis(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update a comment successfully', async () => {
    mockCommentCollection.getComment.mockResolvedValue(mockComment);
    mockCommentCollection.updateCommentById.mockResolvedValue(true);
    const updateCommentHandler = updateComments({ commentCollection: mockCommentCollection });

    const response = await updateCommentHandler(request, h);

    expect(h.code).toHaveBeenCalledWith(201);
    expect(h.response).toHaveBeenCalledWith({
      statusCode: 201,
      data: {
        message: 'Comment updated!',
      },
    });
    expect(response).toEqual(h);
    expect(mockCommentCollection.updateCommentById).toHaveBeenCalledWith({ id: commentId, dataToUpdate: { body: 'Updated comment body' } });
  });

  it('should return an error if comment is not found', async () => {
    mockCommentCollection.getComment.mockReturnValue(null);
    const updateCommentHandler = updateComments({ commentCollection: mockCommentCollection });
    try {
      await updateCommentHandler(request, h);
    } catch (error: any) {
      expect(error.output.statusCode).toBe(404);
      expect(error.message).toBe('Comment not found');
      expect(mockCommentCollection.updateCommentById).not.toHaveBeenCalled();
    }
  });

  test('should not update the comment if the user is not authorized to update', async () => {
    mockCommentCollection.getComment.mockReturnValue({ id: 5 });
    const updateCommentHandler = updateComments({ commentCollection: mockCommentCollection });
    try {
      await updateCommentHandler(request, h);
      expect(true).toBe(true);
    } catch (error: any) {
      expect(error.output.statusCode).toBe(401);
      expect(error.message).toBe('You are not authorized to update this comment');
      expect(mockCommentCollection.updateCommentById).not.toHaveBeenCalled();
    }
  });
});
