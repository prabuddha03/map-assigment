"use client";

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { removeColorRule, updatePolygon } from '@/store/slices/polygonSlice';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2 } from 'lucide-react';
import ColorRuleForm from './ColorRuleForm';
import { Polygon } from '@/types/polygon';

interface ColorRulesManagerProps {
  polygon: Polygon;
}

const dataSources = [
  { value: 'temperature_2m', label: 'Temperature' },
  { value: 'precipitation', label: 'Precipitation' },
  { value: 'wind_speed_10m', label: 'Wind Speed' },
];

const ColorRulesManager: React.FC<ColorRulesManagerProps> = ({ polygon }) => {
  const dispatch = useDispatch();

  const handleDataSourceChange = (value: string) => {
    dispatch(updatePolygon({ id: polygon.id, updates: { dataSource: value } }));
  };

  return (
    <Card className="mt-2">
      <CardHeader className="p-3">
        <CardTitle className="text-sm">Data Source & Coloring</CardTitle>
      </CardHeader>
      <CardContent className="p-3 space-y-3">
        <Select value={polygon.dataSource} onValueChange={handleDataSourceChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {dataSources.map(ds => (
              <SelectItem key={ds.value} value={ds.value}>{ds.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="space-y-2">
          {polygon.colorRules.map(rule => (
            <div key={rule.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: rule.color }} />
                <Badge variant="outline">{rule.operator} {rule.value}</Badge>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => dispatch(removeColorRule({ polygonId: polygon.id, ruleId: rule.id }))}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
        
        <ColorRuleForm polygonId={polygon.id} />

      </CardContent>
    </Card>
  );
};

export default ColorRulesManager;
