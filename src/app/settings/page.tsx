"use client";

import { ThemeSelector } from "@/components/theme-selector";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  return (
    <main className="flex-1 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold">Settings</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your application preferences
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Theme</label>
                  <p className="text-sm text-muted-foreground mb-4">
                    Select a theme for the application. Choose from our
                    predefined themes or customize your own.
                  </p>
                  <ThemeSelector />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Add more settings sections here */}
        </div>
      </div>
    </main>
  );
}
