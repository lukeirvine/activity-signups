import { Activity } from '@/types/firebase-types';
import Papa from 'papaparse';
import uuid from 'react-uuid';

export const parseCsvToActivity = (file: File, weekId: string, dayId: string): Promise<Activity[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>) => {
      try {
        const content = e.target?.result as string;

        Papa.parse(content, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const rows = results.data as Array<{ [key: string]: string }>;
            const activities: Activity[] = [];

            rows.forEach((row, index) => {
              const activity: Activity = {
                id: uuid(),
                index,
                name: row['Name']?.trim() || '',
                cost: row['Cost']?.trim() || '',
                highlightedText: row['Highlighted Text']?.trim() || '',
                department: row['Department']?.trim() || '',
                period: row['Period']?.split(',').map(num => parseInt(num.trim())) || [],
                headcount: parseInt(row['Headcount']?.trim() || '0'),
                dayId,
                weekId,
                secondaryHeadcountName: row['Secondary Headcount Name']?.trim() || '',
                secondaryHeadcount: parseInt(row['Secondary Headcount']?.trim() || '0'),
                notes: row['Notes']?.split(';').map((note) => note.trim()) || [""],
                timeCreated: new Date().toISOString(),
                timeUpdated: new Date().toISOString()
              };

              activities.push(activity);
            });

            resolve(activities);
          },
          error: (error: Error) => {
            console.error(error);
            reject(new Error("Error parsing CSV file."));
          }
        });
      } catch (e) {
        console.error(e);
        reject(new Error("Error parsing CSV file."));
      }
    };

    reader.readAsText(file);
  });
};
