export interface CompanyOfficer {
  name?: string;
  title?: string;
  fiscalYear?: number;
  totalPay?: number;
  exercisedValue?: number;
  unexercisedValue?: number;
}

export interface StockInfoResponse {
  /** ---------------------- Basic company info ---------------------- */
  symbol: string;
  shortName?: string;
  longName?: string;
  industry?: string;
  sector?: string;
  website?: string;
  longBusinessSummary?: string;
  fullTimeEmployees?: number;

  /** ---------------------- Address & contact ---------------------- */
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  phone?: string;

  /** ---------------------- Employees & management ---------------------- */
  companyOfficers?: CompanyOfficer[];

  /** ---------------------- Financial position ---------------------- */
  enterpriseValue?: number;
  ebitda?: number;
  totalCash?: number;
  totalCashPerShare?: number;
  totalDebt?: number;
  debtToEquity?: number;
  quickRatio?: number;
  currentRatio?: number;
  totalRevenue?: number;
  revenuePerShare?: number;
  revenueGrowth?: number;
  returnOnAssets?: number;
  returnOnEquity?: number;
  grossProfits?: number;
  operatingCashflow?: number;
  freeCashflow?: number;
  profitMargins?: number;
  operatingMargins?: number;
  grossMargins?: number;
  ebitdaMargins?: number;
  financialCurrency?: string;

  /** ---------------------- Earnings & valuation ---------------------- */
  earningsDate?: number[]; // epoch timestamps
  earningsAverage?: number;
  earningsLow?: number;
  earningsHigh?: number;
  revenueAverage?: number;
  revenueLow?: number;
  revenueHigh?: number;
  earningsQuarterlyGrowth?: number;
  earningsTimestamp?: number;
  trailingPE?: number;
  forwardPE?: number;
  trailingEps?: number;
  forwardEps?: number;
  epsTrailingTwelveMonths?: number;
  epsForward?: number;
  epsCurrentYear?: number;
  priceEpsCurrentYear?: number;
  bookValue?: number;
  priceToBook?: number;

  /** ---------------------- Dividends ---------------------- */
  dividendRate?: number;
  dividendYield?: number;
  payoutRatio?: number;
  trailingAnnualDividendRate?: number;
  trailingAnnualDividendYield?: number;
  fiveYearAvgDividendYield?: number;
  exDividendDate?: number;

  /** ---------------------- Stock / trading info ---------------------- */
  currency?: string;
  exchange?: string;
  quoteType?: string;
  hasPrePostMarketData?: boolean;
  market?: string;
  marketCap?: number;
  sharesOutstanding?: number;
  sharesShort?: number;
  floatShares?: number;
  impliedSharesOutstanding?: number;
  heldPercentInsiders?: number;
  heldPercentInstitutions?: number;
  beta?: number;
  volume?: number;
  averageVolume?: number;
  averageVolume10days?: number;
  averageDailyVolume3Month?: number;
  averageDailyVolume10Day?: number;
  regularMarketVolume?: number;
  bid?: number;
  ask?: number;
  bidSize?: number;
  askSize?: number;
  exchangeTimezoneName?: string;
  exchangeTimezoneShortName?: string;
  fullExchangeName?: string;
  gmtOffSetMilliseconds?: number;
  exchangeDataDelayedBy?: number;
  quoteSourceName?: string;
  language?: string;
  region?: string;
  typeDisp?: string;

  /** ---------------------- Dates & splits ---------------------- */
  lastFiscalYearEnd?: number;
  nextFiscalYearEnd?: number;
  mostRecentQuarter?: number;
  lastSplitFactor?: string;
  lastSplitDate?: number;

  /** ---------------------- Prices info ---------------------- */
  currentPrice?: number;
  previousClose?: number;
  priceHint?: number;
  open?: number;
  dayLow?: number;
  dayHigh?: number;
  regularMarketOpen?: number;
  regularMarketDayLow?: number;
  regularMarketDayHigh?: number;
  regularMarketChange?: number;
  regularMarketChangePercent?: number;
  regularMarketTime?: number;
  postMarketChange?: number;
  postMarketChangePercent?: number;
  postMarketPrice?: number;
  postMarketTime?: number;
  preMarketChange?: number;
  preMarketChangePercent?: number;
  preMarketPrice?: number;
  preMarketTime?: number;
  marketState?: string;
  regularMarketPrice?: number;
  regularMarketPreviousClose?: number;
  regularMarketDayRange?: string;
  fiftyTwoWeekLow?: number;
  fiftyTwoWeekHigh?: number;
  allTimeHigh?: number;
  allTimeLow?: number;
  fiftyDayAverage?: number;
  twoHundredDayAverage?: number;
  fiftyTwoWeekLowChange?: number;
  fiftyTwoWeekLowChangePercent?: number;
  fiftyTwoWeekHighChange?: number;
  fiftyTwoWeekHighChangePercent?: number;
  fiftyTwoWeekRange?: string;
  fiftyTwoWeekChangePercent?: number;
  SandP52WeekChange?: number;

  /** ---------------------- Targets & recommendations ---------------------- */
  targetHighPrice?: number;
  targetLowPrice?: number;
  targetMeanPrice?: number;
  targetMedianPrice?: number;
  recommendationKey?: string;
  recommendationMean?: number;
  numberOfAnalystOpinions?: number;
  averageAnalystRating?: string;

  /** ---------------------- Governance / risk info ---------------------- */
  auditRisk?: number;
  boardRisk?: number;
  compensationRisk?: number;
  shareHolderRightsRisk?: number;
  overallRisk?: number;
  governanceEpochDate?: number;
  compensationAsOfEpochDate?: number;
}

export interface HistoryPoint {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  dividends: number;
  stockSplits: number;
}

export interface StockHistoryResponse {
  symbol: string;
  change?: number;
  changePercentage?: number;
  history: Array<HistoryPoint>;
}
