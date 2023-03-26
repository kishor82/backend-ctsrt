import deletePosts from '../../../controllers/post/delete';

describe('deletePostMethod', () => {
  let mockPostCollection: any;
  let request: any;
  let h: any;
  const postId = 1;

  beforeAll(() => {
    mockPostCollection = {
      deletePostById: jest.fn(),
      getPost: jest.fn(),
    };
  });

  beforeEach(() => {
    request = {
      query: {},
      params: { id: postId },
      auth: { credentials: { id: postId, scope: 'USER' } },
    };
    h = {
      response: jest.fn().mockReturnThis(),
      code: jest.fn().mockReturnThis(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should delete a post successfully', async () => {
    mockPostCollection.getPost.mockResolvedValue({ id: postId, userId: postId });
    mockPostCollection.deletePostById.mockResolvedValue(true);
    const deletePostHandler = deletePosts({ postCollection: mockPostCollection });

    const response = await deletePostHandler(request, h);

    expect(h.code).toHaveBeenCalledWith(200);
    expect(h.response).toHaveBeenCalledWith({
      statusCode: 200,
      data: {
        message: 'Post deleted!',
      },
    });
    expect(response).toEqual(h);
    expect(mockPostCollection.deletePostById).toHaveBeenCalledWith({ id: postId });
  });

  it('should return an error if post is not found', async () => {
    mockPostCollection.getPost.mockReturnValue(null);
    const deletePostHandler = deletePosts({ postCollection: mockPostCollection });
    try {
      await deletePostHandler(request, h);
    } catch (error: any) {
      expect(error.output.statusCode).toBe(404);
      expect(error.message).toBe('Post not found');
      expect(mockPostCollection.deletePostById).not.toHaveBeenCalled();
    }
  });

  test('should not delete the post if the post is not authorized to delete', async () => {
    mockPostCollection.getPost.mockReturnValue({ id: 5 });
    const deletePostHandler = deletePosts({ postCollection: mockPostCollection });
    try {
      await deletePostHandler(request, h);
      expect(true).toBe(true);
    } catch (error: any) {
      expect(error.output.statusCode).toBe(401);
      expect(error.message).toBe('You are not authorized to delete this post');
      expect(mockPostCollection.deletePostById).not.toHaveBeenCalled();
    }
  });
});
