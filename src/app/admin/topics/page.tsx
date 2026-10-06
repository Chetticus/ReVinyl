'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DeleteConfirmationModal } from '@/components/admin/DeleteConfirmationModal';
import { Plus, Search, X, ChevronDown, MoreVertical } from 'lucide-react';
import {
  useGetProductList,
  useDeleteProduct,
} from '@/modules/admin/hooks/useProductAdmin';
import { AdminProduct } from '@/modules/admin/domain/types';
import { useCategoryHome } from '@/modules/courses/hooks/useCategory';

export default function CoursesPage() {
  const router = useRouter();
  const [searchKeyword, setSearchKeyword] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('');
  const [selectedStatus, setSelectedStatus] = React.useState<
    'published' | 'draft' | 'archived' | ''
  >('');
  const [activeFilters, setActiveFilters] = React.useState<string[]>([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(10);

  // Delete confirmation modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [productToDelete, setProductToDelete] =
    React.useState<AdminProduct | null>(null);

  // API hooks
  const {
    data: productsResponse,
    isLoading,
    error,
    refetch,
  } = useGetProductList({
    category_id: selectedCategory || undefined,
    status: selectedStatus || undefined,
    search: searchKeyword || undefined,
    page: Number(currentPage) || 1,
    limit: perPage,
  });

  const deleteProductMutation = useDeleteProduct();
  const { getListCategory: categoriesData } = useCategoryHome();

  // Get products data from API response
  const productsData = productsResponse?.data || [];

  const categoryOptions = React.useMemo(() => {
    if (categoriesData.data && Array.isArray(categoriesData.data)) {
      return categoriesData.data.map((category: any) => ({
        value: category.id,
        label: category.title,
      }));
    }
    return [
      { value: 'vietnam-history', label: 'Lịch sử Việt Nam' },
      { value: 'world-history', label: 'Lịch sử thế giới' },
      { value: 'ancient-history', label: 'Lịch sử cổ đại' },
    ];
  }, [categoriesData.data]);

  const statusOptions = [
    { value: 'published', label: 'Đã xuất bản' },
    { value: 'draft', label: 'Bản nháp' },
    { value: 'archived', label: 'Đã lưu trữ' },
  ];

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setCurrentPage(1);

    // Remove existing category filter
    setActiveFilters(prev =>
      prev.filter(filter => !filter.startsWith('Danh mục:'))
    );

    if (value) {
      const filterText = `Danh mục: ${categoryOptions.find(opt => opt.value === value)?.label}`;
      setActiveFilters(prev => [...prev, filterText]);
    }
  };

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value as 'published' | 'draft' | 'archived' | '');
    setCurrentPage(1); // Reset to first page

    // Remove existing status filter
    setActiveFilters(prev =>
      prev.filter(filter => !filter.startsWith('Trạng thái:'))
    );

    if (value) {
      const filterText = `Trạng thái: ${statusOptions.find(opt => opt.value === value)?.label}`;
      setActiveFilters(prev => [...prev, filterText]);
    }
  };

  const handleSearch = (value: string) => {
    setSearchKeyword(value);
    setCurrentPage(1);
  };

  const removeFilter = (filterToRemove: string) => {
    setActiveFilters(prev => prev.filter(filter => filter !== filterToRemove));

    // Reset corresponding dropdown
    if (filterToRemove.startsWith('Danh mục:')) {
      setSelectedCategory('');
    } else if (filterToRemove.startsWith('Trạng thái:')) {
      setSelectedStatus('');
    }
  };

  const clearAllFilters = () => {
    setActiveFilters([]);
    setSelectedCategory('');
    setSelectedStatus('');
    setSearchKeyword('');
    setCurrentPage(1);
  };

  // Product action handlers
  const handleDeleteClick = (product: AdminProduct) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (productToDelete) {
      deleteProductMutation.mutate(productToDelete.id, {
        onSuccess: () => {
          refetch();
          setIsDeleteModalOpen(false);
          setProductToDelete(null);
        },
        onError: error => {
          console.error('Delete failed:', error);
          setIsDeleteModalOpen(false);
          setProductToDelete(null);
        },
      });
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setProductToDelete(null);
  };

  const handleEdit = (product: AdminProduct) => {
    router.push(`/admin/topics/edit/${product.id}`);
  };

  // No need for client-side filtering as it's handled by API
  const filteredData = productsData;

  const coursesColumns = [
    {
      key: 'course',
      label: 'Chuyên đề',
      render: (product: AdminProduct) => (
        <div className='flex items-center space-x-3'>
          <div className='w-12 h-12 rounded-lg flex-shrink-0 overflow-hidden'>
            {product.thumbnail ? (
              <img
                src={product.thumbnail}
                alt={product.title}
                className='w-full h-full object-cover'
              />
            ) : (
              <div className='w-full h-full bg-gradient-to-br from-orange-400 to-red-500'></div>
            )}
          </div>
          <div className='min-w-0 flex-1'>
            <p
              className='text-sm font-medium text-gray-900 truncate max-w-[120px] sm:max-w-[180px] md:max-w-[220px] lg:max-w-[280px] xl:max-w-[320px]'
              title={product.title}
            >
              {product.title}
            </p>
            <p
              className='text-sm text-gray-500 truncate max-w-[120px] sm:max-w-[180px] md:max-w-[220px] lg:max-w-[280px] xl:max-w-[320px]'
              title={product.short_description}
            >
              {product.short_description}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'lessons',
      label: 'Chuyên đề',
      render: (product: AdminProduct) => {
        const totalLessons = product.stats?.totalLessons || 0;
        return <span className='text-sm text-gray-900'>{totalLessons}</span>;
      },
    },
    {
      key: 'quizzes',
      label: 'Bài KT',
      render: (product: AdminProduct) => {
        const quizCount = product.stats?.lessonsByType?.quiz || 0;
        return <span className='text-sm text-gray-900'>{quizCount}</span>;
      },
    },
    {
      key: 'exercises',
      label: 'Bài tập',
      render: (product: AdminProduct) => {
        const contentCount = product.stats?.lessonsByType?.content || 0;
        const videoCount = product.stats?.lessonsByType?.video || 0;
        const exerciseCount = contentCount + videoCount;
        return <span className='text-sm text-gray-900'>{exerciseCount}</span>;
      },
    },
    {
      key: 'createdAt',
      label: 'Ngày tạo',
      render: (product: AdminProduct) => (
        <div className='text-sm text-gray-900'>
          <div>{new Date(product.created_at).toLocaleDateString('vi-VN')}</div>
          <div className='text-gray-500'>
            {new Date(product.created_at).toLocaleTimeString('vi-VN', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Trạng thái',
      render: (product: AdminProduct) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.status === 'published'
              ? 'bg-green-100 text-green-800'
              : product.status === 'draft'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-gray-100 text-gray-800'
            }`}
        >
          {product.status === 'published'
            ? 'Đã xuất bản'
            : product.status === 'draft'
              ? 'Bản nháp'
              : 'Đã lưu trữ'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Thao tác',
      render: (product: AdminProduct) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0' title='Thao tác'>
              <MoreVertical className='w-4 h-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem onClick={() => handleEdit(product)}>
              Chỉnh sửa
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleDeleteClick(product)}
              className='text-red-600 focus:text-red-600'
            >
              Xóa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className='p-6 space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>
            Danh sách Chuyên đề
          </h1>
          <div className='flex items-center space-x-2 text-sm text-gray-600 mt-1'>
            <span>Bảng điều khiển</span>
            <span className='w-1 h-1 bg-gray-400 rounded-full'></span>
            <span>Chuyên đề</span>
            <span className='w-1 h-1 bg-gray-400 rounded-full'></span>
            <span className='text-gray-900'>Danh sách Chuyên đề</span>
          </div>
        </div>
        <Button
          className='bg-gray-900 cursor-pointer hover:bg-gray-800'
          onClick={() => router.push('/admin/create-topic')}
        >
          <Plus className='w-4 h-4 mr-2' />
          Thêm mới
        </Button>
      </div>
      <div className='space-y-6 bg-white rounded-xl shadow p-6'>
        {/* Filters */}
        <div className='p-4 space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            {/* Category Filter */}
            <div className='relative'>
              <select
                value={selectedCategory}
                onChange={e => handleCategoryChange(e.target.value)}
                className='appearance-none w-full px-4 h-[54px] py-2 border border-[#919EAB52] rounded-[10px] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 cursor-pointer pr-10'
              >
                <option value=''>Danh mục</option>
                {categoryOptions.map(option => (
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

        {/* Results Count */}
        <div className='text-sm text-gray-600'>
          {productsResponse?.pagination?.total || 0} kết quả được tìm thấy
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
                    {coursesColumns.map(column => (
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
                  {filteredData.map(product => (
                    <tr key={product.id} className='hover:bg-gray-50'>
                      {coursesColumns.map(column => (
                        <td
                          key={column.key}
                          className='px-6 py-4 whitespace-nowrap'
                        >
                          {column.render(product)}
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
        {productsResponse?.pagination && (
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
                {Math.min(
                  currentPage * perPage,
                  productsResponse.pagination.total
                )}{' '}
                của {productsResponse.pagination.total}
              </span>
              <div className='flex space-x-1'>
                <button
                  className='p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50'
                  disabled={currentPage <= 1}
                  onClick={() =>
                    setCurrentPage(prev => {
                      const newPage = Math.max(1, (Number(prev) || 1) - 1);
                      return newPage;
                    })
                  }
                >
                  <ChevronDown className='w-4 h-4 rotate-90' />
                </button>
                <button
                  className='p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50'
                  disabled={
                    !productsResponse?.pagination ||
                    currentPage >= productsResponse.pagination.pages
                  }
                  onClick={() =>
                    setCurrentPage(prev => {
                      const totalPages = productsResponse?.pagination?.pages;
                      const newPage =
                        productsResponse?.pagination && totalPages
                          ? Math.min(totalPages, (Number(prev) || 1) + 1)
                          : Number(prev) || 1;
                      return newPage;
                    })
                  }
                >
                  <ChevronDown className='w-4 h-4 -rotate-90' />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onConfirm={handleConfirmDelete}
        onClose={handleCancelDelete}
        title='Xóa Chuyên đề'
        message={
          productToDelete
            ? `Bạn có chắc chắn muốn xóa Chuyên đề "${productToDelete.title}"? Hành động này không thể hoàn tác.`
            : ''
        }
      />
    </div>
  );
}
