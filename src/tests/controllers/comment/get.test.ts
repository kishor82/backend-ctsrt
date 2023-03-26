import getComments from '../../../controllers/comment/get';

describe('getCommentMethod', () => {
  let mockCommentCollection: any;
  let request: any;
  let h: any;

  beforeAll(() => {
    mockCommentCollection = {
      getComment: jest.fn(),
      getAllComments: jest.fn(),
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

  describe('getComment', () => {
    it('should return the comment with the given ID', async () => {
      const mockComment = { id: 1, body: 'test comment', userId: 1, postId: 1 };
      mockCommentCollection.getComment.mockResolvedValue(mockComment);

      const result = await getComments({ commentCollection: mockCommentCollection })(request, h);

      expect(mockCommentCollection.getComment).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual(mockComment);
    });

    it('should throw an error if the ID is not a number', async () => {
      await expect(getComments(mockCommentCollection)(request, h)).rejects.toThrowError();
    });
  });

  describe('getAllComments', () => {
    it('should return all comments', async () => {
      const mockComments = [
        { id: 1, body: 'test comment 1', userId: 1, postId: 1 },
        { id: 2, body: 'test comment 2', userId: 2, postId: 1 },
        { id: 3, body: 'test comment 3', userId: 3, postId: 2 },
      ];

      request = {
        params: {},
        query: {},
        auth: { credentials: { id: 1 } },
      };
      mockCommentCollection.getAllComments.mockResolvedValue(mockComments);

      const result = await getComments({ commentCollection: mockCommentCollection })(request, h);

      expect(mockCommentCollection.getAllComments).toHaveBeenCalledWith({ keyword: undefined, pageNumber: undefined, pageSize: undefined });
      expect(result).toEqual(mockComments);
    });

    it('should return comments matching the given keyword', async () => {
      const mockComments = [
        { id: 1, body: 'test comment 1', userId: 1, postId: 1 },
        { id: 2, body: 'test comment 2', userId: 2, postId: 1 },
      ];
      const pageNumber = 1;
      const pageSize = 5;
      request = { params: {}, query: { keyword: 'test', pageNumber, pageSize }, auth: { credentials: { id: 1 } } };

      mockCommentCollection.getAllComments.mockResolvedValue([
        {
          metadata: [
            {
              total: 2,
              pageNumber,
              pageSize,
            },
          ],
          data: mockComments,
        },
      ]);

      const result: any = await getComments({ commentCollection: mockCommentCollection })(request, h);

      expect(mockCommentCollection.getAllComments).toHaveBeenCalledWith({ keyword: 'test', pageNumber, pageSize });
      expect(result[0].data).toEqual(mockComments);
    });

    it('should throw an error if getAllComments() throws an error', async () => {
      const mockError = new Error('Error getting comments.');
      request = {
        params: {},
        query: { pageNumber: 2, pageSize: 10, keyword: 'test' },
        auth: { credentials: { id: 1 } },
      };
      mockCommentCollection.getAllComments.mockRejectedValue(mockError);

      await expect(getComments({ commentCollection: mockCommentCollection })(request, h)).rejects.toThrow(mockError);
      expect(mockCommentCollection.getAllComments).toHaveBeenCalledWith({
        keyword: 'test',
        pageNumber: 2,
        pageSize: 10,
      });
    });
  });
});
