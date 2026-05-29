import { Linking } from 'react-native';

export async function callPhone(tel: string | null | undefined): Promise<void> {
  if (!tel) return;
  const digits = tel.replace(/[^\d+]/g, '');
  if (!digits) return;
  await Linking.openURL(`tel:${digits}`);
}

type MapsArgs = {
  latitude?: number | null;
  longitude?: number | null;
  address?: string | null;
  googleMapUrl?: string | null;
};

export async function openGoogleMaps({
  latitude,
  longitude,
  address,
  googleMapUrl,
}: MapsArgs): Promise<void> {
  if (latitude != null && longitude != null) {
    const nav = `google.navigation:q=${latitude},${longitude}&mode=d`;
    if (await Linking.canOpenURL(nav)) {
      await Linking.openURL(nav);
      return;
    }
    await Linking.openURL(`geo:${latitude},${longitude}?q=${latitude},${longitude}`);
    return;
  }
  if (googleMapUrl) {
    await Linking.openURL(googleMapUrl);
    return;
  }
  if (address) {
    const q = encodeURIComponent(address);
    await Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${q}`);
  }
}

export async function openWebsite(url: string | null | undefined): Promise<void> {
  if (!url) return;
  await Linking.openURL(url);
}
