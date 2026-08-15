"use client";
import { useState, useEffect } from "react";

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [selectedEnquiry, setSelectedEnquiry] = useState<any>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchEnquiries = () => {
    fetch(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}/enquiries`)
      .then(res => res.json())
      .then(data => {
        setEnquiries(data);
        setLoading(false);
        if (selectedEnquiry) {
          const updated = data.find((e: any) => e.id === selectedEnquiry.id);
          if (updated) setSelectedEnquiry(updated);
        }
      })
      .catch(err => {
        console.error("Error fetching enquiries", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleStatusChange = async (enquiryId: number, status: string) => {
    await fetch(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}/enquiries/${enquiryId}/status?status=${status}`, { method: 'PUT' });
    fetchEnquiries();
  };

  const handleSendReply = async () => {
    if (!replyMessage.trim() || !selectedEnquiry) return;
    setSending(true);

    const formData = new FormData();
    formData.append("message", replyMessage);
    formData.append("is_from_admin", "true");
    attachments.forEach(file => {
      formData.append("files", file);
    });

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}/enquiries/${selectedEnquiry.id}/reply`, {
        method: 'POST',
        body: formData
      });
      
      if (res.ok) {
        setReplyMessage("");
        setAttachments([]);
        fetchEnquiries(); // Refresh to see the new reply
        alert("Reply sent via Email!");
      } else {
        alert("Failed to send reply. Check SMTP settings.");
      }
    } catch (err) {
      alert("Error sending reply.");
    } finally {
      setSending(false);
    }
  };

  if (loading) return <div className="p-8">Loading enquiries...</div>;

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-80px)] flex flex-col">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 shrink-0">Customer Enquiries</h1>
      
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex">
        
        {/* Left Pane: Inbox List */}
        <div className="w-1/3 border-r border-gray-100 flex flex-col bg-gray-50/50">
          <div className="p-4 border-b border-gray-100 bg-white font-semibold text-gray-800">
            Inbox ({enquiries.length})
          </div>
          <div className="overflow-y-auto flex-1">
            {enquiries.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No enquiries found.</div>
            ) : (
              enquiries.map((enq) => (
                <div 
                  key={enq.id} 
                  onClick={() => setSelectedEnquiry(enq)}
                  className={`p-4 border-b border-gray-50 cursor-pointer transition-colors ${
                    selectedEnquiry?.id === enq.id ? 'bg-red-50 border-l-4 border-l-meewa-red' : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h3 className={`font-bold truncate pr-2 ${enq.status === 'New' ? 'text-black' : 'text-gray-700'}`}>
                      {enq.name}
                    </h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap ${
                      enq.status === 'New' ? 'bg-red-100 text-meewa-red' : 
                      enq.status === 'Replied' ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-700'
                    }`}>
                      {enq.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">{enq.email}</p>
                  <p className="text-xs text-gray-400 mt-2">{new Date(enq.created_at).toLocaleString()}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Pane: Conversation & Reply */}
        <div className="w-2/3 flex flex-col bg-white">
          {selectedEnquiry ? (
            <>
              {/* Header */}
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedEnquiry.name}</h2>
                  <p className="text-gray-500 text-sm">
                    {selectedEnquiry.email} {selectedEnquiry.phone && `• ${selectedEnquiry.phone}`}
                  </p>
                </div>
                <div className="flex gap-2">
                  <select 
                    value={selectedEnquiry.status}
                    onChange={(e) => handleStatusChange(selectedEnquiry.id, e.target.value)}
                    className="border rounded p-1 text-sm bg-gray-50 outline-none"
                  >
                    <option value="New">Mark New</option>
                    <option value="Read">Mark Read</option>
                    <option value="Replied">Mark Replied</option>
                    <option value="Resolved">Mark Resolved</option>
                  </select>
                </div>
              </div>

              {/* Conversation Thread */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50">
                {/* Original Message */}
                <div className="flex flex-col items-start">
                  <span className="text-xs text-gray-500 mb-1 ml-1">{selectedEnquiry.name} (Customer)</span>
                  <div className="bg-white border border-gray-200 p-4 rounded-2xl rounded-tl-none shadow-sm max-w-[80%] whitespace-pre-wrap">
                    {selectedEnquiry.message}
                    
                    {selectedEnquiry.products_requested && selectedEnquiry.products_requested.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="font-bold text-sm text-gray-700 mb-2">Requested Products:</p>
                        <ul className="space-y-2">
                          {selectedEnquiry.products_requested.map((prod: any, idx: number) => (
                            <li key={idx} className="flex justify-between items-center text-sm bg-gray-50 p-2 rounded">
                              <span className="font-medium text-gray-800">{prod.product_name} <span className="text-gray-400 font-normal">({prod.category_name})</span></span>
                              <span className="text-meewa-red font-bold">Qty: {prod.quantity}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* Admin Replies */}
                {selectedEnquiry.replies?.map((reply: any) => (
                  <div key={reply.id} className={`flex flex-col ${reply.is_from_admin ? 'items-end' : 'items-start'}`}>
                    <span className={`text-xs text-gray-500 mb-1 ${reply.is_from_admin ? 'mr-1' : 'ml-1'}`}>
                      {reply.is_from_admin ? 'MEEWA Admin' : selectedEnquiry.name} • {new Date(reply.created_at).toLocaleString()}
                    </span>
                    <div className={`p-4 rounded-2xl shadow-sm max-w-[80%] whitespace-pre-wrap ${
                      reply.is_from_admin 
                        ? 'bg-meewa-red text-white rounded-tr-none' 
                        : 'bg-white border border-gray-200 rounded-tl-none'
                    }`}>
                      {reply.message}
                    </div>
                  </div>
                ))}
              </div>

              {/* Reply Box */}
              <div className="p-4 border-t border-gray-100 bg-white">
                <textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Type your reply here... (This will be sent as an email)"
                  className="w-full border border-gray-200 rounded-xl p-4 focus:outline-none focus:border-meewa-red focus:ring-1 focus:ring-meewa-red resize-none"
                  rows={4}
                />
                <div className="flex justify-between items-end mt-2">
                  <div className="flex flex-col gap-2 max-w-[70%]">
                    <label className="cursor-pointer text-sm text-gray-500 hover:text-meewa-red flex items-center gap-1 w-fit transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                      Attach Photos / PDFs
                      <input 
                        type="file" 
                        multiple 
                        className="hidden" 
                        onChange={(e) => setAttachments(Array.from(e.target.files || []))}
                      />
                    </label>
                    
                    {attachments.length > 0 && (
                      <div className="flex flex-wrap gap-2 text-xs">
                        {attachments.map((f, i) => (
                          <div key={i} className="flex items-center gap-1 bg-gray-100 text-gray-600 px-2 py-1 rounded-md border border-gray-200">
                            <span className="truncate max-w-[120px]">{f.name}</span>
                            <button 
                              onClick={() => setAttachments(attachments.filter((_, idx) => idx !== i))}
                              className="text-gray-400 hover:text-red-500 ml-1"
                              title="Remove attachment"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <span className="text-xs text-gray-400 mt-1">Ensure SMTP is configured in Global Settings before replying.</span>
                  </div>
                  <button 
                    onClick={handleSendReply}
                    disabled={sending || !replyMessage.trim()}
                    className="bg-meewa-red text-white px-6 py-2 rounded-lg font-bold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {sending ? 'Sending...' : 'Send Reply via Email'}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400 flex-col">
              <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <p>Select an enquiry to view details and reply.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
