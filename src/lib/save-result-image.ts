import * as MediaLibrary from 'expo-media-library';
import type { RefObject } from 'react';
import type { View } from 'react-native';
import { captureRef } from 'react-native-view-shot';

// 症状まとめ View を PNG でキャプチャして端末のフォトライブラリへ保存する。
// 権限拒否・キャプチャ失敗時は false を返す（呼び出し側で通知）。
export async function saveResultImage(ref: RefObject<View | null>): Promise<boolean> {
  if (!ref.current) return false;
  try {
    const permission = await MediaLibrary.requestPermissionsAsync();
    if (!permission.granted) return false;
    const uri = await captureRef(ref, { format: 'png', quality: 1 });
    await MediaLibrary.saveToLibraryAsync(uri);
    return true;
  } catch {
    return false;
  }
}
