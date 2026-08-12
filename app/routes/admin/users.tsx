import * as React from 'react';
import { Button } from '@gaulatti/bleecker/components/button';
import { CollectionFilters } from '@gaulatti/bleecker/components/collection-filters';
import { DataTable, type ColumnDef, type SortState } from '@gaulatti/bleecker/components/table';
import { PageHeader } from '@gaulatti/bleecker/components/page-header';
import { Pagination } from '@gaulatti/bleecker/components/pagination';
import { SearchInput } from '@gaulatti/bleecker/components/search-input';
import { StatusBadge } from '@gaulatti/bleecker/components/status-badge';
import { Plus } from 'lucide-react';

interface User { id: string; name: string; email: string; role: string; status: 'active' | 'inactive' | 'pending'; lastActive: string; }
const users: User[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', status: 'active', lastActive: '2 minutes ago' },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com', role: 'Editor', status: 'active', lastActive: '1 hour ago' },
  { id: '3', name: 'Charlie Brown', email: 'charlie@example.com', role: 'Viewer', status: 'inactive', lastActive: '3 days ago' },
  { id: '4', name: 'Diana Prince', email: 'diana@example.com', role: 'Editor', status: 'pending', lastActive: '1 week ago' },
  { id: '5', name: 'Evan Wright', email: 'evan@example.com', role: 'Viewer', status: 'active', lastActive: '5 hours ago' },
  { id: '6', name: 'Fiona Gallagher', email: 'fiona@example.com', role: 'Admin', status: 'active', lastActive: '30 minutes ago' },
  { id: '7', name: 'George Martin', email: 'george@example.com', role: 'Viewer', status: 'inactive', lastActive: '2 weeks ago' },
  { id: '8', name: 'Hannah Lee', email: 'hannah@example.com', role: 'Editor', status: 'active', lastActive: '4 hours ago' }
];
const columns: ColumnDef<User>[] = [
  { key: 'name', header: 'Person', sortable: true, cell: (user) => <div><p className='font-medium'>{user.name}</p><p className='font-secondary mt-0.5 text-[11px] text-text-secondary'>{user.email}</p></div> },
  { key: 'role', header: 'Role', sortable: true },
  { key: 'lastActive', header: 'Last active', cell: (user) => <span className='font-secondary text-xs text-text-secondary'>{user.lastActive}</span> },
  { key: 'status', header: 'Status', align: 'right', cell: (user) => <StatusBadge label={user.status[0].toUpperCase() + user.status.slice(1)} variant={user.status === 'active' ? 'live' : user.status === 'pending' ? 'warning' : 'default'} /> }
];

export default function UsersPage() {
  const [search, setSearch] = React.useState('');
  const [filters, setFilters] = React.useState<Record<string, boolean | string>>({});
  const [sort, setSort] = React.useState<SortState>({ field: 'name', order: 'asc' });
  const [selected, setSelected] = React.useState(new Set<string>());
  const [page, setPage] = React.useState(1);
  const pageSize = 5;
  const filtered = React.useMemo(() => users.filter((user) => {
    const query = search.toLowerCase();
    return (!query || `${user.name} ${user.email}`.toLowerCase().includes(query)) && (!filters.role || user.role === filters.role) && (!filters.status || user.status === filters.status);
  }), [search, filters]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const rows = filtered.slice((page - 1) * pageSize, page * pageSize);

  React.useEffect(() => setPage(1), [search, filters]);

  return (
    <div className='mx-auto max-w-7xl space-y-8'>
      <PageHeader title='People & access' description='Manage identities, roles, and the authority attached to each account.' actions={<Button size='sm'><Plus size={14} /> Invite user</Button>} />
      <section aria-label='User filters' className='space-y-3'>
        <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'><SearchInput aria-label='Search users' value={search} onChange={(event) => setSearch(event.target.value)} onClear={() => setSearch('')} placeholder='Search people or email…' className='w-full sm:max-w-sm' />{selected.size ? <div className='flex items-center gap-3'><span className='font-secondary text-xs text-text-secondary'>{selected.size} selected</span><Button variant='secondary' size='sm'>Edit access</Button></div> : <p className='font-secondary text-xs text-text-secondary'>{filtered.length} people</p>}</div>
        <CollectionFilters currentFilters={filters} currentSort={sort} onFilterChange={setFilters} onSortChange={setSort} filterOptions={[
          { field: 'role', label: 'Role', type: 'select', options: ['Admin', 'Editor', 'Viewer'].map((value) => ({ label: value, value })) },
          { field: 'status', label: 'Status', type: 'select', options: ['active', 'inactive', 'pending'].map((value) => ({ label: value[0].toUpperCase() + value.slice(1), value })) }
        ]} sortOptions={[{ field: 'name', label: 'Name' }, { field: 'role', label: 'Role' }, { field: 'lastActive', label: 'Last active' }]} />
      </section>
      <DataTable caption='Application users and access status' selectable selectedKeys={selected} onSelectionChange={setSelected} data={rows} columns={columns} getRowKey={(user) => user.id} sort={sort} onSortChange={setSort} emptyMessage='No people match these filters.' />
      <Pagination currentPage={page} totalPages={totalPages} hasPrevPage={page > 1} hasNextPage={page < totalPages} onPageChange={setPage} />
    </div>
  );
}
