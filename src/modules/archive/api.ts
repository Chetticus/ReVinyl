import api from '@/lib/api/axios';
import {
  ArchiveRecording,
  ArchiveAdminDashboard,
  ArchiveResponse,
  Contribution,
  ContributionStatus,
  CreateContributionInput,
  ModerateContributionInput,
  Locale,
  Lookups,
} from './types';

export const archiveApi = {
  adminDashboard: () =>
    api
      .get<ArchiveAdminDashboard>('/admin/archive/dashboard')
      .then(r => r.data),
  list: (params: Record<string, string | number | undefined>) =>
    api
      .get<ArchiveResponse>('/archive/recordings', { params })
      .then(r => r.data),
  detail: (slug: string, locale: Locale) =>
    api
      .get<ArchiveRecording>(`/archive/recordings/${slug}`, {
        params: { locale },
      })
      .then(r => r.data),
  lookups: () => api.get<Lookups>('/archive/lookups').then(r => r.data),
  createLookup: (kind: string, data: object) =>
    api.post(`/admin/archive/lookups/${kind}`, data).then(r => r.data),
  updateLookup: (kind: string, id: string, data: object) =>
    api.patch(`/admin/archive/lookups/${kind}/${id}`, data).then(r => r.data),
  deleteLookup: (kind: string, id: string) =>
    api.delete(`/admin/archive/lookups/${kind}/${id}`).then(r => r.data),
  timeline: (locale: Locale) =>
    api.get('/archive/timeline', { params: { locale } }).then(r => r.data),
  createContribution: (data: CreateContributionInput) =>
    api.post('/archive/contributions', data).then(r => r.data),
  adminList: (params: Record<string, string | number | undefined>) =>
    api
      .get<ArchiveResponse>('/admin/archive/recordings', { params })
      .then(r => r.data),
  save: (data: object, id?: string) =>
    id
      ? api.put(`/admin/archive/recordings/${id}`, data)
      : api.post('/admin/archive/recordings', data),
  remove: (id: string) => api.delete(`/admin/archive/recordings/${id}`),
  status: (id: string, status: 'DRAFT' | 'PUBLISHED') =>
    api.patch(`/admin/archive/recordings/${id}/status`, { status }),
  uploadAudio: (id: string, type: string, form: FormData) =>
    api.post(`/admin/archive/recordings/${id}/audio/${type}`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  uploadCover: (id: string, form: FormData) =>
    api.post(`/admin/archive/recordings/${id}/cover`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  adminContributions: (params: {
    search?: string;
    status?: ContributionStatus;
  }) =>
    api
      .get<Contribution[]>('/admin/archive/contributions', { params })
      .then(r => r.data),
  updateContribution: (id: string, data: ModerateContributionInput) =>
    api.patch(`/admin/archive/contributions/${id}`, data),
};
