'use client';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { archiveApi } from '@/modules/archive/api';
import { RecordingEditor } from '@/components/admin/archive/RecordingEditor';
export default function EditRecordingPage() {
  const id = String(useParams().id);
  const { data } = useQuery({
    queryKey: ['admin-recording', id],
    queryFn: () =>
      archiveApi
        .adminList({ perPage: 100 })
        .then(x => x.data.find(r => r.id === id)),
  });
  return data ? (
    <RecordingEditor recording={data} />
  ) : (
    <p className='p-8'>Loading…</p>
  );
}
