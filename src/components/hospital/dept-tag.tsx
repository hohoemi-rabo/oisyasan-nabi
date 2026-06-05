import { Text, View } from 'react-native';

import { colors } from '@/src/constants/colors';
import { deptTagColor } from '@/src/constants/dept-colors';

// 診療科タグ（DESIGN-GUIDELINES.md §5.4）。診療科カテゴリで色分け。
// matched=true で推奨/該当科を強調（枠線追加）。
export function DeptTag({ name, matched = false }: { name: string; matched?: boolean }) {
  const c = deptTagColor(name);
  return (
    <View
      style={{
        backgroundColor: c.bg,
        borderWidth: matched ? 1.5 : 0,
        borderColor: matched ? colors.teal[500] : 'transparent',
      }}
      className="rounded-lg px-2.5 py-1 mr-1.5 mb-1.5">
      <Text style={{ color: c.text }} className="text-[11px] font-bold">
        {name}
      </Text>
    </View>
  );
}
