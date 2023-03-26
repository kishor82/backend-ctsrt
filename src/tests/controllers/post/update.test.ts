import updatePosts from '../../../controllers/post/update';

describe('updatePostMethod', () => {
  let mockPostCollection: any;
  let request: any;
  let h: any;
  const mockPost = {
    id: 1,
    userId: 1,
    title: 'this is post title',
    body: 'Mock post body',
  };
  const postId = 1;

  beforeAll(() => {
    mockPostCollection = {
      updatePostById: jest.fn(),
      getPost: jest.fn(),
    };
  });

  beforeEach(() => {
    request = {
      query: {},
      params: { id: postId },
      payload: {
        title: 'title',
        body: 'Updated post body',
      },
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

  it('should update a post successfully', async () => {
    mockPostCollection.getPost.mockResolvedValue(mockPost);
    mockPostCollection.updatePostById.mockResolvedValue(true);
    const updatePostHandler = updatePosts({ postCollection: mockPostCollection });

    const response = await updatePostHandler(request, h);

    expect(h.code).toHaveBeenCalledWith(201);
    expect(h.response).toHaveBeenCalledWith({
      statusCode: 201,
      data: {
        message: 'Post updated!',
      },
    });
    expect(response).toEqual(h);
    expect(mockPostCollection.updatePostById).toHaveBeenCalledWith({ id: postId, dataToUpdate: { title: 'title', body: 'Updated post body' } });
  });

  it('should return an error if post is not found', async () => {
    mockPostCollection.getPost.mockReturnValue(null);
    const updatePostHandler = updatePosts({ postCollection: mockPostCollection });
    try {
      await updatePostHandler(request, h);
    } catch (error: any) {
      expect(error.output.statusCode).toBe(404);
      expect(error.message).toBe('Post not found');
      expect(mockPostCollection.updatePostById).not.toHaveBeenCalled();
    }
  });

  test('should not update the post if the user is not authorized to update', async () => {
    mockPostCollection.getPost.mockReturnValue({ id: 5 });
    const updatePostHandler = updatePosts({ postCollection: mockPostCollection });
    try {
      await updatePostHandler(request, h);
      expect(true).toBe(true);
    } catch (error: any) {
      expect(error.output.statusCode).toBe(401);
      expect(error.message).toBe('You are not authorized to update this post');
      expect(mockPostCollection.updatePostById).not.toHaveBeenCalled();
    }
  });
});
