'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';

import { Button } from '@/components/ui/button';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import {
  ArrowRight,
  MoreHorizontal,
} from 'lucide-react';

interface DataTableColumn {
  key: string;
  label: string;
  render?: (
    value: any,
    row: any
  ) => React.ReactNode;
}

interface DataTableProps {
  title: string;
  description?: string;
  columns: DataTableColumn[];
  data?: any[];

  handleSeeAll?: () => void;

  onEdit?: (row: any) => void;
  onView?: (row: any) => void;
  onDelete?: (row: any) => void;

  isEditing?: boolean;

  emptyMessage?: string;
}

const DataTable = React.forwardRef<
  HTMLDivElement,
  DataTableProps
>(
  (
    {
      title,
      description,
      columns,
      data = [],
      handleSeeAll,
      onEdit,
      onView,
      onDelete,
      isEditing = true,
      emptyMessage = 'Không có dữ liệu.',
    },
    ref
  ) => {
    const showAction =
      isEditing &&
      Boolean(onEdit || onView || onDelete);

    const totalColumns =
      columns.length + (showAction ? 1 : 0);

    return (
      <Card
        ref={ref}
        className='overflow-hidden rounded-2xl border border-[#EAE5E1] bg-white shadow-[0_1px_2px_rgba(43,36,32,0.03)]'
      >
        {/* Header */}
        <CardHeader className='border-b border-[#F0ECE8] px-5 py-5 md:px-6'>
          <div className='flex items-start justify-between gap-4'>
            <div>
              <h2 className='text-base font-bold text-[#292421] md:text-lg'>
                {title}
              </h2>

              {description && (
                <p className='mt-1.5 text-sm leading-5 text-[#8A817B]'>
                  {description}
                </p>
              )}
            </div>
          </div>
        </CardHeader>

        {/* Content */}
        <CardContent className='p-0'>
          <div className='w-full overflow-x-auto'>
            <table className='w-full min-w-[640px]'>
              <thead>
                <tr className='border-b border-[#EEE9E5] bg-[#FBFAF8]'>
                  {columns.map(column => (
                    <th
                      key={column.key}
                      className='px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-[0.08em] text-[#928983] md:px-6'
                    >
                      {column.label}
                    </th>
                  ))}

                  {showAction && (
                    <th className='w-[80px] px-5 py-3.5 text-right text-[11px] font-bold uppercase tracking-[0.08em] text-[#928983]'>
                      Thao tác
                    </th>
                  )}
                </tr>
              </thead>

              <tbody>
                {data.length > 0 ? (
                  data.map((row, index) => (
                    <tr
                      key={row?.id ?? index}
                      className='border-b border-[#F2EEEB] transition-colors last:border-b-0 hover:bg-[#FCFAF8]'
                    >
                      {columns.map(column => (
                        <td
                          key={column.key}
                          className='px-5 py-4 align-middle md:px-6'
                        >
                          {column.render
                            ? column.render(
                              row[column.key],
                              row
                            )
                            : (
                              <span className='text-sm text-[#514A45]'>
                                {row[column.key]}
                              </span>
                            )}
                        </td>
                      ))}

                      {showAction && (
                        <td className='px-5 py-4 text-right align-middle'>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant='ghost'
                                size='icon'
                                className='h-8 w-8 rounded-full text-[#766D67] hover:bg-[#F5F1EE]'
                              >
                                <MoreHorizontal className='h-4 w-4' />
                              </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent
                              align='end'
                              className='w-40'
                            >
                              {onView && (
                                <DropdownMenuItem
                                  onClick={() =>
                                    onView(row)
                                  }
                                >
                                  Xem chi tiết
                                </DropdownMenuItem>
                              )}

                              {onEdit && (
                                <DropdownMenuItem
                                  onClick={() =>
                                    onEdit(row)
                                  }
                                >
                                  Chỉnh sửa
                                </DropdownMenuItem>
                              )}

                              {onDelete && (
                                <DropdownMenuItem
                                  onClick={() =>
                                    onDelete(row)
                                  }
                                  className='text-red-600 focus:text-red-600'
                                >
                                  Xóa
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={totalColumns}
                      className='px-6 py-14 text-center'
                    >
                      <div className='mx-auto max-w-xs'>
                        <div className='text-sm font-semibold text-[#655C56]'>
                          Chưa có dữ liệu
                        </div>

                        <p className='mt-1 text-xs leading-5 text-[#A09791]'>
                          {emptyMessage}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>

        {/* Footer */}
        {handleSeeAll && (
          <CardFooter className='justify-end border-t border-[#F0ECE8] px-5 py-3 md:px-6'>
            <Button
              variant='ghost'
              onClick={handleSeeAll}
              className='gap-2 rounded-full px-3 text-sm font-semibold text-[#E4722C] hover:bg-[#FFF4EC] hover:text-[#D46321]'
            >
              Xem tất cả
              <ArrowRight className='h-4 w-4' />
            </Button>
          </CardFooter>
        )}
      </Card>
    );
  }
);

DataTable.displayName = 'DataTable';

export { DataTable };