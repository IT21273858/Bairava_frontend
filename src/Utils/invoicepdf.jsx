import jsPDF from "jspdf";
import "jspdf-autotable";
import Logo from "./image/Logo-light Theme.png"; 
import Footerlogo from "./image/Footer.png"
import { InknutAntiquaBold, k2d, Inter, InterSemiBold } from "./fonts";
import PhoneIcon from "./image/caller.png";
import MailIcon from "./image/mail.png";
import LocationIcon from "./image/location.png";

const InvoicePDFGenerator = (payload) => {
    console.log("Payload ss", payload);

    const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
    });

    doc.addFileToVFS("InknutAntiqua-Bold.ttf", InknutAntiquaBold);
    doc.addFont("InknutAntiqua-Bold.ttf", "InknutAntiqua", "normal");
    doc.addFileToVFS("k2d-normal.ttf", k2d);
    doc.addFont("k2d-normal.ttf", "k2d", "regular");
    doc.addFileToVFS("Inter.ttf", Inter);
    doc.addFont("Inter.ttf", "Inter", "regular");
    doc.addFileToVFS("Inter-SemiBold.ttf", InterSemiBold);
    doc.addFont("Inter-SemiBold.ttf", "Inter-SemiBold", "normal");

    const img = new Image();
    img.src = Logo;
    img.onload = () => {
        const imgWidth = 40;
        const imgHeight = 35;
        const pageWidth = doc.internal.pageSize.getWidth();
        const imgXPosition = pageWidth - imgWidth - 10;

        const title = "PERFORMA INVOICE";
        doc.setFont("InknutAntiqua", "normal");
        doc.setFontSize(16);
        doc.setTextColor(43, 0, 145);

        const titleXPosition = (pageWidth - doc.getTextWidth(title)) - 10;
        doc.text(title, titleXPosition, 25);
        doc.addImage(img, "PNG", 10, 5, imgWidth, imgHeight);

        doc.setFont("Inter", "regular");
        doc.setFontSize(12);
        doc.setTextColor(68, 3, 150);
        doc.text("Bill to:", 14, 40);
        doc.setTextColor(0, 0, 0);
        doc.text(payload.bill_to || "001", 40, 40);
        doc.setTextColor(68, 3, 150);
        doc.text("Invoice Date:", pageWidth - 65, 40);
        doc.setTextColor(0, 0, 0);
        doc.text(payload.tour_sdate.split('T')[0] || "001", pageWidth - 34, 40);
        doc.setTextColor(68, 3, 150);
        doc.text("Tour Date:", pageWidth - 85, 45);
        doc.setTextColor(0, 0, 0);
        doc.text(payload.tour_sdate.split('T')[0] + " to " + payload.tour_edate.split('T')[0] || "001", pageWidth - 63, 45);
        doc.setFont("k2d", "regular");
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.setFont("Inter", "regular");
        doc.setFontSize(12);
        doc.setTextColor(68, 3, 150);
        doc.text("Voucher No :", 14, 45);
        doc.setFont("k2d", "regular");
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(payload.invoice_no || "001", 40, 45);

        // Table for Product Details
        const itemDetails = payload.items.map(item => [
            item.name || "N/A",
            item.amount || "N/A",
        ]);

        // Adjust the column widths to cover the full width of the page
        doc.autoTable({
            head: [["Description", "Amount"]],
            body: itemDetails,
            startY: 60,
            theme: "grid",
            headStyles: {
                fillColor: [255, 255, 255],
                textColor: [43, 0, 145],
                fontStyle: "InknutAntiqua",
                fontSize: 12,
                lineWidth: 0.1,
                lineColor: [68, 3, 150],
                cellPadding: 3,
                halign: "center"
            },
            bodyStyles: {
                textColor: [0, 0, 0],
                fontSize: 12,
                fontStyle: "InknutAntiqua",
                lineWidth: 0.1,
                lineColor: [68, 3, 150],
                cellPadding: 3,
                halign: "center"
            },
            columnStyles: {
                0: { cellWidth: 155 },  // Adjusted width for description
                1: { cellWidth: 30 },  // Adjusted width for amount
            },
            tableLineColor: [68, 3, 150],
        });

        // Calculate Grand Total
        const grandTotal = payload.items.reduce((acc, row) =>
            row.isadvance ? acc - Number(row.amount) : acc + Number(row.amount), 0
        );

        // Grand Total
        doc.autoTable({
            body: [["Balance Amount:", `$${grandTotal}`]],
            startY: doc.autoTable.previous.finalY,
            theme: "plain",
            bodyStyles: {
                textColor: [0, 0, 0],
                fontSize: 10,
                lineWidth: 0.1,
                fontSize: 12,
                lineColor: [68, 3, 150],
                cellPadding: 3,
            },
            columnStyles: {
                0: {
                    cellWidth: 155,
                    halign: "center",
                },
                1: {
                    cellWidth: 30,
                    halign: "center",
                },
            },
            tableLineColor: [68, 3, 150],
        });


        doc.setFont("InknutAntiqua", "normal");
        doc.setFontSize(16);
        doc.setTextColor(43, 0, 145);
        doc.text("Bank Account Details", pageWidth / 3, doc.autoTable.previous.finalY + 15);


        // Bank Details Section
        const bankDetails = [
            ["Beneficiary Name", payload.bank_details.b_name],
            ["Bank Name", payload.bank_details.bank_name],
            ["Account Number", payload.bank_details.acc_no],
            ["Bank Branch", payload.bank_details.bank_branch],
            ["Branch", payload.bank_details.code],
            ["Account Currency", payload.bank_details.currency_type]
        ];

        doc.autoTable({
            body: bankDetails,
            startY: doc.autoTable.previous.finalY + 25,
            theme: "grid",
            headStyles: {
                fillColor: [255, 255, 255],
                textColor: [33, 33, 33],
                halign: "center",
                fontSize: 12,
                lineWidth: 0.1,
                lineColor: [68, 3, 150],
                cellPadding: 3,
            },
            bodyStyles: {
                textColor: [0, 0, 0],
                fontSize: 12,
                lineWidth: 0.1,
                lineColor: [68, 3, 150],
                cellPadding: 3,
            },
            columnStyles: {
                0: { cellWidth: 65, textColor: [68, 3, 150] },
                1: { cellWidth: 120 },
            },
            tableLineColor: [68, 3, 150],
        });

        // Notes Section (Bullet Points)
        const notes = payload.notes;

        let startY = doc.autoTable.previous.finalY + 10;
        doc.setFont("Inter", "normal");
        doc.setFontSize(14);
        doc.setTextColor(43, 0, 145);
        doc.text("Notes:", 14, startY);

        notes.forEach((note, index) => {
            doc.text(`• ${note}`, 20, startY + 8 + (index * 5));
        });

        doc.setFont("Inter", "normal");
        doc.setFontSize(15);
        doc.setTextColor(43, 0, 145);
        doc.text("For further clarifications please contact our 24/7 hotline number", pageWidth / 5, 250);
        doc.text("+94 769 936 596 | +94 769 936 956", pageWidth / 4, 255);

        doc.setFont("Inter-SemiBold", "normal");
        doc.setFontSize(15);
        doc.setTextColor(43, 0, 145);
        doc.text("Thank you for choosing Vibes Lanka for your Travel !", pageWidth / 5, 265);


        // Footer
        doc.addImage(Footerlogo, "JPG", 0, 270, pageWidth, 70)
        // doc.output('dataurlnewwindow');
        doc.save(`invoice_${payload.invoice_no}.pdf`);
    };
};

export default InvoicePDFGenerator;
