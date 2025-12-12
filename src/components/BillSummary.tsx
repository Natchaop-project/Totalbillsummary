import { Card } from './ui/card';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { Receipt, User, DollarSign, UtensilsCrossed, Wallet, ArrowRight, Download } from 'lucide-react';
import { FoodItem } from '../App';
import { Button } from './ui/button';
import { useRef } from 'react';
import html2canvas from 'html2canvas';

interface Transaction {
  from: string;
  to: string;
  amount: number;
}

interface BillSummaryProps {
  totalBill: number;
  people: string[];
  personAmounts: { [key: string]: number };
  personPaid: { [key: string]: number };
  foodItems: FoodItem[];
  transactions: Transaction[];
}

export function BillSummary({
  totalBill,
  people,
  personAmounts,
  personPaid,
  foodItems,
  transactions,
}: BillSummaryProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const cardRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    if (cardRef.current) {
      html2canvas(cardRef.current).then(canvas => {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'bill_summary.png';
        link.click();
      });
    }
  };

  return (
    <div className="space-y-4">
      <div ref={cardRef}>
        <Card className="p-6 bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-lg border-white/20">
          <h2 className="text-white mb-6">สรุป</h2>
          
          <div className="space-y-4">
            {/* Total Bill */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-purple-300" />
                <span className="text-purple-200">ยอดรวมทั้งหมด</span>
              </div>
              <span className="text-white">{formatCurrency(totalBill)}</span>
            </div>

            <Separator className="bg-white/20" />

            {/* Transactions - Who owes whom */}
            {transactions.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-purple-200 mb-3 flex items-center gap-2">
                  <ArrowRight className="w-4 h-4" />
                  โอนเงิน
                </h3>
                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                  {transactions.map((tx, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-r from-orange-500/10 to-pink-500/10 rounded-lg p-3 border border-orange-500/20"
                    >
                      <div className="flex items-center gap-2 text-sm">
                        <div className="flex items-center gap-2 flex-1">
                          <User className="w-4 h-4 text-orange-300" />
                          <span className="text-white">{tx.from}</span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-orange-400 flex-shrink-0" />
                        <div className="flex items-center gap-2 flex-1">
                          <User className="w-4 h-4 text-green-300" />
                          <span className="text-white">{tx.to}</span>
                        </div>
                      </div>
                      <div className="text-center mt-2">
                        <span className="text-orange-300">{formatCurrency(tx.amount)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Each Person Summary */}
            {people.length > 0 && totalBill > 0 && (
              <>
                <Separator className="bg-white/20 mt-4" />
                <div className="space-y-2">
                  <h3 className="text-purple-200 mb-3">สรุปแต่ละคน</h3>
                  <div className="space-y-2 max-h-[200px] overflow-y-auto">
                    {people.map((person, index) => {
                      const owes = personAmounts[person] || 0;
                      const paid = personPaid[person] || 0;
                      const balance = paid - owes;
                      
                      return (
                        <div
                          key={index}
                          className="bg-white/5 rounded-lg p-3 space-y-1"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-purple-300" />
                              <span className="text-purple-100">{person || `คนที่ ${index + 1}`}</span>
                            </div>
                          </div>
                          <div className="text-xs space-y-1 pl-6">
                            <div className="flex justify-between text-purple-300">
                              <span>ควรจ่าย:</span>
                              <span>{formatCurrency(owes)}</span>
                            </div>
                            <div className="flex justify-between text-green-300">
                              <span>จ่ายไปแล้ว:</span>
                              <span>{formatCurrency(paid)}</span>
                            </div>
                            {balance !== 0 && (
                              <div className={`flex justify-between ${balance > 0 ? 'text-green-400' : 'text-orange-400'}`}>
                                <span>{balance > 0 ? 'ได้รับคืน:' : 'ต้องจ่าย:'}</span>
                                <span>{formatCurrency(Math.abs(balance))}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {/* Food Items Breakdown */}
            {foodItems.length > 0 && (
              <>
                <Separator className="bg-white/20 mt-6" />
                <div className="mt-4 space-y-2">
                  <h3 className="text-purple-200 mb-3 flex items-center gap-2">
                    <UtensilsCrossed className="w-4 h-4" />
                    รายการอาหาร
                  </h3>
                  <div className="space-y-2 max-h-[250px] overflow-y-auto">
                    {foodItems.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white/5 rounded-lg p-3 space-y-2"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <div className="text-white text-sm">{item.name}</div>
                              {item.paidBy && (
                                <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-xs">
                                  <Wallet className="w-3 h-3 mr-1" />
                                  {item.paidBy}
                                </Badge>
                              )}
                            </div>
                            <div className="text-purple-300 text-xs mt-1">
                              {formatCurrency(item.price)}
                            </div>
                          </div>
                        </div>
                        
                        {item.sharedBy.length > 0 && (
                          <div className="text-xs text-purple-300">
                            กินร่วมกันโดย: {item.sharedBy.join(', ')}
                            <div className="text-purple-400 mt-1">
                              {formatCurrency(item.price / item.sharedBy.length)} ต่อคน
                            </div>
                          </div>
                        )}
                        
                        {item.sharedBy.length === 0 && (
                          <div className="text-xs text-yellow-400">
                            ⚠️ ยังไม่มีใครเลือก
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Stats */}
            {totalBill > 0 && (
              <div className="mt-6 pt-6 border-t border-white/20">
                <h3 className="text-purple-200 mb-3">สถิติ</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-purple-300">
                    <span>ยอดรวมทั้งหมด:</span>
                    <span>{formatCurrency(totalBill)}</span>
                  </div>
                  <div className="flex justify-between text-purple-300">
                    <span>จำนวนคน:</span>
                    <span>{people.length}</span>
                  </div>
                  <div className="flex justify-between text-purple-300">
                    <span>จำนวนรายการ:</span>
                    <span>{foodItems.length}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Download button outside the card */}
      {totalBill > 0 && (
        <Button
          className="w-full bg-purple-500 hover:bg-purple-600 text-white"
          onClick={handleDownload}
        >
          <Download className="w-4 h-4 mr-2" />
          ดาวน์โหลดรูปภาพ
        </Button>
      )}
    </div>
  );
}