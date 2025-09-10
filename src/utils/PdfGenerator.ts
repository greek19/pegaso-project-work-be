import PDFDocument from "pdfkit";

export class PdfGenerator {
    static createMovimentiPdf(movimenti: any[], stream: NodeJS.WritableStream) {
        const doc = new PDFDocument({ margin: 40, size: "A4" });
        doc.pipe(stream);

        doc.fontSize(20).fillColor("#2c3e50").text("Lista Movimenti", { align: "center" });
        doc.moveDown(2);

        const tableTop = 120;
        const rowHeight = 25;
        const colWidths = [120, 220, 100];
        const startX = 50;

        doc.fontSize(12).fillColor("white");
        doc.rect(startX, tableTop, colWidths[0], rowHeight).fill("#34495e");
        doc.rect(startX + colWidths[0], tableTop, colWidths[1], rowHeight).fill("#34495e");
        doc.rect(startX + colWidths[0] + colWidths[1], tableTop, colWidths[2], rowHeight).fill("#34495e");

        doc.text("Data", startX + 5, tableTop + 7, { width: colWidths[0] - 10 });
        doc.text("Descrizione", startX + colWidths[0] + 5, tableTop + 7, { width: colWidths[1] - 10 });
        doc.text("Importo (€)", startX + colWidths[0] + colWidths[1] + 5, tableTop + 7, {
            width: colWidths[2] - 10,
        });

        let y = tableTop + rowHeight;
        doc.fontSize(11).fillColor("black");

        movimenti.forEach((mov, i) => {
            const isEven = i % 2 === 0;
            const bgColor = isEven ? "#ecf0f1" : "#ffffff";

            doc.fillColor(bgColor)
                .rect(startX, y, colWidths[0], rowHeight).fill()
                .rect(startX + colWidths[0], y, colWidths[1], rowHeight).fill()
                .rect(startX + colWidths[0] + colWidths[1], y, colWidths[2], rowHeight).fill();

            doc.fillColor("black")
                .text(new Date(mov.data).toLocaleDateString("it-IT"), startX + 5, y + 7, { width: colWidths[0] - 10 })
                .text(mov.descrizione, startX + colWidths[0] + 5, y + 7, { width: colWidths[1] - 10 })
                .text(mov.importo.toFixed(2), startX + colWidths[0] + colWidths[1] + 5, y + 7, {
                    width: colWidths[2] - 10,
                    align: "right",
                });

            y += rowHeight;
            if (y > doc.page.height - 60) {
                doc.addPage();
                y = 50;
            }
        });

        doc.fontSize(10).fillColor("gray").text(`Generato il ${new Date().toLocaleString("it-IT")}`, 50, doc.page.height - 50, {
            align: "center",
            width: doc.page.width - 100,
        });

        doc.end();
    }
}
