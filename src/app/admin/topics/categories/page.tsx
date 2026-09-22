'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, X, ChevronDown } from 'lucide-react';
import {
  useGetCategoryList,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from '@/modules/admin/hooks/useCategoryAdmin';
import { useDebounce } from '@/hooks/useDebounce';
import {
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from '@/modules/admin/domain/categorySchema';
import { CategoryModal } from '@/components/admin/CategoryModal';
import { DeleteConfirmationModal } from '@/components/admin/DeleteConfirmationModal';
import { Eye, Edit, Trash } from 'iconsax-react';

type CategoryAction = 'add' | 'edit' | 'view';

export default function CourseCategoriesPage() {
  const [searchInput, setSearchInput] = React.useState('');
  const [selectedStatus, setSelectedStatus] = React.useState('');
  const [activeFilters, setActiveFilters] = React.useState<string[]>([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(10);

  // Modal states
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [modalAction, setModalAction] = React.useState<CategoryAction>('add');
  const [selectedCategory, setSelectedCategory] =
    React.useState<Category | null>(null);

  // Delete confirmation modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [categoryToDelete, setCategoryToDelete] =
    React.useState<Category | null>(null);

  const debouncedSearch = useDebounce(searchInput, 500);

  const {
    data: categoriesResponse,
    isLoading,
    error,
  } = useGetCategoryList({
    search: debouncedSearch || undefined,
    status: (selectedStatus as 'published' | 'draft') || undefined,
    page: currentPage,
    limit: perPage,
  });

  const createCategoryMutation = useCreateCategory();
  const updateCategoryMutation = useUpdateCategory();
  const deleteCategoryMutation = useDeleteCategory();

  const categoriesData = categoriesResponse?.data?.data || [];
  const total = categoriesResponse?.data?.meta?.total || 0;
  const totalPages = categoriesResponse?.data?.meta?.totalPages || 0;

  const statusOptions = [
    { value: 'published', label: 'Đã xuất bản' },
    { value: 'draft', label: 'Bản nháp' },
  ];

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

    // Reset corresponding dropdown
    if (filterToRemove.startsWith('Trạng thái:')) {
      setSelectedStatus('');
    } else if (filterToRemove.startsWith('Từ khóa:')) {
      setSearchInput('');
    }
  };

  const clearAllFilters = () => {
    setActiveFilters([]);
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

  // Modal handlers
  const openModal = (action: CategoryAction, category?: Category) => {
    setModalAction(action);
    setSelectedCategory(category || null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
  };

  const handleSaveCategory = (data: any) => {
    if (modalAction === 'add') {
      const createData: CreateCategoryRequest = {
        title: data.title,
        slug: data.slug,
        short_description: data.short_description,
        status: data.status,
      };
      createCategoryMutation.mutate(createData);
    } else if (modalAction === 'edit' && data.id) {
      const updateData: UpdateCategoryRequest = {
        title: data.title,
        slug: data.slug,
        short_description: data.short_description,
        status: data.status,
      };
      updateCategoryMutation.mutate({ id: data.id, data: updateData });
    }
    closeModal();
  };

  const handleDeleteCategory = (category: Category) => {
    setCategoryToDelete(category);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (categoryToDelete) {
      deleteCategoryMutation.mutate(categoryToDelete.id);
      setIsDeleteModalOpen(false);
      setCategoryToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setCategoryToDelete(null);
  };

  const categoriesColumns = React.useMemo(
    () => [
      {
        key: 'title',
        label: 'Tên',
        render: (category: Category) => (
          <span className='text-sm font-medium text-gray-900 max-w-40'>
            {category.title}
          </span>
        ),
      },
      {
        key: 'created_at',
        label: 'Ngày tạo',
        render: (category: Category) => (
          <span className='text-sm text-gray-900'>
            {new Date(category.created_at).toLocaleDateString('vi-VN', {
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
        key: 'products',
        label: 'Sản phẩm',
        render: (category: Category) => (
          <span className='text-sm text-gray-900'>
            {category._count.products}
          </span>
        ),
      },
      {
        key: 'status',
        label: 'Trạng thái',
        render: (category: Category) => (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              category.status === 'published'
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {category.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
          </span>
        ),
      },
      {
        key: 'actions',
        label: '',
        render: (category: Category) => (
          <div className='flex items-center space-x-1'>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => openModal('view', category)}
              title='Xem chi tiết'
            >
              <Eye size='32' color='green' />
            </Button>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => openModal('edit', category)}
              title='Chỉnh sửa'
            >
              <Edit size='32' color='blue' />
            </Button>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => handleDeleteCategory(category)}
              title='Xóa'
            >
              <Trash size='32' color='red' />
            </Button>
          </div>
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
            Danh mục Chuyên đề
          </h1>
          {/* Breadcrumb */}
          <div className='flex items-center space-x-2 text-sm text-gray-600 mt-1'>
            <span>Bảng điều khiển</span>
            <span className='w-1 h-1 bg-gray-400 rounded-full'></span>
            <span>Chuyên đề</span>
            <span className='w-1 h-1 bg-gray-400 rounded-full'></span>
            <span className='text-gray-900'>Danh mục Chuyên đề</span>
          </div>
        </div>
        <Button
          className='bg-gray-900 cursor-pointer hover:bg-gray-800'
          onClick={() => openModal('add')}
        >
          <Plus className='w-4 h-4 mr-2' />
          Thêm mới
        </Button>
      </div>

      <div className='space-y-6 bg-white p-6 rounded-xl'>
        {/* Filters */}
        <div className='p-4 space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
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
          {total} kết quả được tìm thấy
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
                    {categoriesColumns.map(column => (
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
                  {categoriesData.map(category => (
                    <tr key={category.id} className='hover:bg-gray-50'>
                      {categoriesColumns.map(column => (
                        <td
                          key={column.key}
                          className='px-6 py-4 whitespace-nowrap'
                        >
                          {column.render(category)}
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

      {/* Category Modal */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={closeModal}
        action={modalAction}
        category={selectedCategory}
        onSave={handleSaveCategory}
        isLoading={
          createCategoryMutation.isPending || updateCategoryMutation.isPending
        }
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title='Xóa danh mục'
        message='Bạn có chắc chắn muốn xóa danh mục này?'
        itemName={categoryToDelete?.title}
        isLoading={deleteCategoryMutation.isPending}
      />
    </div>
  );
}
