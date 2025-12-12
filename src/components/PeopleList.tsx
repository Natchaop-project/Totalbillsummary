import { Card } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Users, Plus, X, AlertCircle } from 'lucide-react';
import { useState } from 'react';

interface PeopleListProps {
  people: string[];
  setPeople: (people: string[]) => void;
}

export function PeopleList({ people, setPeople }: PeopleListProps) {
  const [newPersonName, setNewPersonName] = useState('');

  const addPerson = () => {
    if (newPersonName.trim()) {
      setPeople([...people, newPersonName.trim()]);
      setNewPersonName('');
    }
  };

  const removePerson = (index: number) => {
    setPeople(people.filter((_, i) => i !== index));
  };

  const updatePersonName = (index: number, name: string) => {
    const updatedPeople = [...people];
    updatedPeople[index] = name;
    setPeople(updatedPeople);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addPerson();
    }
  };

  return (
    <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20">
      <div className="flex items-center gap-2 mb-6">
        <Users className="w-5 h-5 text-purple-400" />
        <h2 className="text-white">คนในกลุ่ม ({people.length})</h2>
      </div>
      
      <div className="space-y-3">
        {/* Error message when no people */}
        {people.length === 0 && (
          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-lg p-3">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <p className="text-red-400 text-sm">กรุณาเพิ่มคนในกลุ่มอย่างน้อย 1 คน</p>
          </div>
        )}

        {/* List of people */}
        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          {people.map((person, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                value={person}
                onChange={(e) => updatePersonName(index, e.target.value)}
                placeholder={`คนที่ ${index + 1}`}
                className="bg-white/5 border-white/20 text-white placeholder:text-purple-300/50"
              />
              <Button
                onClick={() => removePerson(index)}
                variant="ghost"
                size="icon"
                className="text-purple-300 hover:text-red-400 hover:bg-red-400/10"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>

        {/* Add new person */}
        <div className="flex items-center gap-2 pt-3 border-t border-white/20">
          <Input
            value={newPersonName}
            onChange={(e) => setNewPersonName(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="เพิ่มชื่อคน"
            className="bg-white/5 border-white/20 text-white placeholder:text-purple-300/50"
          />
          <Button
            onClick={addPerson}
            className="bg-purple-500 hover:bg-purple-600 text-white"
            size="icon"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}