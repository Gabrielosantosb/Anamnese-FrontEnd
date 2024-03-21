export interface GetAllProductsResponse {
  id: string,
  name: string,
  amount: number,
  description: string,
  price: string,
  category: {
    id: string,
    name: string,
  };
}

export interface GetReportResponse
{
  reportId: number,
  reportDateTime: Date,
  medicalHistory: string
  currentMedications: string,
  cardiovascularIssues: boolean,
  diabetes: boolean,
  familyHistoryCardiovascularIssues: boolean,
  familyHistoryDiabetes: boolean,
  physicalActivity: string,
  smoker: boolean,
  alcoholConsumption: number,
  emergencyContactName: string,
  emergencyContactPhone: string,
  observations: string,
  pacientId: number,
  pacientName: string,
}

export interface ReportRequest
{
  medicalHistory: string;
  currentMedications: string;
  cardiovascularIssues: boolean;
  address: string;
  diabetes: boolean;
  familyHistoryCardiovascularIssues: boolean;
  familyHistoryDiabetes: boolean;
  physicalActivity: string;
  smoker: boolean;
  alcoholConsumption: number;
  emergencyContactName: string;
  emergencyContactPhone: string;
  observations: string;
}

