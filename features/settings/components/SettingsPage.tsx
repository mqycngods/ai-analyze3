"use client";

import { Button, Card } from "@/ui";
import { settingsSections } from "@/features/settings/data/settings.mock";

type PageProps = {
  notify?: (message: string) => void;
};

function SectionHeading({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-4">
      <h2 className="text-lg font-semibold mb-1">{title}</h2>
      <p className="text-xs text-muted-foreground m-0">{description}</p>
    </div>
  );
}

export function SettingsPage({ notify }: PageProps) {
  return (
    <div className="grid gap-6">
      {settingsSections.map((section) => (
        <Card className="p-0 border-none shadow-sm bg-surface overflow-hidden" key={section.title}>
          <div className="flex items-start justify-between gap-4 p-6 border-b border-border/50">
            <SectionHeading title={section.title} description="采用结构化分组，便于后续接入真实配置和权限体系。" />
            {section.title === "Profile" ? (
              <Button variant="secondary" onClick={() => notify?.("已保存设置中心示例配置。")} type="button">
                保存修改
              </Button>
            ) : null}
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-6 p-6">
            {section.rows.map((row) => (
              <div key={row[0]} className="space-y-2">
                <div className="text-[13px] text-muted-foreground">{row[0]}</div>
                <div className="text-sm text-foreground font-medium leading-relaxed">{row[1]}</div>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}
