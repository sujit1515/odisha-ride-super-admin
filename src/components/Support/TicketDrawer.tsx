'use client';

import { useState, useEffect, useRef } from 'react'
import { X, Send, Paperclip, User, Car, MessageSquare,FileText, Clock, Tag, AlertCircle } from 'lucide-react'
import type { SupportTicket, TicketMessage, TicketStatus, TicketPriority } from '@/api/types/types'
import { getTicketMessages, replyToTicket, assignTicket } from '@/app/support/api/support'
import { priorityStyles, statusStyles, userTypeStyles } from '@/app/support/page'

interface Props {
  ticket:           SupportTicket
  onClose:          () => void
  onStatusChange:   (id: string, s: TicketStatus) => void
  onPriorityChange: (id: string, p: TicketPriority) => void
  onDelete:         (id: string) => void
  showToast:        (msg: string, ok: boolean) => void
  actionLoading:    string | null
  onRefresh:        () => void
}

const STATUSES:   TicketStatus[]   = ['Open', 'In Progress', 'Resolved', 'Closed']
const PRIORITIES: TicketPriority[] = ['High', 'Medium', 'Low']

export default function TicketDrawer({
  ticket, onClose, onStatusChange, onPriorityChange,
  onDelete, showToast, actionLoading, onRefresh,
}: Props) {
  const [messages,      setMessages     ] = useState<TicketMessage[]>([])
  const [msgLoading,    setMsgLoading   ] = useState(true)
  const [replyText,     setReplyText    ] = useState('')
  const [sendingReply,  setSendingReply ] = useState(false)
  const [assignAgent,   setAssignAgent  ] = useState(ticket.assignedTo ?? '')
  const [activeTab,     setActiveTab    ] = useState<'details' | 'chat'>('details')
  const chatEndRef = useRef<HTMLDivElement>(null)

  // Fetch messages
  useEffect(() => {
    fetchMessages()
  }, [ticket._id])

  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const fetchMessages = async () => {
    setMsgLoading(true)
    try {
      const data = await getTicketMessages(ticket._id)
      setMessages(data)
    } catch { /* silent */ }
    finally { setMsgLoading(false) }
  }

  const handleReply = async () => {
    if (!replyText.trim()) return
    setSendingReply(true)
    try {
      const msg = await replyToTicket(ticket._id, replyText.trim())
      setMessages(m => [...m, msg])
      setReplyText('')
      showToast('Reply sent.', true)
    } catch {
      showToast('Failed to send reply.', false)
    } finally {
      setSendingReply(false)
    }
  }

  const handleAssign = async () => {
    if (!assignAgent.trim()) return
    try {
      await assignTicket(ticket._id, assignAgent.trim())
      showToast(`Assigned to ${assignAgent}`, true)
      onRefresh()
    } catch {
      showToast('Failed to assign ticket.', false)
    }
  }

  const fmt = (d: string) =>
    new Date(d).toLocaleString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })

  return (
    <>
      {/* ── Backdrop ── */}
      <div
        className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* ── Drawer ── */}
      <div className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white z-50
                      shadow-2xl flex flex-col overflow-hidden">

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm font-bold text-blue-600
                             bg-blue-50 px-2.5 py-1 rounded-lg">
              {ticket.ticketId}
            </span>
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium
                              ${statusStyles[ticket.status]}`}>
              {ticket.status}
            </span>
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium
                              ${priorityStyles[ticket.priority]}`}>
              {ticket.priority}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* ── Tabs ── */}
        <div className="flex border-b border-slate-100 px-5">
          {(['details', 'chat'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-medium capitalize border-b-2 transition-colors
                ${activeTab === tab
                  ? 'border-slate-900 text-slate-900'
                  : 'border-transparent text-slate-400 hover:text-slate-600'}`}
            >
              {tab === 'chat' ? `Chat (${messages.length})` : 'Details'}
            </button>
          ))}
        </div>

        {/* ── Content ── */}
        <div className="flex-1 overflow-y-auto">

          {/* ── DETAILS TAB ── */}
          {activeTab === 'details' && (
            <div className="p-5 space-y-5">

              {/* User Info */}
              <Section icon={<User className="w-4 h-4" />} title="User Information">
                <Grid>
                  <InfoItem label="Name"      value={ticket.name} />
                  <InfoItem label="Email"     value={ticket.email} />
                  <InfoItem label="Phone"     value={ticket.phone} />
                  <InfoItem label="User Type" value={
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize
                                     ${userTypeStyles[ticket.userType]}`}>
                      {ticket.userType}
                    </span>
                  } />
                </Grid>
              </Section>

              {/* Issue Info */}
              <Section icon={<AlertCircle className="w-4 h-4" />} title="Issue Information">
                <Grid>
                  <InfoItem label="Subject"     value={ticket.subject} span />
                  <InfoItem label="Category"    value={ticket.category} />
                  <InfoItem label="Created"     value={fmt(ticket.createdAt)} />
                  <InfoItem label="Description" value={ticket.description} span />
                </Grid>
              </Section>

              {/* Ride Info */}
              {ticket.rideInfo && (
                <Section icon={<Car className="w-4 h-4" />} title="Ride Information">
                  <Grid>
                    <InfoItem label="Ride ID"        value={ticket.rideInfo.rideId} />
                    <InfoItem label="Driver"         value={ticket.rideInfo.driverName ?? '—'} />
                    <InfoItem label="Pickup"         value={ticket.rideInfo.pickupLocation} span />
                    <InfoItem label="Drop"           value={ticket.rideInfo.dropLocation} span />
                  </Grid>
                </Section>
              )}

              {/* Attachments */}
              {ticket.attachments && ticket.attachments.length > 0 && (
                <Section icon={<Paperclip className="w-4 h-4" />} title="Attachments">
                  <div className="flex flex-wrap gap-2">
                    {ticket.attachments.map((url, i) => (
                      <a
                        key={i}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-2 rounded-lg
                                   bg-slate-50 border border-slate-200 text-xs
                                   text-slate-600 hover:bg-slate-100 transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        Attachment {i + 1}
                      </a>
                    ))}
                  </div>
                </Section>
              )}

              {/* Actions */}
              <Section icon={<Tag className="w-4 h-4" />} title="Actions">
                <div className="grid grid-cols-2 gap-3">

                  {/* Status */}
                  <div>
                    <label className="text-xs text-slate-500 mb-1.5 block font-medium">
                      Change Status
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {STATUSES.map(s => (
                        <button
                          key={s}
                          onClick={() => onStatusChange(ticket._id, s)}
                          disabled={ticket.status === s || actionLoading === ticket._id}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors
                                      disabled:opacity-40 disabled:cursor-not-allowed
                            ${ticket.status === s
                              ? statusStyles[s] + ' ring-2 ring-offset-1 ring-slate-400'
                              : 'border border-slate-200 hover:bg-slate-50 text-slate-600'
                            }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Priority */}
                  <div>
                    <label className="text-xs text-slate-500 mb-1.5 block font-medium">
                      Change Priority
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {PRIORITIES.map(p => (
                        <button
                          key={p}
                          onClick={() => onPriorityChange(ticket._id, p)}
                          disabled={ticket.priority === p || actionLoading === ticket._id}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors
                                      disabled:opacity-40 disabled:cursor-not-allowed
                            ${ticket.priority === p
                              ? priorityStyles[p] + ' ring-2 ring-offset-1 ring-slate-400'
                              : 'border border-slate-200 hover:bg-slate-50 text-slate-600'
                            }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Assign */}
                <div className="mt-4">
                  <label className="text-xs text-slate-500 mb-1.5 block font-medium">
                    Assign To Agent
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={assignAgent}
                      onChange={e => setAssignAgent(e.target.value)}
                      placeholder="Agent name or ID..."
                      className="flex-1 border border-slate-200 rounded-lg px-3 py-2
                                 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
                    />
                    <button
                      onClick={handleAssign}
                      className="px-4 py-2 bg-slate-900 text-white text-sm font-medium
                                 rounded-lg hover:bg-slate-700 transition-colors"
                    >
                      Assign
                    </button>
                  </div>
                  {ticket.assignedTo && (
                    <p className="text-xs text-slate-400 mt-1.5">
                      Currently: <span className="font-medium text-slate-600">{ticket.assignedTo}</span>
                      {ticket.assignedAt && ` · ${fmt(ticket.assignedAt)}`}
                    </p>
                  )}
                </div>

                {/* Delete */}
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => onDelete(ticket._id)}
                    disabled={actionLoading === ticket._id}
                    className="px-4 py-2 bg-red-50 text-red-600 text-sm font-medium
                               rounded-lg hover:bg-red-100 transition-colors
                               border border-red-100 disabled:opacity-40"
                  >
                    Delete Ticket
                  </button>
                </div>
              </Section>
            </div>
          )}

          {/* ── CHAT TAB ── */}
          {activeTab === 'chat' && (
            <div className="flex flex-col h-full">
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {msgLoading ? (
                  <div className="space-y-3">
                    {[1,2,3].map(i => (
                      <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : ''}`}>
                        <div className="h-16 w-64 bg-slate-100 rounded-xl animate-pulse" />
                      </div>
                    ))}
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-40 text-slate-400">
                    <MessageSquare className="w-10 h-10 mb-2 text-slate-200" />
                    <p className="text-sm">No messages yet</p>
                  </div>
                ) : (
                  messages.map(msg => (
                    <div
                      key={msg._id}
                      className={`flex ${msg.senderType === 'admin' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                        msg.senderType === 'admin'
                          ? 'bg-slate-900 text-white rounded-br-sm'
                          : 'bg-slate-100 text-slate-800 rounded-bl-sm'
                      }`}>
                        <div className={`text-xs font-medium mb-1 ${
                          msg.senderType === 'admin' ? 'text-slate-400' : 'text-slate-500'
                        }`}>
                          {msg.senderName}
                        </div>
                        <p className="text-sm leading-relaxed">{msg.message}</p>
                        <div className={`text-xs mt-1.5 ${
                          msg.senderType === 'admin' ? 'text-slate-500' : 'text-slate-400'
                        }`}>
                          {fmt(msg.createdAt)}
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <div ref={chatEndRef} />
              </div>

              {/* ── Reply Box ── */}
              <div className="border-t border-slate-100 p-4">
                <div className="flex gap-2">
                  <textarea
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleReply()
                      }
                    }}
                    placeholder="Type a reply... (Enter to send)"
                    rows={3}
                    className="flex-1 border border-slate-200 rounded-xl px-3 py-2.5
                               text-sm resize-none focus:outline-none focus:ring-2
                               focus:ring-slate-300"
                  />
                  <button
                    onClick={handleReply}
                    disabled={!replyText.trim() || sendingReply}
                    className="px-4 py-2 bg-slate-900 text-white rounded-xl
                               hover:bg-slate-700 transition-colors self-end
                               disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {sendingReply
                      ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      : <Send className="w-4 h-4" />
                    }
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

// ── Small reusable layout components ─────────────────────────────────────────

function Section({ icon, title, children }: {
  icon: React.ReactNode; title: string; children: React.ReactNode
}) {
  return (
    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
      <div className="flex items-center gap-2 mb-3 text-slate-700 font-semibold text-sm">
        {icon}
        {title}
      </div>
      {children}
    </div>
  )
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 gap-3">{children}</div>
}

function InfoItem({ label, value, span }: {
  label: string; value: React.ReactNode; span?: boolean
}) {
  return (
    <div className={span ? 'col-span-2' : ''}>
      <p className="text-xs text-slate-400 mb-0.5">{label}</p>
      <p className="text-sm font-medium text-slate-700 break-words">{value}</p>
    </div>
  )
}