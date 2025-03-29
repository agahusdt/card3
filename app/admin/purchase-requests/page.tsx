'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface PurchaseRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  amount: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

export default function AdminPurchaseRequests() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [purchaseRequests, setPurchaseRequests] = useState<PurchaseRequest[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [actionStatus, setActionStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const response = await fetch('/api/user');
        const data = await response.json();
        
        if (!data.success) {
          console.error('Failed to fetch user data:', data.error);
          router.push('/');
          return;
        }
        
        if (data.data.role !== 'ADMIN') {
          console.error('User is not an admin');
          router.push('/dashboard');
          return;
        }
        
        setIsAdmin(true);
        fetchPurchaseRequests();
      } catch (error) {
        console.error('Failed to check admin status:', error);
        router.push('/');
      }
    };

    const fetchPurchaseRequests = async () => {
      try {
        const response = await fetch('/api/admin/purchase-requests');
        const data = await response.json();
        
        if (!data.success) {
          console.error('Failed to fetch purchase requests:', data.error);
          setIsLoading(false);
          return;
        }
        
        setPurchaseRequests(data.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch purchase requests:', error);
        setIsLoading(false);
      }
    };

    checkAdminStatus();
  }, [router]);

  const handleAction = async (requestId: string, action: 'approve' | 'reject') => {
    setIsProcessing(true);
    setActionStatus({ type: null, message: '' });

    try {
      const response = await fetch('/api/admin/purchase-requests/action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requestId,
          action
        }),
      });

      const data = await response.json();

      if (data.success) {
        setActionStatus({ 
          type: 'success', 
          message: `Request ${action === 'approve' ? 'approved' : 'rejected'} successfully!` 
        });
        
        // Update the local state
        setPurchaseRequests(prev => 
          prev.map(req => 
            req.id === requestId 
              ? { ...req, status: action === 'approve' ? 'APPROVED' : 'REJECTED' } 
              : req
          )
        );
      } else {
        setActionStatus({ 
          type: 'error', 
          message: data.error || `Failed to ${action} request` 
        });
      }
    } catch (error) {
      console.error(`Error ${action}ing request:`, error);
      setActionStatus({ 
        type: 'error', 
        message: `An error occurred while ${action}ing the request` 
      });
    } finally {
      setIsProcessing(false);
      // Clear status message after 3 seconds
      setTimeout(() => {
        setActionStatus({ type: null, message: '' });
      }, 3000);
    }
  };

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-white">Checking permissions...</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 mt-20 md:mt-0">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-pink-600/5 rounded-2xl blur-3xl"></div>
        <div className="relative">
          <div className="space-y-8" style={{ opacity: 1 }}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h1 className="text-3xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text" style={{ transform: 'none' }}>
                Purchase Requests
              </h1>
            </div>

            {actionStatus.type && (
              <div className={`p-4 rounded-xl ${
                actionStatus.type === 'success' 
                  ? 'bg-green-500/10 text-green-400' 
                  : 'bg-red-500/10 text-red-400'
              }`}>
                {actionStatus.message}
              </div>
            )}

            <div className="text-card-foreground shadow bg-black/40 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden">
              <div className="p-6 border-b border-white/5">
                <h2 className="text-xl font-bold text-white">Coin Purchase Requests</h2>
              </div>
              <div className="p-6">
                {purchaseRequests.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    No purchase requests found
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">User</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Amount</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Date</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Status</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {purchaseRequests.map((request) => (
                          <tr key={request.id} className="border-b border-white/5 hover:bg-white/5">
                            <td className="px-4 py-4">
                              <div>
                                <p className="text-white font-medium">{request.userName}</p>
                                <p className="text-gray-400 text-sm">{request.userEmail}</p>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <span className="text-white font-medium">{request.amount} $GROK</span>
                            </td>
                            <td className="px-4 py-4">
                              <span className="text-gray-400">
                                {new Date(request.createdAt).toLocaleString()}
                              </span>
                            </td>
                            <td className="px-4 py-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                request.status === 'PENDING' 
                                  ? 'bg-yellow-500/20 text-yellow-400' 
                                  : request.status === 'APPROVED' 
                                    ? 'bg-green-500/20 text-green-400' 
                                    : 'bg-red-500/20 text-red-400'
                              }`}>
                                {request.status}
                              </span>
                            </td>
                            <td className="px-4 py-4">
                              {request.status === 'PENDING' ? (
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => handleAction(request.id, 'approve')}
                                    disabled={isProcessing}
                                    className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition"
                                  >
                                    Approve
                                  </button>
                                  <button
                                    onClick={() => handleAction(request.id, 'reject')}
                                    disabled={isProcessing}
                                    className="px-3 py-1 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition"
                                  >
                                    Reject
                                  </button>
                                </div>
                              ) : (
                                <span className="text-gray-400">
                                  {request.status === 'APPROVED' ? 'Approved' : 'Rejected'}
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 