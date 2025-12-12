import { Card } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { UtensilsCrossed, Plus, X, Wallet } from 'lucide-react';
import { useState } from 'react';
import { FoodItem } from '../App';

interface FoodListProps {
  foodItems: FoodItem[];
  setFoodItems: (items: FoodItem[]) => void;
  people: string[];
}

export function FoodList({ foodItems, setFoodItems, people }: FoodListProps) {
  const [newFoodName, setNewFoodName] = useState('');
  const [newFoodPrice, setNewFoodPrice] = useState('');

  const addFood = () => {
    if (newFoodName.trim() && newFoodPrice && parseFloat(newFoodPrice) > 0) {
      const newFood: FoodItem = {
        id: Date.now().toString(),
        name: newFoodName.trim(),
        price: parseFloat(newFoodPrice),
        sharedBy: [],
        paidBy: people[0] || '',
      };
      setFoodItems([...foodItems, newFood]);
      setNewFoodName('');
      setNewFoodPrice('');
    }
  };

  const removeFood = (id: string) => {
    setFoodItems(foodItems.filter(item => item.id !== id));
  };

  const togglePerson = (foodId: string, person: string) => {
    setFoodItems(foodItems.map(item => {
      if (item.id === foodId) {
        const sharedBy = item.sharedBy.includes(person)
          ? item.sharedBy.filter(p => p !== person)
          : [...item.sharedBy, person];
        return { ...item, sharedBy };
      }
      return item;
    }));
  };

  const setPaidBy = (foodId: string, person: string) => {
    setFoodItems(foodItems.map(item => {
      if (item.id === foodId) {
        return { ...item, paidBy: person };
      }
      return item;
    }));
  };

  const selectAllPeople = (foodId: string) => {
    setFoodItems(foodItems.map(item => {
      if (item.id === foodId) {
        return { ...item, sharedBy: [...people] };
      }
      return item;
    }));
  };

  const toggleAllPeople = (foodId: string) => {
    setFoodItems(foodItems.map(item => {
      if (item.id === foodId) {
        // If all people are selected, deselect all. Otherwise, select all
        const allSelected = people.every(person => item.sharedBy.includes(person));
        return { ...item, sharedBy: allSelected ? [] : [...people] };
      }
      return item;
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addFood();
    }
  };

  return (
    <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20">
      <div className="flex items-center gap-2 mb-6">
        <UtensilsCrossed className="w-5 h-5 text-purple-400" />
        <h2 className="text-white">รายการอาหาร ({foodItems.length})</h2>
      </div>
      
      <div className="space-y-4">
        {/* Add new food */}
        <div className="space-y-3 pb-4 border-b border-white/20">
          <div>
            <Label htmlFor="foodName" className="text-purple-200 mb-2 block">
              ชื่ออาหาร
            </Label>
            <Input
              id="foodName"
              value={newFoodName}
              onChange={(e) => setNewFoodName(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="กรอกชื่ออาหาร"
              className="bg-white/5 border-white/20 text-white placeholder:text-purple-300/50"
            />
          </div>

          <div>
            <Label htmlFor="foodPrice" className="text-purple-200 mb-2 block">
              ราคา
            </Label>
            <Input
              id="foodPrice"
              type="number"
              value={newFoodPrice}
              onChange={(e) => setNewFoodPrice(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="0.00"
              className="bg-white/5 border-white/20 text-white placeholder:text-purple-300/50"
              step="0.01"
              min="0"
            />
          </div>

          <Button
            onClick={addFood}
            className="w-full bg-purple-500 hover:bg-purple-600 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            เพิ่มอาหาร
          </Button>
        </div>

        {/* List of food items */}
        <div className="space-y-3 max-h-[500px] overflow-y-auto">
          {foodItems.length === 0 ? (
            <div className="text-center py-8 text-purple-300/50">
              ยังไม่มีรายการอาหาร เพิ่มกันเถอะ!
            </div>
          ) : (
            foodItems.map((item) => (
              <div key={item.id} className="bg-white/5 rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="text-white">{item.name}</div>
                      {item.paidBy && (
                        <Badge className="bg-green-500/20 text-green-300 border-green-500/30 hover:bg-green-500/30">
                          <Wallet className="w-3 h-3 mr-1" />
                          {item.paidBy}
                        </Badge>
                      )}
                    </div>
                    <div className="text-purple-300 text-sm mt-1">
                      ${item.price.toFixed(2)}
                    </div>
                  </div>
                  <Button
                    onClick={() => removeFood(item.id)}
                    variant="ghost"
                    size="icon"
                    className="text-purple-300 hover:text-red-400 hover:bg-red-400/10 flex-shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {/* Who paid */}
                {people.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-white/10">
                    <Label htmlFor={`paidBy-${item.id}`} className="text-purple-200 text-sm">
                      ใครจ่าย?
                    </Label>
                    <Select value={item.paidBy} onValueChange={(value) => setPaidBy(item.id, value)}>
                      <SelectTrigger 
                        id={`paidBy-${item.id}`}
                        className="bg-white/5 border-white/20 text-white"
                      >
                        <SelectValue placeholder="เลือกคน" />
                      </SelectTrigger>
                      <SelectContent>
                        {people.map((person, index) => (
                          <SelectItem key={index} value={person}>
                            {person || `คนที่ ${index + 1}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* People checkboxes */}
                {people.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-white/10">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`${item.id}-all`}
                        checked={people.every(person => item.sharedBy.includes(person))}
                        onCheckedChange={() => toggleAllPeople(item.id)}
                        className="border-white/20 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
                      />
                      <label
                        htmlFor={`${item.id}-all`}
                        className="text-sm text-purple-200 cursor-pointer"
                      >
                        ทุกคน
                      </label>
                    </div>
                    <div className="space-y-2 pl-6">
                      {people.map((person, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Checkbox
                            id={`${item.id}-${person}`}
                            checked={item.sharedBy.includes(person)}
                            onCheckedChange={() => togglePerson(item.id, person)}
                            className="border-white/20 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
                          />
                          <label
                            htmlFor={`${item.id}-${person}`}
                            className="text-sm text-purple-200 cursor-pointer"
                          >
                            {person || `คนที่ ${index + 1}`}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </Card>
  );
}