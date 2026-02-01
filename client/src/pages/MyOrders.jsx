import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Package, CheckCircle, Download, ExternalLink } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // Import as a function

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const { token, user } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/orders/myorders', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(data);
      } catch (err) {
        console.error("Error fetching orders", err);
      }
    };
    if (token) fetchOrders();
  }, [token]);

  // --- PDF GENERATION LOGIC ---
  const generateInvoice = (order) => {
    const doc = new jsPDF();

    // 1. Header Styling
    doc.setFont("serif", "bold");
    doc.setFontSize(22);
    doc.text("OCCAZIONALS", 14, 20);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Premium Fashion Rental & Sales", 14, 28);
    doc.text(`Invoice No: INV-${order._id.slice(-6).toUpperCase()}`, 14, 40);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 14, 45);
    doc.text(`Customer: ${user?.name || 'Valued Client'}`, 14, 50);

    // 2. Table Data
    const tableColumn = ["Product Name", "Order Type", "Price (INR)"];
    const tableRows = order.orderItems.map(item => [
      item.name,
      item.orderType,
      item.price.toLocaleString('en-IN')
    ]);

    // 3. FIX: Call autoTable directly as a function
    autoTable(doc, {
      startY: 60,
      head: [tableColumn],
      body: tableRows,
      theme: 'grid',
      headStyles: { fillStyle: [0, 0, 0], textColor: [255, 255, 255] },
      styles: { font: "helvetica", fontSize: 10 },
    });
    
    // 4. Totals Logic
    const finalY = doc.lastAutoTable.finalY || 70;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(`Grand Total: INR ${order.totalPrice.toLocaleString('en-IN')}`, 14, finalY + 15);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text("Thank you for shopping with Occazionals!", 14, finalY + 30);

    // 5. Save
    doc.save(`Occazionals_Invoice_${order._id.slice(-6)}.pdf`);
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-5xl mx-auto min-h-screen">
      <h1 className="text-3xl font-serif mb-10">Order History</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-3xl">
          <Package className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="text-gray-500">No orders found.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {orders.map((order) => (
            <div key={order._id} className="border rounded-3xl overflow-hidden bg-white hover:shadow-lg transition">
              {/* Order Top Bar */}
              <div className="bg-gray-50 px-8 py-4 flex justify-between items-center border-b">
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-bold">Order ID</p>
                  <p className="text-xs font-mono">#{order._id.slice(-8).toUpperCase()}</p>
                </div>
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Paid</span>
                </div>
              </div>

              {/* Items */}
              <div className="p-8">
                {order.orderItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-6 py-2">
                    <img src={item.image} className="w-12 h-16 object-cover rounded-lg" alt="" />
                    <div className="flex-1">
                      <p className="text-sm font-bold">{item.name}</p>
                      <p className="text-xs text-gray-400 uppercase">{item.orderType}</p>
                    </div>
                    <p className="text-sm font-bold">₹{item.price}</p>
                  </div>
                ))}

                <div className="mt-8 pt-6 border-t flex justify-between items-center">
                  {/* UPDATE THIS BUTTON */}
                  <button 
                    onClick={() => generateInvoice(order)}
                    className="text-[10px] font-bold text-black border-b border-black flex items-center gap-1 hover:opacity-50 transition uppercase tracking-widest"
                  >
                    Download Invoice <Download size={12} />
                  </button>
                  <p className="text-xl font-serif font-bold">Total: ₹{order.totalPrice}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;