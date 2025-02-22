'use client';

import { PDFDownloadLink } from '@react-pdf/renderer';
import AdmitCardPDF from './pdf/AdmitCardPDF';
import { MdDownload } from 'react-icons/md';

const AdmitCardButton = ({ 
  studentId, 
  studentName,
  img, 
  className, 
  parentName, 
  dob, 
  subjects 
}: { 
  studentId: string, 
  studentName: string,
  img: string, 
  className: string, 
  parentName: string, 
  dob: Date, 
  subjects: { id: number; name: string }[] 
}) => {

  // console.log(" dsafafasdf=====",subjects);
  
  return (
    <PDFDownloadLink
      document={<AdmitCardPDF 
        studentId={studentId} 
        studentName={studentName}
        img={img}
        className={className} 
        parentName={parentName} 
        dob={dob.toISOString().split('T')[0]}  // Convert Date to string and get only the date
        subjects={subjects}
      />}
      fileName={`admit_card_${studentId}.pdf`}
    >
      {({ loading }) => (
        <button
          disabled={loading}
          className={`px-4 py-2 rounded-md text-white ${
            loading ? 'bg-gray-400' : 'bg-blue-300 hover:bg-blue-400'
          }`}
        >
          {loading ? 'Generating...' : <><MdDownload className="inline-block mr-2" /> Admit Card</>}
        </button>
      )}
    </PDFDownloadLink>
  );
};

export default AdmitCardButton;
