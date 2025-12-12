import { Card } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { DollarSign } from 'lucide-react';

interface BillCalculatorProps {
  billAmount: number;
  setBillAmount: (value: number) => void;
}

export function BillCalculator({
  billAmount,
  setBillAmount,
}: BillCalculatorProps) {
  return (
    <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20">
      <h2 className="text-white mb-6">Bill Details</h2>
      
      <div>
        <Label htmlFor="billAmount" className="text-purple-200 mb-2 block">
          Bill Amount
        </Label>
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-300" />
          <Input
            id="billAmount"
            type="number"
            value={billAmount || ''}
            onChange={(e) => setBillAmount(Number(e.target.value))}
            placeholder="0.00"
            className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-purple-300/50"
            step="0.01"
            min="0"
          />
        </div>
      </div>
    </Card>
  );
}
