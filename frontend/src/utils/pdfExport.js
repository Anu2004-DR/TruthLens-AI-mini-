import jsPDF from "jspdf";

export function exportPDF(result, inputText) {

  const doc = new jsPDF();

  doc.setFontSize(20);

  doc.text("TruthLens AI Report", 20, 20);

  doc.setFontSize(12);

  doc.text(
    `Generated: ${new Date().toLocaleString()}`,
    20,
    35
  );

  doc.text("Input:", 20, 50);

  doc.text(inputText, 20, 60, {
    maxWidth: 170,
  });

  doc.text(
    `Prediction: ${result.prediction}`,
    20,
    100
  );

  doc.text(
    `Confidence: ${result.confidence}%`,
    20,
    110
  );

  let y = 125;

  doc.text("Retrieved Evidence:", 20, y);

  y += 10;

  result.evidence.forEach((ev) => {

    doc.text("- " + ev, 20, y, {
      maxWidth: 170,
    });

    y += 15;

  });

  doc.save("TruthLens_Report.pdf");
}