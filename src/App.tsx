import { useState, useMemo } from 'react';
import { BillSummary } from './components/BillSummary';
import { PeopleList } from './components/PeopleList';
import { FoodList } from './components/FoodList';
import { Receipt } from 'lucide-react';

export interface FoodItem {
  id: string;
  name: string;
  price: number;
  sharedBy: string[]; // รายชื่อคนที่กิน
  paidBy: string; // คนที่ออกตังก่อน
}

export default function App() {
  const [people, setPeople] = useState<string[]>([]);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);

  // คำนวณยอดรวม
  const totalBill = useMemo(() => {
    return foodItems.reduce((sum, item) => sum + item.price, 0);
  }, [foodItems]);

  // คำนวณเงินที่แต่ละคนต้องจ่าย (จากอาหารที่กิน)
  const personAmounts = useMemo(() => {
    const amounts: { [key: string]: number } = {};
    
    // เริ่มต้นทุกคนที่ 0
    people.forEach(person => {
      amounts[person] = 0;
    });

    // คำนวณจากแต่ละรายการอาหาร
    foodItems.forEach(item => {
      if (item.sharedBy.length > 0) {
        const pricePerPerson = item.price / item.sharedBy.length;
        item.sharedBy.forEach(person => {
          amounts[person] = (amounts[person] || 0) + pricePerPerson;
        });
      }
    });

    return amounts;
  }, [foodItems, people]);

  // คำนวณเงินที่แต่ละคนจ่ายไปจริงๆ (paidBy)
  const personPaid = useMemo(() => {
    const paid: { [key: string]: number } = {};
    
    people.forEach(person => {
      paid[person] = 0;
    });

    foodItems.forEach(item => {
      if (item.paidBy) {
        paid[item.paidBy] = (paid[item.paidBy] || 0) + item.price;
      }
    });

    return paid;
  }, [foodItems, people]);

  // คำนวณการโอนเงิน
  const transactions = useMemo(() => {
    // คำนวณ balance ของแต่ละคน (จ่ายไป - ควรจ่าย)
    const balances: { [key: string]: number } = {};
    people.forEach(person => {
      balances[person] = (personPaid[person] || 0) - (personAmounts[person] || 0);
    });

    // แยกคนที่ต้องได้เงินคืน และคนที่ต้องจ่ายเงิน
    const creditors: { person: string; amount: number }[] = [];
    const debtors: { person: string; amount: number }[] = [];

    Object.entries(balances).forEach(([person, balance]) => {
      if (balance > 0.01) {
        creditors.push({ person, amount: balance });
      } else if (balance < -0.01) {
        debtors.push({ person, amount: -balance });
      }
    });

    // สร้าง transactions
    const txs: { from: string; to: string; amount: number }[] = [];
    let i = 0, j = 0;

    while (i < debtors.length && j < creditors.length) {
      const debtor = debtors[i];
      const creditor = creditors[j];
      const amount = Math.min(debtor.amount, creditor.amount);

      if (amount > 0.01) {
        txs.push({
          from: debtor.person,
          to: creditor.person,
          amount: amount
        });
      }

      debtor.amount -= amount;
      creditor.amount -= amount;

      if (debtor.amount < 0.01) i++;
      if (creditor.amount < 0.01) j++;
    }

    return txs;
  }, [people, personAmounts, personPaid]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Receipt className="w-10 h-10 text-purple-400" />
            <h1 className="text-white">บิลทั้งหมดเมื่อคืนนี้</h1>
          </div>
          <p className="text-purple-200">คำนวณและแบ่งบิลกับเพื่อนๆ</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="space-y-6">
            <PeopleList
              people={people}
              setPeople={setPeople}
            />
          </div>

          <div className="space-y-6">
            <FoodList
              foodItems={foodItems}
              setFoodItems={setFoodItems}
              people={people}
            />
          </div>
          
          <BillSummary
            totalBill={totalBill}
            people={people}
            personAmounts={personAmounts}
            personPaid={personPaid}
            foodItems={foodItems}
            transactions={transactions}
          />
        </div>
      </div>
    </div>
  );
}