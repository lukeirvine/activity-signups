import { Activity } from "@/types/firebase-types";
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { saveAs } from 'file-saver';
import fontkit from '@pdf-lib/fontkit';

async function fetchFont(url: string): Promise<Uint8Array> {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  return new Uint8Array(arrayBuffer);
}

export async function printActivitiesPDF(activities: { [key: string]: Activity }) {
  const pdfDoc = await PDFDocument.create();

  pdfDoc.registerFontkit(fontkit);

  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);

  // Load the sans-serif font
  const fontUrl = '/fonts/NotoSans-VariableFont_wdth.ttf';
  const fontBytes = await fetchFont(fontUrl);
  const sansSerifFont = await pdfDoc.embedFont(fontBytes);

  const pageWidth = 8.5 * 72; // 612 points
  const pageHeight = 11 * 72; // 792 points

  Object.values(activities).forEach(activity => {
    const page = pdfDoc.addPage([pageWidth, pageHeight]);
    const { width, height } = page.getSize();
    
    const titleSize = 40;
    const fontSize = 12;

    const ml = 50;
    const mt = 120;

    let xpos = ml;
    let ypos = height - mt;

    // Helper function to draw centered text
    const drawCenteredText = (text: string, y: number, font: any, size: number) => {
      const textWidth = font.widthOfTextAtSize(text, size);
      const x = (width - textWidth) / 2;
      page.drawText(text, {
        x,
        y,
        size,
        font,
        color: rgb(0, 0, 0),
      });
    };

    drawCenteredText(`${activity.name}`, ypos, sansSerifFont, titleSize);
    ypos -= 30;
    
    drawCenteredText(`Activity ${activity.period.join(', ')}`, ypos, sansSerifFont, fontSize);
    ypos -= 40;

    // Highlight "First & Last Name"
    const highlightText = "First & Last Name";
    const highlightWidth = sansSerifFont.widthOfTextAtSize(highlightText, fontSize);
    const highlightHeight = fontSize + 4;
    const highlightX = ml;
    const highlightY = ypos - highlightHeight + 4;

    // Draw the yellow rectangle
    page.drawRectangle({
      x: highlightX,
      y: highlightY,
      width: highlightWidth,
      height: highlightHeight,
      color: rgb(1, 1, 0), // Yellow color
      opacity: 0.5,
    });

    // Draw the text over the rectangle
    page.drawText(highlightText, {
      x: ml,
      y: ypos,
      size: fontSize,
      font: sansSerifFont,
      color: rgb(0, 0, 0),
    });
    ypos -= 20;

    page.drawText(`Period: ${activity.period.join(', ')}`, {
      x: ml,
      y: ypos,
      size: fontSize,
      font: timesRomanFont,
      color: rgb(0, 0, 0),
    });
    ypos -= 20;

    page.drawText(`Headcount: ${activity.headcount}`, {
      x: ml,
      y: ypos,
      size: fontSize,
      font: timesRomanFont,
      color: rgb(0, 0, 0),
    });
    ypos -= 20;

    page.drawText(`Secondary Headcount Name: ${activity.secondaryHeadcountName}`, {
      x: ml,
      y: ypos,
      size: fontSize,
      font: timesRomanFont,
      color: rgb(0, 0, 0),
    });
    ypos -= 20;

    page.drawText(`Secondary Headcount: ${activity.secondaryHeadcount}`, {
      x: ml,
      y: ypos,
      size: fontSize,
      font: timesRomanFont,
      color: rgb(0, 0, 0),
    });
    ypos -= 20;

    page.drawText(`Notes: ${activity.notes}`, {
      x: ml,
      y: ypos,
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