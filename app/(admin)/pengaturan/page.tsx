// app/pengaturan/page.tsx
import { getSettings } from "@/actions/setting";
import { SettingForm } from "@/components/setting/SettingForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function SettingsPage() {
  const settings = await getSettings();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Pengaturan Aplikasi</h1>
      
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Parameter Zakat</CardTitle>
        </CardHeader>
        <CardContent>
          <SettingForm initialData={settings} />
        </CardContent>
      </Card>
    </div>
  );
}
