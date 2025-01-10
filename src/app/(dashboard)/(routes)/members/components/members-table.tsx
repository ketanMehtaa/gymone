'use client';

import * as React from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Icons } from '@/components/icons';

interface Member {
  id: string;
  memberCode: string;
  user: {
    name: string | null;
    email: string | null;
  };
  phone: string;
  status: 'ACTIVE' | 'INACTIVE' | 'BLOCKED';
  memberships: Array<{
    plan: {
      name: string;
    };
    endDate: Date;
  }>;
  createdAt: Date;
}

export const columns: ColumnDef<Member>[] = [
  {
    accessorKey: 'memberCode',
    header: 'Member ID',
    cell: ({ row }) => (
      <div className='font-medium'>{row.getValue('memberCode')}</div>
    )
  },
  {
    accessorKey: 'user',
    header: 'Name',
    cell: ({ row }) => (
      <div className='font-medium'>{row.original.user.name}</div>
    )
  },
  {
    accessorKey: 'phone',
    header: 'Phone'
  },
  {
    accessorKey: 'user.email',
    header: 'Email',
    cell: ({ row }) => <div>{row.original.user.email}</div>
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      return (
        <div
          className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium ${
            status === 'ACTIVE'
              ? 'bg-green-100 text-green-800'
              : status === 'INACTIVE'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {status.toLowerCase()}
        </div>
      );
    }
  },
  {
    accessorKey: 'memberships',
    header: 'Plan',
    cell: ({ row }) => {
      const memberships = row.original.memberships;
      const currentPlan = memberships[0]?.plan.name || 'No active plan';
      const endDate = memberships[0]?.endDate
        ? formatDate(memberships[0].endDate)
        : 'N/A';
      return (
        <div className='font-medium'>
          {currentPlan}
          <div className='text-xs text-muted-foreground'>
            Expires: {endDate}
          </div>
        </div>
      );
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const member = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <Icons.more className='h-4 w-4' />
              <span className='sr-only'>Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem asChild>
              <Link href={`/members/${member.id}`}>View details</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/members/${member.id}/edit`}>Edit member</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/members/${member.id}/attendance`}>
                View attendance
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
  }
];

interface MembersTableProps {
  data: Member[];
}

export function MembersTable({ data }: MembersTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility
    }
  });

  return (
    <div className='space-y-4'>
      <div className='flex items-center gap-4'>
        <Input
          placeholder='Filter by name...'
          value={(table.getColumn('user')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('user')?.setFilterValue(event.target.value)
          }
          className='max-w-sm'
        />
        <Input
          placeholder='Filter by phone...'
          value={(table.getColumn('phone')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('phone')?.setFilterValue(event.target.value)
          }
          className='max-w-sm'
        />
      </div>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  No members found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className='flex items-center justify-end space-x-2'>
        <div className='flex-1 text-sm text-muted-foreground'>
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className='space-x-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
