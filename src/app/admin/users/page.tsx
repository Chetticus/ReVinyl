'use client';

import * as React from 'react';
import { DataTable } from '@/components/admin/DataTable';
import { UserModal } from '@/components/admin/UserModal';
import { DeleteConfirmationModal } from '@/components/admin/DeleteConfirmationModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, X, Trash2 } from 'lucide-react';
import {
  useGetUserList,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
} from '@/modules/admin/hooks/useUserAdmin';
import {
  AdminUser,
  CreateUserRequest,
  UpdateUserRequest,
} from '@/modules/admin/domain/types';
import { useDebounce } from '@/hooks/useDebounce';

type UserAction = 'add' | 'edit' | 'view';

interface UserFormData {
  id?: string;
  fullName: string;
  email: string;
  password?: string;
  role: string;
  age?: number;
  grade?: string;
  avatar?: string;
}

const getAvatarUrl = (avatar: any) => {
  if (!avatar) return null;
  const cloudinary_name = "dpri5hjbx"

  // Nếu backend đã trả URL đầy đủ
  if (
    avatar.startsWith('http://') ||
    avatar.startsWith('https://')
  ) {
    return avatar;
  }

  return `https://res.cloudinary.com/${cloudinary_name}/image/upload/${avatar}`;
};

export default function UsersPage() {
  const [activeTab, setActiveTab] = React.useState('all');
  const [searchKeyword, setSearchKeyword] = React.useState('');
  const [searchInput, setSearchInput] = React.useState('');
  const debouncedSearch = useDebounce(searchInput, 500);
  const [selectedRole, setSelectedRole] = React.useState('');
  const [activeFilters, setActiveFilters] = React.useState<
    Array<{ type: string; value: string }>
  >([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [perPage] = React.useState(10);

  // Modal states
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [modalAction, setModalAction] = React.useState<UserAction>('add');
  const [selectedUser, setSelectedUser] = React.useState<UserFormData | null>(
    null
  );

  // Delete confirmation modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [userToDelete, setUserToDelete] = React.useState<AdminUser | null>(
    null
  );

  // API hooks
  const {
    data: usersResponse,
    isLoading,
    error,
  } = useGetUserList({
    role: selectedRole || undefined,
    keyword: debouncedSearch || undefined,
    page: currentPage,
    perPage: perPage,
  });

  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();

  const usersColumns = [
    {
      key: 'user',
      label: 'Tên',
      render: (value: any, row: AdminUser) => (
        <div className='flex items-center space-x-3'>
          <div className='w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center'>
            {row.avatar ? (
              <img
                src={getAvatarUrl(row.avatar)}
                alt={row.fullName}
                className='w-10 h-10 rounded-full object-cover'
              />
            ) : (
              <span className='text-sm font-medium text-gray-600'>
                {row.fullName?.charAt(0) || 'U'}
              </span>
            )}
          </div>
          <div>
            <p className='text-sm font-medium text-gray-900'>
              {row.fullName || 'N/A'}
            </p>
            <p className='text-xs text-gray-500'>{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'age',
      label: 'Tuổi',
      render: (value: any, row: AdminUser) => (
        <span className='text-sm text-gray-900'>{row.age || 'N/A'}</span>
      ),
    },
    {
      key: 'grade',
      label: 'Lớp',
      render: (value: any, row: AdminUser) => (
        <span className='text-sm text-gray-900'>{row.grade || 'N/A'}</span>
      ),
    },
    {
      key: 'role',
      label: 'Vai trò',
      render: (value: any, row: AdminUser) => (
        <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
          {row.role}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Trạng thái',
      render: (value: any, row: AdminUser) => {
        const status = row.isVerified ? 'Đang hoạt động' : 'Đang chờ';
        const statusConfig = {
          'Đang hoạt động': 'text-green-600 bg-green-100',
          'Bị cấm': 'text-red-600 bg-red-100',
          'Đang chờ': 'text-orange-600 bg-orange-100',
          'Loại bỏ': 'text-gray-600 bg-gray-100',
        };
        return (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig[status as keyof typeof statusConfig] || 'text-gray-600 bg-gray-100'}`}
          >
            {status}
          </span>
        );
      },
    },
    {
      key: 'stats',
      label: 'Thống kê',
      render: (value: any, row: AdminUser) => (
        <div className='text-xs text-gray-600'>
          <div>Chuyên đề: {row._count.enrollments}</div>
          <div>Đánh giá: {row._count.reviews}</div>
        </div>
      ),
    },
  ];

  // Get users data from API response
  const usersData = usersResponse?.data || [];

  // Calculate counts based on real data
  const activeCount = usersData.filter(user => user.isVerified).length;
  const pendingCount = usersData.filter(user => !user.isVerified).length;
  const totalCount = usersResponse?.total || 0;

  const filterTabs = [
    {
      id: 'all',
      label: 'Tất cả',
      count: totalCount,
      color: 'text-black border-b border-b-[#212B36]',
    },
    {
      id: 'active',
      label: 'Hoạt động',
      count: activeCount,
      color: 'bg-white text-gray-900',
    },
    {
      id: 'pending',
      label: 'Đang chờ',
      count: pendingCount,
      color: 'bg-white text-gray-900',
    },
    {
      id: 'banned',
      label: 'Bị cấm',
      count: 0, // No banned status in current API
      color: 'bg-white text-gray-900',
    },
    {
      id: 'removed',
      label: 'Loại bỏ',
      count: 0, // No removed status in current API
      color: 'bg-white text-gray-900',
    },
  ];

  const roleOptions = [
    { value: '', label: 'Tất cả vai trò' },
    { value: 'admin', label: 'Admin' },
    { value: 'user', label: 'Người dùng' },
  ];

  // Modal handlers
  const openModal = (action: UserAction, user?: AdminUser) => {
    setModalAction(action);
    if (user) {
      // Map AdminUser to UserFormData for the modal
      const mappedUser: UserFormData = {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        age: user.age || undefined,
        grade: user.grade || undefined,
        avatar: user.avatar || undefined,
      };
      setSelectedUser(mappedUser);
    } else {
      setSelectedUser(null);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleSaveUser = (userData: UserFormData) => {
    if (modalAction === 'add') {
      const createData: CreateUserRequest = {
        fullName: userData.fullName,
        email: userData.email,
        password: userData.password || '12345678', // Default password if not provided
        role: userData.role,
      };
      createUserMutation.mutate(createData);
    } else if (modalAction === 'edit' && userData.id) {
      const updateData: UpdateUserRequest = {
        fullName: userData.fullName,
        age: userData.age,
        gender: undefined, // Not available in current form, can be added later
        birthday: undefined, // Not available in current form, can be added later
      };
      updateUserMutation.mutate({ id: userData.id, data: updateData });
    }
    closeModal();
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      deleteUserMutation.mutate(userId);
    }
  };

  // DataTable action handlers
  const handleEditUser = (row: AdminUser) => {
    openModal('edit', row);
  };

  const handleViewUser = (row: AdminUser) => {
    openModal('view', row);
  };

  const handleDeleteUserFromTable = (row: AdminUser) => {
    setUserToDelete(row);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (userToDelete) {
      deleteUserMutation.mutate(userToDelete.id);
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setUserToDelete(null);
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setCurrentPage(1); // Reset to first page when changing tabs
  };

  const handleRoleChange = (role: string) => {
    setSelectedRole(role);
    setCurrentPage(1); // Reset to first page when changing role filter
    if (role) {
      const roleLabel =
        roleOptions.find(opt => opt.value === role)?.label || role;
      setActiveFilters(prev => [
        ...prev.filter(f => f.type !== 'role'),
        { type: 'role', value: roleLabel },
      ]);
    } else {
      setActiveFilters(prev => prev.filter(f => f.type !== 'role'));
    }
  };

  const handleSearch = (keyword: string) => {
    setSearchInput(keyword);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Reflect debounced keyword into filter pills
  React.useEffect(() => {
    setActiveFilters(prev => {
      const next = prev.filter(f => f.type !== 'keyword');
      if (debouncedSearch)
        return [...next, { type: 'keyword', value: debouncedSearch }];
      return next;
    });
  }, [debouncedSearch]);

  const removeFilter = (filterType: string) => {
    setActiveFilters(prev => prev.filter(f => f.type !== filterType));
    if (filterType === 'role') setSelectedRole('');
    if (filterType === 'keyword') {
      setSearchKeyword('');
      setSearchInput('');
    }
    setCurrentPage(1); // Reset to first page when removing filters
  };

  const clearAllFilters = () => {
    setActiveFilters([]);
    setSelectedRole('');
    setSearchKeyword('');
    setCurrentPage(1);
  };

  // Filter data based on active tab (client-side filtering for status)
  const filteredData = usersData.filter(user => {
    if (activeTab !== 'all') {
      if (activeTab === 'active' && !user.isVerified) return false;
      if (activeTab === 'pending' && user.isVerified) return false;
      // banned and removed tabs will show no data as these statuses don't exist in API
    }
    return true;
  });

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>Quản trị viên</h1>
        </div>
        <Button
          className='bg-gray-900 cursor-pointer hover:bg-gray-800'
          onClick={() => openModal('add')}
        >
          <Plus className='w-4 h-4 mr-2' />
          Thêm mới
        </Button>
      </div>

      {/* Breadcrumb */}
      <div className='flex items-center space-x-2 text-sm text-gray-600'>
        <span>Bảng điều khiển</span>
        <span className='w-1 h-1 bg-gray-400 rounded-full'></span>
        <span>Người dùng</span>
        <span className='w-1 h-1 bg-gray-400 rounded-full'></span>
        <span className='text-gray-900'>Quản trị viên</span>
      </div>

      {/* Filter Tabs */}
      <div className='bg-white rounded-xl p-4 space-y-4'>
        <div className='flex'>
          {filterTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`px-4 py-2 text-sm font-medium flex items-center space-x-2 ${activeTab === tab.id ? 'text-black border-b-2 border-b-[#212B36]' : 'bg-white text-gray-900'}`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-2 py-0.5 rounded text-xs ${tab.id === 'active'
                  ? 'bg-green-100 text-green-800'
                  : tab.id === 'pending'
                    ? 'bg-orange-100 text-orange-800'
                    : tab.id === 'banned'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-black text-white'
                  }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search and Filter Bar */}
        <div className='flex items-center space-x-4'>
          <div className='relative'>
            <select
              value={selectedRole}
              onChange={e => handleRoleChange(e.target.value)}
              className='appearance-none px-4 h-[54px] w-48 py-2 border border-[#919EAB52] rounded-[10px] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 cursor-pointer pr-10'
            >
              {roleOptions.map(option => (
                <option
                  key={option.value}
                  value={option.value}
                  className='py-2'
                >
                  {option.label}
                </option>
              ))}
            </select>
            <div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'>
              <svg
                className='w-4 h-4 text-gray-400'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M19 9l-7 7-7-7'
                />
              </svg>
            </div>
          </div>
          <div className='relative flex-1 max-w-xl'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
            <Input
              placeholder='Tìm kiếm...'
              value={searchInput}
              onChange={e => handleSearch(e.target.value)}
              className='!px-10 !my-0'
            />
          </div>
        </div>

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className='flex items-center justify-between bg-gray-50 p-4 rounded-lg'>
            <div className='flex items-center space-x-2'>
              <span className='text-sm text-gray-600'>
                {filteredData.length} kết quả được tìm thấy
              </span>
              <div className='flex items-center space-x-2'>
                {activeFilters.map((filter, index) => (
                  <div
                    key={index}
                    className='flex items-center space-x-1 bg-white px-3 py-1 rounded-full border border-gray-200'
                  >
                    <span className='text-sm text-gray-700'>
                      {filter.type === 'role' ? 'Vai trò' : 'Từ khóa'}:{' '}
                      {filter.value}
                    </span>
                    <button
                      onClick={() => removeFilter(filter.type)}
                      className='ml-1 text-gray-400 hover:text-gray-600'
                    >
                      <X className='w-3 h-3' />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <button
              onClick={clearAllFilters}
              className='flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800'
            >
              <Trash2 className='w-4 h-4' />
              <span>Xóa</span>
            </button>
          </div>
        )}

        {/* Users Table */}
        {isLoading ? (
          <div className='flex items-center justify-center py-8'>
            <div className='text-gray-500'>Đang tải dữ liệu...</div>
          </div>
        ) : error ? (
          <div className='flex items-center justify-center py-8'>
            <div className='text-red-500'>Có lỗi xảy ra khi tải dữ liệu</div>
          </div>
        ) : (
          <DataTable
            title='Danh sách người dùng'
            columns={usersColumns}
            data={filteredData}
            onEdit={handleEditUser}
            onView={handleViewUser}
            onDelete={handleDeleteUserFromTable}
          />
        )}
      </div>

      {/* User Modal */}
      <UserModal
        isOpen={isModalOpen}
        onClose={closeModal}
        action={modalAction}
        user={selectedUser}
        onSave={handleSaveUser}
        onDelete={handleDeleteUser}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title='Xóa người dùng'
        message='Bạn có chắc chắn muốn xóa người dùng này?'
        itemName={userToDelete?.fullName}
        isLoading={deleteUserMutation.isPending}
      />
    </div>
  );
}
