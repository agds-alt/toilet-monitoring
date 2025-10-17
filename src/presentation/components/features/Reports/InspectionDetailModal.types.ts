export interface InspectionDetailModalProps {
  inspection: any;
  userName: string;
  userRole: string;
  onClose: () => void;
  totalInspections: number;
  currentIndex: number;
  onNext?: () => void;
  onPrev?: () => void;
}
