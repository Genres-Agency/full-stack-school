"use client"
import React from 'react';
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Admission } from "@prisma/client";
import { IoDownload } from 'react-icons/io5';
import { FaDownload } from 'react-icons/fa';

const AdmissionPDF: React.FC<Admission> = (data) => {
    const downloadPDF = () => {
        const doc = new jsPDF();
        doc.text("Admission Form Data", 20, 10);
        doc.autoTable({
          head: [["Label", "Value"]],
          body: [
            ["Student's Name", data.studentName],
            ["Contact Number", data.contactNumber],
            ["Blood Group", data.bloodGroup],
            ["Email", data.email],
            ["Nationality", data.nationality],
            ["Gender", data.gender],
            ["Birth Certificate/NID No", data.birthCertificate],
            ["Religion", data.religion],
            ["Date of Birth", data.dateOfBirth.toISOString().split('T')[0]],
            ["Present Address", data.presentAddress],
            ["Father's Name", data.fatherName],
            ["Father's Phone No", data.fatherPhone],
            ["Father's Occupation", data.fatherOccupation],
            ["Mother's Name", data.motherName],
            ["Mother's Phone No", data.motherPhone],
            ["Mother's Occupation", data.motherOccupation],
            ["SSC/Equivalent", data.sscEquivalent],
            ["SSC Group", data.sscGroup],
            ["SSC Board", data.sscBoard],
            ["SSC Board Roll", data.sscBoardRoll],
            ["SSC GPA", data.sscGPA],
            ["SSC Passing Year", data.sscPassingYear],
            ["SSC Institute Name", data.sscInstituteName],
            ["HSC/Equivalent", data.hscEquivalent],
            ["HSC Group", data.hscGroup],
            ["HSC Board", data.hscBoard],
            ["HSC Board Roll", data.hscBoardRoll],
            ["HSC GPA", data.hscGPA],
            ["HSC Passing Year", data.hscPassingYear],
            ["HSC Institute Name", data.hscInstituteName],
          ],
        });
        doc.save(`admission_${data.id}.pdf`);
    };

    return (
        <button onClick={downloadPDF} className="bg-green-300 text-white p-1 rounded-md flex items-center gap-2 px-2">
            <FaDownload className='w-3 h-3'/> PDF
        </button>
    );
};

export default AdmissionPDF;