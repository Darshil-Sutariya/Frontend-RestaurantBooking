import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import React, { useState } from 'react'
import { Header } from '../components/Header/Header'
import "../styles/css/Checkout.css"
import { useLocation } from 'react-router-dom';
import { closeBill } from "../api/bill";


const years = [2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035];
const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export const Checkout = () => {

    const [paymentMode, setPaymentMode] = useState(""); // cash | online
    const [onlineType, setOnlineType] = useState("");   // card | upi
    const location = useLocation();
    const { billId, items = [], grandTotal = 0 } = location.state || {};
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState(""); // success | error
    const [upiId, setUpiId] = useState("");
    const [cardMonth, setCardMonth] = useState("");
    const [cardYear, setCardYear] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [cvv, setCvv] = useState("");



    const handlePayNow = async () => {
        try {
            // 🔴 PAYMENT MODE REQUIRED
            if (!paymentMode) {
                setMessage("Please select payment mode");
                setMessageType("error");
                return;
            }

            // 🔴 ONLINE MODE VALIDATION
            if (paymentMode === "online") {

                if (!onlineType) {
                    setMessage("Please select Card or UPI");
                    setMessageType("error");
                    return;
                }

                // 🔴 CARD VALIDATION
                if (onlineType === "card") {

                    if (!cardMonth || !cardYear) {
                        setMessage("Please select card expiry month and year");
                        setMessageType("error");
                        return;
                    }

                    if (!cardNumber || cardNumber.length !== 16) {
                        setMessage("Please enter valid 16-digit card number");
                        setMessageType("error");
                        return;
                    }

                    if (!cvv || cvv.length !== 3) {
                        setMessage("Please enter valid 3-digit CVV");
                        setMessageType("error");
                        return;
                    }
                }

                // 🔴 UPI ID REQUIRED
                if (onlineType === "upi" && !upiId.trim()) {
                    setMessage("Please enter UPI ID");
                    setMessageType("error");
                    return;
                }
            }

            // 🔴 BILL ID CHECK
            if (!billId) {
                setMessage("Bill ID not found");
                setMessageType("error");
                return;
            }

            // ✅ CLOSE BILL API
            await closeBill(billId, {
                paymentMode,
                paymentType: onlineType || "cash",
                paidAmount: grandTotal,
                upiId: onlineType === "upi" ? upiId : null,
            });

            // ✅ PDF
            generateBillPDF();

            setMessage("Payment successful & Bill closed");
            setMessageType("success");

        } catch (error) {
            console.error(error);
            setMessage("Payment failed. Please try again.");
            setMessageType("error");
        }
    };




    const generateBillPDF = () => {
        const doc = new jsPDF();

        // Title
        doc.setFontSize(18);
        doc.text("MyApp - Bill Receipt", 14, 20);

        // Date
        doc.setFontSize(10);
        doc.text(`Date: ${new Date().toLocaleString()}`, 14, 28);

        // Payment Mode Text
        let paymentText = "Payment Mode: Cash";

        if (paymentMode === "online") {
            paymentText = `Payment Mode: Online (${onlineType.toUpperCase()})`;
        }

        // Show payment mode in PDF
        doc.setFontSize(11);
        doc.text(paymentText, 14, 34);


        // Table Data
        const tableColumn = ["Product Name", "Price", "Qty", "Total"];
        const tableRows = [];

        items.forEach(item => {
            tableRows.push([
                item.productName,
                `Rs. ${item.price}`,
                item.quantity,
                `Rs. ${item.total}`
            ]);
        });

        // Auto Table
        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 40,
        });

        // Grand Total
        const finalY = doc.lastAutoTable.finalY || 50;
        doc.setFontSize(14);
        doc.text(`Grand Total: Rs. ${grandTotal}`, 14, finalY + 15);

        // Footer
        doc.setFontSize(10);
        doc.text("Thank you for your purchase!", 14, finalY + 25);

        // Download PDF
        doc.save("Bill.pdf");
    };


    return (
        <div>
            <Header />

            <div className='paymentcheck'>
                <h3>Payment Details:</h3>

                <div className='paymentdetails'>

                    {/* LEFT SIDE */}
                    <div className='payleft'>

                        {/* PAYMENT MODE */}
                        <div className='paymentmode'>
                            <h5>Payment Mode :</h5>

                            <label className='cashrad'>
                                <input
                                    type="radio"
                                    name="payment"
                                    value="cash"
                                    onChange={(e) => setPaymentMode(e.target.value)}
                                />
                                Cash
                            </label>

                            <label className='onrad'>
                                <input
                                    type="radio"
                                    name="payment"
                                    value="online"
                                    onChange={(e) => setPaymentMode(e.target.value)}
                                />
                                Online
                            </label>
                        </div>

                        {/* IF ONLINE SELECTED */}
                        {paymentMode === "online" && (
                            <>
                                {/* ONLINE TYPE */}
                                <div className='onlinepay'>
                                    <select
                                        value={onlineType}
                                        onChange={(e) => setOnlineType(e.target.value)}
                                        required
                                    >
                                        <option value="" disabled>Please Select Payment Mode</option>
                                        <option value="card">Card</option>
                                        <option value="upi" >UPI</option>
                                    </select>
                                </div>

                                {/* CARD PAYMENT */}
                                {onlineType === "card" && (
                                    <div className='cardpay'>
                                        <div className='cardexp'>
                                            <select value={cardMonth} onChange={(e) => setCardMonth(e.target.value)}>
                                                <option value="">Card Expiry Month</option>
                                                {months.map((m, i) => (
                                                    <option key={i} value={m}>{m}</option>
                                                ))}
                                            </select>


                                            <select value={cardYear} onChange={(e) => setCardYear(e.target.value)}>
                                                <option value="">Card Expiry Year</option>
                                                {years.map((y, i) => (
                                                    <option key={i} value={y}>{y}</option>
                                                ))}
                                            </select>

                                        </div>

                                        <div className='cardnum'>
                                            <input
                                                type="text"
                                                placeholder="Please Enter Card Number"
                                                value={cardNumber}
                                                maxLength={16}
                                                onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ""))}
                                            />

                                        </div>

                                        <div className='cardcvv'>
                                            <input
                                                type="password"
                                                placeholder="Please Enter CVV Number"
                                                value={cvv}
                                                maxLength={3}
                                                onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
                                            />

                                        </div>
                                    </div>
                                )}

                                {/* UPI PAYMENT */}
                                {onlineType === "upi" && (
                                    <div className='upipay'>
                                        <input
                                            type="text"
                                            placeholder="Please Enter UPI ID"
                                            value={upiId}
                                            onChange={(e) => setUpiId(e.target.value)}
                                        />

                                    </div>
                                )}
                            </>
                        )}

                        {/* PAY NOW BUTTON (CASH OR ONLINE) */}
                        {paymentMode && (
                            <div className='paybtn'>
                                <button
                                    onClick={handlePayNow}
                                    disabled={
                                        paymentMode === "online" &&
                                        (
                                            !onlineType ||
                                            (onlineType === "upi" && !upiId.trim()) ||
                                            (onlineType === "card" &&
                                                (!cardMonth || !cardYear || cardNumber.length !== 16 || cvv.length !== 3)
                                            )
                                        )
                                    }

                                >
                                    Pay Now
                                </button>

                                {message && (
                                    <p
                                        className={`pay-message ${messageType}`}
                                    >
                                        {message}
                                    </p>
                                )}

                            </div>
                        )}

                    </div>

                    {/* RIGHT SIDE */}
                    <div className='payright'>
                        <h5>Cart Summary :</h5>

                        <div className='productsummary'>

                            {items.map((item, index) => (
                                <div className='pnameprice' key={index}>
                                    <p className='productName'>{item.productName}</p>
                                    <p className='productprice'>₹{item.total}</p>
                                </div>
                            ))}

                            <div className='cproducttotal'>
                                <p>Total</p>
                                <p>₹{grandTotal}</p>
                            </div>

                        </div>
                    </div>


                </div>
            </div>
        </div>
    )
}
