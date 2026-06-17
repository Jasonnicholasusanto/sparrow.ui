"use client";

import { useState } from "react";
import { Building2, MapPin, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { StockInfoResponse } from "@/schemas/stock";

import { MetricGrid } from "./metric-grid";
import { DetailsSection } from "./details-section";
import {
  formatNumber,
  getChiefExecutive,
  getCompanyLocation,
} from "@/lib/utils/stockDetails";

type CompanyOverviewTabProps = {
  stock: StockInfoResponse;
};

const SUMMARY_LIMIT = 600;

export function CompanyOverviewTab({ stock }: CompanyOverviewTabProps) {
  const [expanded, setExpanded] = useState(false);

  const summary =
    stock.longBusinessSummary ||
    "No company description is currently available.";

  const chiefExecutive = getChiefExecutive(stock);
  const shouldTruncate = summary.length > SUMMARY_LIMIT;

  const displayedSummary =
    shouldTruncate && !expanded
      ? `${summary.slice(0, SUMMARY_LIMIT).trim()}…`
      : summary;

  return (
    <div className="grid gap-4 xl:grid-cols-3">
      <DetailsSection
        title="Company profile"
        description="Business description and primary operations"
        icon={Building2}
        className="xl:col-span-2"
      >
        <p className="whitespace-pre-line text-sm leading-7 text-muted-foreground">
          {displayedSummary}
        </p>

        {shouldTruncate && (
          <Button
            variant="link"
            className="mt-2 h-auto p-0 text-xs"
            onClick={() => setExpanded((current) => !current)}
          >
            {expanded ? "Show less" : "Read full description"}
          </Button>
        )}
      </DetailsSection>

      <DetailsSection
        title="Company information"
        description="Corporate and operating details"
        icon={MapPin}
      >
        <MetricGrid
          columns={2}
          items={[
            {
              label: "Chief executive",
              value: chiefExecutive?.name ?? "—",
              description: chiefExecutive?.title,
            },
            {
              label: "Employees",
              value: formatNumber(stock.fullTimeEmployees, 0),
            },
            {
              label: "Sector",
              value: stock.sector ?? "—",
            },
            {
              label: "Industry",
              value: stock.industry ?? "—",
            },
            {
              label: "Headquarters",
              value: getCompanyLocation(stock) || "—",
            },
            {
              label: "Website",
              value: stock.website ?? "—",
            },
          ]}
        />
      </DetailsSection>

      {!!stock.companyOfficers?.length && (
        <DetailsSection
          title="Leadership"
          description="Reported company officers"
          icon={UserRound}
          className="xl:col-span-3"
        >
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {stock.companyOfficers.slice(0, 6).map((officer) => (
              <div
                key={`${officer.name}-${officer.title}`}
                className="rounded-xl border bg-muted/20 p-4"
              >
                <p className="text-sm font-semibold">
                  {officer.name ?? "Unknown officer"}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  {officer.title ?? "Title unavailable"}
                </p>
              </div>
            ))}
          </div>
        </DetailsSection>
      )}
    </div>
  );
}
