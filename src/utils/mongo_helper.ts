export const getPointerBasedPagination = (pageNumber = 1, pageSize = 10) => {
  return [
    {
      $setWindowFields: {
        output: {
          totalCount: {
            $count: {},
          },
        },
      },
    },
    {
      $skip: (pageNumber - 1) * pageSize,
    },
    {
      $limit: pageSize,
    },
  ];
};

export const getFacetPagination = (pageNumber = 1, pageSize = 10) => {
  return {
    $facet: {
      metadata: [{ $count: 'total' }, { $addFields: { pageNumber: Number(pageNumber), pageSize: Number(pageSize) } }],
      data: [{ $skip: (pageNumber - 1) * pageSize }, { $limit: pageSize }],
    },
  };
};

export const getSearchQuery = ({ keyword }: { keyword: string }) => [
  {
    $match: {
      $text: { $search: `/${keyword}/i` },
    },
  },
  {
    $sort: { score: { $meta: 'textScore' } },
  },
];
