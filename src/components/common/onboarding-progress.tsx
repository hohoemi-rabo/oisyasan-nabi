import { View } from 'react-native';

type Props = {
  current: number;
  total?: number;
};

export function OnboardingProgress({ current, total = 4 }: Props) {
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 1, max: total, now: current }}
      className="flex-row gap-2 items-center justify-center py-3">
      {Array.from({ length: total }, (_, i) => i + 1).map((n) => (
        <View
          key={n}
          className={`h-2 rounded-full ${
            n === current ? 'w-6 bg-blue-600' : 'w-2 bg-neutral-300'
          }`}
        />
      ))}
    </View>
  );
}
