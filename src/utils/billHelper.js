import { viewBill, createBill, updateBill } from "../api/bill";

export const getOpenBill = async () => {
  const res = await viewBill();
  const bills = res.data.data || [];
  return bills.find(b => b.status === "open") || null;
};

export const addOrUpdateBillItem = async ({ product, quantity }) => {
  let bill = await getOpenBill();

  // 1️⃣ Create bill if not exists
  if (!bill) {
    const payload = {
      items: [{
        product: product._id,
        productName: product.productname,
        quantity,
        price: product.productprice,
        total: product.productprice * quantity
      }]
    };

    const res = await createBill(payload);
    return res.data.data;
  }

  // 2️⃣ Update existing bill
  const items = [...bill.items];
  const index = items.findIndex(i => i.product === product._id);

  if (quantity === 0) {
    if (index !== -1) items.splice(index, 1);
  } else {
    if (index !== -1) {
      items[index].quantity = quantity;
      items[index].total = quantity * items[index].price;
    } else {
      items.push({
        product: product._id,
        productName: product.productname,
        quantity,
        price: product.productprice,
        total: product.productprice * quantity
      });
    }
  }

  return updateBill(bill._id, { items });
};
