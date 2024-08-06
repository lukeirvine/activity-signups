import { Activity } from "@/types/firebase-types";
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { saveAs } from 'file-saver';

export async function printActivitiesPDF(activities: { [key: string]: Activity }) {
  const pdfDoc = await PDFDocument.create();
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);

  Object.values(activities).forEach(activity => {
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    const fontSize = 12;

    page.drawText(`Name: ${activity.name}`, {
      x: 50,
      y: height - 50,
      size: fontSize,
      font: timesRomanFont,
      color: rgb(0, 0, 0),
    });

    page.drawText(`Period: ${activity.period.join(', ')}`, {
      x: 50,
      y: height - 70,
      size: fontSize,
      font: timesRomanFont,
      color: rgb(0, 0, 0),
    });

    page.drawText(`Headcount: ${activity.headcount}`, {
      x: 50,
      y: height - 90,
      size: fontSize,
      font: timesRomanFont,
      color: rgb(0, 0, 0),
    });

    page.drawText(`Secondary Headcount Name: ${activity.secondaryHeadcountName}`, {
      x: 50,
      y: height - 110,
      size: fontSize,
      font: timesRomanFont,
      color: rgb(0, 0, 0),
    });

    page.drawText(`Secondary Headcount: ${activity.secondaryHeadcount}`, {
      x: 50,
      y: height - 130,
      size: fontSize,
      font: timesRomanFont,
      color: rgb(0, 0, 0),
    });

    page.drawText(`Notes: ${activity.notes}`, {
      x: 50,
      y: height - 150,
      size: fontSize,
      font: timesRomanFont,
      color: rgb(0, 0, 0),
    });
  });

  const pdfBytes = await pdfDoc.save();

  // Use FileSaver to save the PDF
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  saveAs(blob, 'activities.pdf');
}