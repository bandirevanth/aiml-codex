
export enum AnalysisType {
  COOKING = 'COOKING',
  EXERCISE = 'EXERCISE',
  TECH = 'TECH',
  GENERAL = 'GENERAL',
  CUSTOM = 'CUSTOM',
}

export interface FrameData {
  id: string;
  base64Data: string; // Actual base64 string, without the 'data:mime/type;base64,' prefix
  mimeType: 'image/jpeg' | 'image/png';
}

export interface AnalysisResultItem {
  id: string;
  name: string;
  details?: string | string[];
  iconKeyword?: string;
  value?: number; // For charts or quantitative display
  confidence?: number; // Optional confidence score
  description?: string; // Optional longer description
}

export interface AnalysisChartDataPoint {
  name: string;
  value: number;
}

export interface AnalysisSection {
  title: string;
  items?: AnalysisResultItem[];
  chartData?: AnalysisChartDataPoint[];
  chartType?: 'bar' | 'pie';
  summary?: string;
  layout?: 'list' | 'grid'; // Optional hint for layout
}

export interface ParsedAnalysisResponse {
  title: string;
  sections: AnalysisSection[];
  overallSummary?: string;
}

export interface AnalysisTypeOption {
  value: AnalysisType;
  label: string;
  description?: string;
}
