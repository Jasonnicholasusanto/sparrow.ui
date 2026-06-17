"use client";

import { motion } from "motion/react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { StockInfoResponse } from "@/schemas/stock";

import { CompanyOverviewTab } from "./company-overview-tab";
import { FinancialsTab } from "./financials-tab";
import { MarketStatisticsTab } from "./market-statistics-tab";
import { OwnershipAnalystsTab } from "./ownership-analysts-tab";
import { StockSummaryCards } from "./stock-summary-cards";
import { ValuationTab } from "./valuation-tab";

interface StockDetailsProps {
  stock: StockInfoResponse;
}

export default function StockDetails({ stock }: StockDetailsProps) {
  if (!stock) return null;

  return (
    <motion.section
      className="space-y-5"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <StockSummaryCards stock={stock} />

      <Tabs defaultValue="overview" className="space-y-4">
        <div className="overflow-x-auto">
          <TabsList className="h-auto min-w-max justify-start rounded-xl bg-muted/60 p-1">
            <TabsTrigger value="overview" className="rounded-lg px-4 py-2">
              Overview
            </TabsTrigger>

            <TabsTrigger value="market" className="rounded-lg px-4 py-2">
              Market
            </TabsTrigger>

            <TabsTrigger value="valuation" className="rounded-lg px-4 py-2">
              Valuation
            </TabsTrigger>

            <TabsTrigger value="financials" className="rounded-lg px-4 py-2">
              Financials
            </TabsTrigger>

            <TabsTrigger value="ownership" className="rounded-lg px-4 py-2">
              Ownership & Analysts
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="mt-0">
          <CompanyOverviewTab stock={stock} />
        </TabsContent>

        <TabsContent value="market" className="mt-0">
          <MarketStatisticsTab stock={stock} />
        </TabsContent>

        <TabsContent value="valuation" className="mt-0">
          <ValuationTab stock={stock} />
        </TabsContent>

        <TabsContent value="financials" className="mt-0">
          <FinancialsTab stock={stock} />
        </TabsContent>

        <TabsContent value="ownership" className="mt-0">
          <OwnershipAnalystsTab stock={stock} />
        </TabsContent>
      </Tabs>
    </motion.section>
  );
}
