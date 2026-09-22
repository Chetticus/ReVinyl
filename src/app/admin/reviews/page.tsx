'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, X, ChevronDown, Star } from 'lucide-react';
import { useGetReviewList } from '@/modules/admin/hooks/useReviewAdmin';
import { useDebounce } from '@/hooks/useDebounce';
import { Review } from '@/modules/admin/domain/reviewSchema';

export default function ReviewsPage() {
  const [searchInput, setSearchInput] = React.useState('');
  const [selectedRating, setSelectedRating] = React.useState('');
  const [selectedStatus, setSelectedStatus] = React.useState('');
  const [activeFilters, setActiveFilters] = React.useState<string[]>([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(10);

  const debouncedSearch = useDebounce(searchInput, 500);

  const {
    data: reviewsResponse,
    isLoading,
    error,
  } = useGetReviewList({
    page: currentPage,
    limit: perPage,
    search: debouncedSearch || undefined,
    rating: selectedRating ? Number(selectedRating) : undefined,
    status: selectedStatus ? selectedStatus === 'approved' : undefined,
    sort_by: 'created_at',
    sort_order: 'desc',
  });

  const reviewsData = reviewsResponse?.data?.data || [];
  const total = reviewsResponse?.data?.pagination?.total || 0;
  const totalPages = reviewsResponse?.data?.pagination?.pages || 0;

  const ratingOptions = [
    { value: '5', label: '5 sao' },
    { value: '4', label: '4 sao' },
    { value: '3', label: '3 sao' },
    { value: '2', label: '2 sao' },
    { value: '1', label: '1 sao' },
  ];

  const statusOptions = [
    { value: 'approved', label: 'Đã duyệt' },
    { value: 'rejected', label: 'Từ chối' },
  ];

  const handleRatingChange = (value: string) => {
    setSelectedRating(value);
    setCurrentPage(1);
    if (value) {
      const filterText = `Đánh giá: ${ratingOptions.find(opt => opt.value === value)?.label}`;
      if (!activeFilters.includes(filterText)) {
        setActiveFilters(prev => [...prev, filterText]);
      }
    }
  };

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
    setCurrentPage(1);
    if (value) {
      const filterText = `Trạng thái: ${statusOptions.find(opt => opt.value === value)?.label}`;
      if (!activeFilters.includes(filterText)) {
        setActiveFilters(prev => [...prev, filterText]);
      }
    }
  };

  const handleSearch = (value: string) => {
    setSearchInput(value);
    setCurrentPage(1);
  };

  const removeFilter = (filterToRemove: string) => {
    setActiveFilters(prev => prev.filter(filter => filter !== filterToRemove));

    if (filterToRemove.startsWith('Trạng thái:')) {
      setSelectedStatus('');
    } else if (filterToRemove.startsWith('Đánh giá:')) {
      setSelectedRating('');
    } else if (filterToRemove.startsWith('Từ khóa:')) {
      setSearchInput('');
    }
  };

  const clearAllFilters = () => {
    setActiveFilters([]);
    setSelectedRating('');
    setSelectedStatus('');
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

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className='w-4 h-4 fill-yellow-400 text-yellow-400' />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <div key='half' className='relative'>
          <Star className='w-4 h-4 text-gray-300' />
          <Star className='w-4 h-4 fill-yellow-400 text-yellow-400 absolute inset-0 clip-path-half' />
        </div>
      );
    }

    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className='w-4 h-4 text-gray-300' />);
    }

    return <div className='flex space-x-1'>{stars}</div>;
  };

  const reviewsColumns = React.useMemo(
    () => [
      {
        key: 'user',
        label: 'Khách hàng',
        render: (review: Review) => (
          <div className='flex items-center space-x-3'>
            <div className='w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center'>
              {review.user.avatar ? (
                <img
                  src={review.user.avatar}
                  alt={review.user.fullName}
                  className='w-10 h-10 rounded-full object-cover'
                />
              ) : (
                <span className='text-sm font-medium text-gray-600'>
                  {review.user.fullName?.charAt(0) || 'U'}
                </span>
              )}
            </div>
            <div>
              <p className='text-sm font-medium text-gray-900'>
                {review.user.fullName}
              </p>
              <p className='text-xs text-gray-500'>{review.user.email}</p>
            </div>
          </div>
        ),
      },
      {
        key: 'product',
        label: 'Chuyên đề',
        render: (review: Review) => (
          <div className='min-w-0 flex-1'>
            <p className='text-sm font-medium text-gray-900 truncate'>
              {review.product.title}
            </p>
            <p className='text-sm text-gray-500 truncate'>
              {review.product.slug}
            </p>
          </div>
        ),
      },
      {
        key: 'comment',
        label: 'Nội dung',
        render: (review: Review) => (
          <span className='text-sm text-gray-900'>{review.comment}</span>
        ),
      },
      {
        key: 'rating',
        label: 'Đánh giá',
        render: (review: Review) => (
          <div className='flex items-center space-x-2'>
            {renderStars(review.rating)}
            <span className='text-sm text-gray-900'>{review.rating}</span>
          </div>
        ),
      },
      {
        key: 'created_at',
        label: 'Ngày tạo',
        render: (review: Review) => (
          <span className='text-sm text-gray-900'>
            {new Date(review.created_at).toLocaleDateString('vi-VN', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        ),
      },
      {
        key: 'status',
        label: 'Trạng thái',
        render: (review: Review) => (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              review.status
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {review.status ? 'Đã duyệt' : 'Từ chối'}
          </span>
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
          <h1 className='text-2xl font-bold text-gray-900'>
            Danh sách đánh giá
          </h1>
          {/* Breadcrumb */}
          <div className='flex items-center space-x-2 text-sm text-gray-600 mt-1'>
            <span>Bảng điều khiển</span>
            <span className='w-1 h-1 bg-gray-400 rounded-full'></span>
            <span className='text-gray-900'>Đánh giá</span>
          </div>
        </div>
      </div>

      <div className='bg-white rounded-xl p-6 space-y-6'>
        {/* Filters */}
        <div className='bg-white rounded-lg p-4 space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            {/* Rating Filter */}
            <div className='relative'>
              <select
                value={selectedRating}
                onChange={e => handleRatingChange(e.target.value)}
                className='appearance-none w-full px-4 h-[54px] py-2 border border-[#919EAB52] rounded-[10px] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 cursor-pointer pr-10'
              >
                <option value=''>Đánh giá</option>
                {ratingOptions.map(option => (
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
                value={searchInput}
                onChange={e => handleSearch(e.target.value)}
                className='!pl-10 !h-[54px] !my-0'
              />
            </div>
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
          <div className='bg-white rounded-lg overflow-hidden'>
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead className='bg-gray-50'>
                  <tr>
                    {reviewsColumns.map(column => (
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
                  {reviewsData.map(review => (
                    <tr key={review.id} className='hover:bg-gray-50'>
                      {reviewsColumns.map(column => (
                        <td
                          key={column.key}
                          className='px-6 py-4 whitespace-nowrap'
                        >
                          {column.render(review)}
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
