'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Search, X, ChevronDown } from 'lucide-react';
import { useGetChallengeScoreList } from '@/modules/admin/hooks/useChallengeScoreAdmin';
import { useDebounce } from '@/hooks/useDebounce';
import { ChallengeScore } from '@/modules/admin/domain/challengeScoreSchema';

export default function ChallengeScoresPage() {
  const [searchInput, setSearchInput] = React.useState('');
  const [activeFilters, setActiveFilters] = React.useState<string[]>([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(10);

  const debouncedSearch = useDebounce(searchInput, 500);

  const {
    data: scoresResponse,
    isLoading,
    error,
  } = useGetChallengeScoreList({
    page: currentPage,
    limit: perPage,
    search: debouncedSearch || undefined,
  });

  const scoresData = scoresResponse?.data?.data || [];
  const total = scoresResponse?.data?.pagination?.total || 0;
  const totalPages = scoresResponse?.data?.pagination?.pages || 0;

  const handleSearch = (value: string) => {
    setSearchInput(value);
    setCurrentPage(1);
  };

  const removeFilter = (filterToRemove: string) => {
    setActiveFilters(prev => prev.filter(filter => filter !== filterToRemove));

    if (filterToRemove.startsWith('Từ khóa:')) {
      setSearchInput('');
    }
  };

  const clearAllFilters = () => {
    setActiveFilters([]);
    setSearchInput('');
    setCurrentPage(1);
  };

  // Reflect debounced search into filter pills
  React.useEffect(() => {
    setActiveFilters(prev => {
      const next = prev.filter(f => !f.startsWith('Từ khóa:'));
      if (debouncedSearch) return [...next, `Từ khóa: ${debouncedSearch}`];
      return next;
    });
  }, [debouncedSearch]);

  const scoresColumns = React.useMemo(
    () => [
      {
        key: 'name',
        label: 'Tên',
        align: 'left' as const,
        render: (score: ChallengeScore) => (
          <div className='flex items-center space-x-3'>
            <div className='w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center'>
              {score.avatar ? (
                <img
                  src={score.avatar}
                  alt={score.name}
                  className='w-10 h-10 rounded-full object-cover'
                />
              ) : (
                <span className='text-sm font-medium text-gray-600'>
                  {score.name?.charAt(0) || 'U'}
                </span>
              )}
            </div>
            <div className='min-w-0 flex-1'>
              <p className='text-sm font-medium text-gray-900 truncate'>
                {score.name}
              </p>
              <p className='text-sm text-gray-500 truncate'>{score.email}</p>
            </div>
          </div>
        ),
      },
      {
        key: 'totalScore',
        label: 'Điểm',
        align: 'right' as const,
        render: (score: ChallengeScore) => (
          <span className='text-sm text-gray-900'>{score.scores.total}</span>
        ),
      },
      {
        key: 'questions',
        label: 'Câu hỏi',
        align: 'right' as const,
        render: (score: ChallengeScore) => (
          <span className='text-sm text-gray-900'>
            {score.completedChallenges}
          </span>
        ),
      },
      {
        key: 'sort',
        label: 'Sắp xếp',
        align: 'right' as const,
        render: (score: ChallengeScore) => (
          <span className='text-sm text-gray-900'>{score.scores.ordering}</span>
        ),
      },
      {
        key: 'matching',
        label: 'Ghép hình',
        align: 'right' as const,
        render: (score: ChallengeScore) => (
          <span className='text-sm text-gray-900'>{score.scores.puzzle}</span>
        ),
      },
      {
        key: 'fillBlank',
        label: 'Điền từ',
        align: 'right' as const,
        render: (score: ChallengeScore) => (
          <span className='text-sm text-gray-900'>
            {score.scores.fillBlank}
          </span>
        ),
      },
      {
        key: 'rank',
        label: 'Hạng',
        align: 'right' as const,
        render: (score: ChallengeScore) => (
          <span className='text-sm text-gray-900'>{score.rank}</span>
        ),
      },
    ],
    []
  );

  return (
    <div className='p-6 space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>Danh sách điểm</h1>
          {/* Breadcrumb */}
          <div className='flex items-center space-x-2 text-sm text-gray-600 mt-1'>
            <span>Bảng điều khiển</span>
            <span className='w-1 h-1 bg-gray-400 rounded-full'></span>
            <span>Thử thách</span>
            <span className='w-1 h-1 bg-gray-400 rounded-full'></span>
            <span className='text-gray-900'>Danh sách điểm</span>
          </div>
        </div>
      </div>

      {/* Main Content Card */}
      <div className='bg-white rounded-xl p-6 space-y-6'>
        {/* Search Section */}
        <div className='space-y-4'>
          {/* Search Bar */}
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
            <Input
              placeholder='Tìm kiếm...'
              value={searchInput}
              onChange={e => handleSearch(e.target.value)}
              className='!pl-10 !h-[54px] !my-0'
            />
          </div>

          {/* Results Count */}
          <div className='text-sm text-gray-600'>
            {total} kết quả được tìm thấy
          </div>

          {/* Active Filters */}
          {activeFilters.length > 0 && (
            <div className='flex items-center flex-wrap gap-2'>
              {activeFilters.map(filter => (
                <div
                  key={filter}
                  className='inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700'
                >
                  <span>{filter}</span>
                  <button
                    onClick={() => removeFilter(filter)}
                    className='ml-2 text-gray-400 hover:text-gray-600'
                  >
                    <X className='w-3 h-3' />
                  </button>
                </div>
              ))}
              <button
                onClick={clearAllFilters}
                className='inline-flex items-center px-3 py-1 rounded-full text-sm text-red-600 hover:bg-red-50'
              >
                <X className='w-3 h-3 mr-1' />
                Xóa
              </button>
            </div>
          )}
        </div>

        {/* Data Table */}
        {isLoading ? (
          <div className='text-center py-8'>
            <div className='text-gray-500'>Đang tải...</div>
          </div>
        ) : error ? (
          <div className='text-center py-8'>
            <div className='text-red-500'>Có lỗi xảy ra khi tải dữ liệu</div>
          </div>
        ) : (
          <div className='overflow-hidden'>
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead className='bg-gray-50'>
                  <tr>
                    {scoresColumns.map(column => (
                      <th
                        key={column.key}
                        className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${
                          column.align === 'right' ? 'text-right' : 'text-left'
                        }`}
                      >
                        {column.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {scoresData.map(score => (
                    <tr key={score.id} className='hover:bg-gray-50'>
                      {scoresColumns.map(column => (
                        <td
                          key={column.key}
                          className={`px-6 py-4 whitespace-nowrap ${
                            column.align === 'right'
                              ? 'text-right'
                              : 'text-left'
                          }`}
                        >
                          {column.render(score)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-2 text-sm text-gray-700'>
            <span>Hàng mỗi trang:</span>
            <select
              className='border border-gray-300 rounded px-2 py-1'
              value={perPage}
              onChange={e => {
                setPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value='5'>5</option>
              <option value='10'>10</option>
              <option value='20'>20</option>
            </select>
          </div>
          <div className='flex items-center space-x-2 text-sm text-gray-700'>
            <span>
              {(currentPage - 1) * perPage + 1}-
              {Math.min(currentPage * perPage, total)} của {total}
            </span>
            <div className='flex space-x-1'>
              <button
                className='p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50'
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              >
                <ChevronDown className='w-4 h-4 rotate-90' />
              </button>
              <button
                className='p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50'
                disabled={currentPage >= totalPages}
                onClick={() =>
                  setCurrentPage(prev => Math.min(totalPages, prev + 1))
                }
              >
                <ChevronDown className='w-4 h-4 -rotate-90' />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
