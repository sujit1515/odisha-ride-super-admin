import adminApi from './axiosinstance'
import type { SupportTicket,TicketMessage,TicketStats,TicketsResponse,TicketFilters,TicketStatus,TicketPriority } from '@/types/index'

// ── GET /support/tickets ──────────────────────────────────────────────────────
export const getTickets = async (
  filters: TicketFilters = {},
): Promise<TicketsResponse> => {
  const params: Record<string, any> = {}
  if (filters.search)   params.search   = filters.search
  if (filters.status   && filters.status   !== 'All') params.status   = filters.status
  if (filters.priority && filters.priority !== 'All') params.priority = filters.priority
  if (filters.userType && filters.userType !== 'All') params.userType = filters.userType
  if (filters.category && filters.category !== 'All') params.category = filters.category
  if (filters.dateFrom) params.dateFrom = filters.dateFrom
  if (filters.dateTo)   params.dateTo   = filters.dateTo
  params.page  = filters.page  ?? 1
  params.limit = filters.limit ?? 10

  const res = await adminApi.get('/support/tickets', { params })
  return res.data
}

// ── GET /support/tickets/stats ────────────────────────────────────────────────
export const getTicketStats = async (): Promise<TicketStats> => {
  const res = await adminApi.get('/support/tickets/stats')
  return res.data
}

// ── GET /support/tickets/:id ──────────────────────────────────────────────────
export const getTicketById = async (id: string): Promise<SupportTicket> => {
  const res = await adminApi.get(`/support/tickets/${id}`)
  return res.data
}

// ── GET /support/tickets/:id/messages ────────────────────────────────────────
export const getTicketMessages = async (
  id: string,
): Promise<TicketMessage[]> => {
  const res = await adminApi.get(`/support/tickets/${id}/messages`)
  return res.data
}

// ── POST /support/tickets/:id/reply ──────────────────────────────────────────
export const replyToTicket = async (
  id: string,
  message: string,
  attachments?: string[],
): Promise<TicketMessage> => {
  const res = await adminApi.post(`/support/tickets/${id}/reply`, {
    message,
    attachments,
  })
  return res.data
}

// ── POST /support/tickets/:id/assign ─────────────────────────────────────────
export const assignTicket = async (
  id: string,
  assignedTo: string,
): Promise<SupportTicket> => {
  const res = await adminApi.post(`/support/tickets/${id}/assign`, {
    assignedTo,
  })
  return res.data
}

// ── PATCH /support/tickets/:id/status ────────────────────────────────────────
export const updateTicketStatus = async (
  id: string,
  status: TicketStatus,
): Promise<SupportTicket> => {
  const res = await adminApi.patch(`/support/tickets/${id}/status`, { status })
  return res.data
}

// ── PATCH /support/tickets/:id/priority ──────────────────────────────────────
export const updateTicketPriority = async (
  id: string,
  priority: TicketPriority,
): Promise<SupportTicket> => {
  const res = await adminApi.patch(`/support/tickets/${id}/priority`, {
    priority,
  })
  return res.data
}

// ── DELETE /support/tickets/:id ───────────────────────────────────────────────
export const deleteTicket = async (id: string): Promise<void> => {
  await adminApi.delete(`/support/tickets/${id}`)
}

// ── GET /support/tickets/export ───────────────────────────────────────────────
export const exportTickets = async (
  format: 'csv' | 'excel' | 'pdf',
  filters: TicketFilters = {},
): Promise<Blob> => {
  const res = await adminApi.get('/support/tickets/export', {
    params:       { ...filters, format },
    responseType: 'blob',
  })
  return res.data
}