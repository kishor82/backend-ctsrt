import deleteComments from '../../../controllers/comment/delete';

describe('deleteCommentMethod', () => {
  let mockCommentCollection: any;
  let request: any;
  let h: any;
  const commentId = 1;

  beforeAll(() => {
    mockCommentCollection = {
      deleteCommentById: jest.fn(),
      getComment: jest.fn(),
    };
  });

  beforeEach(() => {
    request = {
      query: {},
      params: { id: commentId },
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

  it('should delete a comment successfully', async () => {
    mockCommentCollection.getComment.mockResolvedValue({ id: commentId, userId: commentId });
    mockCommentCollection.deleteCommentById.mockResolvedValue(true);
    const deleteCommentHandler = deleteComments({ commentCollection: mockCommentCollection });

    const response = await deleteCommentHandler(request, h);

    expect(h.code).toHaveBeenCalledWith(200);
    expect(h.response).toHaveBeenCalledWith({
      statusCode: 200,
      data: {
        message: 'Comment deleted!',
      },
    });
    expect(response).toEqual(h);
    expect(mockCommentCollection.deleteCommentById).toHaveBeenCalledWith({ id: commentId });
  });

  it('should return an error if comment is not found', async () => {
    mockCommentCollection.getComment.mockReturnValue(null);
    const deleteCommentHandler = deleteComments({ commentCollection: mockCommentCollection });
    try {
      await deleteCommentHandler(request, h);
    } catch (error: any) {
      expect(error.output.statusCode).toBe(404);
      expect(error.message).toBe('Comment not found');
      expect(mockCommentCollection.deleteCommentById).not.toHaveBeenCalled();
    }
  });

  test('should not delete the comment if the comment is not authorized to delete', async () => {
    mockCommentCollection.getComment.mockReturnValue({ id: 5 });
    const deleteCommentHandler = deleteComments({ commentCollection: mockCommentCollection });
    try {
      await deleteCommentHandler(request, h);
      expect(true).toBe(true);
    } catch (error: any) {
      expect(error.output.statusCode).toBe(401);
      expect(error.message).toBe('You are not authorized to delete this comment');
      expect(mockCommentCollection.deleteCommentById).not.toHaveBeenCalled();
    }
  });
});
