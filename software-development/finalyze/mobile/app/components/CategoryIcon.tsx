import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import AntDesign from '@expo/vector-icons/AntDesign';

type CategoryIconProps = {
  category: string;
  color?: string; // optional color prop
};

export default function CategoryIcon({
  category,
  color = 'white',
}: CategoryIconProps) {
  let IconComponent: any = FontAwesome; // default to FontAwesome
  let iconName = 'question'; // default icon

  switch (category) {
    case 'Salary':
      IconComponent = FontAwesome;
      iconName = 'suitcase';
      break;
    case 'Investment':
    case 'Freelance':
    case 'Savings':
      IconComponent = FontAwesome;
      iconName = 'money';
      break;
    case 'Food':
      IconComponent = FontAwesome;
      iconName = 'cutlery';
      break;
    case 'Transport':
      IconComponent = FontAwesome;
      iconName = 'bus';
      break;
    case 'Health':
      IconComponent = AntDesign;
      iconName = 'medicinebox';
      break;
    case 'Groceries':
      IconComponent = FontAwesome;
      iconName = 'shopping-basket';
      break;
    case 'Rent':
      IconComponent = AntDesign;
      iconName = 'key';
      break;
    case 'Gifts':
      IconComponent = AntDesign;
      iconName = 'gift';
      break;
    case 'Entertainment':
      IconComponent = AntDesign;
      iconName = 'smileo';
      break;
    case 'Profile':
      IconComponent = FontAwesome6;
      iconName = 'person';
      break;
    case 'Pie':
      IconComponent = FontAwesome6;
      iconName = 'chart-pie';
      break;
    case 'List':
      IconComponent = FontAwesome6;
      iconName = 'list';
      break;
    case 'Add':
      IconComponent = FontAwesome6;
      iconName = 'add';
      break;
  }

  return <IconComponent name={iconName} size={24} color={color} />;
}
