import { Activity } from "@/types/firebase-types";
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { saveAs } from 'file-saver';
import fontkit from '@pdf-lib/fontkit';

async function fetchFont(url: string): Promise<Uint8Array> {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  return new Uint8Array(arrayBuffer);
}

export async function printActivitiesPDF(activities: { [key: string]: Activity }, filename: string) {
  const pdfDoc = await PDFDocument.create();

  pdfDoc.registerFontkit(fontkit);

  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);

  // Load the sans-serif font
  const fontUrl = '/fonts/NotoSans-VariableFont_wdth.ttf';
  const fontBytes = await fetchFont(fontUrl);
  const sansSerifFont = await pdfDoc.embedFont(fontBytes);

  const pageWidth = 8.5 * 72; // 612 points
  const pageHeight = 11 * 72; // 792 points

  Object.values(activities).sort((a, b) => {
    // sort by period[0] first, then by department
    if (a.period[0] < b.period[0]) return -1;
    if (a.period[0] > b.period[0]) return 1;
    if (a.department < b.department) return -1;
    if (a.department > b.department) return 1;
    return 0;
  }).forEach(activity => {
    const page = pdfDoc.addPage([pageWidth, pageHeight]);
    const { width, height } = page.getSize();
    
    const titleSize = 40;
    const fontSize = 12;

    const ml = 50;
    const mr = 50;
    const mt = 120;

    let xpos = ml;
    let ypos = height - mt;

    // Helper function to draw centered text
    const drawCenteredText = (text: string, y: number, font: any, size: number, color = rgb(0, 0, 0)) => {
      const textWidth = font.widthOfTextAtSize(text, size);
      const x = (width - textWidth) / 2;
      page.drawText(text, {
        x,
        y,
        size,
        font,
        color,
      });
    };

    drawCenteredText(`${activity.name}${activity.cost?.length > 0 ? ` - ${activity.cost}` : ''}`, ypos, sansSerifFont, titleSize);
    ypos -= 30;
    
    if (activity.notes.length > 0 && activity.notes[0].length > 0) {
      activity.notes.forEach((note) => {
        drawCenteredText(`${note}`, ypos, sansSerifFont, fontSize, rgb(1, 0, 0));
        ypos -= 15;
      })
      ypos -= 10;
    }

    drawCenteredText(`Activity ${activity.period[0]}${activity.period.length > 1 ? ` - ${activity.period[activity.period.length - 1]}` : ''}`, ypos, sansSerifFont, fontSize);
    ypos -= 40;

    // Highlight "First & Last Name"
    const highlightText = activity.highlightedText.length > 0 ? activity.highlightedText : "First & Last Name";
    const highlightWidth = sansSerifFont.widthOfTextAtSize(highlightText, fontSize) + 8;
    const highlightHeight = fontSize + 8;
    const highlightX = ml - 4;
    const highlightY = ypos - (highlightHeight / 2) + 4;

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
    ypos -= 40;

    for (let i = 0; i < activity.headcount; i++) {
      page.drawText(`${i + 1}`, {
        x: ml + 20,
        y: ypos,
        size: fontSize,
        font: sansSerifFont,
        color: rgb(0, 0, 0),
      });
      ypos -= 5;

      page.drawLine({
        start: { x: xpos, y: ypos },
        // end mr away from the right edge
        end: { x: width - mr, y: ypos },
        thickness: 1,
        color: rgb(0, 0, 0),
      });
      ypos -= 30;
    }

    if (activity.secondaryHeadcount > 0) {
      page.drawText(`${activity.secondaryHeadcountName}`, {
        x: ml,
        y: ypos,
        size: fontSize,
        font: sansSerifFont,
        color: rgb(0, 0, 0),
      });
      ypos -= 30;

      for (let i = 0; i < activity.secondaryHeadcount; i++) {
        page.drawText(`${i + 1 + activity.headcount}`, {
          x: xpos + 20,
          y: ypos,
          size: fontSize,
          font: sansSerifFont,
          color: rgb(0, 0, 0),
        });
        ypos -= 5;

        page.drawLine({
          start: { x: xpos, y: ypos },
          // end mr away from the right edge
          end: { x: width - mr, y: ypos },
          thickness: 1,
          color: rgb(0, 0, 0),
        });
        ypos -= 30;
      }
    }
  });

  const pdfBytes = await pdfDoc.save();

  // Use FileSaver to save the PDF
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  saveAs(blob, filename);
}