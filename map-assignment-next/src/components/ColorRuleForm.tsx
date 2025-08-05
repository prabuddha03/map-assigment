"use client";

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addColorRule } from '@/store/slices/polygonSlice';
import { ColorRule } from '@/types/polygon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, MoreVertical } from 'lucide-react';

interface ColorRuleFormProps {
  polygonId: string;
}

const ColorRuleForm: React.FC<ColorRuleFormProps> = ({ polygonId }) => {
  const dispatch = useDispatch();
  const [operator, setOperator] = useState<'<' | '>'>('>');
  const [value, setValue] = useState<number | ''>('');
  const [color, setColor] = useState('#ff0000');

  const handleAddRule = () => {
    if (value === '' || isNaN(Number(value))) {
      // Basic validation: ensure value is not empty and is a number
      alert('Please enter a valid number for the rule.');
      return;
    }
    const newRule: Omit<ColorRule, 'id'> = { operator, value: Number(value), color };
    dispatch(addColorRule({ polygonId, rule: newRule }));
    // Reset form
    setValue('');
    setOperator('>');
    setColor('#ff0000');
  };

  return (
    <div className="flex items-center gap-1 p-2 border rounded-lg bg-background">
      <Select value={operator} onValueChange={(val: '<' | '>') => setOperator(val)}>
        <SelectTrigger className="w-14">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value=">">{'>'}</SelectItem>
          <SelectItem value="<">{'<'}</SelectItem>
        </SelectContent>
      </Select>
      <Input
        type="number"
        value={value}
        onChange={(e) => setValue(e.target.value === '' ? '' : parseFloat(e.target.value))}
        className="flex-1 text-base px-2"
        placeholder="Value"
      />
      <Input
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
        className="w-10 h-10 p-1 bg-transparent border-none"
      />
      <Button variant="ghost" size="icon" onClick={handleAddRule} className="h-10 w-10">
        <PlusCircle className="h-5 w-5" />
        <span className="sr-only">Add Rule</span>
      </Button>
    </div>
  );
};

export default ColorRuleForm;
