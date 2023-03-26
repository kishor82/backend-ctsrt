import getPosts from '../../../controllers/post/get';

describe('getPostMethod', () => {
  let mockPostCollection: any;
  let request: any;
  let h: any;

  beforeAll(() => {
    mockPostCollection = {
      getPost: jest.fn(),
      getAllPosts: jest.fn(),
    };
  });

  beforeEach(() => {
    request = {
      params: {
        id: 1,
      },
      query: {},
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

  describe('getPost', () => {
    it('should return the post with the given ID', async () => {
      const mockpost = { id: 1, body: 'test post', userId: 1, postId: 1 };
      mockPostCollection.getPost.mockResolvedValue(mockpost);

      const result = await getPosts({ postCollection: mockPostCollection })(request, h);

      expect(mockPostCollection.getPost).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual(mockpost);
    });

    it('should throw an error if the ID is not a number', async () => {
      await expect(getPosts(mockPostCollection)(request, h)).rejects.toThrowError();
    });
  });

  describe('getAllPosts', () => {
    it('should return all posts', async () => {
      const mockposts = [
        { id: 1, body: 'test post 1', userId: 1, titile: 'title-1' },
        { id: 2, body: 'test post 2', userId: 2, titile: 'title-2' },
        { id: 3, body: 'test post 3', userId: 3, titile: 'title-3' },
      ];

      request = {
        params: {},
        query: {},
        auth: { credentials: { id: 1 } },
      };
      mockPostCollection.getAllPosts.mockResolvedValue(mockposts);

      const result = await getPosts({ postCollection: mockPostCollection })(request, h);

      expect(mockPostCollection.getAllPosts).toHaveBeenCalledWith({ keyword: undefined, pageNumber: undefined, pageSize: undefined });
      expect(result).toEqual(mockposts);
    });

    it('should return posts matching the given keyword', async () => {
      const mockposts = [
        { id: 1, body: 'test post 1', userId: 1, titile: 'title-1' },
        { id: 2, body: 'test post 2', userId: 2, titile: 'title-2' },
      ];
      const pageNumber = 1;
      const pageSize = 5;
      request = { params: {}, query: { keyword: 'test', pageNumber, pageSize }, auth: { credentials: { id: 1 } } };

      mockPostCollection.getAllPosts.mockResolvedValue([
        {
          metadata: [
            {
              total: 2,
              pageNumber,
              pageSize,
            },
          ],
          data: mockposts,
        },
      ]);

      const result: any = await getPosts({ postCollection: mockPostCollection })(request, h);

      expect(mockPostCollection.getAllPosts).toHaveBeenCalledWith({ keyword: 'test', pageNumber, pageSize });
      expect(result[0].data).toEqual(mockposts);
    });

    it('should throw an error if getAllPosts() throws an error', async () => {
      const mockError = new Error('Error getting posts.');
      request = {
        params: {},
        query: { pageNumber: 2, pageSize: 10, keyword: 'test' },
        auth: { credentials: { id: 1 } },
      };
      mockPostCollection.getAllPosts.mockRejectedValue(mockError);

      await expect(getPosts({ postCollection: mockPostCollection })(request, h)).rejects.toThrow(mockError);
      expect(mockPostCollection.getAllPosts).toHaveBeenCalledWith({
        keyword: 'test',
        pageNumber: 2,
        pageSize: 10,
      });
    });
  });
});
