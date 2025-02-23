import React from 'react';
import { MdContactEmergency } from "react-icons/md";


const emergencyNumbers = [
  { service: 'National Emergency Service', number: '999' },
  { service: 'Fire Service and Civil Defence', number: '102' },
  { service: 'Ambulance Service', number: '999' },
  { service: 'Police', number: '999' },
  { service: 'Women and Children Ministry Helpline', number: '109' },
  { service: 'Health Services', number: '16263' },
  { service: 'Agricultural Information Services', number: '16123' },
  { service: 'Legal Services', number: '16430' },
  { service: 'National Information Service', number: '333' },
  { service: 'IEDCR Helpline for COVID-19', number: '10655' },
  { service: 'Anti Corruption Commission', number: '106' },
  { service: 'Dhaka WASA', number: '16162' },
  { service: 'Disaster Preparedness', number: '1090' },
];

const EmergencyNumbers: React.FC = () => {
  return (
    <div className="w-full mx-auto bg-white dark:bg-[#18181b] shadow-md rounded-lg overflow-hidden mt-10">
      <div className=" text-[#ff0000] text-center py-4 border-b">
        <h1 className="text-xl font-semibold flex gap-2 items-center justify-center"><MdContactEmergency /> Emergency Contacts </h1>
      </div>
      <ul className="">
        {emergencyNumbers.map((item: { service: string; number: string }, index) => (
          <li key={index} className="px-4 py-2 flex justify-between items-center even:bg-[#edf9fd] dark:even:bg-gray-600">
            <span className="text-gray-700 dark:text-gray-400">{item.service}</span>
            <span className="text-green-500 font-semibold">{item.number}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmergencyNumbers;
