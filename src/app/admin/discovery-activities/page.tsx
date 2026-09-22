'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, X, ChevronDown, MoreVertical, Edit } from 'lucide-react';
import { useGetChallengeList } from '@/modules/admin/hooks/useChallengeAdmin';
import { Challenge } from '@/modules/admin/domain/challengeSchema';
import { useDebounce } from '@/hooks/useDebounce';
import { useRouter } from 'next/navigation';

export default function ChallengesPage() {
  const router = useRouter();
  const [searchKeyword, setSearchKeyword] = React.useState('');
  const [searchInput, setSearchInput] = React.useState('');
  const debouncedSearch = useDebounce(searchInput, 500);
  const [selectedType, setSelectedType] = React.useState('');
  const [selectedStatus, setSelectedStatus] = React.useState('');
  const [activeFilters, setActiveFilters] = React.useState<string[]>([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [perPage] = React.useState(10);

  // API hooks
  const {
    data: challengesResponse,
    isLoading,
    error,
  } = useGetChallengeList({
    search: debouncedSearch || undefined,
    status: selectedStatus || undefined,
    type: selectedType || undefined,
    page: currentPage,
    perPage: perPage,
  });

  const typeOptions = [
    { value: 'quiz', label: 'Quiz' },
    { value: 'ordering', label: 'Sắp xếp' },
    { value: 'fillBlank', label: 'Điền từ' },
    { value: 'puzzle', label: 'Puzzle' },
  ];

  const statusOptions = [
    { value: 'published', label: 'Đã xuất bản' },
    { value: 'draft', label: 'Bản nháp' },
  ];

  // Get challenges data from API response
  const challengesData = challengesResponse?.data || [];

  const handleTypeChange = (value: string) => {
    setSelectedType(value);
    setCurrentPage(1); // Reset to first page when changing filters
    if (value) {
      const filterText = `Loại: ${typeOptions.find(opt => opt.value === value)?.label}`;
      if (!activeFilters.includes(filterText)) {
        setActiveFilters(prev => [...prev, filterText]);
      }
    }
  };

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
    setCurrentPage(1); // Reset to first page when changing filters
    if (value) {
      const filterText = `Trạng thái: ${statusOptions.find(opt => opt.value === value)?.label}`;
      if (!activeFilters.includes(filterText)) {
        setActiveFilters(prev => [...prev, filterText]);
      }
    }
  };

  const handleSearch = (value: string) => {
    setSearchInput(value);
    setSearchKeyword(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Update search filter pill only when debounced value changes
  React.useEffect(() => {
    const filterText = `Từ khóa: ${debouncedSearch}`;
    setActiveFilters(prev => {
      const index = prev.findIndex(f => f.startsWith('Từ khóa: '));
      const next = [...prev];
      if (!debouncedSearch) {
        if (index !== -1) next.splice(index, 1);
        return next;
      }
      if (index !== -1) {
        next[index] = filterText;
        return next;
      }
      return [...prev, filterText];
    });
  }, [debouncedSearch]);

  const removeFilter = (filterToRemove: string) => {
    setActiveFilters(prev => prev.filter(filter => filter !== filterToRemove));

    // Reset corresponding dropdown
    if (filterToRemove.startsWith('Loại:')) {
      setSelectedType('');
    } else if (filterToRemove.startsWith('Trạng thái:')) {
      setSelectedStatus('');
    } else if (filterToRemove.startsWith('Từ khóa:')) {
      setSearchKeyword('');
      setSearchInput('');
    }
    setCurrentPage(1); // Reset to first page when removing filters
  };

  const clearAllFilters = () => {
    setActiveFilters([]);
    setSelectedType('');
    setSelectedStatus('');
    setSearchKeyword('');
    setSearchInput('');
    setCurrentPage(1);
  };

  // No need for client-side filtering since API handles it
  const filteredData = challengesData;

  const challengesColumns = [
    {
      key: 'title',
      label: 'Tên',
      render: (challenge: Challenge) => (
        <div className='min-w-0 flex-1 max-w-40'>
          <p className='text-sm font-medium text-gray-900 truncate'>
            {challenge.title}
          </p>
          <p className='text-sm text-gray-500 truncate'>
            {challenge.description}
          </p>
        </div>
      ),
    },
    {
      key: 'type',
      label: 'Loại',
      render: (challenge: Challenge) => (
        <span className='text-sm text-gray-900'>
          {typeOptions.find(opt => opt.value === challenge.type)?.label ||
            challenge.type}
        </span>
      ),
    },
    {
      key: 'questions',
      label: 'Câu hỏi',
      render: (challenge: Challenge) => {
        const count =
          challenge?.summary?.questionsCount ||
          challenge?.summary?.itemsCount ||
          0;
        return <span className='text-sm text-gray-900'>{count}</span>;
      },
    },
    {
      key: 'completions',
      label: 'Hoàn thành',
      render: (challenge: Challenge) => (
        <span className='text-sm text-gray-900'>
          {challenge.stats.totalCompletions}
        </span>
      ),
    },
    {
      key: 'created_at',
      label: 'Ngày tạo',
      render: (challenge: Challenge) => {
        const date = new Date(challenge.created_at);
        const formattedDate = date.toLocaleDateString('vi-VN');
        const formattedTime = date.toLocaleTimeString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit',
        });
        return (
          <div className='text-sm text-gray-900'>
            <div>{formattedDate}</div>
            <div className='text-gray-500'>{formattedTime}</div>
          </div>
        );
      },
    },
    {
      key: 'status',
      label: 'Trạng thái',
      render: (challenge: Challenge) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            challenge.status === 'published'
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {challenge.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: '',
      render: (challenge: Challenge) => (
        <div className='flex items-center space-x-1'>
          <Button
            variant='ghost'
            size='sm'
            className='h-8 w-8 p-0'
            onClick={() =>
              router.push(
                `/admin/discovery-activities/create-challenge?id=${challenge.id}`
              )
            }
          >
            <Edit className='h-4 w-4' />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className='p-6 space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>
            Danh sách thử thách
          </h1>
          {/* Breadcrumb */}
          <div className='flex items-center space-x-2 text-sm text-gray-600 mt-1'>
            <span>Bảng điều khiển</span>
            <span className='w-1 h-1 bg-gray-400 rounded-full'></span>
            <span>Thử thách</span>
            <span className='w-1 h-1 bg-gray-400 rounded-full'></span>
            <span className='text-gray-900'>Danh sách thử thách</span>
          </div>
        </div>
        <Button
          className='bg-gray-900 cursor-pointer hover:bg-gray-800'
          onClick={() => router.push('/admin/discovery-activities/create-challenge')}
        >
          <Plus className='w-4 h-4 mr-2' />
          Thêm mới
        </Button>
      </div>

      <div className='bg-white rounded-xl p-6 space-y-6'>
        {/* Filters */}
        <div className='bg-white rounded-lg p-4 space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            {/* Type Filter */}
            <div className='relative'>
              <select
                value={selectedType}
                onChange={e => handleTypeChange(e.target.value)}
                className='appearance-none w-full px-4 h-[54px] py-2 border border-[#919EAB52] rounded-[10px] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 cursor-pointer pr-10'
              >
                <option value=''>Loại</option>
                {typeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'>
                <ChevronDown className='w-4 h-4 text-gray-400' />
              </div>
            </div>

            {/* Status Filter */}
            <div className='relative'>
              <select
                value={selectedStatus}
                onChange={e => handleStatusChange(e.target.value)}
                className='appearance-none w-full px-4 h-[54px] py-2 border border-[#919EAB52] rounded-[10px] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 cursor-pointer pr-10'
              >
                <option value=''>Trạng thái</option>
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'>
                <ChevronDown className='w-4 h-4 text-gray-400' />
              </div>
            </div>

            {/* Search */}
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
              <Input
                placeholder='Tìm kiếm...'
                value={searchKeyword}
                onChange={e => handleSearch(e.target.value)}
                className='!pl-10 !h-[54px] !my-0'
              />
            </div>
          </div>

          {/* Results Count */}
          <div className='text-sm text-gray-600'>
            {challengesResponse?.total || 0} kết quả được tìm thấy
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
          <div className='flex items-center justify-center py-8'>
            <div className='text-gray-500'>Đang tải dữ liệu...</div>
          </div>
        ) : error ? (
          <div className='flex items-center justify-center py-8'>
            <div className='text-red-500'>Có lỗi xảy ra khi tải dữ liệu</div>
          </div>
        ) : (
          <div className='bg-white rounded-lg overflow-hidden'>
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead className='bg-gray-50'>
                  <tr>
                    {challengesColumns.map(column => (
                      <th
                        key={column.key}
                        className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                      >
                        {column.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {filteredData.map(challenge => (
                    <tr key={challenge.id} className='hover:bg-gray-50'>
                      {challengesColumns.map(column => (
                        <td
                          key={column.key}
                          className='px-6 py-4 whitespace-nowrap'
                        >
                          {column.render(challenge as Challenge)}
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
        {!isLoading && !error && (
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-2 text-sm text-gray-700'>
              <span>Hàng mỗi trang:</span>
              <select
                value={perPage}
                onChange={e => {
                  // Handle per page change if needed
                }}
                className='border border-gray-300 rounded px-2 py-1'
              >
                <option value='5'>5</option>
                <option value='10'>10</option>
                <option value='20'>20</option>
              </select>
            </div>
            <div className='flex items-center space-x-2 text-sm text-gray-700'>
              <span>
                {(currentPage - 1) * perPage + 1}-
                {Math.min(
                  currentPage * perPage,
                  challengesResponse?.total || 0
                )}{' '}
                của {challengesResponse?.total || 0}
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
                  disabled={
                    currentPage >= (challengesResponse?.totalPages || 1)
                  }
                  onClick={() => setCurrentPage(prev => prev + 1)}
                >
                  <ChevronDown className='w-4 h-4 -rotate-90' />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
