import React, { useEffect, useState } from 'react'
import { Header } from '../components/Header/Header'
import "../styles/css/Cart.css"
import { MdDelete } from "react-icons/md";
import { viewBill } from '../api/bill';
import { Link } from 'react-router-dom';
import { updateBill } from '../api/bill';


export const Cart = () => {

    const [bills, setBills] = useState([]);

    const fetchBillData = async () => {
        try {
            const billResponse = await viewBill();
            const openBills = (billResponse.data.data || []).filter(
                bill => bill.status === "open"
            );

            setBills(openBills);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    useEffect(() => {
        fetchBillData();
    }, [])



    const handleDeleteItem = async (billId, productId) => {
        try {
            const bill = bills.find(b => b._id === billId);
            if (!bill) return;

            // ✅ remove clicked product
            const remainingItems = bill.items.filter(
                item => item.product !== productId
            );

            const payloadItems = remainingItems.map(item => ({
                productId: item.product,   // 🔥 correct mapping
                quantity: item.quantity
            }));

            await updateBill(billId, {
                items: payloadItems
            });

            fetchBillData();

        } catch (error) {
            console.error("Delete error:", error);
        }
    };




    const slugify = (text) => {
        return text
            .toLowerCase()          // Capital → small
            .trim()                // Extra spaces remove
            .replace(/\s+/g, "-")  // Space → -
            .replace(/[^\w-]+/g, "") // Special characters remove
            .replace(/--+/g, "-"); // Multiple - → single -
    };



    return (
        <div>
            <Header />

            <div >

                <table className="carttable">
                    <thead>
                        <tr className="cartrow1">
                            <th className="carthead">Product</th>
                            <th className="carthead">Name</th>
                            <th className="carthead">Price</th>
                            <th className="carthead">Qty</th>
                            <th className="carthead">Total</th>
                            <th className="carthead">Action</th>
                        </tr>
                    </thead>


                    <tbody>
                        {bills.map((bill) =>
                            bill.items.map((item, index) => (
                                <tr
                                    className="cartrow2 premium-row"
                                    key={`${bill._id}-${index}`}
                                    style={{ animationDelay: `${index * 0.08}s` }}
                                >
                                    <td className="cartdata image-cell">
                                        <Link to={`/product/${slugify(item.productName)}`}>
                                            <img src={item.productImg} alt={item.productName} />
                                        </Link>
                                    </td>

                                    <td className="cartdata name-cell">
                                        {item.productName}
                                    </td>

                                    <td className="cartdata price-cell">
                                        ₹{item.price}
                                    </td>

                                    <td className="cartdata qty-cell">
                                        {item.quantity}
                                    </td>

                                    <td className="cartdata total-cell">
                                        ₹{item.total}
                                    </td>

                                    <td className="cartdata action-cell">
                                        <MdDelete
                                            className="cartdelete"
                                            onClick={() => handleDeleteItem(bill._id, item.product)}
                                        />
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>



                <div className='billdetails'>
                    <h3>Bill Details</h3>

                    {bills.map((bill) => (
                        <div key={bill._id}>
                            {bill.items.map((item, index) => (
                                <div key={index}>
                                    <h4 className='productbill'>{item.productName}</h4>
                                    <div className='billsub'>
                                        <h5>Price:</h5>
                                        <h5>₹{item.price}</h5>
                                    </div>

                                    <div className='billqty'>
                                        <h5>Quantity:</h5>
                                        <h5>{item.quantity}</h5>
                                    </div>

                                    <div className='billtotal'>
                                        <h5>Total</h5>
                                        <h5>₹{item.total}</h5>
                                    </div>
                                </div>
                            ))}

                            {/* ✅ Bill level total */}
                            <div className='billtotalamount'>
                                <h5>Total Amount</h5>
                                <h5>₹{bill.grandTotal}</h5>
                            </div>
                        </div>
                    ))}

                    <div className='checkoutbtn'>

                        <Link
                            to="/checkout"
                            state={{
                                billId: bills[0]?._id,
                                items: bills[0]?.items || [],
                                grandTotal: bills[0]?.grandTotal || 0
                            }}
                        >
                            <button>PROCEED CHECKOUT</button>
                        </Link>

                    </div>
                </div>

            </div>
        </div >
    )
}
