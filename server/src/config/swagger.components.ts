export const swaggerComponents = {
  schemas: {
    PullRequestResponse: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              repo: { type: 'string' },
              pullRequests: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'integer' },
                    repo: { type: 'string' },
                    number: { type: 'integer' },
                    title: { type: 'string' },
                    author: {
                      type: 'object',
                      nullable: true,
                      properties: {
                        id: { type: 'integer' },
                        username: { type: 'string' },
                        avatarUrl: { type: 'string' }
                      }
                    },
                    url: { type: 'string' },
                    state: { type: 'string', enum: ['open', 'closed', 'all'] },
                    created_at: { type: 'string' },
                    updated_at: { type: 'string' },
                    closed_at: { type: 'string', nullable: true },
                    merged_at: { type: 'string', nullable: true },
                    requested_reviewers: {
                      type: 'array',
                      items: {
                        type: 'object',
                        nullable: true,
                        properties: {
                          id: { type: 'integer' },
                          username: { type: 'string' },
                          avatarUrl: { type: 'string' }
                        }
                      }
                    },
                    last_review: {
                      type: 'object',
                      nullable: true,
                      properties: {
                        id: { type: 'integer' },
                        reviewer: {
                          type: 'object',
                          nullable: true,
                          properties: {
                            id: { type: 'integer' },
                            username: { type: 'string' },
                            avatarUrl: { type: 'string' }
                          }
                        },
                        body: { type: 'string', nullable: true },
                        state: { type: 'string', enum: ['APPROVED', 'CHANGES_REQUESTED', 'COMMENTED', 'PENDING', 'DISMISSED'] },
                        url: { type: 'string' },
                        pull_request_number: { type: 'integer' },
                        submitted_at: { type: 'string', nullable: true },
                        commit_id: { type: 'string' }
                      }
                    }
                  },
                  required: ['id', 'repo', 'number', 'title', 'url', 'state', 'created_at', 'updated_at']
                }
              }
            },
            required: ['repo', 'pullRequests']
          }
        },
        pagination: {
          type: 'object',
          properties: {
            page: { type: 'integer' },
            per_page: { type: 'integer' },
            total_pages: { type: 'integer' },
            total_records: { type: 'integer' }
          },
          required: ['page', 'per_page', 'total_pages', 'total_records']
        },
        filters: {
          type: 'object',
          properties: {
            state: { type: 'string', enum: ['open', 'closed', 'all'] },
            username: { type: 'string' }
          },
          required: ['state', 'username']
        },
        sort: {
          type: 'object',
          properties: {
            sort_by: { type: 'string' },
            dir: { type: 'string' }
          },
          required: ['sort_by', 'dir']
        },
        rate_limit: { type: 'object' }
      },
      required: ['success', 'data', 'pagination', 'filters']
    },

    RepoPRResponse: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'integer' },
              repo: { type: 'string' },
              number: { type: 'integer' },
              title: { type: 'string' },
              author: {
                type: 'object',
                nullable: true,
                properties: {
                  id: { type: 'integer' },
                  username: { type: 'string' },
                  avatarUrl: { type: 'string' }
                }
              },
              url: { type: 'string' },
              state: { type: 'string', enum: ['open', 'closed', 'all'] },
              created_at: { type: 'string' },
              updated_at: { type: 'string' },
              closed_at: { type: 'string', nullable: true },
              merged_at: { type: 'string', nullable: true },
              requested_reviewers: {
                type: 'array',
                items: {
                  type: 'object',
                  nullable: true,
                  properties: {
                    id: { type: 'integer' },
                    username: { type: 'string' },
                    avatarUrl: { type: 'string' }
                  }
                }
              },
              last_review: {
                type: 'object',
                nullable: true,
                properties: {
                  id: { type: 'integer' },
                  reviewer: {
                    type: 'object',
                    nullable: true,
                    properties: {
                      id: { type: 'integer' },
                      username: { type: 'string' },
                      avatarUrl: { type: 'string' }
                    }
                  },
                  body: { type: 'string', nullable: true },
                  state: { type: 'string', enum: ['APPROVED', 'CHANGES_REQUESTED', 'COMMENTED', 'PENDING', 'DISMISSED'] },
                  url: { type: 'string' },
                  pull_request_number: { type: 'integer' },
                  submitted_at: { type: 'string', nullable: true },
                  commit_id: { type: 'string' }
                }
              }
            },
            required: ['id', 'repo', 'number', 'title', 'url', 'state', 'created_at', 'updated_at']
          }
        },
        pagination: {
          type: 'object',
          properties: {
            page: { type: 'integer' },
            per_page: { type: 'integer' },
            total_pages: { type: 'integer' },
            total_records: { type: 'integer' }
          },
          required: ['page', 'per_page', 'total_pages', 'total_records']
        },
        filters: {
          type: 'object',
          properties: {
            state: { type: 'string', enum: ['open', 'closed', 'all'] },
            username: { type: 'string' },
            repo: { type: 'string' }
          },
          required: ['state', 'username', 'repo']
        },
        sort: {
          type: 'object',
          properties: {
            sort_by: { type: 'string' },
            dir: { type: 'string' }
          },
          required: ['sort_by', 'dir']
        },
        rate_limit: { type: 'object' }
      },
      required: ['success', 'data', 'pagination', 'filters']
    },

    UserRepositoriesResponse: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        data: { type: 'array', items: { type: 'object' } },
        pagination: { type: 'object' },
        filters: { type: 'object' },
        sort: { type: 'object' },
        rate_limit: { type: 'object' }
      },
      required: ['success', 'data', 'pagination', 'filters']
    },

    PRReviewResponse: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        data: {
          type: 'object',
          properties: {
            repo: { type: 'string' },
            pull_request_number: { type: 'integer' },
            reviews: { type: 'array', items: { type: 'object' } }
          }
        },
        pagination: { type: 'object' },
        filters: { type: 'object' },
        rate_limit: { type: 'object' }
      },
      required: ['success', 'data']
    },

    RepoReviewResponse: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        data: {
          type: 'object',
          properties: {
            repo: { type: 'string' },
            reviews: { type: 'array', items: { type: 'object' } }
          }
        },
        pagination: { type: 'object' },
        filters: { type: 'object' },
        statistics: { type: 'object' },
        failed_operations: { type: 'array', items: { type: 'object' } },
        rate_limit: { type: 'object' }
      },
      required: ['success', 'data']
    },

    UserReviewResponse: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        data: { type: 'array', items: { type: 'object' } },
        pagination: { type: 'object' },
        filters: { type: 'object' },
        statistics: { type: 'object' },
        failed_operations: { type: 'array', items: { type: 'object' } },
        rate_limit: { type: 'object' }
      },
      required: ['success', 'data']
    },

    ReviewerReviewsResponse: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        data: {
          type: 'object',
          properties: {
            reviewer: { type: 'string' },
            reviews: { type: 'array', items: { type: 'object' } }
          }
        },
        pagination: { type: 'object' },
        filters: { type: 'object' },
        statistics: { type: 'object' },
        failed_operations: { type: 'array', items: { type: 'object' } },
        rate_limit: { type: 'object' }
      },
      required: ['success', 'data']
    },

    ReviewStatsResponse: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        data: {
          type: 'object',
          properties: {
            username: { type: 'string' },
            repo: { type: 'string', nullable: true },
            statistics: { type: 'object' },
            operation_stats: { type: 'object' },
            failed_operations: { type: 'array', items: { type: 'object' } }
          }
        },
        rate_limit: { type: 'object' }
      },
      required: ['success', 'data']
    }
  }
};